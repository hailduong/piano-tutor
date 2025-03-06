export interface IMusicTheoryConcept {
  id: string;
  titlePrefix: string;
  title: string;
  description: string;
  image?: string;
  completed: boolean;
}

export const conceptList: IMusicTheoryConcept[] = [
  {
    id: 'basic-notation',
    titlePrefix: 'Lesson 1',
    title: 'Basic Music Notation',
    description: 'Learn about the staff, clefs, and basic note values in music notation.',
    image: '/images/basic-notation.jpg',
    completed: false
  },
  {
    id: 'rhythm-basics',
    titlePrefix: 'Lesson 2',
    title: 'Rhythm Basics',
    description: 'Understand note durations, time signatures, and counting rhythms.',
    image: '/images/rhythm-basics.png',
    completed: false
  },
  {
    id: 'scales-keys',
    titlePrefix: 'Lesson 3',
    title: 'Scales and Keys',
    description: 'Learn about major and minor scales, key signatures, and related conceptList.',
    image: '/images/scales-keys.png',
    completed: false
  },
  {
    id: 'intervals',
    titlePrefix: 'Lesson 4',
    title: 'Intervals',
    description: 'Understand the distances between notes and how they form the foundation of harmony.',
    image: '/images/intervals.png',
    completed: false
  },
  {
    id: 'chords',
    titlePrefix: 'Lesson 5',
    title: 'Chords',
    description: 'Learn about triads, seventh chords, and chord progressions.',
    image: '/images/chords.png',
    completed: false
  }
]
