import React, {useEffect, useState, FC, useMemo} from 'react'
import Vex, {Voice, Formatter} from 'vexflow'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import {incrementScore, setSuggestedNote, Note} from 'store/slices/musicNotesSlice'
import {USER_CONFIG} from 'config'
import {useMusicTheory} from 'pages/MusicTheory/MusicTheoryContext'
import {
  TheoryAnnotation,
  ScrollingContainer,
  SheetMusicRendererStyled
} from 'common/SheetMusicRenderer/styles/SheetMusicRenderer.styled'
import {useVexFlowRenderer} from './hooks/useVexFlowRenderer'
import {generateMusicTheoryHint} from 'pages/MusicTheory/utils/musicTheoryHintUtil'

// Interfaces
interface SheetMusicRendererProps {
  notes: Vex.StaveNote[] | Note[];
  onCorrectNote?: (noteAttempted: string, timingDeviation: number) => void;
  tempo?: number;
  showTheoryHints?: boolean;
  selectedConcept?: string;
}

// Component to display remaining notes
const RemainingNotes: FC<{ count: number }> = ({count}) => (
  <><strong>{count}</strong> Notes Remaining</>
)

// Component for sheet music rendering
const SheetMusicDisplay: FC<{ musicRef: React.RefObject<HTMLDivElement> }> = ({musicRef}) => (
  <ScrollingContainer ref={musicRef}/>
)

// Main component
const SheetMusicRenderer: FC<SheetMusicRendererProps> = (props) => {
  /* Store & Props */
  const {notes, onCorrectNote, tempo = 120, showTheoryHints = false, selectedConcept} = props
  const dispatch = useDispatch()

  // Access current and suggested notes from Redux store
  const musicNotesState = useSelector((state: RootState) => state.musicNotes)
  const currentNote = musicNotesState.currentNote
  const suggestedNote = musicNotesState.suggestedNote

  /* State */
  // Track correctness and timing for note evaluation
  const [lastKeyPressIncorrect, setLastKeyPressIncorrect] = useState(false)
  const [expectedNoteTime, setExpectedNoteTime] = useState<number | null>(null)

  /* Hooks & Memoized Values */
  // Access music theory context with fallback
  const musicTheory = useMusicTheory()
  const musicTheoryContext = useMemo(() => {
    try {
      return musicTheory
    } catch (e) {
      return {
        showTheoryAnnotations: showTheoryHints,
        currentTheoryConcept: selectedConcept || ''
      }
    }
  }, [musicTheory, showTheoryHints, selectedConcept])

  // Convert input notes to VexFlow format if needed
  const vexNotes = useMemo(() => {
    // Check if notes are already Vex.StaveNote objects
    if (notes.length > 0 && 'getKeys' in notes[0]) {
      return notes as Vex.StaveNote[]
    }

    // Convert Note objects to Vex.StaveNote objects
    return (notes as Note[]).map(note => {
      const staveNote = new Vex.Flow.StaveNote({
        keys: [`${note.note.toLowerCase()}/${note.octave}`],
        duration: note.length || 'q'
      })

      // Add accidentals if present
      if (note.note.includes('#')) {
        staveNote.addModifier(new Vex.Flow.Accidental('#'), 0)
      } else if (note.note.includes('b')) {
        staveNote.addModifier(new Vex.Flow.Accidental('b'), 0)
      }

      return staveNote
    })
  }, [notes])

  // Custom hooks for rendering
  const {musicRef, clearMusicSheet, renderSheetMusic} = useVexFlowRenderer(
    vexNotes,
    currentNote,
    suggestedNote,
    tempo
  )

  const theoryConcept = musicTheoryContext.currentTheoryConcept || selectedConcept || '';
  const theoryHint = showTheoryHints ? generateMusicTheoryHint(vexNotes, theoryConcept) : '';

  /* Effects */
  // Initialize expected note time when notes are loaded
  useEffect(() => {
    if (notes.length > 0 && expectedNoteTime === null) {
      setExpectedNoteTime(Date.now())
    }
  }, [notes.length])

  // Render sheet music whenever notes or current note changes
  useEffect(() => {
    if (vexNotes.length === 0) {
      clearMusicSheet()
      return
    }

    const VF = Vex.Flow
    const staffWidth = Math.max(200, vexNotes.length * USER_CONFIG.NOTE_WIDTH)

    if (!musicRef.current) return

    const renderer = new VF.Renderer(musicRef.current, VF.Renderer.Backends.SVG)
    renderer.resize(staffWidth, 200)
    const context = renderer.getContext()
    context.clear()

    const stave = new VF.Stave(10, 40, staffWidth)
    stave.addClef('treble')
    stave.setTempo({bpm: tempo, duration: 'q'}, 0)
    stave.setContext(context).draw()

    if (vexNotes.length > 0) {
      const voice = new Voice({
        num_beats: vexNotes.length,
        beat_value: 4
      })

      voice.addTickables(vexNotes)
      new Formatter().joinVoices([voice]).format([voice], staffWidth - 100)
      voice.draw(context, stave)

      renderSheetMusic(vexNotes, context, stave, currentNote, setLastKeyPressIncorrect)
    }

    return () => {
      clearMusicSheet()
    }
  }, [vexNotes, currentNote, suggestedNote])

  // Process note input and handle correct/incorrect notes
  useEffect(() => {
    if (notes.length === 0 || !currentNote || !expectedNoteTime) return

    const expectedNoteKey = vexNotes[0].getKeys()[0].toLowerCase()
    const playedNoteKey = currentNote.note.toLowerCase() + '/' + currentNote.octave

    // Calculate timing deviation
    const currentTime = Date.now()
    const beatDuration = 60000 / tempo // Duration of one beat in ms
    const timingDeviation = currentTime - expectedNoteTime

    if (expectedNoteKey === playedNoteKey) {
      // Correct key pressed - update score and clear suggestion
      if (!suggestedNote) {
        dispatch(incrementScore())
      }
      if (suggestedNote !== null) {
        dispatch(setSuggestedNote(null))
      }

      // Notify parent component of correct note
      if (onCorrectNote) {
        onCorrectNote(playedNoteKey, timingDeviation)
      }

      // Update timing expectation for next note
      setExpectedNoteTime(expectedNoteTime + beatDuration)
    } else if (lastKeyPressIncorrect) {
      // Set visual suggestion for incorrect attempt
      const key = vexNotes[0].getKeys()[0].split('/')[0].toUpperCase()
      const octave = parseInt(vexNotes[0].getKeys()[0].split('/')[1])
      dispatch(setSuggestedNote({
        note: key,
        length: 'q',
        timestamp: Date.now(),
        octave
      }))
    }
  }, [currentNote, dispatch])

  /* Render */
  return (
    <SheetMusicRendererStyled>
      {vexNotes.length === 0 ? (
        <span>Training Complete! Well done!</span>
      ) : (
        <>
          <RemainingNotes count={vexNotes.length}/>
          <SheetMusicDisplay musicRef={musicRef}/>

          {showTheoryHints && theoryHint && (
            <TheoryAnnotation>{theoryHint}</TheoryAnnotation>
          )}
        </>
      )}
    </SheetMusicRendererStyled>
  )
}

export default SheetMusicRenderer
