import React, {useEffect, useState, FC, useMemo} from 'react'
import Vex from 'vexflow'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import {incrementScore, setSuggestedNote, INote} from 'store/slices/musicNotesSlice'
import {
  TheoryAnnotation,
  ScrollingSheetMusicDisplay,
  SheetMusicRendererStyled
} from 'common/SheetMusicRenderer/styles/SheetMusicRenderer.styled'
import {useVexFlowRenderer} from './hooks/useVexFlowRenderer'
import {generateMusicTheoryHint} from 'pages/MusicTheory/utils/musicTheoryHintUtil'
import {TKeySignature} from 'pages/LearnMusicNotes/utils/musicNoteGenerator'

// Interfaces
interface SheetMusicRendererProps {
  notes: Vex.StaveNote[] | INote[];
  keySignature?: TKeySignature;
  onCorrectNote?: (noteAttempted: string, timingDeviation: number) => void;
  tempo?: number;
  showTheoryHints?: boolean;
  selectedConcept?: string;
}


// Main component
const SheetMusicRenderer: FC<SheetMusicRendererProps> = (props) => {
  /* Store & Props */
  const {notes, onCorrectNote, tempo = 120, showTheoryHints = false, selectedConcept, keySignature} = props
  const dispatch = useDispatch()

  // Access current and suggested notes from Redux store
  const musicNotesState = useSelector((state: RootState) => state.musicNotes)
  const currentNote = musicNotesState.currentNote
  const suggestedNote = musicNotesState.suggestedNote

  // Get music theory state from Redux instead of context
  const showTheoryAnnotations = useSelector((state: RootState) => state.musicTheory.showTheoryAnnotations)
  const currentTheoryConcept = useSelector((state: RootState) => state.musicTheory.currentTheoryConcept)

  /* State */
  // Track correctness and timing for note evaluation
  const [lastKeyPressIncorrect, setLastKeyPressIncorrect] = useState(false)
  const [expectedNoteTime, setExpectedNoteTime] = useState<number | null>(null)

  /* Hooks */
  // Convert input notes to VexFlow format if needed
  const vexNotes = useMemo(() => {
    // Check if notes are already Vex.StaveNote objects
    if (notes.length > 0 && 'getKeys' in notes[0]) {
      return notes as Vex.StaveNote[]
    }

    // Convert Note objects to Vex.StaveNote objects
    return (notes as INote[]).map(note => {
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
  const {musicRef, renderSheet} = useVexFlowRenderer(
    currentNote,
    tempo,
    setLastKeyPressIncorrect,
    keySignature
  )

  const theoryHint = showTheoryAnnotations ? generateMusicTheoryHint(vexNotes, currentTheoryConcept) : ''
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
      renderSheet(null) // Pass null to clear the sheet
      return
    }

    renderSheet(vexNotes)

    // No need for a cleanup function if it's handled in the hook
  }, [vexNotes, currentNote, suggestedNote, renderSheet])

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
          <span className='me-3'>Notes Remaining: <strong>{vexNotes.length}</strong></span>
          <span>Key: <strong>{keySignature}</strong></span>
          <ScrollingSheetMusicDisplay ref={musicRef}/>

          {showTheoryAnnotations && theoryHint && (
            <TheoryAnnotation>{theoryHint}</TheoryAnnotation>
          )}
        </>
      )}
    </SheetMusicRendererStyled>
  )
}

export default SheetMusicRenderer
