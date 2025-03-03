import React, {useState, useEffect, useRef} from 'react'
import {Spin} from 'antd'
import {useSheetMusicParser} from './hooks/useSheetMusicParser'
import {useMIDIHandler} from './hooks/useMIDIHandler'
import {useNoteHighlighting} from './hooks/useNoteHighlighting'
import {useNoteTimingTracking} from './hooks/useNoteTimingTracking'
import MusicSheetRenderer from './MusicSheetRenderer'
import Vex from 'vexflow'

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
  const [vexNotes, setVexNotes] = useState<Vex.StaveNote[]>([]);


  /* Refs */
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  /* Hooks */
  const {parseSheetMusic, calculateNotePositions, convertKeyToMIDINote} = useSheetMusicParser()
  const {midiAccess, playNote, hasSupport} = useMIDIHandler()
  const {highlightRef, nextHighlightRef, updateHighlightPosition, updateNextHighlightPosition} = useNoteHighlighting()
  const {expectedNoteTime, lastNoteTimestamp, handleNotePlay, initializeTiming} = useNoteTimingTracking()

  /* Effects */
  useEffect(() => {
    if (sheetMusicXMLString) {
      const notes = parseSheetMusic(sheetMusicXMLString);
      setVexNotes(notes);
      setIsLoading(false)
    }
  }, [sheetMusicXMLString])

  // Update note positions when vexNotes change
  useEffect(() => {
    if (vexNotes.length > 0 && scrollContainerRef.current) {
      const positions = calculateNotePositions(noteElements, scrollContainerRef.current)
      setNotePositions(positions)

      // Set initial current and next notes if they're not set
      if (!currentNote && vexNotes.length > 0) {
        const firstNoteId = vexNotes[0].getAttribute('id')
        setCurrentNote(firstNoteId)

        if (vexNotes.length > 1) {
          const secondNoteId = vexNotes[1].getAttribute('id')
          setNextNote(secondNoteId)
        }
      }
    }
  }, [])

  // Update highlight positions
  useEffect(() => {
    updateHighlightPosition(currentNote, notePositions, scrollContainerRef)
    updateNextHighlightPosition(nextNote, notePositions)
  }, [])

  // Initialize timing when starting to play
  useEffect(() => {
    initializeTiming(isPlaying)
  }, [])

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
      onSongComplete()
      setCurrentNote(null)
      setNextNote(null)
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
        <div
          ref={highlightRef}
          style={{
            position: 'absolute',
            background: 'rgba(0, 255, 0, 0.3)',
            borderRadius: '4px',
            pointerEvents: 'none'
          }}
        />

        {/* Next note highlight */}
        <div
          ref={nextHighlightRef}
          style={{
            position: 'absolute',
            background: 'rgba(255, 255, 0, 0.2)',
            borderRadius: '4px',
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  )
}

export default AdvancedMusicSheet
