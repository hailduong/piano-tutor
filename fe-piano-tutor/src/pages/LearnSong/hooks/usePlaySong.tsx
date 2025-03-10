import {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {togglePlaying} from 'store/slices/learnSongSlice'
import {durationToBeats} from 'pages/LearnSong/sheetUtils'
import {useSheetMusicParser} from 'pages/LearnSong/hooks/useSheetMusicParser'
import {useMIDIHandler} from 'pages/LearnSong/hooks/useMIDIHandler'
import {useNoteTimingTracking} from 'pages/LearnSong/hooks/useNoteTimingTracking'
import {Vex} from 'vexflow'

interface UseAutoPlayNotesProps {
  vexNotes: Vex.StaveNote[];
  isPlaying: boolean;
  isPracticing: boolean;
  tempo: number;
  setCurrentNote: (note: string | null) => void;
  currentNote: string | null;
  setNextNote: (note: string | null) => void;
  nextNote: string | null;
}

/**
 * Custom hook to automatically play notes in a song.
 */
const usePlaySong = ({
                       vexNotes,
                       isPlaying,
                       isPracticing,
                       tempo,
                       setCurrentNote,
                       currentNote,
                       setNextNote,
                       nextNote
                     }: UseAutoPlayNotesProps) => {
  const dispatch = useDispatch()
  const currentNoteRef = useRef<string | null>(null)
  currentNoteRef.current = useSelector((state: any) => state.learnSong.currentNote)

  const {convertKeyToMIDINote} = useSheetMusicParser()
  const {playNote} = useMIDIHandler()
  const {initializeTiming} = useNoteTimingTracking()

  useEffect(() => {
    let isActive = true

    const playNextNoteAutomatically = async (): Promise<void> => {
      if (!isActive || !isPlaying || !currentNote) return Promise.resolve()

      const thisNote = currentNote
      const currentIndex = vexNotes.findIndex(note => note.getAttribute('id') === thisNote)
      if (currentIndex === -1) return Promise.resolve()

      const currentVexNote = vexNotes[currentIndex]
      console.log(`Playing note at index ${currentIndex} of ${vexNotes.length}`)

      // Get the duration from the VexFlow note
      const rawDuration = currentVexNote.getDuration()
      const noteBeats = durationToBeats(rawDuration)

      // Check if note is dotted (increases duration by 50%)
      const isDotted = currentVexNote.isDotted()

      // Apply dotted note adjustment (1.5x)
      const adjustedBeats = isDotted ? noteBeats * 1.5 : noteBeats

      // Calculate actual duration in milliseconds
      const noteBeatDuration = (60000 / tempo) * adjustedBeats
      console.log(`Note duration: ${noteBeatDuration}ms`)

      // Directly play the note using playNote
      const key = currentVexNote.getKeys()[0]
      const midiNote = convertKeyToMIDINote(key)
      await playNote(midiNote, noteBeatDuration)

      // Advance to next note
      if (currentIndex < vexNotes.length - 1) {
        const nextNoteId = vexNotes[currentIndex + 1].getAttribute('id')
        setCurrentNote(nextNoteId)
        console.log(`Setting currentNote to ${nextNoteId}`)

        // Update next note reference
        if (currentIndex + 2 < vexNotes.length) {
          const nextNextNoteId = vexNotes[currentIndex + 2].getAttribute('id')
          setNextNote(nextNextNoteId)
          console.log(`Setting nextNote to ${nextNextNoteId}`)
        } else {
          setNextNote(null)
          console.log(`Setting nextNote to null`)
        }

        // Schedule the next note based on this note's duration
        setTimeout(() => {
          if (isActive && isPlaying) playNextNoteAutomatically()
        }, noteBeatDuration)
      } else {
        // Set playing to false when the song ends
        dispatch(togglePlaying(false))

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
    }

    // Start playing only when isPlaying changes to true and we're not in practice mode
    if (isPlaying && !isPracticing) {
      playNextNoteAutomatically()
    }

    return () => {
      isActive = false // Clean up on unmount
    }
  }, [isPlaying, currentNote])
}

export default usePlaySong
