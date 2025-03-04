import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

import musicNotesReducer from 'store/slices/musicNotesSlice';
import performanceReducer from 'store/slices/performanceSlice';
import musicTheoryReducer from 'store/slices/musicTheorySlice';
import songLibraryReducer from 'store/slices/songLibrarySlice';
import learnSongReducer from 'store/slices/learnSongSlice'
import settingsReducer from 'store/slices/settingsSlice';
import {TypedUseSelectorHook, useSelector, useDispatch} from 'react-redux' // Import the new settings slice

// Persist configuration
const persistConfig = {
  key: 'root',
  storage
};

// Persist each reducer separately to have more control
const createPersistedReducer = (key: string, reducer: any) =>
  persistReducer({ ...persistConfig, key }, reducer);

const persistedMusicNotesReducer = createPersistedReducer('musicNotes', musicNotesReducer);
const persistedPerformanceReducer = createPersistedReducer('performance', performanceReducer);
const persistedMusicTheoryReducer = createPersistedReducer('musicTheory', musicTheoryReducer);
const persistedSongLibraryReducer = createPersistedReducer('songLibrary', songLibraryReducer);
const persistedLearnSongReducer = createPersistedReducer('learnSong', learnSongReducer);
const persistedSettingsReducer = createPersistedReducer('settings', settingsReducer); // Persist the settings reducer

export const store = configureStore({
  reducer: {
    musicNotes: persistedMusicNotesReducer,
    performance: persistedPerformanceReducer,
    musicTheory: persistedMusicTheoryReducer,
    songLibrary: persistedSongLibraryReducer,
    learnSong: persistedLearnSongReducer,
    settings: persistedSettingsReducer, // Add the settings reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create the persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
