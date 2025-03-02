import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for music theory concepts
export interface MusicTheoryConcept {
  id: string;
  title: string;
  description: string;
  image?: string;
  completed: boolean;
}

// Define types for quiz questions
export interface QuizQuestion {
  id: string;
  conceptId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
}

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
  concepts: [
    {
      id: 'basic-notation',
      title: 'Basic Music Notation',
      description: 'Learn about the staff, clefs, and basic note values in music notation.',
      image: '/images/basic-notation.png',
      completed: false,
    },
    {
      id: 'rhythm-basics',
      title: 'Rhythm Basics',
      description: 'Understand note durations, time signatures, and counting rhythms.',
      image: '/images/rhythm-basics.png',
      completed: false,
    },
    {
      id: 'scales-keys',
      title: 'Scales and Keys',
      description: 'Learn about major and minor scales, key signatures, and related concepts.',
      image: '/images/scales-keys.png',
      completed: false,
    },
    {
      id: 'intervals',
      title: 'Intervals',
      description: 'Understand the distances between notes and how they form the foundation of harmony.',
      image: '/images/intervals.png',
      completed: false,
    },
    {
      id: 'chords',
      title: 'Chords',
      description: 'Learn about triads, seventh chords, and chord progressions.',
      image: '/images/chords.png',
      completed: false,
    },
  ],
  quizzes: {
    'basic-notation': [
      {
        id: 'bn-q1',
        conceptId: 'basic-notation',
        question: 'What is the name of the symbol at the beginning of a staff that indicates the pitch of the notes?',
        options: ['Time signature', 'Clef', 'Key signature', 'Tempo marking'],
        correctAnswer: 'Clef',
      },
      {
        id: 'bn-q2',
        conceptId: 'basic-notation',
        question: 'Which clef is commonly used for higher-pitched instruments?',
        options: ['Bass clef', 'Treble clef', 'Alto clef', 'Tenor clef'],
        correctAnswer: 'Treble clef',
      },
      {
        id: 'bn-q3',
        conceptId: 'basic-notation',
        question: 'How many lines does a standard musical staff have?',
        options: ['4', '5', '6', '7'],
        correctAnswer: '5',
      }
    ],
    'rhythm-basics': [
      {
        id: 'rb-q1',
        conceptId: 'rhythm-basics',
        question: 'Which note value gets one beat in 4/4 time?',
        options: ['Whole note', 'Half note', 'Quarter note', 'Eighth note'],
        correctAnswer: 'Quarter note',
      },
      {
        id: 'rb-q2',
        conceptId: 'rhythm-basics',
        question: 'What does the top number in a time signature represent?',
        options: ['Number of beats per measure', 'Note value that gets one beat', 'Tempo', 'Key signature'],
        correctAnswer: 'Number of beats per measure',
      },
      {
        id: 'rb-q3',
        conceptId: 'rhythm-basics',
        question: 'How many quarter notes equal one whole note?',
        options: ['2', '3', '4', '8'],
        correctAnswer: '4',
      }
    ],
    'scales-keys': [],
    'intervals': [],
    'chords': []
  },
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
