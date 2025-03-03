export interface MusicTheoryConcept {
  id: string;
  title: string;
  description: string;
  image?: string;
  completed: boolean;
}

export const concepts: MusicTheoryConcept[] = [
  {
    id: 'basic-notation',
    title: 'Basic Music Notation',
    description: 'Learn about the staff, clefs, and basic note values in music notation.',
    image: '/images/basic-notation.jpg',
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
]
