/* Interfaces */
interface IWhiteKeyData {
  note: string;
  octave: number;
}

interface IBlackKeyData {
  note: string;
  octave: number;
  left: number;
}

/**
 * Singleton utility class for piano operations
 */
export class PianoUtils {

  private noteValues: { [key: string]: number } = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
    'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
  }

  /**
   * Create white keys data for an octave
   */
  public createWhiteKeysForOctave(octave: number): IWhiteKeyData[] {
    return [
      {note: 'C', octave},
      {note: 'D', octave},
      {note: 'E', octave},
      {note: 'F', octave},
      {note: 'G', octave},
      {note: 'A', octave},
      {note: 'B', octave}
    ]
  }

  /**
   * Create black keys data for an octave with position offsets
   */
  public createBlackKeysForOctave(octave: number): IBlackKeyData[] {
    return [
      {note: 'C#', octave, left: 28},
      {note: 'D#', octave, left: 68},
      // No black key between E and F
      {note: 'F#', octave, left: 148},
      {note: 'G#', octave, left: 188},
      {note: 'A#', octave, left: 228}
    ]
  }

  /**
   * Convert note and octave to MIDI note number
   */
  public getNoteToMIDI(note: string, octave: number): number {
    return (octave + 1) * 12 + this.noteValues[note]
  }
}

const pianoUtils = new PianoUtils()
export default pianoUtils
