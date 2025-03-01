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

import musicNotesReducer from 'slices/musicNotesSlice';
import performanceReducer from 'slices/performanceSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['musicNotes'], // Only persist musicNotes
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

export const store = configureStore({
  reducer: {
    musicNotes: persistedMusicNotesReducer,
    performance: persistedPerformanceReducer,
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
