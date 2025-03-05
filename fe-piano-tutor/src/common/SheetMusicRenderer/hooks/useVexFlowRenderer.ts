import {useRef, useCallback} from 'react'
import {useSelector} from 'react-redux'
import Vex, {Voice, Formatter} from 'vexflow'
import {RootState} from 'store'
import {TKeySignature} from 'pages/LearnMusicNotes/utils/musicNoteGenerator'
import {IPianoNote} from 'store/slices/types/IPianoNote'

/**
 * Types and interfaces
 */
type TNoteStyle = {
  fillStyle: string;
}

// Key signature patterns for detection
type TKeySignatureMap = {
  [key: string]: {
    name: TKeySignature;
    pattern: string[];
  }
}

/**
 * Hook that handles rendering sheet music using VexFlow
 */
export const useVexFlowRenderer = (
  currentNote: IPianoNote | null,
  tempo: number,
  setLastKeyPressIncorrect?: React.Dispatch<React.SetStateAction<boolean>>,
  keySignature?: TKeySignature
) => {
  /* DOM References */
  const musicRef = useRef<HTMLDivElement>(null)

  /* Redux State */
  const noteWidth = useSelector((state: RootState) =>
    state.settings.learnMusicNotes.NOTE_WIDTH
  )

  /**
   * Detects the key signature from the provided notes
   */
  const detectKeySignature = useCallback((notes: Vex.StaveNote[]): TKeySignature => {
    if (!notes || notes.length === 0) return 'C'

    // Define key signature patterns (sharps and flats in order of appearance)
    const keySignatures: TKeySignatureMap = {
      'C': {name: 'C', pattern: []}, // C major - no sharps/flats
      'G': {name: 'G', pattern: ['F#']}, // G major - 1 sharp
      'D': {name: 'D', pattern: ['F#', 'C#']}, // D major - 2 sharps
      'A': {name: 'A', pattern: ['F#', 'C#', 'G#']}, // A major - 3 sharps
      'E': {name: 'E', pattern: ['F#', 'C#', 'G#', 'D#']}, // E major - 4 sharps
      'B': {name: 'B', pattern: ['F#', 'C#', 'G#', 'D#', 'A#']}, // B major - 5 sharps
      'F#': {name: 'F#', pattern: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#']} // F# major - 6 sharps
    }

    // Extract all accidentals from notes
    const noteAccidentals: Set<string> = new Set()
    notes.forEach(note => {
      const keys = note.getKeys()
      keys.forEach(key => {
        const noteName = key.split('/')[0]
        if (noteName.includes('#')) {
          noteAccidentals.add(noteName)
        } else if (noteName.includes('b')) {
          // Convert flat to equivalent sharp for consistent handling
          const flatToSharp: Record<string, string> = {
            'Bb': 'A#', 'Eb': 'D#', 'Ab': 'G#', 'Db': 'C#', 'Gb': 'F#', 'Cb': 'B'
          }
          const sharpEquivalent = flatToSharp[noteName]
          if (sharpEquivalent) {
            noteAccidentals.add(sharpEquivalent)
          } else {
            noteAccidentals.add(noteName)
          }
        }
      })
    })

    // Find the best matching key signature
    let bestMatchKey: TKeySignature = 'C'
    let bestMatchScore = 0

    Object.entries(keySignatures).forEach(([key, {pattern}]) => {
      let score = 0

      // Calculate match score (pattern accidentals in the notes)
      pattern.forEach(accidental => {
        if (noteAccidentals.has(accidental)) {
          score++
        } else {
          score -= 0.5 // Penalize missing accidentals
        }
      })

      // Penalize extra accidentals not in this key signature
      noteAccidentals.forEach(accidental => {
        if (!pattern.includes(accidental)) {
          score -= 0.5
        }
      })

      if (score > bestMatchScore) {
        bestMatchScore = score
        bestMatchKey = key as TKeySignature
      }
    })

    return bestMatchKey
  }, [])

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
    // Add extra space for clef, key signature, and tempo marking
    const staffWidth = Math.max(250, notesToRender.length * noteWidth + 150)

    const renderer = new VF.Renderer(context, VF.Renderer.Backends.SVG)
    renderer.resize(staffWidth, 200)
    const renderContext = renderer.getContext()

    /* Create and configure staff */
    const stave = new VF.Stave(10, 40, staffWidth - 20)
    stave.addClef('treble')

    // Use provided key signature or detect from notes
    const keyToUse = keySignature || detectKeySignature(notesToRender)
    stave.addKeySignature(keyToUse)

    // Position tempo marking above the staff and slightly to the left
    stave.setTempo({bpm: tempo, duration: 'q'}, -16)
    stave.setContext(renderContext).draw()

    /* Add notes to voice and format */
    const voice = new Voice({
      num_beats: notesToRender.length,
      beat_value: 4
    })

    voice.addTickables(notesToRender)

    // Allow more space for formatting
    const formattingWidth = staffWidth - stave.getNoteStartX() - 40
    new Formatter()
      .joinVoices([voice])
      .format([voice], formattingWidth)

    voice.draw(renderContext, stave)

    /* Apply visual styling to notes */
    notesToRender.forEach((note, index) => {
      // Style the first note based on current input
      if (index === 0 && currentNote) {
        const expectedKey = note.getKeys()[0].toUpperCase()
        const playedKey = `${currentNote.note.toUpperCase()}/${currentNote.octave}`
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

      // Skip adding accidentals if they're already covered by the key signature
      const keys = note.getKeys()
      const currentKeySignature = keyToUse

      keys.forEach((key, keyIndex) => {
        const noteName = key.split('/')[0]
        const accidental = noteName.match(/[#b]/)

        if (accidental) {
          // Check if this accidental needs to be explicitly shown
          const baseNote = noteName.charAt(0)
          const accidentalType = accidental[0]

          // Only add explicit accidental if it's not part of the key signature
          // or if it's a natural in a key signature that would alter this note
          let needsExplicitAccidental = true

          // Define key signature patterns (notes that have sharps in each key)
          const keySignatureAccidentals: Record<TKeySignature, string[]> = {
            'C': [],
            'G': ['F#'],
            'D': ['F#', 'C#'],
            'A': ['F#', 'C#', 'G#'],
            'E': ['F#', 'C#', 'G#', 'D#'],
            'B': ['F#', 'C#', 'G#', 'D#', 'A#'],
            'F#': ['F#', 'C#', 'G#', 'D#', 'A#', 'E#']
          }

          const accidentalsInKey = keySignatureAccidentals[currentKeySignature]

          if (accidentalType === '#') {
            // If it's a sharp, check if it's already in the key signature
            needsExplicitAccidental = !accidentalsInKey.includes(noteName)
          } else if (accidentalType === 'b') {
            // If it's a flat, it likely needs explicit marking in sharp-based key signatures
            needsExplicitAccidental = true
          } else if (accidentalType === 'n') {
            // For naturals, check if the base note would normally have an accidental in this key
            const sharpVersionOfNote = baseNote + '#'
            needsExplicitAccidental = accidentalsInKey.some(accNote =>
              accNote.charAt(0) === baseNote
            )
          }

          // Handle special case: if a note with an accidental that contradicts the key signature
          // For example, F natural in G major (which has F#)
          if (accidentalType === undefined) {
            // If the note has no accidental but its base form would have one in this key
            const matchingKeyAccidental = accidentalsInKey.find(acc => acc.charAt(0) === baseNote)
            if (matchingKeyAccidental) {
              // We need to add a natural sign
              note.addModifier(new VF.Accidental('n'), keyIndex)
            }
          }

          if (needsExplicitAccidental) {
            note.addModifier(new VF.Accidental(accidentalType), keyIndex)
          }
        }
      })
    })
  }, [currentNote, tempo, setLastKeyPressIncorrect, noteWidth, detectKeySignature, keySignature])

  return {
    musicRef,
    renderSheet
  }
}
