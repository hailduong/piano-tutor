import {configureStore} from '@reduxjs/toolkit'
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage
import {PersistPartial} from 'redux-persist/es/persistReducer'

import musicNotesReducer, {IMusicNotesState} from 'store/slices/musicNotesSlice'
import performanceReducer, {IPerformanceState} from 'store/slices/performanceSlice'
import musicTheoryReducer, {IMusicTheoryState} from 'store/slices/musicTheorySlice'
import songLibraryReducer, {ISongLibraryState} from 'store/slices/songLibrarySlice'
import learnSongReducer from 'store/slices/learnSongSlice'
import virtualPianoReducer, {IVirtualPianoState} from 'store/slices/virtualPianoSlice'
import settingsReducer, {ISettingsState} from 'store/slices/settingsSlice'
import {TypedUseSelectorHook, useSelector, useDispatch} from 'react-redux'
import {ILearnSongState} from 'models/LearnSong' // Import the new settings slice

// Persist configuration
const persistConfig = {
  key: 'root',
  storage
}

// Persist each reducer separately to have more control
const createPersistedReducer = (key: string, reducer: any) =>
  persistReducer({...persistConfig, key}, reducer)

const persistedMusicNotesReducer = createPersistedReducer('musicNotes', musicNotesReducer)
const persistedPerformanceReducer = createPersistedReducer('performance', performanceReducer)
const persistedMusicTheoryReducer = createPersistedReducer('musicTheory', musicTheoryReducer)
const persistedSongLibraryReducer = createPersistedReducer('songLibrary', songLibraryReducer)
const persistedLearnSongReducer = createPersistedReducer('learnSong', learnSongReducer)
const persistedSettingsReducer = createPersistedReducer('settings', settingsReducer)
const persistedVirtualPianoReducer = createPersistedReducer('virtualPiano', virtualPianoReducer)

export const store = configureStore({
  reducer: {
    musicNotes: persistedMusicNotesReducer,
    musicTheory: persistedMusicTheoryReducer,
    performance: persistedPerformanceReducer,
    songLibrary: persistedSongLibraryReducer,
    learnSong: persistedLearnSongReducer,
    settings: persistedSettingsReducer,
    virtualPiano: persistedVirtualPianoReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)

export type RootState = {
  learnSong: ILearnSongState & PersistPartial;
  musicNotes: IMusicNotesState & PersistPartial;
  musicTheory: IMusicTheoryState & PersistPartial;
  performance: IPerformanceState & PersistPartial;
  settings: ISettingsState & PersistPartial;
  songLibrary: ISongLibraryState & PersistPartial;
  virtualPiano: IVirtualPianoState & PersistPartial;
};

export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
