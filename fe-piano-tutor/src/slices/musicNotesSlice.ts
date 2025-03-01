import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Note {
  note: string;      // e.g., "C", "C#", etc.
  length: string;    // Default: "q" (quarter note)
  timestamp: number; // When the note was played
  octave: number;    // The octave of the note (e.g., 4 for A4)
}

interface MusicNotesState {
  currentNote: Note | null;
  history: Note[];
  suggestedNote: Note | null; // The note that should be played (suggested by the system)
  score: number;  // Total accumulated score
  lastSessionScore: number; // Score from the most recent session
}

const initialState: MusicNotesState = {
  currentNote: null,
  history: [],
  suggestedNote: null,
  score: 0,
  lastSessionScore: 0,
};

const musicNotesSlice = createSlice({
  name: 'musicNotes',
  initialState,
  reducers: {
    setCurrentNote: (state, action: PayloadAction<Note>) => {
      state.currentNote = action.payload;
      state.history.push(action.payload);
    },
    setSuggestedNote: (state, action: PayloadAction<Note | null>) => {
      state.suggestedNote = action.payload;
    },
    incrementScore: (state) => {
      state.score += 1;
    },
    resetScore: (state) => {
      state.score = 0;
    },
    setLastSessionScore: (state, action: PayloadAction<number>) => {
      state.lastSessionScore = action.payload;
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
});

export const {
  setCurrentNote,
  setSuggestedNote,
  incrementScore,
  resetScore,
  setLastSessionScore,
  clearHistory
} = musicNotesSlice.actions;
export default musicNotesSlice.reducer;
