export const enum EMusicTheoryConceptLevel {
  Beginner = 'beginner',
  Elementary = 'elementary',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  Professional = 'professional'
}

export interface IMusicTheoryConcept {
  id: string;
  titlePrefix: string;
  level: EMusicTheoryConceptLevel | string;
  title: string;
  description: string;
  image?: string;
  completed: boolean;
}

export const conceptList: IMusicTheoryConcept[] = [
  // Beginner Level
  { id: 'beginner-1', level: 'beginner', title: 'Basic Music Notation', description: 'Learn about the staff, clefs, and note values.', image: '/images/basic-notation.jpg', completed: false },
  { id: 'beginner-2', level: 'beginner', title: 'Rhythm Basics', description: 'Understand note durations, time signatures, and counting rhythms.', image: '/images/rhythm-basics.png', completed: false },
  { id: 'beginner-3', level: 'beginner', title: 'Introduction to Scales and Keys', description: 'Learn major scales and their patterns.', image: '/images/scales-keys.png', completed: false },
  { id: 'beginner-4', level: 'beginner', title: 'Basic Intervals', description: 'Understand the distances between notes and their harmonic roles.', image: '/images/intervals.png', completed: false },
  { id: 'beginner-5', level: 'beginner', title: 'Basic Chords and Arpeggios', description: 'Learn major and minor triads and arpeggios.', image: '/images/chords.png', completed: false },
  { id: 'beginner-6', level: 'beginner', title: 'Simple Songs', description: 'Play easy songs with hands separately and together.', image: '/images/simple-songs.png', completed: false },

  // Elementary Level
  { id: 'elementary-1', level: 'elementary', title: 'Advanced Rhythm and Time Signatures', description: 'Explore dotted notes, triplets, and compound time signatures.', image: '/images/rhythm-advanced.png', completed: false },
  { id: 'elementary-2', level: 'elementary', title: 'Intermediate Scales and Arpeggios', description: 'Learn 5-finger positions, major and minor scales with key signatures.', image: '/images/scales-intermediate.png', completed: false },
  { id: 'elementary-3', level: 'elementary', title: 'Hand Independence', description: 'Focus on exercises to develop left-hand and right-hand coordination.', image: '/images/hand-independence.png', completed: false },
  { id: 'elementary-4', level: 'elementary', title: 'Chord Progressions and Harmony', description: 'Learn primary and secondary chords in major/minor keys.', image: '/images/chord-progressions.png', completed: false },
  { id: 'elementary-5', level: 'elementary', title: 'Dynamics and Articulation', description: 'Explore the use of dynamics (piano, forte) and articulation (staccato, legato).', image: '/images/dynamics-articulation.png', completed: false },
  { id: 'elementary-6', level: 'elementary', title: 'Basic Sight-Reading', description: 'Develop the skill of reading simple pieces at first sight.', image: '/images/sight-reading.png', completed: false },
  { id: 'elementary-7', level: 'elementary', title: 'Classical Repertoire', description: 'Start with easy classical pieces like Bach\'s Minuets and Beethoven’s Sonatinas.', image: '/images/classical-repertoire.png', completed: false },

  // Intermediate Level
  { id: 'intermediate-1', level: 'intermediate', title: 'Advanced Scales and Modes', description: 'Learn pentatonic, blues, and chromatic scales.', image: '/images/scales-advanced.png', completed: false },
  { id: 'intermediate-2', level: 'intermediate', title: 'Complex Chords and Inversions', description: 'Study 7th chords, diminished, and augmented chords.', image: '/images/chords-complex.png', completed: false },
  { id: 'intermediate-3', level: 'intermediate', title: 'Ear Training and Solfeggio', description: 'Develop an ear for intervals, chords, and melodic dictation.', image: '/images/ear-training.png', completed: false },
  { id: 'intermediate-4', level: 'intermediate', title: 'Advanced Sight-Reading', description: 'Read more difficult pieces and recognize patterns in music.', image: '/images/sight-reading-advanced.png', completed: false },
  { id: 'intermediate-5', level: 'intermediate', title: 'Classical Repertoire – Intermediate', description: 'Pieces like Bach’s Inventions, Beethoven’s Sonatas.', image: '/images/classical-intermediate.png', completed: false },
  { id: 'intermediate-6', level: 'intermediate', title: 'Playing with Expression and Phrasing', description: 'Focus on emotional interpretation of the music.', image: '/images/expression-phrasing.png', completed: false },
  { id: 'intermediate-7', level: 'intermediate', title: 'Introduction to Music Theory', description: 'Harmonic analysis, basic counterpoint, and modulation.', image: '/images/music-theory-intro.png', completed: false },

  // Advanced Level
  { id: 'advanced-1', level: 'advanced', title: 'Mastering Technical Studies', description: 'Work on advanced exercises (Czerny, Hanon, Liszt).', image: '/images/technical-studies.png', completed: false },
  { id: 'advanced-2', level: 'advanced', title: 'Advanced Rhythms and Polyrhythms', description: 'Study complex time signatures and syncopation.', image: '/images/polyrhythms.png', completed: false },
  { id: 'advanced-3', level: 'advanced', title: 'Memorization Techniques', description: 'Strategies for memorizing difficult pieces.', image: '/images/memorization.png', completed: false },
  { id: 'advanced-4', level: 'advanced', title: 'Advanced Chord Progressions', description: 'Explore diminished and altered chords.', image: '/images/advanced-chords.png', completed: false },
  { id: 'advanced-5', level: 'advanced', title: 'Advanced Sight-Reading and Ear Training', description: 'Sight-read more complex pieces.', image: '/images/sight-reading-advanced.png', completed: false },
  { id: 'advanced-6', level: 'advanced', title: 'Classical Repertoire – Advanced', description: 'Pieces like Chopin Preludes, Rachmaninoff Preludes, and Liszt Etudes.', image: '/images/classical-advanced.png', completed: false },
  { id: 'advanced-7', level: 'advanced', title: 'Jazz Improvisation and Composition', description: 'Introduction to jazz chords, scales, and improvisation techniques.', image: '/images/jazz-improvisation.png', completed: false },

  // Professional Level
  { id: 'professional-1', level: 'professional', title: 'Performance Preparation', description: 'Preparing for recitals and competitions, handling nerves.', image: '/images/performance-prep.png', completed: false },
  { id: 'professional-2', level: 'professional', title: 'Advanced Music Theory and Composition', description: 'Dive deeper into harmonic analysis, counterpoint, and musical form.', image: '/images/music-theory-advanced.png', completed: false },
  { id: 'professional-3', level: 'professional', title: 'Masterclass Interpretation', description: 'Develop personal interpretations of advanced pieces.', image: '/images/masterclass.png', completed: false },
  { id: 'professional-4', level: 'professional', title: 'Advanced Repertoire – Professional Level', description: 'Perform advanced concertos, symphonic pieces, and virtuosic solos.', image: '/images/classical-professional.png', completed: false },
  { id: 'professional-5', level: 'professional', title: 'Chamber Music and Collaboration', description: 'Learn to collaborate with other musicians, playing duets and ensembles.', image: '/images/chamber-music.png', completed: false },
  { id: 'professional-6', level: 'professional', title: 'Preparing for Conservatory Auditions', description: 'Prepare audition pieces and discuss expectations for conservatory-level performance.', image: '/images/conservatory-audition.png', completed: false },
  { id: 'professional-7', level: 'professional', title: 'Final Recital Preparation', description: 'Develop a recital program, performance techniques, and polish repertoire.', image: '/images/final-recital.png', completed: false }
].map((lesson, index, arr) => {
  const levelLessons = arr.filter(l => l.level === lesson.level);
  return { ...lesson, titlePrefix: `Lesson ${levelLessons.indexOf(lesson) + 1}` };
});
