import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {QuizQuestion, quizzes} from 'pages/MusicTheory/data/musicTheoryQuizzes'
import {MusicTheoryConcept, concepts} from 'pages/MusicTheory/data/musicTheoryConceptDashboard'


// Define the state for the music theory slice
interface MusicTheoryState {
  concepts: MusicTheoryConcept[];
  quizzes: Record<string, QuizQuestion[]>; // conceptId -> questions
  activeConceptId: string | null;
  activeQuizId: string | null;
  completedConcepts: string[];
  conceptProgress: Record<string, number>; // conceptId -> progress percentage
}

// Initial state with sample music theory concepts
const initialState: MusicTheoryState = {
  concepts,
  quizzes,
  activeConceptId: null,
  activeQuizId: null,
  completedConcepts: [],
  conceptProgress: {},
};

const musicTheorySlice = createSlice({
  name: 'musicTheory',
  initialState,
  reducers: {
    setActiveConcept: (state, action: PayloadAction<string>) => {
      state.activeConceptId = action.payload;
    },
    setActiveQuiz: (state, action: PayloadAction<string>) => {
      state.activeQuizId = action.payload;
    },
    markConceptAsCompleted: (state, action: PayloadAction<string>) => {
      const conceptId = action.payload;
      state.completedConcepts.push(conceptId);

      // Update the concept's completed status
      const concept = state.concepts.find(c => c.id === conceptId);
      if (concept) {
        concept.completed = true;
      }

      // Set progress to 100% for this concept
      state.conceptProgress[conceptId] = 100;
    },
    answerQuizQuestion: (state, action: PayloadAction<{conceptId: string, questionId: string, answer: string}>) => {
      const { conceptId, questionId, answer } = action.payload;
      const conceptQuiz = state.quizzes[conceptId];

      if (conceptQuiz) {
        const questionIndex = conceptQuiz.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
          conceptQuiz[questionIndex].userAnswer = answer;
        }
      }

      // Calculate and update progress for this concept
      if (conceptQuiz) {
        const total = conceptQuiz.length;
        const answered = conceptQuiz.filter(q => q.userAnswer !== undefined).length;
        state.conceptProgress[conceptId] = Math.round((answered / total) * 100);
      }
    },
    resetQuiz: (state, action: PayloadAction<string>) => {
      const conceptId = action.payload;
      const conceptQuiz = state.quizzes[conceptId];

      if (conceptQuiz) {
        conceptQuiz.forEach(question => {
          question.userAnswer = undefined;
        });
      }

      // Reset progress for this concept
      state.conceptProgress[conceptId] = 0;
    }
  },
});

export const {
  setActiveConcept,
  setActiveQuiz,
  markConceptAsCompleted,
  answerQuizQuestion,
  resetQuiz
} = musicTheorySlice.actions;

export default musicTheorySlice.reducer;
