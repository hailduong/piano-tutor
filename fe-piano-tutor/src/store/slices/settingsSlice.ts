// fe-piano-tutor/src/store/slices/settingsSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {LEARN_MUSIC_NOTE_SETTINGS} from 'store/defaultConfigs'

export interface ISettingsState {
  learnMusicNotes: typeof LEARN_MUSIC_NOTE_SETTINGS;
  // Add other pages' settings here if needed
}

const initialState: ISettingsState = {
  learnMusicNotes: LEARN_MUSIC_NOTE_SETTINGS
  // Initialize other pages' settings here if needed
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateLearnMusicNotesSettings(state, action: PayloadAction<Partial<typeof LEARN_MUSIC_NOTE_SETTINGS>>) {
      state.learnMusicNotes = {...state.learnMusicNotes, ...action.payload}
    }
    // Add other pages' settings reducers here if needed
  }
})

export const {updateLearnMusicNotesSettings} = settingsSlice.actions
export default settingsSlice.reducer
