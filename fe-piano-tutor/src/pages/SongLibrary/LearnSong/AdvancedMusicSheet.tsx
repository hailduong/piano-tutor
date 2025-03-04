import React, {useState, useEffect, useRef} from 'react'
import {Spin} from 'antd'
import {useSheetMusicParser} from 'pages/SongLibrary/LearnSong/hooks/useSheetMusicParser'
import {useMIDIHandler} from 'pages/SongLibrary/LearnSong/hooks/useMIDIHandler'
import {useNoteTimingTracking} from 'pages/SongLibrary/LearnSong/hooks/useNoteTimingTracking'
import AdvancedMusicSheetRenderer from 'pages/SongLibrary/LearnSong/AdvancedMusicSheetRenderer'
import Vex from 'vexflow'
import {durationToBeats} from 'pages/SongLibrary/LearnSong/sheetUtils'

interface AdvancedMusicSheetProps {
  songId: string | null;
  sheetMusicXMLString: string;
  isPlaying: boolean;
  tempo: number;
  currentPosition: number;
  onNotePlay: (noteId: string, timingDeviation: number) => void;
  onSongComplete: () => void;
}

const AdvancedMusicSheet: React.FC<AdvancedMusicSheetProps> = (props) => {
  /* Props */
  const {songId, sheetMusicXMLString, isPlaying, tempo, currentPosition, onNotePlay, onSongComplete} = props

  /* States */
  const [currentNote, setCurrentNote] = useState<string | null>(null)
  const [nextNote, setNextNote] = useState<string | null>(null)
  const [notePositions, setNotePositions] = useState<Map<string, any>>(new Map())
  const [noteElements, setNoteElements] = useState<Map<string, HTMLElement>>(new Map())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [vexNotes, setVexNotes] = useState<Vex.StaveNote[]>([])
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false)
  const [incorrectAttempt, setIncorrectAttempt] = useState<boolean>(false)

  /* Refs */
  const currentNoteRef = useRef(currentNote)
  currentNoteRef.current = currentNote
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isPracticingRef = useRef(isPracticeMode)
  isPracticingRef.current = isPracticeMode

  /* Hooks */
  const {parseSheetMusic, calculateNotePositions, convertKeyToMIDINote} = useSheetMusicParser()
  const {midiAccess, playNote, hasSupport} = useMIDIHandler()
  const {expectedNoteTime, lastNoteTimestamp, handleNotePlay, initializeTiming} = useNoteTimingTracking()

  // Update practice mode when isPlaying changes
  useEffect(() => {
    // If we're not playing automatically, we're in practice mode
    const practiceMode = !isPlaying && currentNote !== null;
    setIsPracticeMode(practiceMode);
  }, [isPlaying, currentNote]);

  /* Effects */
  useEffect(() => {
    if (sheetMusicXMLString) {
      const notes = parseSheetMusic(sheetMusicXMLString)
      setVexNotes(notes)
      setIsLoading(false)
    }
  }, [sheetMusicXMLString])

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
  }, [vexNotes, noteElements, isPlaying])

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
  }, [isPlaying, tempo, isPracticeMode])

  // Handle piano key press for practice mode
  const handlePianoKeyPress = (midiNote: number) => {
    // Only process key presses in practice mode
    if (!isPracticeMode || !currentNote) return;

    // Get the current note's expected MIDI value
    const currentIndex = vexNotes.findIndex(note => note.getAttribute('id') === currentNote);
    if (currentIndex === -1) return;

    const currentVexNote = vexNotes[currentIndex];
    const key = currentVexNote.getKeys()[0]; // Get the first key of the VexFlow note
    const expectedMidiNote = convertKeyToMIDINote(key);

    // Check if played note matches expected note
    if (midiNote === expectedMidiNote) {
      // Correct note
      setIncorrectAttempt(false);

      // Play the note sound
      playNote(midiNote, 500, 96);

      // Record the correct note
    handleNotePlay(
      currentNote,
      vexNotes,
      false, // Not auto-playing
      tempo,
      onNotePlay,
      playNote,
      convertKeyToMIDINote
      );

      // Move to next note
    if (currentIndex < vexNotes.length - 1) {
        const nextNoteId = vexNotes[currentIndex + 1].getAttribute('id');
        setCurrentNote(nextNoteId);

        // Update next note reference
      if (currentIndex + 2 < vexNotes.length) {
          const nextNextNoteId = vexNotes[currentIndex + 2].getAttribute('id');
          setNextNote(nextNextNoteId);
      } else {
          setNextNote(null);
      }
    } else {
      // End of song
        onSongComplete();
        setCurrentNote(null);
        setNextNote(null);
    }
    } else {
      // Incorrect note
      setIncorrectAttempt(true);
      // Still play the note but with lower velocity to give feedback
      playNote(midiNote, 200, 50);

      // Highlight the correct note more prominently
      const noteElement = noteElements.get(currentNote);
      if (noteElement) {
        // Add a temporary class for incorrect attempt
        noteElement.classList.add('incorrect-attempt');
        setTimeout(() => {
          noteElement.classList.remove('incorrect-attempt');
        }, 300);
      }
    }
  };

  /* Handlers */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Map keyboard keys to MIDI notes for testing on computer keyboard
    // This is a simplified example - in a real app, you'd have a more complete mapping
    const keyMap: Record<string, number> = {
      'a': 60, // C4
      's': 62, // D4
      'd': 64, // E4
      'f': 65, // F4
      'g': 67, // G4
      'h': 69, // A4
      'j': 71, // B4
      'k': 72, // C5
    };

    const midiNote = keyMap[event.key.toLowerCase()];
    if (midiNote) {
      handlePianoKeyPress(midiNote);
    }
  }

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
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{width: '100%', outline: 'none'}}
    >
      <div>
        {hasSupport ? 'MIDI support detected' : 'MIDI not supported in your browser'}
      </div>
      <div>
        {isPracticeMode
          ? "Practice Mode: Play the highlighted note on the piano"
          : "Playback Mode: Listen to the song"}
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
        <AdvancedMusicSheetRenderer
          vexNotes={vexNotes}
          onNoteElementsUpdate={handleNoteElementsUpdate}
          currentNote={currentNote}
          nextNote={nextNote}
          incorrectAttempt={incorrectAttempt}
        />
      </div>
    </div>
  )
}

export default AdvancedMusicSheet
