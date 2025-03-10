import {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {updateProgress} from 'store/slices/learnSongSlice'
import {setSuggestedNote, selectPianoCurrentNote} from 'store/slices/virtualPianoSlice'
import {IPianoNote} from 'store/slices/types/IPianoNote'
import {useSheetMusicParser} from 'pages/LearnSong/hooks/useSheetMusicParser'
import {useNoteTimingTracking} from 'pages/LearnSong/hooks/useNoteTimingTracking'
import Vex from 'vexflow'

interface UsePracticeSongProps {
  vexNotes: Vex.StaveNote[];
  isPracticing: boolean;
  currentNote: string | null;
  setCurrentNote: (note: string | null) => void;
  setNextNote: (note: string | null) => void;
  onSongPracticeComplete: () => void;
  setIncorrectAttempt: (incorrect: boolean) => void;
}

const usePracticeSong = ({
                           vexNotes,
                           isPracticing,
                           currentNote,
                           setCurrentNote,
                           setNextNote,
                           onSongPracticeComplete,
                           setIncorrectAttempt
                         }: UsePracticeSongProps) => {
  const dispatch = useDispatch()
  const pianoCurrentNote: null | IPianoNote = useSelector(selectPianoCurrentNote)
  const {convertKeyToMIDINote} = useSheetMusicParser()
  const {initializeTiming} = useNoteTimingTracking()
  const lastPianoNoteRef = useRef<IPianoNote | null>(null)

  useEffect(() => {
    if (!isPracticing || !currentNote || !pianoCurrentNote) {
      return
    }

    // Update ref to prevent duplicate processing
    lastPianoNoteRef.current = pianoCurrentNote

    // Get expected note information
    const currentIndex = vexNotes.findIndex(note => note.getAttribute('id') === currentNote)
    if (currentIndex === -1) return

    const currentVexNote = vexNotes[currentIndex]
    const key = currentVexNote.getKeys()[0]
    const expectedMidiNote = convertKeyToMIDINote(key)

    // Get the MIDI note number from the piano note object
    const playedNote = pianoCurrentNote.note
    const playedOctave = pianoCurrentNote.octave
    const playedMidiNote = convertKeyToMIDINote(`${playedNote}/${playedOctave}`)

    // Compare the played note with the expected note
    if (playedMidiNote === expectedMidiNote) {
      // Correct note was played
      dispatch(setSuggestedNote(null))
      setIncorrectAttempt(false)

      // Move to next note
      if (currentIndex < vexNotes.length - 1) {
        const nextNoteId = vexNotes[currentIndex + 1].getAttribute('id')
        setCurrentNote(nextNoteId)
        console.log(`Setting currentNote to ${nextNoteId} after correct play`)

        // Update next note reference
        if (currentIndex + 2 < vexNotes.length) {
          const nextNextNoteId = vexNotes[currentIndex + 2].getAttribute('id')
          setNextNote(nextNextNoteId)
          console.log(`Setting nextNote to ${nextNextNoteId} after correct play`)
        } else {
          setNextNote(null)
          console.log(`Setting nextNote to null after correct play`)
        }

        // Set expected time for next note based on tempo
        initializeTiming(false)
      } else {
        // End of song
        onSongPracticeComplete()

        // Reset currentNote and nextNote to initial values
        if (vexNotes.length > 0) {
          const firstNoteId = vexNotes[0].getAttribute('id')
          setCurrentNote(firstNoteId)
          console.log(`Resetting currentNote to ${firstNoteId}`)

          if (vexNotes.length > 1) {
            const secondNoteId = vexNotes[1].getAttribute('id')
            setNextNote(secondNoteId)
            console.log(`Resetting nextNote to ${secondNoteId}`)
          } else {
            setNextNote(null)
            console.log(`Setting nextNote to null`)
          }
        } else {
          setCurrentNote(null)
          setNextNote(null)
        }
      }

      // Update correct notes count
      dispatch(updateProgress({correctNotes: 1}))
    } else {
      // Incorrect note
      setIncorrectAttempt(true)

      // Suggest the correct note in the piano UI
      const nextKey = currentVexNote.getKeys()[0]

      // Parse the key to get note name and octave
      // Example key format: "C/4" where "C" is the note and "4" is the octave
      const [noteName, octaveStr] = nextKey.split('/')

      // Create a proper IPianoNote object
      const suggestedNote: IPianoNote = {
        note: noteName.toUpperCase(), // e.g., "C", "C#", etc.
        length: 'q', // Default to quarter note
        timestamp: Date.now(), // Current timestamp
        octave: parseInt(octaveStr, 10) // Parse octave number
      }

      dispatch(setSuggestedNote(suggestedNote))

      // Update incorrect notes count
      dispatch(updateProgress({incorrectNotes: 1}))
    }
  }, [pianoCurrentNote])
}

export default usePracticeSong
