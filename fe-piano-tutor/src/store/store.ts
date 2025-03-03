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

// Persist configuration
const persistConfig = {
  key: 'root',
  storage
};

// Persist each reducer separately to have more control
const persistedMusicNotesReducer = persistReducer(
  { ...persistConfig, key: 'musicNotes' },
  musicNotesReducer
);

const persistedPerformanceReducer = persistReducer(
  { ...persistConfig, key: 'performance' },
  performanceReducer
);

const persistedMusicTheoryReducer = persistReducer(
  { ...persistConfig, key: 'musicTheory' },
  musicTheoryReducer
);

const persistedSongLibraryReducer = persistReducer(
  { ...persistConfig, key: 'songLibrary' },
  songLibraryReducer
);

const persistedLearnSongReducer = persistReducer(
  { ...persistConfig, key: 'learnSong' },
  learnSongReducer
);

export const store = configureStore({
  reducer: {
    musicNotes: persistedMusicNotesReducer,
    performance: persistedPerformanceReducer,
    musicTheory: persistedMusicTheoryReducer,
    songLibrary: persistedSongLibraryReducer,
    learnSong: persistedLearnSongReducer
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

export default store;
