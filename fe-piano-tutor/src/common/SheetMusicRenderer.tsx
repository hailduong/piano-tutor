import React, {useEffect, useRef, useState, FC} from 'react'
import Vex, {Voice, Formatter} from 'vexflow'
import styled from 'styled-components'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import {incrementScore, setSuggestedNote, Note} from 'slices/musicNotesSlice'
import {USER_CONFIG} from 'config'
import {useMusicTheory} from 'contexts/MusicTheoryContext'


// Styled Components
const MusicContainer = styled.div`
    background-color: white;
    padding: 10px;
    border: 1px solid #ccc;
    overflow: hidden;
    width: 100%;
    position: relative;
`

const ScrollingContainer = styled.div`
    display: inline-block;
    width: 3600px;
`

const TempoDisplay = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.9em;
    font-weight: bold;
`

const TheoryAnnotation = styled.div`
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(225, 245, 254, 0.9);
    padding: 5px 10px;
    border-radius: 4px;
    border: 1px solid #90caf9;
    font-size: 0.9em;
    color: #0277bd;
    max-width: 90%;
    text-align: center;
`

// Interfaces
interface SheetMusicRendererProps {
  notes: Vex.StaveNote[];
  onCorrectNote?: (noteAttempted: string, timingDeviation: number) => void;
  tempo?: number; // Beats per minute, default is 60 (1 beat per second)
  rawNotes?: Note[]; // Optional: raw notes for music theory annotations
  showTheoryHints?: boolean; // Optional: whether to show music theory hints
  selectedConcept?: string; // Optional: which concept to highlight
}

const SheetMusicRenderer: FC<SheetMusicRendererProps> = ({
                                                           notes,
                                                           onCorrectNote,
                                                           tempo = 60, // Default tempo: 60 BPM (quarter note = 1 second)
                                                           rawNotes = [],
                                                           showTheoryHints = false,
                                                           selectedConcept = ''
                                                         }) => {
  /* Store and props */
  const musicRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<Vex.Renderer | null>(null)
  const dispatch = useDispatch()
  const {currentNote, suggestedNote} = useSelector((state: RootState) => state.musicNotes)

  // Use music theory context if available
  const musicTheory = useMusicTheory()
  const musicTheoryContext = React.useMemo(() => {
    try {
      return musicTheory
    } catch (e) {
      return {
        showTheoryAnnotations: showTheoryHints,
        currentTheoryConcept: selectedConcept
      }
    }
  }, [musicTheory, showTheoryHints, selectedConcept])

  /* States */
  const [lastKeyPressIncorrect, setLastKeyPressIncorrect] = useState(false)
  const [expectedNoteTime, setExpectedNoteTime] = useState<number | null>(null)
  const [theoryHint, setTheoryHint] = useState<string>('')

  // When component mounts, set the initial expected note time
  useEffect(() => {
    if (notes.length > 0 && expectedNoteTime === null) {
      setExpectedNoteTime(Date.now())
    }
  }, [notes.length])

  // Clear previous rendering by removing SVG content
  const clearMusicSheet = () => {
    if (musicRef.current) {
      // Remove all SVG elements inside the container
      while (musicRef.current.firstChild) {
        musicRef.current.removeChild(musicRef.current.firstChild)
      }
    }
  }

  /* Handlers */
  // Render the sheet music using VexFlow
  const renderSheetMusic = (notes: Vex.StaveNote[], context: Vex.RenderContext, stave: Vex.Stave) => {
    // For each note, adjust style based on Redux state:
    // For the expected note (first note), if a wrong key was pressed (i.e. currentNote does not match)
    // then render it in red (#f44336). Otherwise, normal black.
    notes.forEach((note, index) => {
      if (index === 0 && currentNote) {
        // Expected note is the first note
        const expectedKey = note.getKeys()[0].toLowerCase()
        const playedKey = currentNote.note.toLowerCase() + '/' + currentNote.octave
        if ((expectedKey !== playedKey)) {
          note.setStyle({fillStyle: '#f44336'})
          setLastKeyPressIncorrect(true)
        } else {
          // Correct key pressed.
          note.setStyle({fillStyle: '#4caf50'})
          setLastKeyPressIncorrect(false)
        }
      } else {
        // All other notes use default color.
        note.setStyle({fillStyle: 'black'})
      }

      // Add accidentals if present
      const keys = note.getKeys()
      keys.forEach((key, keyIndex) => {
        const accidental = key.match(/[#b]/)
        if (accidental) {
          note.addModifier(new Vex.Flow.Accidental(accidental[0]), keyIndex)
        }
      })
    })

    // Add music theory annotations if enabled
    if ((showTheoryHints || musicTheoryContext.showTheoryAnnotations) && rawNotes.length > 0) {
      generateTheoryHint(rawNotes, musicTheoryContext.currentTheoryConcept || selectedConcept)
    }
  }

  // Generate music theory hints based on the displayed notes
  const generateTheoryHint = (notes: Note[], conceptType: string): void => {
    if (!notes || notes.length === 0) {
      setTheoryHint('')
      return
    }

    let hint = ''

    // Generate different hints based on the selected concept
    switch (conceptType) {
      case 'intervals':
        if (notes.length >= 2) {
          hint = getIntervalHint(notes[0], notes[1])
        }
        break
      case 'scales-keys':
        if (notes.length >= 3) {
          hint = getScaleHint(notes)
        }
        break
      case 'chords':
        if (notes.length >= 3) {
          hint = getChordHint(notes)
        }
        break
      case 'basic-notation':
        hint = `Note: ${notes[0].note}${notes[0].octave} - ${getNotePosition(notes[0])}`
        break
      case 'rhythm-basics':
        hint = `${notes[0].length === 'q' ? 'Quarter Note' :
          notes[0].length === 'h' ? 'Half Note' :
            notes[0].length === 'w' ? 'Whole Note' :
              notes[0].length === '8' ? 'Eighth Note' :
                'Note'} (${notes[0].note}${notes[0].octave})`
        break
      default:
        // Default hint about note names
        if (notes.length > 0) {
          hint = `Note: ${notes[0].note}${notes[0].octave}`
        }
    }

    setTheoryHint(hint)
  }

  // Helper functions for theory explanations
  const getIntervalHint = (note1: Note, note2: Note): string => {
    // Simplified interval calculation (would need to be enhanced for a real app)
    const noteValues: Record<string, number> = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
      'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    }

    const value1 = noteValues[note1.note] + (note1.octave * 12)
    const value2 = noteValues[note2.note] + (note2.octave * 12)
    const semitones = Math.abs(value2 - value1)

    // Map semitones to interval names
    const intervalNames: Record<number, string> = {
      0: 'Unison', 1: 'Minor 2nd', 2: 'Major 2nd', 3: 'Minor 3rd',
      4: 'Major 3rd', 5: 'Perfect 4th', 7: 'Perfect 5th',
      8: 'Minor 6th', 9: 'Major 6th', 10: 'Minor 7th',
      11: 'Major 7th', 12: 'Octave'
    }

    return `Interval: ${intervalNames[semitones] || `${semitones} semitones`}`
  }

  const getScaleHint = (notes: Note[]): string => {
    // Very simplified - just check for common patterns
    const firstNote = notes[0].note.replace('#', '').replace('b', '')

    // Check for C major scale pattern
    if (notes.length >= 7) {
      const noteNames = notes.map(n => n.note.replace('#', '').replace('b', ''))
      if (['C', 'D', 'E', 'F', 'G', 'A', 'B'].every(note => noteNames.includes(note))) {
        return `${firstNote} Major Scale`
      }
    }

    return `Scale starting with ${firstNote}`
  }

  const getChordHint = (notes: Note[]): string => {
    // Very simplified - just check for common chord types based on first note
    const rootNote = notes[0].note

    if (notes.length === 3) {
      // Simplified major/minor detection
      const noteNames = notes.map(n => n.note)
      if (noteNames.includes('E') && noteNames.includes('G') && rootNote === 'C') {
        return 'C Major Chord (C-E-G)'
      } else if (noteNames.includes('Eb') && noteNames.includes('G') && rootNote === 'C') {
        return 'C Minor Chord (C-Eb-G)'
      }
    }

    return `Chord based on ${rootNote}`
  }

  const getNotePosition = (note: Note): string => {
    // Return the position of the note on the staff
    const positions: Record<string, string> = {
      'C': 'First ledger line below the staff',
      'D': 'Space below the staff',
      'E': 'First line',
      'F': 'First space',
      'G': 'Second line',
      'A': 'Second space',
      'B': 'Third line',
      'C5': 'Third space',
      'D5': 'Fourth line',
      'E5': 'Fourth space',
      'F5': 'Fifth line',
      'G5': 'Space above the staff',
      'A5': 'Ledger line above the staff'
    }

    const key = note.note + (note.octave >= 5 ? note.octave : '')
    return positions[key] || 'On the staff'
  }

  /* Effects */
  // Everytime the notes change, re-render the sheet music
  useEffect(() => {
    if (notes.length === 0) {
      clearMusicSheet()
      return
    } // nothing to render

    const VF = Vex.Flow
    const staffWidth = Math.max(200, notes.length * USER_CONFIG.NOTE_WIDTH)

    // Only create a new renderer if we don't have one
    if (!rendererRef.current && musicRef.current) {
      rendererRef.current = new VF.Renderer(musicRef.current, VF.Renderer.Backends.SVG)
    }

    if (rendererRef.current) {
      rendererRef.current.resize(staffWidth, 200)
      const context = rendererRef.current.getContext()
      context.clear()

      const stave = new VF.Stave(10, 40, staffWidth)
      stave.addClef('treble')

      // Add tempo marking
      stave.setTempo({bpm: tempo, duration: 'q'}, 0)

      stave.setContext(context).draw()

      const voice = new Voice({num_beats: notes.length, beat_value: 4})

      // Check that each note is a proper VexFlow Tickable object
      const validNotes = notes.filter(note =>
        note && typeof note.shouldIgnoreTicks === 'function'
      )

      // Only create a voice if we have notes
      if (validNotes.length > 0) {
        // Create voice with the actual number of valid notes
        const voice = new Voice({
          num_beats: validNotes.length,
          beat_value: 4
        })

        voice.addTickables(validNotes)
        new Formatter().joinVoices([voice]).format([voice], staffWidth - 100)
        voice.draw(context, stave)
      } else {
        console.warn('No valid notes to render')
      }

      renderSheetMusic(notes, context, stave)
    }
  }, [notes, currentNote, suggestedNote, tempo, rawNotes, showTheoryHints, selectedConcept])

  // Cleanup renderer on component unmount
  useEffect(() => {
    return () => {
      clearMusicSheet()
      rendererRef.current = null
    }
  }, [])

  // Check if the current note is correct.
  useEffect(() => {
    if (notes.length === 0 || !currentNote || !expectedNoteTime || !onCorrectNote) return

    const expectedNoteKey = notes[0].getKeys()[0].toLowerCase()
    const playedNoteKey = currentNote.note.toLowerCase() + '/' + currentNote.octave

    // Calculate timing deviation
    const currentTime = Date.now()
    const beatDuration = 60000 / tempo // Duration of one beat in ms (quarter note)
    const expectedTime = expectedNoteTime // When the note should have been played
    const timingDeviation = currentTime - expectedTime

    if (expectedNoteKey === playedNoteKey) {
      // Correct key pressed.
      // If no suggestion was active, award a point.
      if (!suggestedNote) {
        dispatch(incrementScore())
      }
      // Clear any suggestion if it exists.
      if (suggestedNote !== null) {
        dispatch(setSuggestedNote(null))
      }

      // Call onCorrectNote with the played note and timing deviation
      onCorrectNote(playedNoteKey, timingDeviation)

      // Calculate the next expected note time
      // Each note is expected to be played after one beat (quarter note)
      setExpectedNoteTime(expectedNoteTime + beatDuration)

    } else if (lastKeyPressIncorrect) {
      // Set the suggestion if the last key press was incorrect
      const key = notes[0].getKeys()[0].split('/')[0].toUpperCase()
      const octave = parseInt(notes[0].getKeys()[0].split('/')[1])
      dispatch(setSuggestedNote({note: key, length: 'q', timestamp: Date.now(), octave}))
    }
  }, [currentNote, dispatch, onCorrectNote, expectedNoteTime, notes, suggestedNote, lastKeyPressIncorrect, tempo])

  /* Render */
  return (
    <MusicContainer>
      {notes.length === 0 ? (
        <span>Training Complete! Well done!</span>
      ) : (
        <>
          <strong>{notes.length}</strong> Notes Remaining
          <TempoDisplay>♩ = {tempo}</TempoDisplay>
          <ScrollingContainer ref={musicRef}/>

          {/* Show theory hint if applicable */}
          {(showTheoryHints || musicTheoryContext.showTheoryAnnotations) && theoryHint && (
            <TheoryAnnotation>{theoryHint}</TheoryAnnotation>
          )}
        </>
      )}
    </MusicContainer>
  )
}

export default SheetMusicRenderer
