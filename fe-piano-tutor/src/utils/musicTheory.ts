import { Note } from 'slices/musicNotesSlice'

class MusicTheoryUtil {
  private static instance: MusicTheoryUtil

  // Map of note values (0-11 representing C through B)
  private noteValues: Record<string, number> = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
    'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
  }

  // Interval name mapping
  private intervalNames: Record<number, string> = {
    0: 'Unison', 1: 'Minor 2nd', 2: 'Major 2nd', 3: 'Minor 3rd',
    4: 'Major 3rd', 5: 'Perfect 4th', 7: 'Perfect 5th',
    8: 'Minor 6th', 9: 'Major 6th', 10: 'Minor 7th',
    11: 'Major 7th', 12: 'Octave'
  }

  // Staff position mapping
  private notePositions: Record<string, string> = {
    'C': 'First ledger line below the staff',
    'D': 'Space below the staff',
    'E': 'First line',
    'F': 'First space',
    'G': 'Second line',
    'A': 'Second space',
    'B': 'Third line',
    'C5': 'Third space',
    'D5': 'Fourth line',
    'E5': 'Fourth space',
    'F5': 'Fifth line',
    'G5': 'Space above the staff',
    'A5': 'Ledger line above the staff'
  }

  private constructor() {}

  public static getInstance(): MusicTheoryUtil {
    if (!MusicTheoryUtil.instance) {
      MusicTheoryUtil.instance = new MusicTheoryUtil()
    }
    return MusicTheoryUtil.instance
  }

  // Calculate the distance in semitones between two notes
  public getIntervalInSemitones(note1: string, octave1: number, note2: string, octave2: number): number {
    const value1 = this.noteValues[note1] + (octave1 * 12)
    const value2 = this.noteValues[note2] + (octave2 * 12)
    return Math.abs(value2 - value1)
  }

  // Get interval name from semitones
  public getIntervalName(semitones: number): string {
    return this.intervalNames[semitones] || `${semitones} semitones`
  }

  // Check if a set of notes forms a major scale
  public isMajorScale(notes: string[]): boolean {
    const pattern = [2, 2, 1, 2, 2, 2, 1] // Whole, Whole, Half, Whole, Whole, Whole, Half

    if (notes.length < 8) return false

    const normalizedNotes = notes.map(note => this.noteValues[note.replace(/\d+$/, '')])

    for (let i = 0; i < normalizedNotes.length - 1; i++) {
      const interval = (normalizedNotes[i + 1] - normalizedNotes[i] + 12) % 12
      if (interval !== pattern[i % pattern.length]) return false
    }

    return true
  }

  // Check if a set of notes forms a chord and identify it
  public identifyChord(notes: string[]): string {
    if (notes.length < 3) return 'Not a chord'

    // Normalize notes to remove octave information and convert to values
    const normalizedNotes = notes.map(note => this.noteValues[note.replace(/\d+$/, '')])

    // Sort the note values
    normalizedNotes.sort((a, b) => a - b)

    // Get the intervals between adjacent notes
    const intervals: number[] = []
    for (let i = 0; i < normalizedNotes.length - 1; i++) {
      const interval = (normalizedNotes[i + 1] - normalizedNotes[i] + 12) % 12
      intervals.push(interval)
    }

    // Check for common chord types
    if (notes.length === 3) {
      // Major triad
      if (intervals.join(',') === '4,3') {
        return 'Major Triad'
      }
      // Minor triad
      else if (intervals.join(',') === '3,4') {
        return 'Minor Triad'
      }
      // Diminished triad
      else if (intervals.join(',') === '3,3') {
        return 'Diminished Triad'
      }
      // Augmented triad
      else if (intervals.join(',') === '4,4') {
        return 'Augmented Triad'
      }
    }

    return 'Unknown Chord'
  }

  // Get notes of a scale given a root note
  public getScaleNotes(rootNote: string, scaleType: 'major' | 'minor' = 'major'): string[] {
    const rootValue = this.noteValues[rootNote]
    if (rootValue === undefined) return []

    const intervals = scaleType === 'major'
      ? [0, 2, 4, 5, 7, 9, 11] // Major scale steps
      : [0, 2, 3, 5, 7, 8, 10] // Natural minor scale steps

    // Convert note values back to note names (only using naturals for simplicity)
    const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    const result: string[] = []

    for (const interval of intervals) {
      const noteValue = (rootValue + interval) % 12
      result.push(Object.entries(this.noteValues).find(([name, val]) =>
        val === noteValue && name.length === 1 // Only include natural notes
      )?.[0] || '')
    }

    return result.filter(Boolean)
  }

  // Generate music theory hints based on the displayed notes
  public generateTheoryHint(notes: Note[], conceptType: string): string {
    if (!notes || notes.length === 0) {
      return ''
    }

    let hint = ''

    // Generate different hints based on the selected concept
    switch (conceptType) {
      case 'intervals':
        if (notes.length >= 2) {
          hint = this.getIntervalHint(notes[0], notes[1])
        }
        break
      case 'scales-keys':
        if (notes.length >= 3) {
          hint = this.getScaleHint(notes)
        }
        break
      case 'chords':
        if (notes.length >= 3) {
          hint = this.getChordHint(notes)
        }
        break
      case 'basic-notation':
        hint = `Note: ${notes[0].note}${notes[0].octave} - ${this.getNotePosition(notes[0])}`
        break
      case 'rhythm-basics':
        hint = `${notes[0].length === 'q' ? 'Quarter Note' :
          notes[0].length === 'h' ? 'Half Note' :
            notes[0].length === 'w' ? 'Whole Note' :
              notes[0].length === '8' ? 'Eighth Note' :
                'Note'} (${notes[0].note}${notes[0].octave})`
        break
      default:
        // Default hint about note names
        if (notes.length > 0) {
          hint = `Note: ${notes[0].note}${notes[0].octave}`
        }
    }

    return hint
  }

  // Generates a hint for the interval between two notes
  public getIntervalHint(note1: Note, note2: Note): string {
    const value1 = this.noteValues[note1.note] + (note1.octave * 12)
    const value2 = this.noteValues[note2.note] + (note2.octave * 12)
    const semitones = Math.abs(value2 - value1)

    return `Interval: ${this.getIntervalName(semitones)}`
  }

  // Generates a hint for the scale or key based on the notes
  public getScaleHint(notes: Note[]): string {
    const firstNote = notes[0].note.replace('#', '').replace('b', '')

    // Check for C major scale pattern
    if (notes.length >= 7) {
      const noteNames = notes.map(n => n.note.replace('#', '').replace('b', ''))
      if (['C', 'D', 'E', 'F', 'G', 'A', 'B'].every(note => noteNames.includes(note))) {
        return `${firstNote} Major Scale`
      }
    }

    return `Scale starting with ${firstNote}`
  }

  // Generates a hint for the chord based on the notes
  public getChordHint(notes: Note[]): string {
    const rootNote = notes[0].note

    if (notes.length === 3) {
      // Simplified major/minor detection
      const noteNames = notes.map(n => n.note)
      if (noteNames.includes('E') && noteNames.includes('G') && rootNote === 'C') {
        return 'C Major Chord (C-E-G)'
      } else if (noteNames.includes('Eb') && noteNames.includes('G') && rootNote === 'C') {
        return 'C Minor Chord (C-Eb-G)'
      }
    }

    return `Chord based on ${rootNote}`
  }

  // Returns the position of the note on the staff
  public getNotePosition(note: Note): string {
    const key = note.note + (note.octave >= 5 ? note.octave : '')
    return this.notePositions[key] || 'On the staff'
  }
}

// Export a singleton instance
const musicTheoryUtil = MusicTheoryUtil.getInstance()
export default musicTheoryUtil
