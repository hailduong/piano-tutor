import React, {useState, useEffect, useRef} from 'react'
import {Spin} from 'antd'
import {useMIDIHandler} from 'pages/LearnSong/hooks/useMIDIHandler'
import {useNoteTimingTracking} from 'pages/LearnSong/hooks/useNoteTimingTracking'
import SheetRenderer from 'pages/LearnSong/SheetRenderer'
import Vex from 'vexflow'
import {useSelector} from 'react-redux'
import {selectIsPracticing, selectIsPlaying} from 'store/slices/learnSongSlice'
import {selectPianoCurrentNote} from 'store/slices/virtualPianoSlice'
import {IPianoNote} from 'store/slices/types/IPianoNote'
import {useAppDispatch} from 'store'
import usePlaySong from 'pages/LearnSong/hooks/usePlaySong'
import usePracticeSong from './hooks/usePracticeSong'

interface AdvancedMusicSheetProps {
  songId: string | null;
  tempo: number;
  currentPosition: number;
  onSongPracticeComplete: () => void;
  vexNotes: Vex.StaveNote[];
}

const SheetContainer: React.FC<AdvancedMusicSheetProps> = (props) => {
  /* Props */
  const {
    songId, tempo, currentPosition,
    onSongPracticeComplete, vexNotes
  } = props


  /* Redux State */
  const dispatch = useAppDispatch()
  const isPracticing = useSelector(selectIsPracticing)
  const pianoCurrentNote: null | IPianoNote = useSelector(selectPianoCurrentNote)
  const isPlaying = useSelector(selectIsPlaying)


  /* States */
  const [currentNote, setCurrentNote] = useState<string | null>(null)
  const [nextNote, setNextNote] = useState<string | null>(null)
  const [noteElements, setNoteElements] = useState<Map<string, HTMLElement>>(new Map())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [incorrectAttempt, setIncorrectAttempt] = useState<boolean>(false)

  /* Refs */
  const containerRef = useRef<HTMLDivElement>(null)
  const currentNoteRef = useRef(currentNote)
  currentNoteRef.current = currentNote
  const isPracticingRef = useRef(isPracticing)
  isPracticingRef.current = isPracticing
  const lastPianoNoteRef = useRef<IPianoNote | null>(null)


  /* Hooks */
  const {midiAccess, playNote, hasSupport} = useMIDIHandler()
  const {expectedNoteTime, lastNoteTimestamp, handleNotePlay, initializeTiming} = useNoteTimingTracking()

  /* Effects */
  useEffect(() => {
    if (vexNotes.length > 0) {
      setIsLoading(false)
    }
  }, [vexNotes])

  useEffect(() => {
    isPracticingRef.current = isPracticing
  }, [isPracticing])

  /**
   * Calculate note positions when notes are ready
   */
  useEffect(() => {
    if (vexNotes.length > 0) {

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

  /**
   * Initialize timing when isPlaying changes
   */
  useEffect(() => {
    initializeTiming(isPlaying)
  }, [])

  /**
   * Automatically play the next note in the song
   */
  usePlaySong({
    vexNotes,
    isPlaying,
    isPracticing,
    tempo,
    setCurrentNote,
    currentNote,
    setNextNote,
    nextNote
  })

  /**
   * Practice the song
   */
  usePracticeSong({
    vexNotes,
    isPracticing,
    currentNote,
    setCurrentNote,
    setNextNote,
    onSongPracticeComplete,
    setIncorrectAttempt,
    tempo
  })


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
        style={{
          position: 'relative',
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden'
        }}
      >
        <SheetRenderer
          vexNotes={vexNotes}
          onNoteElementsUpdate={handleNoteElementsUpdate}
          highlightNote={currentNote}
          incorrectAttempt={incorrectAttempt}
        />
      </div>
    </div>
  )
}

export default SheetContainer
