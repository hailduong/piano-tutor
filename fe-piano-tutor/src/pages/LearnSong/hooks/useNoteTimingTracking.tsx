// src/pages/LearnSong/hooks/useNoteTimingTracking.tsx
import {useState, useCallback} from 'react'
import {useDispatch} from 'react-redux'
import Vex from 'vexflow'
import {updateTiming} from 'store/slices/learnSongSlice'

interface UseNoteTimingTrackingResult {
  expectedNoteTime: number | null;
  lastNoteTimestamp: number | null;
  handleNotePlay: (
    currentNote: string | null,
    vexNotes: Vex.StaveNote[],
    isPlaying: boolean,
    tempo: number,
    playNote: (midiNote: number, duration?: number, velocity?: number) => void,
    convertKeyToMIDINote: (key: string) => number
  ) => void;
  initializeTiming: (isPlaying: boolean) => void;
  calculateTimingAccuracy: (expected: number, actual: number) => {
    diffMs: number,
    diffSeconds: number
  };
}

export const useNoteTimingTracking = (): UseNoteTimingTrackingResult => {
  const [expectedNoteTime, setExpectedNoteTime] = useState<number | null>(null)
  const [lastNoteTimestamp, setLastNoteTimestamp] = useState<number | null>(null)
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const dispatch = useDispatch()

  // Initialize timing when starting to play
  const initializeTiming = useCallback((isPlaying: boolean) => {
    if (isPlaying && expectedNoteTime === null) {
      const now = Date.now()
      setExpectedNoteTime(now)
      setSessionStartTime(now)

      // Initialize the timings in the store
      dispatch(updateTiming({
        expectedTiming: 0, // 0ms since start
        actualTiming: 0,
        timingAccuracy: 0,
        timingDiffInSeconds: 0
      }))
    }
  }, [expectedNoteTime, dispatch])

  // Calculate timing accuracy in ms and seconds
  const calculateTimingAccuracy = useCallback((expected: number, actual: number) => {
    // Calculate how many milliseconds early/late the note was played
    const diffMs = actual - expected
    // Convert to seconds with 2 decimal places
    const diffSeconds = parseFloat((diffMs / 1000)?.toFixed(2))

    return {diffMs, diffSeconds}
  }, [])

  // Handle note played event
  const handleNotePlay = useCallback(
    (
      currentNote: string | null,
      vexNotes: Vex.StaveNote[],
      isPlaying: boolean,
      tempo: number,
      playNote: (midiNote: number, duration?: number, velocity?: number) => void,
      convertKeyToMIDINote: (key: string) => number
    ) => {
      if (!isPlaying || !currentNote) return

      // Calculate timing
      const now = Date.now()
      const relativeStart = sessionStartTime || now

      // Calculate relative timings since session start in seconds
      const relativeExpected = expectedNoteTime
        ? (expectedNoteTime - relativeStart)
        : 0
      const relativeActual = now - relativeStart

      // Calculate timing accuracy if we have an expected time
      if (expectedNoteTime !== null) {
        const {diffMs, diffSeconds} = calculateTimingAccuracy(expectedNoteTime, now)

        // Update the store with timing information
        dispatch(updateTiming({
          expectedTiming: relativeExpected,
          actualTiming: relativeActual,
          timingAccuracy: diffMs,
          timingDiffInSeconds: diffSeconds
        }))
      }

      // Send MIDI message
      const noteIndex = vexNotes.findIndex(note => note.getAttribute('id') === currentNote)
      if (noteIndex !== -1) {
        const key = vexNotes[noteIndex].getKeys()[0]
        const midiNote = convertKeyToMIDINote(key)
        playNote(midiNote, 500, 0x7f)
      }

      // Update expected time for next note based on tempo
      const beatDuration = 60000 / tempo
      const nextExpectedTime = now + beatDuration
      setExpectedNoteTime(nextExpectedTime)
      setLastNoteTimestamp(now)
    },
    [expectedNoteTime, calculateTimingAccuracy, dispatch, sessionStartTime]
  )

  return {
    expectedNoteTime,
    lastNoteTimestamp,
    handleNotePlay,
    initializeTiming,
    calculateTimingAccuracy
  }
}
