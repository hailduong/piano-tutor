export interface QuizQuestion {
  id: string;
  conceptId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
}

export const quizzes: Record<string, QuizQuestion[]> = {
  'beginner-1': [
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
  'beginner-2': [
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
}
