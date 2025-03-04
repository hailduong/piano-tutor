import {useRef, useCallback} from 'react'
import {useSelector} from 'react-redux'
import Vex, {Voice, Formatter} from 'vexflow'
import {RootState} from 'store'
import {INote} from 'store/slices/musicNotesSlice'

/**
 * Types and interfaces
 */
type TNoteStyle = {
  fillStyle: string;
}

/**
 * Hook that handles rendering sheet music using VexFlow
 */
export const useVexFlowRenderer = (
  vexNotes: Vex.StaveNote[],
  currentNote: INote | null,
  suggestedNote: INote | null, // Kept for API compatibility
  tempo: number,
  setLastKeyPressIncorrect?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  /* DOM References */
  const musicRef = useRef<HTMLDivElement>(null)

  /* Redux State */
  const noteWidth = useSelector((state: RootState) =>
    state.settings.learnMusicNotes.NOTE_WIDTH
  )

  /**
   * Render sheet music with the provided notes
   */
  const renderSheet = useCallback((notesToRender: Vex.StaveNote[] | null) => {
    if (!musicRef.current) return

    const VF = Vex.Flow
    const context = musicRef.current

    // Clear existing content
    while (context.firstChild) {
      context.removeChild(context.firstChild)
    }

    if (!notesToRender || notesToRender.length === 0) {
      return // Nothing to render
    }

    /* Setup rendering area */
    const staffWidth = Math.max(200, notesToRender.length * noteWidth)

    const renderer = new VF.Renderer(context, VF.Renderer.Backends.SVG)
    renderer.resize(staffWidth, 200)
    const renderContext = renderer.getContext()

    /* Create and configure staff */
    const stave = new VF.Stave(10, 40, staffWidth)
    stave.addClef('treble')
    stave.setTempo({bpm: tempo, duration: 'q'}, 0)
    stave.setContext(renderContext).draw()

    /* Add notes to voice and format */
    const voice = new Voice({
      num_beats: notesToRender.length,
      beat_value: 4
    })

    voice.addTickables(notesToRender)
    new Formatter().joinVoices([voice]).format([voice], staffWidth - 100)
    voice.draw(renderContext, stave)

    /* Apply visual styling to notes */
    notesToRender.forEach((note, index) => {
      // Style the first note based on current input
      if (index === 0 && currentNote) {
        const expectedKey = note.getKeys()[0].toLowerCase()
        const playedKey = `${currentNote.note.toLowerCase()}/${currentNote.octave}`
        const isCorrect = expectedKey === playedKey

        // Apply different styles based on correctness
        const noteStyle: TNoteStyle = {
          fillStyle: isCorrect ? '#4caf50' : '#f44336'
        }
        note.setStyle(noteStyle)
        setLastKeyPressIncorrect?.(!isCorrect)
      } else {
        // Default style for other notes
        note.setStyle({fillStyle: 'black'})
      }

      // Add accidentals if needed
      const keys = note.getKeys()
      keys.forEach((key, keyIndex) => {
        const accidental = key.match(/[#b]/)
        if (accidental) {
          note.addModifier(new VF.Accidental(accidental[0]), keyIndex)
        }
      })

    })
  }, [currentNote, tempo, setLastKeyPressIncorrect, noteWidth])

  return {
    musicRef,
    renderSheet
  }
}
