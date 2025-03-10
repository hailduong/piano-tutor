/**
 * Types and interfaces for the Learn Song feature
 */

// Song learning progress tracking
export interface ISessionProgress {
  totalNotes: number;
  notesPlayed: number;
  correctNotes: number;
  incorrectNotes: number;
  accuracy: number;
  currentPosition: number;
}

export interface INoteTimings {
  expectedTiming: number;  // in milliseconds since start
  actualTiming: number;    // in milliseconds since start
  timingAccuracy: number;  // in milliseconds difference (negative = early, positive = late)
  timingDiffInSeconds: number; // human-readable seconds difference
}

// Main learning session state
export interface ILearnSongState {
  songId: string | null;
  isPlaying: boolean;
  isPaused: boolean;
  tempo: number;
  currentNote: string | null;
  nextNote: string | null;
  timings: INoteTimings;
  sessionProgress: ISessionProgress;
  startTime: number | null;
  elapsedTime: number;
  metronomeEnabled: boolean;
  isPracticing: boolean;
  sheetMusic: any | null;
}

// Song learning settings
export interface ILearnSongSettings {
  tempo?: number;
  metronomeEnabled?: boolean;
  isPracticing?: boolean;
}

// Performance summary for the session
export interface IPerformanceSummary {
  accuracy: number;
  totalNotes: number;
  correctNotes: number;
  incorrectNotes: number;
  averageTiming: number;
  elapsedTime: number;
  songId: string;
  date: string;
}
