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
  answered: number;
  total: number;
  selectedAnswers: Record<string, string>; // key: questionId, value: selected answer
}

export interface IMusicTheoryPerformance {
  conceptsCompleted: number;
  totalConcepts: number;
  quizzes: Record<string, IMusicTheoryQuizStats>; // key: concept id
}

export interface ISongPracticeStats {
  songId: string;
  playedNotes: number;
  correctNotes: number;
  incorrectNotes: number;
  noteAccuracy: number; // Calculated as a percentage (0 to 100)
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
  musicTheory: IMusicTheoryPerformance;
  songPractice: ISongPracticeStats[]; // New state field for Song Practice stats
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
    lastSessionScore: 0,
    totalNotes: 0
  },
  musicTheory: {
    conceptsCompleted: 0,
    totalConcepts: 0,
    quizzes: {}
  },
  songPractice: [] // Initialize as empty array
}

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
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
      action: PayloadAction<{
        conceptId: string;
        answered: number;
        total: number;
        selectedAnswers: Record<string, string>
      }>
    ) => {
      const {conceptId, answered, total, selectedAnswers} = action.payload

      // If the quiz already exists, preserve any existing data not provided
      if (state.musicTheory.quizzes[conceptId]) {
        state.musicTheory.quizzes[conceptId] = {
          ...state.musicTheory.quizzes[conceptId],
          answered,
          total,
          selectedAnswers
        }
      } else {
        state.musicTheory.quizzes[conceptId] = {
          answered,
          total,
          selectedAnswers
        }
      }
    },
    // New reducer to update selected answer for a specific question
    updateQuizAnswer: (
      state,
      action: PayloadAction<{
        conceptId: string;
        questionId: string;
        answer: string
      }>
    ) => {
      const {conceptId, questionId, answer} = action.payload

      // Initialize the quiz entry if it doesn't exist
      if (!state.musicTheory.quizzes[conceptId]) {
        state.musicTheory.quizzes[conceptId] = {
          answered: 0,
          total: 0,
          selectedAnswers: {}
        }
      }

      // Initialize selectedAnswers if it doesn't exist
      if (!state.musicTheory.quizzes[conceptId].selectedAnswers) {
        state.musicTheory.quizzes[conceptId].selectedAnswers = {}
      }

      // Update the selected answer
      state.musicTheory.quizzes[conceptId].selectedAnswers[questionId] = answer
    },
    // New reducer to update song practice stats
    updateSongPracticeStats: (state, action: PayloadAction<ISongPracticeStats>) => {
      const index = state.songPractice.findIndex(
        (stat) => stat.songId === action.payload.songId
      )
      if (index >= 0) {
        state.songPractice[index] = action.payload
      } else {
        state.songPractice.push(action.payload)
      }
    }
  }
})

export const {
  startSession,
  endSession,
  clearPerformanceData,
  incrementScore,
  resetScore,
  increaseMusicNotesTotal,
  setLastSessionScore,
  setTotalConcepts,
  markConceptCompleted,
  updateQuizForConcept,
  updateQuizAnswer,
  updateSongPracticeStats
} = performanceSlice.actions

export default performanceSlice.reducer
