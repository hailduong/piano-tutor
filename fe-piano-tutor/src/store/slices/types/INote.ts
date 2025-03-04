export interface INote {
  note: string;      // e.g., "C", "C#", etc.
  length: string;    // Default: "q" (quarter note)
  timestamp: number; // When the note was played
  octave: number;    // The octave of the note (e.g., 4 for A4)
}
