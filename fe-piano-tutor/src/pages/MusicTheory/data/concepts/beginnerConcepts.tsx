import React from 'react'
import {Typography} from 'antd'
import {TheoryContent} from 'pages/MusicTheory/data/styles/theoryContent'

const {Title, Paragraph} = Typography

export const beginnerConcepts: Record<string, React.ReactNode> = {
  'beginner-1': (
    <TheoryContent>
      <Title level={3}>Basic Music Notation</Title>
      <Paragraph>
        Music notation is a system of symbols used to represent musical sounds. The most common system uses a five-line
        staff with notes placed on it to indicate pitch.
      </Paragraph>
      <Title level={4}>The Staff</Title>
      <Paragraph>
        The staff consists of five horizontal lines and four spaces. Notes are positioned on these lines and spaces to
        indicate different pitches.
      </Paragraph>
      <Title level={4}>Clefs</Title>
      <Paragraph>
        Clefs determine the pitch range of the notes on the staff:
      </Paragraph>
      <ul>
        <li><strong>Treble Clef (𝄞)</strong>: Used for higher notes, typically played with the right hand on the piano.
        </li>
        <li><strong>Bass Clef (𝄢)</strong>: Used for lower notes, typically played with the left hand on the piano.</li>
      </ul>
      <Title level={4}>Ledger Lines</Title>
      <Paragraph>
        When notes extend beyond the staff, short horizontal lines called ledger lines are used to notate them.
      </Paragraph>
      <Title level={4}>Note Heads, Stems, and Flags</Title>
      <Paragraph>
        Notes consist of different components:
      </Paragraph>
      <ul>
        <li><strong>Note Head</strong>: The circular part of a note that indicates the pitch.</li>
        <li><strong>Stem</strong>: A vertical line attached to the note head, indicating rhythm.</li>
        <li><strong>Flag</strong>: A curved mark attached to stems on eighth notes and smaller values.</li>
      </ul>
    </TheoryContent>
  ),
  'beginner-2':
    (
      <TheoryContent>
        <Title level={3}>Rhythm Basics</Title>
        <Paragraph>
          Rhythm is the pattern of sounds and silences in music, giving it a sense of time and movement.
        </Paragraph>
        <Title level={4}>Time Signatures</Title>
        <Paragraph>
          A time signature is written as two numbers at the beginning of a piece:
        </Paragraph>
        <ul>
          <li><strong>Top Number</strong>: Indicates how many beats are in each measure.</li>
          <li><strong>Bottom Number</strong>: Indicates the note value that receives one beat.</li>
        </ul>
        <Paragraph>
          Common time signatures include:
        </Paragraph>
        <ul>
          <li><strong>4/4</strong>: Four quarter notes per measure. Also known as "common time."</li>
          <li><strong>3/4</strong>: Three quarter notes per measure. Often used in waltzes.</li>
          <li><strong>2/4</strong>: Two quarter notes per measure. Common in marches.</li>
          <li><strong>6/8</strong>: Six eighth notes per measure. Has a compound feel.</li>
        </ul>
        <Title level={4}>Note Durations</Title>
        <Paragraph>
          The length of a note determines how long it is held.
        </Paragraph>
        <ul>
          <li><strong>Whole Note</strong>: Lasts 4 beats.</li>
          <li><strong>Half Note</strong>: Lasts 2 beats.</li>
          <li><strong>Quarter Note</strong>: Lasts 1 beat.</li>
          <li><strong>Eighth Note</strong>: Lasts 1/2 beat.</li>
        </ul>
        <Title level={4}>Rests</Title>
        <Paragraph>
          Rests indicate silence and correspond to note values.
        </Paragraph>
        <ul>
          <li><strong>Whole Rest</strong>: 4 beats of silence.</li>
          <li><strong>Half Rest</strong>: 2 beats of silence.</li>
          <li><strong>Quarter Rest</strong>: 1 beat of silence.</li>
        </ul>
      </TheoryContent>
    ),
  'beginner-3':
    (
      <TheoryContent>
        <Title level={3}>Introduction to Scales and Keys</Title>
        <Paragraph>
          A scale is a sequence of notes arranged in ascending or descending order. Scales serve as the foundation for
          melodies and harmonies.
        </Paragraph>
        <Title level={4}>Major Scales</Title>
        <Paragraph>
          The major scale follows this pattern of whole and half steps: W-W-H-W-W-W-H.
        </Paragraph>
        <Paragraph>
          Example: C Major Scale - C, D, E, F, G, A, B, C.
        </Paragraph>
        <Title level={4}>Minor Scales</Title>
        <Paragraph>
          Minor scales have a different pattern that gives them a darker, more melancholic sound.
        </Paragraph>
        <Paragraph>
          Natural Minor Scale Formula: W-H-W-W-H-W-W.
        </Paragraph>
        <Paragraph>
          Example: A Minor Scale - A, B, C, D, E, F, G, A.
        </Paragraph>
        <Title level={4}>Key Signatures</Title>
        <Paragraph>
          Key signatures appear at the beginning of a piece and indicate which notes should be played as sharps or flats
          throughout the piece.
        </Paragraph>
        <Paragraph>
          Example: G Major has one sharp (F♯), F Major has one flat (B♭).
        </Paragraph>
      </TheoryContent>
    ),
  'beginner-4':
    (
      <TheoryContent>
        <Title level={3}>Basic Intervals</Title>
        <Paragraph>
          An interval is the distance between two pitches. Intervals are crucial in defining melodies and harmonies.
        </Paragraph>
        <Title level={4}>Types of Intervals</Title>
        <Paragraph>
          Intervals can be categorized by their number (distance in scale steps) and quality (major, minor, perfect,
          augmented, diminished).
        </Paragraph>
        <ul>
          <li><strong>Unison</strong>: The same note played twice.</li>
          <li><strong>Major 2nd</strong>: Two half steps (C to D).</li>
          <li><strong>Minor 3rd</strong>: Three half steps (C to E♭).</li>
          <li><strong>Major 3rd</strong>: Four half steps (C to E).</li>
          <li><strong>Perfect 4th</strong>: Five half steps (C to F).</li>
          <li><strong>Perfect 5th</strong>: Seven half steps (C to G).</li>
        </ul>
      </TheoryContent>
    ),
  'beginner-5':
    (
      <TheoryContent>
        <Title level={3}>Basic Chords and Arpeggios</Title>
        <Paragraph>
          Chords are groups of three or more notes played simultaneously, forming the harmonic foundation of music.
        </Paragraph>
        <Title level={4}>Triads</Title>
        <Paragraph>
          A triad consists of a root note, a third, and a fifth. The type of third and fifth determines the chord
          quality.
        </Paragraph>
        <ul>
          <li><strong>Major Triad</strong>: Root, major 3rd, perfect 5th (C-E-G).</li>
          <li><strong>Minor Triad</strong>: Root, minor 3rd, perfect 5th (C-E♭-G).</li>
          <li><strong>Augmented Triad</strong>: Root, major 3rd, augmented 5th (C-E-G#).</li>
          <li><strong>Diminished Triad</strong>: Root, minor 3rd, diminished 5th (C-E♭-G♭).</li>
        </ul>
        <Title level={4}>Arpeggios</Title>
        <Paragraph>
          An arpeggio is a chord played one note at a time rather than simultaneously, creating a flowing sound.
        </Paragraph>
        <ul>
          <li><strong>Ascending Arpeggio</strong>: Playing the chord notes from lowest to highest.</li>
          <li><strong>Descending Arpeggio</strong>: Playing the chord notes from highest to lowest.</li>
        </ul>
      </TheoryContent>
    ),
  'beginner-6': (
    <TheoryContent>
      <Title level={3}>Simple Songs</Title>
      <Paragraph>
        Learning simple songs helps build confidence and reinforces foundational music skills such as note reading and
        rhythm.
      </Paragraph>
      <Title level={4}>Melody and Harmony</Title>
      <Paragraph>
        Simple songs typically have a single melody line, with harmony added as chords.
      </Paragraph>
      <Title level={4}>Example Songs</Title>
      <ul>
        <li><strong>Twinkle Twinkle Little Star</strong>: A simple melody using basic notes.</li>
        <li><strong>Mary Had a Little Lamb</strong>: A stepwise motion-based tune.</li>
        <li><strong>Ode to Joy</strong>: An introduction to playing melodies with simple harmonies.</li>
      </ul>
      <Title level={4}>Practice Tips</Title>
      <ul>
        <li>Start slowly and play one hand at a time before combining both hands.</li>
        <li>Focus on consistent rhythm and hand coordination.</li>
        <li>Use a metronome to keep time.</li>
      </ul>
    </TheoryContent>
  )
}
