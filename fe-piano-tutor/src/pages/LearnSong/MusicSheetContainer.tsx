import React, {useState, useEffect, useRef} from 'react'
import {Spin} from 'antd'
import {useSheetMusicParser} from 'pages/LearnSong/hooks/useSheetMusicParser'
import {useMIDIHandler} from 'pages/LearnSong/hooks/useMIDIHandler'
import {useNoteTimingTracking} from 'pages/LearnSong/hooks/useNoteTimingTracking'
import SheetMusicRenderer from 'pages/LearnSong/SheetMusicRenderer'
import Vex from 'vexflow'
import {durationToBeats} from 'pages/LearnSong/sheetUtils'
import {useSelector} from 'react-redux'
import {selectIsPracticing, updateProgress} from 'store/slices/learnSongSlice'
import {setSuggestedNote, selectPianoCurrentNote} from 'store/slices/virtualPianoSlice'
import {IPianoNote} from 'store/slices/types/IPianoNote'
import {useAppDispatch} from 'store'

interface AdvancedMusicSheetProps {
  songId: string | null;
  sheetMusicXMLString: string;
  isPlaying: boolean;
  tempo: number;
  currentPosition: number;
  onSongComplete: () => void;
}

const MusicSheetContainer: React.FC<AdvancedMusicSheetProps> = (props) => {
  /* Props */
  const {songId, sheetMusicXMLString, isPlaying, tempo, currentPosition, onSongComplete} = props


  /* Redux State */
  const dispatch = useAppDispatch()
  const isPracticing = useSelector(selectIsPracticing)
  const pianoCurrentNote: null | IPianoNote = useSelector(selectPianoCurrentNote)


  /* States */
  const [currentNote, setCurrentNote] = useState<string | null>(null)
  const [nextNote, setNextNote] = useState<string | null>(null)
  const [notePositions, setNotePositions] = useState<Map<string, any>>(new Map())
  const [noteElements, setNoteElements] = useState<Map<string, HTMLElement>>(new Map())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [vexNotes, setVexNotes] = useState<Vex.StaveNote[]>([])
  const [incorrectAttempt, setIncorrectAttempt] = useState<boolean>(false)

  /* Refs */
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const currentNoteRef = useRef(currentNote)
  currentNoteRef.current = currentNote
  const isPracticingRef = useRef(isPracticing)
  isPracticingRef.current = isPracticing
  const lastPianoNoteRef = useRef<IPianoNote | null>(null)


  /* Hooks */
  const {parseSheetMusic, calculateNotePositions, convertKeyToMIDINote} = useSheetMusicParser()
  const {midiAccess, playNote, hasSupport} = useMIDIHandler()
  const {expectedNoteTime, lastNoteTimestamp, handleNotePlay, initializeTiming} = useNoteTimingTracking()

  /* Effects */
  useEffect(() => {
    if (sheetMusicXMLString) {
      const notes = parseSheetMusic(sheetMusicXMLString)
      setVexNotes(notes)
      setIsLoading(false)
    }
  }, [sheetMusicXMLString])

  useEffect(() => {
    isPracticingRef.current = isPracticing
  }, [isPracticing])

  // Update note positions when vexNotes change
  useEffect(() => {
    if (vexNotes.length > 0 && scrollContainerRef.current) {
      const positions = calculateNotePositions(noteElements, scrollContainerRef.current)
      setNotePositions(positions)

      // Set initial current and next notes
      if (vexNotes.length > 0) {
        const firstNoteId = vexNotes[0].getAttribute('id')
        setCurrentNote(firstNoteId)

        if (vexNotes.length > 1) {
          const secondNoteId = vexNotes[1].getAttribute('id')
          setNextNote(secondNoteId)
        }
      }

      // Initialize timing when notes are ready
      initializeTiming(isPlaying)
    }
  }, [vexNotes])

  // Initialize timing when starting to play
  useEffect(() => {
    initializeTiming(isPlaying)
  }, [])

  // Play notes automatically mode
  useEffect(() => {
    let isActive = true

    const playNextNoteAutomatically = async (): Promise<void> => {
      if (!isActive || !isPlaying || !currentNoteRef.current) return Promise.resolve()

      const thisNote = currentNoteRef.current
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
      // (60000 / tempo) gives us milliseconds per beat
      const noteBeatDuration = (60000 / tempo) * adjustedBeats

      // Play the current note
      handleNotePlay(
        thisNote,
        vexNotes,
        isPlaying,
        tempo,
        onNotePlay,
        playNote,
        convertKeyToMIDINote
      )

      // Advance to next note
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

        // Schedule the next note based on this note's duration
        setTimeout(() => {
          if (isActive && isPlaying) playNextNoteAutomatically()
        }, noteBeatDuration)
      } else {
        // End of song
        onSongComplete()
        setCurrentNote(null)
        setNextNote(null)
      }
    }

    // Start playing only when isPlaying changes to true and we're not in practice mode
    if (isPlaying && !isPracticingRef.current) {
      playNextNoteAutomatically()
    }

    return () => {
      isActive = false // Clean up on unmount
    }
  }, [isPlaying, tempo])


  /**
   * Play a note > Check if the played note matches the expected note
   */
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
    // Instead of parsing from a string, access the note and octave properties
    const playedNote = pianoCurrentNote.note
    const playedOctave = pianoCurrentNote.octave
    // Convert note name and octave to MIDI note number
    const playedMidiNote = convertKeyToMIDINote(`${playedNote}/${playedOctave}`)

    // Compare the played note with the expected note
    if (playedMidiNote === expectedMidiNote) {
      // Correct note was played
      setIncorrectAttempt(false)
      dispatch(setSuggestedNote(null))

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

        // Set expected time for next note based on tempo
        initializeTiming(false)
      } else {
        // End of song
        onSongComplete()
        setCurrentNote(null)
        setNextNote(null)
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
        note: noteName.toUpperCase(),           // e.g., "C", "C#", etc.
        length: 'q',              // Default to quarter note
        timestamp: Date.now(),    // Current timestamp
        octave: parseInt(octaveStr, 10)  // Parse octave number
      }

      dispatch(setSuggestedNote(suggestedNote))

      // Update incorrect notes count
      dispatch(updateProgress({incorrectNotes: 1}))
    }
  }, [pianoCurrentNote])

  /* Handlers */
  // Store note element references from the rendered sheet
  const handleNoteElementsUpdate = (elements: Map<string, HTMLElement>) => {
    setNoteElements(elements)
  }

  /* Render */
  if (isLoading) {
    return <Spin/>
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      style={{width: '100%', outline: 'none'}}
    >
      <div>
        {hasSupport ? '' : 'MIDI not supported in your browser'}
      </div>
      <div>
        {isPracticing
          ? <span><strong>Practice Mode:</strong> Play the highlighted note on the piano</span>
          : <span><strong>Playback Mode:</strong> Listen to the song</span>}
      </div>
      <div
        ref={scrollContainerRef}
        style={{
          position: 'relative',
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden'
        }}
      >
        <SheetMusicRenderer
          vexNotes={vexNotes}
          onNoteElementsUpdate={handleNoteElementsUpdate}
          currentNote={currentNote}
          incorrectAttempt={incorrectAttempt}
        />
      </div>
    </div>
  )
}

export default MusicSheetContainer
