import React, {useState, useEffect, useRef} from 'react'
import {Spin} from 'antd'
import {useSheetMusicParser} from './hooks/useSheetMusicParser'
import {useMIDIHandler} from './hooks/useMIDIHandler'
import {useNoteTimingTracking} from './hooks/useNoteTimingTracking'
import MusicSheetRenderer from './MusicSheetRenderer'
import Vex from 'vexflow'
import {durationToBeats} from 'pages/LearnSong/sheetUtils'

interface AdvancedMusicSheetProps {
  sheetMusicXMLString: string;
  isPlaying: boolean;
  tempo: number;
  onNotePlay: (noteId: string, timingDeviation: number) => void;
  onSongComplete: () => void;
}

const AdvancedMusicSheet: React.FC<AdvancedMusicSheetProps> = (props) => {
  /* Props */
  const {sheetMusicXMLString, isPlaying, tempo, onNotePlay, onSongComplete} = props

  /* States */
  const [currentNote, setCurrentNote] = useState<string | null>(null)
  const [nextNote, setNextNote] = useState<string | null>(null)
  const [notePositions, setNotePositions] = useState<Map<string, any>>(new Map())
  const [noteElements, setNoteElements] = useState<Map<string, HTMLElement>>(new Map())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [vexNotes, setVexNotes] = useState<Vex.StaveNote[]>([])


  /* Refs */
  const currentNoteRef = useRef(currentNote)
  currentNoteRef.current = currentNote
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  /* Hooks */
  const {parseSheetMusic, calculateNotePositions, convertKeyToMIDINote} = useSheetMusicParser()
  const {midiAccess, playNote, hasSupport} = useMIDIHandler()
  // const {highlightRef, nextHighlightRef, updateHighlightPosition, updateNextHighlightPosition} = useNoteHighlighting()
  const {expectedNoteTime, lastNoteTimestamp, handleNotePlay, initializeTiming} = useNoteTimingTracking()

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
      if (isPlaying) {
        initializeTiming(isPlaying)
      }
    }
  }, [vexNotes, noteElements, isPlaying])

  // Update highlight positions
  // useEffect(() => {
  //   updateHighlightPosition(currentNote, notePositions, scrollContainerRef)
  //   updateNextHighlightPosition(nextNote, notePositions)
  // }, [currentNote, nextNote, notePositions])

  // Initialize timing when starting to play
  useEffect(() => {
    initializeTiming(isPlaying)
  }, [])

  // Play notes automatically
  // Play notes automatically
  useEffect(() => {
    let isActive = true

    const playNextNoteAutomatically = async (): Promise<void> => {
      if (!isActive || !isPlaying || !currentNoteRef.current) return Promise.resolve()

      const thisNote = currentNoteRef.current
      const currentIndex = vexNotes.findIndex(note => note.getAttribute('id') === thisNote)
      if (currentIndex === -1) return Promise.resolve()

      const currentVexNote = vexNotes[currentIndex]
      console.log(`Playing note at index ${currentIndex} of ${vexNotes.length}`)

      /// Get the duration from the VexFlow note
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

    // Start playing only when isPlaying changes to true
    if (isPlaying) {
      playNextNoteAutomatically()
    }

    return () => {
      isActive = false // Clean up on unmount
    }
}, [isPlaying, tempo])

  /* Handlers */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isPlaying || !currentNote) return

    // This is a simplified example - in a real application, you'd map keys to notes
    // Here we just advance to the next note on any keypress
    const currentIndex = vexNotes.findIndex(note => note.getAttribute('id') === currentNote)

    handleNotePlay(
      currentNote,
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

      // Update next highlight
      if (currentIndex + 2 < vexNotes.length) {
        const nextNextNoteId = vexNotes[currentIndex + 2].getAttribute('id')
        setNextNote(nextNextNoteId)
      } else {
        setNextNote(null)
      }
    } else {
      // End of song
      // onSongComplete()
      setCurrentNote(null)
      setNextNote(null)
    }
  }

  // Store note element references from the rendered sheet
  const handleNoteElementsUpdate = (elements: Map<string, HTMLElement>) => {
    setNoteElements(elements)
  }

  const handleTestPlay = (index: number) => {
    if (index < vexNotes.length) {
      const note = vexNotes[index]
      const key = note.getKeys()[0]
      const midiNote = convertKeyToMIDINote(key)
      playNote(midiNote, 500, 96)
      console.log(`Playing note: ${key} (MIDI: ${midiNote})`)
    }
  }

  /* Render */
  if (isLoading) {
    return <Spin/>
  }

  return (
    <div
      ref={containerRef}
      // onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{width: '100%', outline: 'none'}}
    >
      <div>
        {hasSupport ? 'MIDI support detected' : 'MIDI not supported in your browser'}
      </div>

      <div style={{margin: '20px 0', padding: '10px', border: '1px solid #ccc'}}>
        <h3>Note Playback Test</h3>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', maxWidth: '600px'}}>
          {vexNotes.slice(0, 8).map((note, index) => (
            <button
              key={index}
              onClick={() => handleTestPlay(index)}
              style={{
                padding: '8px 12px',
                background: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Play {note.getKeys()[0]}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            if (isPlaying) return
            // Test playing a chord with multiple notes
            const demoNotes = [60, 64, 67] // C major chord
            demoNotes.forEach(note => playNote(note, 800))
          }}
          style={{
            margin: '10px 0',
            padding: '8px 12px',
            background: '#52c41a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Play C Major Chord
        </button>
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
        <MusicSheetRenderer
          vexNotes={vexNotes}
          onNoteElementsUpdate={handleNoteElementsUpdate}
        />

        {/* Current note highlight */}
        {/*<div*/}
        {/*  ref={highlightRef}*/}
        {/*  style={{*/}
        {/*    position: 'absolute',*/}
        {/*    background: 'rgba(0, 255, 0, 0.3)',*/}
        {/*    borderRadius: '4px',*/}
        {/*    pointerEvents: 'none'*/}
        {/*  }}*/}
        {/*/>*/}

        {/* Next note highlight */}
        {/*<div*/}
        {/*  ref={nextHighlightRef}*/}
        {/*  style={{*/}
        {/*    position: 'absolute',*/}
        {/*    background: 'rgba(255, 255, 0, 0.2)',*/}
        {/*    borderRadius: '4px',*/}
        {/*    pointerEvents: 'none'*/}
        {/*  }}*/}
        {/*/>*/}
      </div>
    </div>
  )
}

export default AdvancedMusicSheet
