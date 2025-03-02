import React, {useEffect, useRef, useState, FC, useMemo} from 'react'
import Vex, {Voice, Formatter} from 'vexflow'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store/store'
import {incrementScore, setSuggestedNote, Note} from 'store/slices/musicNotesSlice'
import {USER_CONFIG} from 'config'
import {useMusicTheory} from 'contexts/MusicTheoryContext'
import {
  TheoryAnnotation,
  TempoDisplay,
  ScrollingContainer,
  SheetMusicRendererStyled
} from 'common/SheetMusicRenderer/SheetMusicRenderer.styled'
import musicTheoryUtil from 'utils/musicTheoryUtil'


// Interfaces
interface SheetMusicRendererProps {
  notes: Vex.StaveNote[] | Note[]; // Accept both VexFlow StaveNotes and our own Note type
  onCorrectNote?: (noteAttempted: string, timingDeviation: number) => void; // Make this optional
  tempo?: number;
  showTheoryHints?: boolean;
  selectedConcept?: string;
}

const SheetMusicRenderer: FC<SheetMusicRendererProps> = ({
                                                           notes,
                                                           onCorrectNote,
                                                           tempo = 60,
                                                           showTheoryHints = false,
                                                           selectedConcept = ''
                                                         }) => {
  /* Store and props */
  const musicRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<Vex.Renderer | null>(null)
  const dispatch = useDispatch()
  const {currentNote, suggestedNote} = useSelector((state: RootState) => state.musicNotes)

  // Convert notes to Vex.StaveNote if they are not already
  const vexNotes = useMemo(() => {
    // Check if notes are already Vex.StaveNote objects
    if (notes.length > 0 && 'getKeys' in notes[0]) {
      return notes as Vex.StaveNote[]
    }

    // Convert Note objects to Vex.StaveNote objects
    return (notes as Note[]).map(note => {
      const staveNote = new Vex.Flow.StaveNote({
        keys: [`${note.note.toLowerCase()}/${note.octave}`],
        duration: note.length || 'q'
      })

      // Add accidentals if present
      if (note.note.includes('#')) {
        staveNote.addModifier(new Vex.Flow.Accidental('#'), 0)
      } else if (note.note.includes('b')) {
        staveNote.addModifier(new Vex.Flow.Accidental('b'), 0)
      }

      return staveNote
    })
  }, [notes])


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
    if ((showTheoryHints || musicTheoryContext.showTheoryAnnotations) && notes.length > 0) {
      // Convert VexFlow notes to our Note type for theory hint generation
      const appNotes = notes.map(vexNote => {
        const keyParts = vexNote.getKeys()[0].split('/')
        const noteName = keyParts[0].toUpperCase()
        const octave = parseInt(keyParts[1])
        const length = vexNote.getDuration()
        return {
          note: noteName,
          octave,
          length,
          timestamp: Date.now()
        } as Note
      })

      const hint = musicTheoryUtil.generateTheoryHint(appNotes, musicTheoryContext.currentTheoryConcept || selectedConcept)
      setTheoryHint(hint)
    }
  }

  /* Effects */
  // Everytime the notes change, re-render the sheet music
  useEffect(() => {
    if (vexNotes.length === 0) {
      clearMusicSheet()
      return
    } // nothing to render

    const VF = Vex.Flow
    const staffWidth = Math.max(200, vexNotes.length * USER_CONFIG.NOTE_WIDTH)

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

      // Check that each note is a proper VexFlow Tickable object
      if (vexNotes.length > 0) {
        const voice = new Voice({
          num_beats: vexNotes.length,
          beat_value: 4
        })

        voice.addTickables(vexNotes)
        new Formatter().joinVoices([voice]).format([voice], staffWidth - 100)
        voice.draw(context, stave)
      } else {
        console.warn('No valid notes to render')
      }

      renderSheetMusic(vexNotes, context, stave)
    }
  }, [vexNotes, currentNote, suggestedNote])

  // Cleanup renderer on component unmount
  useEffect(() => {
    return () => {
      clearMusicSheet()
      rendererRef.current = null
    }
  }, [])

  // Check if the current note matches the expected note
  useEffect(() => {
    if (notes.length === 0 || !currentNote || !expectedNoteTime) return

    const expectedNoteKey = vexNotes[0].getKeys()[0].toLowerCase()
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

      // Call onCorrectNote with the played note and timing deviation if provided
      if (onCorrectNote) {
        onCorrectNote(playedNoteKey, timingDeviation)
      }

      // Calculate the next expected note time
      // Each note is expected to be played after one beat (quarter note)
      setExpectedNoteTime(expectedNoteTime + beatDuration)

    } else if (lastKeyPressIncorrect) {
      // Set the suggestion if the last key press was incorrect
      const key = vexNotes[0].getKeys()[0].split('/')[0].toUpperCase()
      const octave = parseInt(vexNotes[0].getKeys()[0].split('/')[1])
      dispatch(setSuggestedNote({note: key, length: 'q', timestamp: Date.now(), octave}))
    }
  }, [currentNote, dispatch])


  /* Render */
  return (
    <SheetMusicRendererStyled>
      {vexNotes.length === 0 ? (
        <span>Training Complete! Well done!</span>
      ) : (
        <>
          {/* Sheet Music */}
          <strong>{vexNotes.length}</strong> Notes Remaining
          <TempoDisplay>♩ = {tempo}</TempoDisplay>
          <ScrollingContainer ref={musicRef}/>

          {/* Theory Hints */}
          {showTheoryHints && theoryHint && (
            <TheoryAnnotation>{theoryHint}</TheoryAnnotation>
          )}
        </>
      )}
    </SheetMusicRendererStyled>
  )
}

export default SheetMusicRenderer
