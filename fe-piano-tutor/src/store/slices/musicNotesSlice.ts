import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface INote {
  note: string;      // e.g., "C", "C#", etc.
  length: string;    // Default: "q" (quarter note)
  timestamp: number; // When the note was played
  octave: number;    // The octave of the note (e.g., 4 for A4)
}

export interface IMusicNotesState {
  currentNote: INote | null;
  suggestedNote: INote | null; // The note that should be played (suggested by the system)
  history: INote[];
  score: number;  // Total accumulated score
  lastSessionScore: number; // Score from the most recent session
  selectedLevel: number; // The most recently selected level
}

const initialState: IMusicNotesState = {
  currentNote: null,
  history: [],
  suggestedNote: null,
  score: 0,
  lastSessionScore: 0,
  selectedLevel: 1 // Default to level 1
}

const musicNotesSlice = createSlice({
  name: 'musicNotes',
  initialState,
  reducers: {
    setCurrentNote: (state, action: PayloadAction<INote | null>) => {
      state.currentNote = action.payload
      if (action.payload) {
        state.history.push(action.payload)
      }
    },
    setSuggestedNote: (state, action: PayloadAction<INote | null>) => {
      state.suggestedNote = action.payload
    },
    incrementScore: (state) => {
      state.score += 1
    },
    resetScore: (state) => {
      state.score = 0
    },
    setLastSessionScore: (state, action: PayloadAction<number>) => {
      state.lastSessionScore = action.payload
    },
    clearHistory: (state) => {
      state.history = []
    },
    setSelectedLevel: (state, action: PayloadAction<number>) => {
      state.selectedLevel = action.payload
    }
  }
})

export const {
  setCurrentNote,
  setSuggestedNote,
  incrementScore,
  resetScore,
  setLastSessionScore,
  clearHistory,
  setSelectedLevel
} = musicNotesSlice.actions
export default musicNotesSlice.reducer
