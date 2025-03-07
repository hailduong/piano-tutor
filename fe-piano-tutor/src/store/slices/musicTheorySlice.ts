import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {QuizQuestion, quizzes} from 'pages/MusicTheory/data/musicTheoryQuizzes'
import {IMusicTheoryConcept, conceptList} from 'pages/MusicTheory/data/musicTheoryConceptList'

// Define the state for the music theory slice without performance metrics.
export interface IMusicTheoryState {
  conceptList: IMusicTheoryConcept[];
  quizzes: Record<string, QuizQuestion[]>; // conceptId -> questions
  activeConceptId: string | null;
  activeQuizId: string | null;
  showTheoryAnnotations: boolean;
  currentTheoryConcept: string;
}

const initialState: IMusicTheoryState = {
  conceptList,
  quizzes,
  activeConceptId: null,
  activeQuizId: null,
  showTheoryAnnotations: false,
  currentTheoryConcept: ''
}

const musicTheorySlice = createSlice({
  name: 'musicTheory',
  initialState,
  reducers: {
    setActiveConcept: (state, action: PayloadAction<string>) => {
      state.activeConceptId = action.payload
    },
    setActiveQuiz: (state, action: PayloadAction<string>) => {
      state.activeQuizId = action.payload
    },
    // Removed markConceptAsCompleted, answerQuizQuestion, and resetQuiz as performance data is tracked in performanceSlice.
    toggleTheoryAnnotations: (state) => {
      state.showTheoryAnnotations = !state.showTheoryAnnotations
    },
    setCurrentTheoryConcept: (state, action: PayloadAction<string>) => {
      state.currentTheoryConcept = action.payload
    }
  }
})

export const {
  setActiveConcept,
  setActiveQuiz,
  toggleTheoryAnnotations,
  setCurrentTheoryConcept
} = musicTheorySlice.actions

export default musicTheorySlice.reducer
