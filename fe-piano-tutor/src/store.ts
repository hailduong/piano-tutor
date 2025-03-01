import { configureStore } from '@reduxjs/toolkit';
import musicNotesReducer from 'slices/musicNotesSlice';
import performanceReducer from 'slices/performanceSlice';

export const store = configureStore({
  reducer: {
    musicNotes: musicNotesReducer,
    performance: performanceReducer,
    // other reducers...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
