// Music Theory utility functions

// Map of note values (0-11 representing C through B)
const noteValues: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
  'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
};

// Calculate the distance in semitones between two notes
export const getIntervalInSemitones = (note1: string, octave1: number, note2: string, octave2: number): number => {
  const value1 = noteValues[note1] + (octave1 * 12);
  const value2 = noteValues[note2] + (octave2 * 12);
  return Math.abs(value2 - value1);
};

// Get interval name from semitones
export const getIntervalName = (semitones: number): string => {
  const intervalNames: Record<number, string> = {
    0: 'Unison', 1: 'Minor 2nd', 2: 'Major 2nd', 3: 'Minor 3rd',
    4: 'Major 3rd', 5: 'Perfect 4th', 7: 'Perfect 5th',
    8: 'Minor 6th', 9: 'Major 6th', 10: 'Minor 7th',
    11: 'Major 7th', 12: 'Octave'
  };

  return intervalNames[semitones] || `${semitones} semitones`;
};

// Check if a set of notes forms a major scale
export const isMajorScale = (notes: string[]): boolean => {
  const pattern = [2, 2, 1, 2, 2, 2, 1]; // Whole, Whole, Half, Whole, Whole, Whole, Half

  if (notes.length < 8) return false;

  const normalizedNotes = notes.map(note => noteValues[note.replace(/\d+$/, '')]);

  for (let i = 0; i < normalizedNotes.length - 1; i++) {
    const interval = (normalizedNotes[i + 1] - normalizedNotes[i] + 12) % 12;
    if (interval !== pattern[i % pattern.length]) return false;
  }

  return true;
};

// Check if a set of notes forms a chord and identify it
export const identifyChord = (notes: string[]): string => {
  if (notes.length < 3) return 'Not a chord';

  // Normalize notes to remove octave information and convert to values
  const normalizedNotes = notes.map(note => noteValues[note.replace(/\d+$/, '')]);

  // Sort the note values
  normalizedNotes.sort((a, b) => a - b);

  // Get the intervals between adjacent notes
  const intervals: number[] = [];
  for (let i = 0; i < normalizedNotes.length - 1; i++) {
    const interval = (normalizedNotes[i + 1] - normalizedNotes[i] + 12) % 12;
    intervals.push(interval);
  }

  // Check for common chord types
  if (notes.length === 3) {
    // Major triad: root, major 3rd (4 semitones), perfect 5th (7 semitones from root)
    if (intervals.join(',') === '4,3') {
      return 'Major Triad';
    }
    // Minor triad: root, minor 3rd (3 semitones), perfect 5th (7 semitones from root)
    else if (intervals.join(',') === '3,4') {
      return 'Minor Triad';
    }
    // Diminished triad: root, minor 3rd (3 semitones), diminished 5th (6 semitones from root)
    else if (intervals.join(',') === '3,3') {
      return 'Diminished Triad';
    }
    // Augmented triad: root, major 3rd (4 semitones), augmented 5th (8 semitones from root)
    else if (intervals.join(',') === '4,4') {
      return 'Augmented Triad';
    }
  }

  return 'Unknown Chord';
};

// Get notes of a scale given a root note
export const getScaleNotes = (rootNote: string, scaleType: 'major' | 'minor' = 'major'): string[] => {
  const rootValue = noteValues[rootNote];
  if (rootValue === undefined) return [];

  const intervals = scaleType === 'major'
    ? [0, 2, 4, 5, 7, 9, 11] // Major scale steps
    : [0, 2, 3, 5, 7, 8, 10]; // Natural minor scale steps

  // Convert note values back to note names (only using naturals for simplicity)
  const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const result: string[] = [];

  for (const interval of intervals) {
    const noteValue = (rootValue + interval) % 12;
    result.push(Object.entries(noteValues).find(([name, val]) =>
      val === noteValue && name.length === 1 // Only include natural notes
    )?.[0] || '');
  }

  return result.filter(Boolean);
};

export default {
  getIntervalInSemitones,
  getIntervalName,
  isMajorScale,
  identifyChord,
  getScaleNotes
};
