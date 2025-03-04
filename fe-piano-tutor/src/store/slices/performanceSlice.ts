// src/slices/performanceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface INotePerformance {
  noteAttempted: string;  // The note that was played (e.g., "C4")
  noteExpected: string;   // The note that should have been played
  isCorrect: boolean;     // Whether the correct note was played
  timingDeviation: number; // Millisecond ds deviation from expected timing
  difficultyLevel: number; // Current difficulty level
  timestamp: number;      // When the note was attempted
}

export interface IPerformanceState {
  currentSessionPerformance: INotePerformance[];  // Current practice session data
  accuracyRate: number;    // Percentage of correct notes in session
  averageTiming: number;   // Average timing deviation in ms
  totalNotesPlayed: number; // Total number of notes attempted in session
  sessionStart: number | null; // Timestamp when session started
  sessionEnd: number | null;   // Timestamp when session ended
}

const initialState: IPerformanceState = {
  currentSessionPerformance: [],
  accuracyRate: 0,
  averageTiming: 0,
  totalNotesPlayed: 0,
  sessionStart: null,
  sessionEnd: null
};

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    recordNotePerformance: (state, action: PayloadAction<INotePerformance>) => {
      state.currentSessionPerformance.push(action.payload);
      state.totalNotesPlayed++;

      // Update accuracy rate
      const correctNotes = state.currentSessionPerformance.filter(note => note.isCorrect).length;
      state.accuracyRate = correctNotes / state.totalNotesPlayed * 100;

      // Update average timing
      const totalDeviation = state.currentSessionPerformance.reduce(
        (sum, note) => sum + Math.abs(note.timingDeviation), 0
      );
      state.averageTiming = totalDeviation / state.totalNotesPlayed;
    },
    startSession: (state) => {
      state.sessionStart = Date.now();
      state.sessionEnd = null;
      state.currentSessionPerformance = [];
      state.accuracyRate = 0;
      state.averageTiming = 0;
      state.totalNotesPlayed = 0;
    },
    endSession: (state) => {
      state.sessionEnd = Date.now();
    },
    clearPerformanceData: (state) => {
      return initialState;
    }
  }
});

export const {
  recordNotePerformance,
  startSession,
  endSession,
  clearPerformanceData
} = performanceSlice.actions;

export default performanceSlice.reducer;
