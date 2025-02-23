import { configureStore } from '@reduxjs/toolkit';
import musicNotesReducer from './slices/musicNotesSlice';

const store = configureStore({
  reducer: {
    musicNotes: musicNotesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
