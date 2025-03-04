// musicNoteGeneratorService.ts

import Vex from 'vexflow'
import {INote} from 'store/slices/musicNotesSlice'

// Types for music theory concepts
export type ScaleType = 'major' | 'minor' | 'pentatonicMajor' | 'pentatonicMinor' | 'chromatic' | 'blues';
export type ChordType = 'major' | 'minor' | 'diminished' | 'augmented' | 'major7' | 'minor7' | 'dominant7';
export type IntervalType =
  'unison' | 'minor2' | 'major2' | 'minor3' | 'major3' | 'perfect4' |
  'tritone' | 'perfect5' | 'minor6' | 'major6' | 'minor7' | 'major7' | 'octave';

export type TKeySignature = 'C' | 'G' | 'D' | 'A' | 'E' | 'B' | 'F#';

export interface NoteGeneratorOptions {
  startingNote?: string;
  startingOctave?: number;
  noteLength?: string;
  accidentals?: boolean;
  ascending?: boolean;
  noteCount?: number;
}

export class MusicNoteGenerator {
  private levels: { [key: number]: { notes: string[], keySignature: TKeySignature } }
  private noteValues: { [key: string]: number }
  private notesByValue: string[]

  constructor() {
    // Each level corresponds to a key signature with increasing number of sharps (0-6)
    this.levels = {
      1: {
        notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        keySignature: 'C' // C major - no sharps/flats
      },
      2: {
        notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
        keySignature: 'G' // G major - 1 sharp (F#)
      },
      3: {
        notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
        keySignature: 'D' // D major - 2 sharps (F#, C#)
      },
      4: {
        notes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
        keySignature: 'A' // A major - 3 sharps (F#, C#, G#)
      },
      5: {
        notes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
        keySignature: 'E' // E major - 4 sharps (F#, C#, G#, D#)
      },
      6: {
        notes: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
        keySignature: 'B' // B major - 5 sharps (F#, C#, G#, D#, A#)
      },
      7: {
        notes: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
        keySignature: 'F#' // F# major - 6 sharps (F#, C#, G#, D#, A#, E#)
      }
    }

    // Map of note values (0-11 representing C through B)
    this.noteValues = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
      'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    }

    // Reverse mapping from values to note names (preferring sharps)
    this.notesByValue = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  }

  /**
   * Generate random notes based on the difficulty level
   * @returns An object containing the generated notes and the key signature
   */
  generateNotes(level: number, numberOfNotes: number): {
    notes: Vex.StaveNote[],
    keySignature: TKeySignature
  } {
    if (level < 1 || level > 7) {
      throw new Error('Level must be between 1 and 7.')
    }

    const {notes: notePool, keySignature} = this.levels[level]
    const notes: Vex.StaveNote[] = []

    // Generate random notes from the pool
    for (let i = 0; i < numberOfNotes; i++) {
      const randomNote = notePool[Math.floor(Math.random() * notePool.length)]
      notes.push(
        new Vex.Flow.StaveNote({
          keys: [`${randomNote}/4`], // Use 4th octave (e.g., c/4)
          duration: 'q' // Quarter note
        })
      )
    }

    return {notes, keySignature}
  }

  /**
   * Convert our Note objects to VexFlow StaveNote objects
   */
  notesToVexNotes(notes: INote[]): Vex.StaveNote[] {
    return notes.map(note => {
      const staveNote = new Vex.Flow.StaveNote({
        keys: [`${note.note.toLowerCase()}/${note.octave}`],
        duration: note.length || 'q'
      })

      // Add accidentals if necessary
      if (note.note.includes('#')) {
        staveNote.addModifier(new Vex.Flow.Accidental('#'))
      } else if (note.note.includes('b')) {
        staveNote.addModifier(new Vex.Flow.Accidental('b'))
      }

      return staveNote
    })
  }

  /**
   * Generate a scale based on a starting note
   */
  generateScale(
    rootNote: string = 'C',
    octave: number = 4,
    scaleType: ScaleType = 'major',
    options: NoteGeneratorOptions = {}
  ): INote[] {
    const {
      noteLength = 'q',
      ascending = true,
      noteCount
    } = options

    let intervals: number[]

    // Define scale intervals (steps from the root)
    switch (scaleType) {
      case 'minor':
        intervals = [0, 2, 3, 5, 7, 8, 10, 12] // Natural minor
        break
      case 'pentatonicMajor':
        intervals = [0, 2, 4, 7, 9, 12]
        break
      case 'pentatonicMinor':
        intervals = [0, 3, 5, 7, 10, 12]
        break
      case 'chromatic':
        intervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        break
      case 'blues':
        intervals = [0, 3, 5, 6, 7, 10, 12]
        break
      case 'major':
      default:
        intervals = [0, 2, 4, 5, 7, 9, 11, 12] // Major scale
    }

    // Limit note count if specified
    const finalIntervals = noteCount ? intervals.slice(0, noteCount) : intervals

    // Create notes array
    const notes: INote[] = []
    const rootValue = this.noteValues[rootNote]

    if (rootValue === undefined) {
      throw new Error(`Invalid root note: ${rootNote}`)
    }

    // Calculate each note in the scale
    for (let i = 0; i < finalIntervals.length; i++) {
      const interval = finalIntervals[i]
      const noteValue = (rootValue + interval) % 12
      const noteName = this.notesByValue[noteValue]

      // Calculate octave (it may increase during the scale)
      const noteOctave = octave + Math.floor((rootValue + interval) / 12)

      notes.push({
        note: noteName,
        octave: noteOctave,
        length: noteLength,
        timestamp: Date.now() + (i * 100) // Stagger timestamps for display
      })
    }

    // Reverse if descending scale is requested
    return ascending ? notes : notes.reverse()
  }

  /**
   * Generate a chord based on a root note
   */
  generateChord(
    rootNote: string = 'C',
    octave: number = 4,
    chordType: ChordType = 'major',
    options: NoteGeneratorOptions = {}
  ): INote[] {
    const {
      noteLength = 'q',
      ascending = true
    } = options

    // Define chord intervals based on chord type
    let intervals: number[]

    switch (chordType) {
      case 'minor':
        intervals = [0, 3, 7] // Minor triad: Root, minor 3rd, perfect 5th
        break
      case 'diminished':
        intervals = [0, 3, 6] // Diminished: Root, minor 3rd, diminished 5th
        break
      case 'augmented':
        intervals = [0, 4, 8] // Augmented: Root, major 3rd, augmented 5th
        break
      case 'major7':
        intervals = [0, 4, 7, 11] // Major 7th: Root, major 3rd, perfect 5th, major 7th
        break
      case 'minor7':
        intervals = [0, 3, 7, 10] // Minor 7th: Root, minor 3rd, perfect 5th, minor 7th
        break
      case 'dominant7':
        intervals = [0, 4, 7, 10] // Dominant 7th: Root, major 3rd, perfect 5th, minor 7th
        break
      case 'major':
      default:
        intervals = [0, 4, 7] // Major triad: Root, major 3rd, perfect 5th
    }

    // Create notes array
    const notes: INote[] = []
    const rootValue = this.noteValues[rootNote]

    if (rootValue === undefined) {
      throw new Error(`Invalid root note: ${rootNote}`)
    }

    // Calculate each note in the chord
    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i]
      const noteValue = (rootValue + interval) % 12
      const noteName = this.notesByValue[noteValue]

      // Calculate octave (it may increase for higher chord notes)
      const noteOctave = octave + Math.floor((rootValue + interval) / 12)

      notes.push({
        note: noteName,
        octave: noteOctave,
        length: noteLength,
        timestamp: Date.now() + (i * 100) // Stagger timestamps for display
      })
    }

    // Reverse if descending chord is requested
    return ascending ? notes : notes.reverse()
  }

  /**
   * Generate an interval between two notes
   */
  generateInterval(
    rootNote: string = 'C',
    octave: number = 4,
    intervalType: IntervalType = 'perfect5',
    options: NoteGeneratorOptions = {}
  ): INote[] {
    const {noteLength = 'q'} = options

    // Map interval types to semitone counts
    const intervalMap: Record<IntervalType, number> = {
      'unison': 0,
      'minor2': 1,
      'major2': 2,
      'minor3': 3,
      'major3': 4,
      'perfect4': 5,
      'tritone': 6,
      'perfect5': 7,
      'minor6': 8,
      'major6': 9,
      'minor7': 10,
      'major7': 11,
      'octave': 12
    }

    const semitones = intervalMap[intervalType]
    const rootValue = this.noteValues[rootNote]

    if (rootValue === undefined) {
      throw new Error(`Invalid root note: ${rootNote}`)
    }

    // Calculate the second note
    const secondNoteValue = (rootValue + semitones) % 12
    const secondNote = this.notesByValue[secondNoteValue]

    // Calculate octave for the second note
    const secondOctave = octave + Math.floor((rootValue + semitones) / 12)

    // Create notes array
    const notes: INote[] = [
      {
        note: rootNote,
        octave: octave,
        length: noteLength,
        timestamp: Date.now()
      },
      {
        note: secondNote,
        octave: secondOctave,
        length: noteLength,
        timestamp: Date.now() + 100
      }
    ]

    return notes
  }

  /**
   * Generate notes for basic notation practice
   */
  generateBasicNotationNotes(
    clef: 'treble' | 'bass' = 'treble',
    options: NoteGeneratorOptions = {}
  ): INote[] {
    const {
      noteCount = 5,
      noteLength = 'q'
    } = options

    // Define note ranges for different clefs
    const trebleNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    const trebleOctaves = [4, 5]

    const bassNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    const bassOctaves = [2, 3]

    const notes: INote[] = []
    const noteSet = clef === 'treble' ? trebleNotes : bassNotes
    const octaveSet = clef === 'treble' ? trebleOctaves : bassOctaves

    // Generate random notes
    for (let i = 0; i < noteCount; i++) {
      const randomNote = noteSet[Math.floor(Math.random() * noteSet.length)]
      const randomOctave = octaveSet[Math.floor(Math.random() * octaveSet.length)]

      notes.push({
        note: randomNote,
        octave: randomOctave,
        length: noteLength,
        timestamp: Date.now() + (i * 100)
      })
    }

    return notes
  }
}

export const musicNoteGenerator = new MusicNoteGenerator()
export default musicNoteGenerator
