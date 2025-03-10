import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit'
import {ILearnSongState, INoteTiming, ISessionProgress, ILearnSongSettings} from 'pages/LearnSong/types/LearnSong'
import {RootState} from 'store/index'


// Initial state for the learn song feature
const initialState: ILearnSongState = {
  songId: null,
  isPlaying: false,
  isPaused: false,
  tempo: 100,
  currentNote: null,
  nextNote: null,
  noteTimings: [],
  sessionProgress: {
    totalNotes: 0,
    notesPlayed: 0,
    correctNotes: 0,
    incorrectNotes: 0,
    accuracy: 0,
    currentPosition: 0
  },
  startTime: null,
  elapsedTime: 0,
  metronomeEnabled: true,
  isPracticing: false,
  sheetMusic: null
}

// Async thunk to load sheet music data
export const loadSheetMusicThunk = createAsyncThunk(
  'learnSong/loadSheetMusic',
  async (songId: string) => {
    const response = await fetch(`${process.env.PUBLIC_URL}/songs/${songId}.musicxml`)
    const text = await response.text()
    return {songId, sheetMusic: text}
  }
)

// Create the learn song slice
const learnSongSlice = createSlice({
  name: 'learnSong',
  initialState,
  reducers: {
    // Initialize a new learning session
    initializeSession: (state, action: PayloadAction<{ songId: string }>) => {
      state.songId = action.payload.songId
      state.isPlaying = false
      state.isPaused = false
      state.noteTimings = []
      state.sessionProgress = {
        totalNotes: 0,
        notesPlayed: 0,
        correctNotes: 0,
        incorrectNotes: 0,
        accuracy: 0,
        currentPosition: 0
      }
      state.startTime = null
      state.elapsedTime = 0
    },

    // Start playing the song
    startPlaying: (state) => {
      state.isPlaying = true
      state.isPaused = false
      state.startTime = Date.now()
    },

    // Pause the current session
    pauseSession: (state) => {
      state.isPlaying = false
      state.isPaused = true
      state.elapsedTime += Date.now() - (state.startTime || Date.now())
      state.startTime = null
    },

    // Resume the current session
    resumeSession: (state) => {
      state.isPlaying = true
      state.isPaused = false
      state.startTime = Date.now()
    },

    // End the current session
    endSession: (state) => {
      state.isPlaying = false
      state.isPaused = false
      state.elapsedTime = 0
      state.startTime = null
    },

    // Toggle Playing state
    togglePlaying: (state, action: PayloadAction<boolean | undefined>) => {
      // If a specific value is provided, use it, otherwise toggle the current value
      state.isPlaying = action.payload !== undefined ? action.payload : !state.isPlaying
    },

    // Toggle practicing state
    togglePracticing: (state, action: PayloadAction<boolean | undefined>) => {
      // If a specific value is provided, use it, otherwise toggle the current value
      state.isPracticing = action.payload !== undefined ? action.payload : !state.isPracticing
    },

    // Update current note being played
    setCurrentNote: (state, action: PayloadAction<string>) => {
      state.currentNote = action.payload
    },

    // Set the next note to be played
    setNextNote: (state, action: PayloadAction<string>) => {
      state.nextNote = action.payload
    },

    // TODO: Record a played note's timing information
    recordNoteTiming: (state, action: PayloadAction<INoteTiming>) => {
      state.noteTimings.push(action.payload)
      state.sessionProgress.notesPlayed += 1

      if (action.payload.isCorrect) {
        state.sessionProgress.correctNotes += 1
      } else {
        state.sessionProgress.incorrectNotes += 1
      }

      // Update accuracy
      state.sessionProgress.accuracy =
        state.sessionProgress.correctNotes / state.sessionProgress.notesPlayed
    },

    // Update session progress
    updateProgress: (state, action: PayloadAction<Partial<ISessionProgress>>) => {
      const {correctNotes, incorrectNotes} = action.payload
      debugger
      if (correctNotes !== undefined) {
        state.sessionProgress.notesPlayed += correctNotes
        state.sessionProgress.correctNotes += correctNotes
        state.sessionProgress.currentPosition += correctNotes
      }

      if (incorrectNotes !== undefined) {
        state.sessionProgress.notesPlayed += incorrectNotes
        state.sessionProgress.incorrectNotes += incorrectNotes
      }

      // Recalculate accuracy
      state.sessionProgress.accuracy = state.sessionProgress.correctNotes / state.sessionProgress.notesPlayed
    },

    // Update learning settings
    updateSettings: (state, action: PayloadAction<Partial<ILearnSongSettings>>) => {
      return {
        ...state,
        ...action.payload
      }
    },

    // Set the total number of notes in the song
    setTotalNotes: (state, action: PayloadAction<number>) => {
      state.sessionProgress.totalNotes = action.payload
    },

    // Move to a specific position in the song
    seekToPosition: (state, action: PayloadAction<number>) => {
      state.sessionProgress.currentPosition = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSheetMusicThunk.pending, (state) => {
        // Handle loading state if needed
      })
      .addCase(loadSheetMusicThunk.fulfilled, (state, action) => {
        state.songId = action.payload.songId
        state.sheetMusic = action.payload.sheetMusic
      })
      .addCase(loadSheetMusicThunk.rejected, (state, action) => {
        // Handle error state if needed
      })
  }
})

// Export actions
export const {
  initializeSession,
  startPlaying,
  pauseSession,
  resumeSession,
  endSession,
  togglePlaying,
  togglePracticing,
  setCurrentNote,
  setNextNote,
  recordNoteTiming,
  updateProgress,
  updateSettings,
  setTotalNotes,
  seekToPosition
} = learnSongSlice.actions

// Export selectors
export const selectLearnSongState = (state: RootState) => state.learnSong
export const selectIsPlaying = (state: RootState) => state.learnSong.isPlaying
export const selectCurrentNote = (state: RootState) => state.learnSong.currentNote
export const selectNextNote = (state: RootState) => state.learnSong.nextNote
export const selectSessionProgress = (state: RootState) => state.learnSong.sessionProgress
export const selectCurrentSongId = (state: RootState) => state.learnSong.songId
export const selectSheetMusic = (state: RootState) => state.learnSong.sheetMusic
export const selectIsPracticing = (state: RootState) => state.learnSong.isPracticing

// Export reducer
const learnSongReducer = learnSongSlice.reducer
export default learnSongReducer
