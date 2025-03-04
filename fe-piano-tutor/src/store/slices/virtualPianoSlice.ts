// src/store/slices/virtualPianoSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from 'store'

export interface IPianoNote {
  note: string;     // e.g., "C", "C#"
  octave: number;   // e.g., 4 for middle C
  length?: string;   // e.g., "q" for quarter note
  timestamp: number; // When the note was played
}

export interface IVirtualPianoState {
  currentNote: IPianoNote | null;    // Last played note
  suggestedNote: IPianoNote | null;  // Note to highlight/suggest
  isVisible: boolean;                // Piano visibility
  history: IPianoNote[];             // History of played notes
}

const initialState: IVirtualPianoState = {
  currentNote: null,
  suggestedNote: null,
  isVisible: true,
  history: []
}

const virtualPianoSlice = createSlice({
  name: 'virtualPiano',
  initialState,
  reducers: {
    setCurrentNote: (state, action: PayloadAction<IPianoNote | null>) => {
      state.currentNote = action.payload
      // Add to history if it's a valid note
      if (action.payload) {
        state.history.push(action.payload)
      }
    },
    setSuggestedNote: (state, action: PayloadAction<IPianoNote | null>) => {
      state.suggestedNote = action.payload
    },
    setPianoVisibility: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload
    },
    togglePianoVisibility: (state) => {
      state.isVisible = !state.isVisible
    },
    clearHistory: (state) => {
      state.history = []
    },
    // Limit history size to prevent memory issues
    limitHistorySize: (state, action: PayloadAction<number>) => {
      if (state.history.length > action.payload) {
        state.history = state.history.slice(state.history.length - action.payload)
      }
    }
  }
})

// Export actions
export const {
  setCurrentNote,
  setSuggestedNote,
  setPianoVisibility,
  togglePianoVisibility,
  clearHistory,
  limitHistorySize
} = virtualPianoSlice.actions

// Export selectors
export const selectCurrentNote = (state: RootState) => state.virtualPiano.currentNote
export const selectSuggestedNote = (state: RootState) => state.virtualPiano.suggestedNote
export const selectPianoVisibility = (state: RootState) => state.virtualPiano.isVisible
export const selectNoteHistory = (state: RootState) => state.virtualPiano.history

export default virtualPianoSlice.reducer
