import {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {updateProgress, updateTiming} from 'store/slices/learnSongSlice'
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
  tempo: number;
}

const usePracticeSong = (props: UsePracticeSongProps) => {
  /* Props */
  const {
    vexNotes,
    isPracticing,
    currentNote,
    setCurrentNote,
    setNextNote,
    onSongPracticeComplete,
    setIncorrectAttempt,
    tempo
  } = props

  /* Redux State */
  const dispatch = useDispatch()
  const pianoCurrentNote: null | IPianoNote = useSelector(selectPianoCurrentNote)
  const {convertKeyToMIDINote} = useSheetMusicParser()
  const {initializeTiming, calculateTimingAccuracy} = useNoteTimingTracking()
  const lastPianoNoteRef = useRef<IPianoNote | null>(null)
  const expectedTimeRef = useRef<number | null>(null)
  const sessionStartTimeRef = useRef<number | null>(null)

  /* Effects */
  useEffect(() => {
    if (isPracticing) {
      const now = Date.now()
      expectedTimeRef.current = now
      sessionStartTimeRef.current = now

      dispatch(updateTiming({
        expectedTiming: 0,
        actualTiming: 0,
        timingAccuracy: 0,
        timingDiffInSeconds: 0
      }))

      // Also use the hook's initializeTiming function
      initializeTiming(isPracticing)
    }
  }, [isPracticing, dispatch, initializeTiming])

  useEffect(() => {
    if (!isPracticing || !currentNote || !pianoCurrentNote) {
      return
    }

    // Prevent duplicate processing
    if (lastPianoNoteRef.current?.timestamp === pianoCurrentNote.timestamp) {
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

      // Capture timing information
      const now = Date.now()
      const relativeStart = sessionStartTimeRef.current || now

      if (expectedTimeRef.current !== null) {
        // Calculate timing accuracy
        const {diffMs, diffSeconds} = calculateTimingAccuracy(expectedTimeRef.current, now)

        // Calculate relative timings since session start in milliseconds
        const relativeExpected = expectedTimeRef.current - relativeStart
        const relativeActual = now - relativeStart

        // Update timing in the store
        dispatch(updateTiming({
          expectedTiming: relativeExpected,
          actualTiming: relativeActual,
          timingAccuracy: diffMs,
          timingDiffInSeconds: diffSeconds
        }))
      }

      // Move to next note
      if (currentIndex < vexNotes.length - 1) {
        const nextNoteId = vexNotes[currentIndex + 1].getAttribute('id')
        setCurrentNote(nextNoteId)

        // Update next note reference
        if (currentIndex + 2 < vexNotes.length) {
          const nextNextNoteId = vexNotes[currentIndex + 2].getAttribute('id')
          setNextNote(nextNextNoteId)
        } else {
          setNextNote(null)
        }

        // Calculate expected time for next note based on tempo
        const beatDuration = 60000 / tempo
        expectedTimeRef.current = now + beatDuration
      } else {
        // End of song
        onSongPracticeComplete()

        // Reset currentNote and nextNote to initial values
        if (vexNotes.length > 0) {
          const firstNoteId = vexNotes[0].getAttribute('id')
          setCurrentNote(firstNoteId)

          if (vexNotes.length > 1) {
            const secondNoteId = vexNotes[1].getAttribute('id')
            setNextNote(secondNoteId)
          } else {
            setNextNote(null)
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
        note: noteName.toUpperCase(),
        length: 'q',
        timestamp: Date.now(),
        octave: parseInt(octaveStr, 10)
      }

      dispatch(setSuggestedNote(suggestedNote))
      dispatch(updateProgress({incorrectNotes: 1}))
    }
  }, [pianoCurrentNote, vexNotes])

  return null
}

export default usePracticeSong
