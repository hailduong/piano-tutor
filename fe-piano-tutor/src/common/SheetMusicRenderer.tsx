import React, {useEffect, useRef, useState, FC} from 'react'
import Vex, {Voice, Formatter} from 'vexflow'
import styled from 'styled-components'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import {incrementScore, setSuggestedNote} from 'slices/musicNotesSlice'
import {USER_CONFIG} from 'config'

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


// Interfaces
interface SheetMusicRendererProps {
  notes: Vex.StaveNote[];
  onCorrectNote: (noteAttempted: string, timingDeviation: number) => void;
  tempo?: number; // Beats per minute, default is 60 (1 beat per second)
}

const SheetMusicRenderer: FC<SheetMusicRendererProps> = ({
  notes,
  onCorrectNote,
  tempo = 60 // Default tempo: 60 BPM (quarter note = 1 second)
}) => {
  /* Store and props */
  const musicRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<Vex.Renderer | null>(null)
  const dispatch = useDispatch()
  const {currentNote, suggestedNote} = useSelector((state: RootState) => state.musicNotes)

  /* States */
  const [lastKeyPressIncorrect, setLastKeyPressIncorrect] = useState(false)
  const [expectedNoteTime, setExpectedNoteTime] = useState<number | null>(null)

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
      stave.setTempo({ bpm: tempo, duration: "q" }, 0)

    stave.setContext(context).draw()

    const voice = new Voice({num_beats: notes.length, beat_value: 4})
    voice.addTickables(notes)
    new Formatter().joinVoices([voice]).format([voice], staffWidth - 100)
    voice.draw(context, stave)

    renderSheetMusic(notes, context, stave)
    }
  }, [notes, currentNote, suggestedNote, tempo])

  // Cleanup renderer on component unmount
  useEffect(() => {
    return () => {
      clearMusicSheet()
      rendererRef.current = null
    }
  }, [])

  // Check if the current note is correct.
  useEffect(() => {
    if (notes.length === 0 || !currentNote || !expectedNoteTime) return

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
  }, [currentNote, dispatch])

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
        </>

      )}
    </MusicContainer>
  )
}

export default SheetMusicRenderer
