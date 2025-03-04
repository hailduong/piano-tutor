// fe-piano-tutor/src/store/slices/settingsSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {USER_CONFIG} from 'config'

interface SettingsState {
  learnMusicNotes: typeof USER_CONFIG;
  // Add other pages' settings here if needed
}

const initialState: SettingsState = {
  learnMusicNotes: USER_CONFIG
  // Initialize other pages' settings here if needed
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateLearnMusicNotesSettings(state, action: PayloadAction<Partial<typeof USER_CONFIG>>) {
      state.learnMusicNotes = {...state.learnMusicNotes, ...action.payload}
    }
    // Add other pages' settings reducers here if needed
  }
})

export const {updateLearnMusicNotesSettings} = settingsSlice.actions
export default settingsSlice.reducer
