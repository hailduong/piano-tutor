import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface IMusicNotesState {
  score: number;  // Total accumulated score
  lastSessionScore: number; // Score from the most recent session
  selectedLevel: number; // The most recently selected level
}

const initialState: IMusicNotesState = {
  score: 0,
  lastSessionScore: 0,
  selectedLevel: 1 // Default to level 1
}

const musicNotesSlice = createSlice({
  name: 'musicNotes',
  initialState,
  reducers: {
    incrementScore: (state) => {
      state.score += 1
    },
    resetScore: (state) => {
      state.score = 0
    },
    setLastSessionScore: (state, action: PayloadAction<number>) => {
      state.lastSessionScore = action.payload
    },
    setSelectedLevel: (state, action: PayloadAction<number>) => {
      state.selectedLevel = action.payload
    }
  }
})

export const {
  incrementScore,
  resetScore,
  setLastSessionScore,
  setSelectedLevel
} = musicNotesSlice.actions
export default musicNotesSlice.reducer
