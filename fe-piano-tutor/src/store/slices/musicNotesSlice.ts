import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface IMusicNotesState {
  selectedLevel: number; // The most recently selected level
}

const initialState: IMusicNotesState = {
  selectedLevel: 1 // Default to level 1
}

const musicNotesSlice = createSlice({
  name: 'musicNotes',
  initialState,
  reducers: {
    setSelectedLevel: (state, action: PayloadAction<number>) => {
      state.selectedLevel = action.payload
    }
  }
})

export const {
  setSelectedLevel
} = musicNotesSlice.actions
export default musicNotesSlice.reducer
