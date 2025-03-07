// src/slices/performanceSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface INotePerformance {
  noteAttempted: string;  // The note that was played (e.g., "C4")
  noteExpected: string;   // The note that should have been played
  isCorrect: boolean;     // Whether the correct note was played
  timingDeviation: number; // Millisecond ds deviation from expected timing
  difficultyLevel: number; // Current difficulty level
  timestamp: number;      // When the note was attempted
}

export interface IMusicTheoryQuizStats {
  answered: number
  total: number
}

export interface IMusicTheoryPerformance {
  conceptsCompleted: number
  totalConcepts: number
  quizzes: Record<string, IMusicTheoryQuizStats> // key: concept id
}


export interface IPerformanceState {
  currentSessionPerformance: INotePerformance[];  // Current practice session data
  accuracyRate: number;    // Percentage of correct notes in session
  averageTiming: number;   // Average timing deviation in ms
  totalNotesPlayed: number; // Total number of notes attempted in session
  sessionStart: number | null; // Timestamp when session started
  sessionEnd: number | null;   // Timestamp when session ended
  musicNotes: {
    totalScore: number,
    lastSessionScore: number; // Added field for session totalScore
    totalNotes: number; // Total notes played
  }
  musicTheory: IMusicTheoryPerformance
}

const initialState: IPerformanceState = {
  currentSessionPerformance: [],
  accuracyRate: 0,
  averageTiming: 0,
  totalNotesPlayed: 0,
  sessionStart: null,
  sessionEnd: null,
  musicNotes: {
    totalScore: 0,
    lastSessionScore: 0, // Initialize with default value
    totalNotes: 0
  },
  musicTheory: {
    conceptsCompleted: 0,
    totalConcepts: 0, // to be set from your concepts data
    quizzes: {}
  }
}

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    recordNotePerformance: (state, action: PayloadAction<INotePerformance>) => {
      state.currentSessionPerformance.push(action.payload)
      state.totalNotesPlayed++

      // Update accuracy rate
      const correctNotes = state.currentSessionPerformance.filter(note => note.isCorrect).length
      state.accuracyRate = correctNotes / state.totalNotesPlayed * 100

      // Update average timing
      const totalDeviation = state.currentSessionPerformance.reduce(
        (sum, note) => sum + Math.abs(note.timingDeviation), 0
      )
      state.averageTiming = totalDeviation / state.totalNotesPlayed
    },
    startSession: (state) => {
      state.sessionStart = Date.now()
      state.sessionEnd = null
      state.currentSessionPerformance = []
      state.accuracyRate = 0
      state.averageTiming = 0
      state.totalNotesPlayed = 0
    },
    endSession: (state) => {
      state.sessionEnd = Date.now()
    },
    clearPerformanceData: (state) => {
      return initialState
    },
    /* Music Notes */
    incrementScore: (state) => {
      state.musicNotes.totalScore += 1
    },
    resetScore: (state) => {
      state.musicNotes.totalScore = 0
    },
    setLastSessionScore: (state, action: PayloadAction<number>) => {
      state.musicNotes.lastSessionScore = action.payload
    },
    increaseMusicNotesTotal: (state) => {
      state.musicNotes.totalNotes++
    },
    /* Music Theory */
    setTotalConcepts: (state, action: PayloadAction<number>) => {
      state.musicTheory.totalConcepts = action.payload
    },
    markConceptCompleted: (state, action: PayloadAction<string>) => {
      // Increment concepts completed count.
      // The action payload could be the concept id for further validation if needed.
      state.musicTheory.conceptsCompleted++
    },
    updateQuizForConcept: (
      state,
      action: PayloadAction<{ conceptId: string; answered: number; total: number }>
    ) => {
      const {conceptId, answered, total} = action.payload
      state.musicTheory.quizzes[conceptId] = {answered, total}
    }
  }
})

export const {
  recordNotePerformance,
  startSession,
  endSession,
  clearPerformanceData,
  incrementScore,
  resetScore,
  increaseMusicNotesTotal,
  setLastSessionScore, // Export the new action
  setTotalConcepts,
  markConceptCompleted,
  updateQuizForConcept
} = performanceSlice.actions

export default performanceSlice.reducer
