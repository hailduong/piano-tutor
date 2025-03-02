import React from 'react'
import styled from 'styled-components'
import {Typography} from 'antd'

const {Title, Text, Paragraph} = Typography

const TheoryContent = styled.div`
    padding: 24px;
    background-color: white;
    border-radius: 8px;
    margin-bottom: 24px;
`

const musicConceptData: Record<string, React.ReactNode> = {
  'basic-notation': (
    <TheoryContent>
      <Title level={3}>Basic Music Notation</Title>
      <Paragraph>
        Music notation is the system used to visually represent music through symbols. The most common form of music
        notation uses a five-line staff.
      </Paragraph>

      <Title level={4}>The Staff</Title>
      <Paragraph>
        The staff consists of five horizontal lines and four spaces. Each line and space represents a different pitch,
        determined by the clef.
      </Paragraph>

      <Title level={4}>Clefs</Title>
      <Paragraph>
        A clef is a musical symbol used to indicate which notes are represented by the lines and spaces on the staff.
      </Paragraph>
      <ul>
        <li><strong>Treble Clef (G clef)</strong>: Used for higher-pitched instruments and typically the right hand in
          piano music.
        </li>
        <li><strong>Bass Clef (F clef)</strong>: Used for lower-pitched instruments and typically the left hand in piano
          music.
        </li>
      </ul>

      <Title level={4}>Notes</Title>
      <Paragraph>
        Notes are symbols that indicate the pitch and duration of a sound. The position of a note on the staff shows its
        pitch, while its shape indicates its duration.
      </Paragraph>
      <ul>
        <li><strong>Whole note</strong>: An empty oval (○) that lasts for 4 beats in 4/4 time.</li>
        <li><strong>Half note</strong>: An empty oval with a stem (𝅗𝅥) that lasts for 2 beats in 4/4 time.</li>
        <li><strong>Quarter note</strong>: A filled oval with a stem (♩) that lasts for 1 beat in 4/4 time.</li>
        <li><strong>Eighth note</strong>: A filled oval with a stem and a flag (♪) that lasts for 1/2 beat in 4/4 time.
        </li>
      </ul>
    </TheoryContent>
  ),
  'rhythm-basics': (
    <TheoryContent>
      <Title level={3}>Rhythm Basics</Title>
      <Paragraph>
        Rhythm is the pattern of sounds and silences in music. It defines how music flows over time.
      </Paragraph>

      <Title level={4}>Time Signatures</Title>
      <Paragraph>
        A time signature tells you how many beats are in each measure and what note value gets one beat.
      </Paragraph>
      <ul>
        <li><strong>4/4 Time</strong>: Four quarter notes per measure. The most common time signature.</li>
        <li><strong>3/4 Time</strong>: Three quarter notes per measure. Often used for waltzes.</li>
        <li><strong>2/4 Time</strong>: Two quarter notes per measure. Common in marches.</li>
        <li><strong>6/8 Time</strong>: Six eighth notes per measure. Has a compound feel (grouped in twos).</li>
      </ul>

      <Title level={4}>Note Values and Rests</Title>
      <Paragraph>
        Note values determine how long a note is played. Rests indicate periods of silence.
      </Paragraph>
      <ul>
        <li><strong>Whole note/rest</strong>: 4 beats</li>
        <li><strong>Half note/rest</strong>: 2 beats</li>
        <li><strong>Quarter note/rest</strong>: 1 beat</li>
        <li><strong>Eighth note/rest</strong>: 1/2 beat</li>
        <li><strong>Sixteenth note/rest</strong>: 1/4 beat</li>
      </ul>

      <Title level={4}>Dots and Ties</Title>
      <Paragraph>
        A dot after a note increases its duration by half its value. A tie connects two notes of the same pitch, adding
        their durations together.
      </Paragraph>
    </TheoryContent>
  ),
  'scales-keys': (
    <TheoryContent>
      <Title level={3}>Scales and Keys</Title>
      <Paragraph>
        Scales are sequences of notes arranged by pitch, while keys refer to the group of pitches that form the basis of
        a musical composition.
      </Paragraph>

      <Title level={4}>Major Scales</Title>
      <Paragraph>
        A major scale follows the pattern of whole and half steps: W-W-H-W-W-W-H.
      </Paragraph>
      <Paragraph>
        For example, C major scale: C-D-E-F-G-A-B-C
      </Paragraph>

      <Title level={4}>Minor Scales</Title>
      <Paragraph>
        Natural minor scale follows the pattern: W-H-W-W-H-W-W.
      </Paragraph>
      <Paragraph>
        For example, A minor scale: A-B-C-D-E-F-G-A
      </Paragraph>

      <Title level={4}>Key Signatures</Title>
      <Paragraph>
        Key signatures appear at the beginning of a piece and indicate which notes should be played as sharps or flats
        throughout the piece.
      </Paragraph>
    </TheoryContent>
  ),
  'intervals': (
    <TheoryContent>
      <Title level={3}>Intervals</Title>
      <Paragraph>
        An interval is the distance between two pitches. Intervals are named by their number (the distance in scale
        steps) and quality (major, minor, perfect, augmented, diminished).
      </Paragraph>

      <Title level={4}>Perfect Intervals</Title>
      <Paragraph>
        Unison (P1), Fourth (P4), Fifth (P5), and Octave (P8) are called perfect intervals.
      </Paragraph>

      <Title level={4}>Major and Minor Intervals</Title>
      <Paragraph>
        Seconds, Thirds, Sixths, and Sevenths can be major or minor. A minor interval is one half step smaller than a
        major interval.
      </Paragraph>
      <ul>
        <li><strong>Major Second</strong>: Two half steps (C to D)</li>
        <li><strong>Minor Third</strong>: Three half steps (C to E♭)</li>
        <li><strong>Major Third</strong>: Four half steps (C to E)</li>
        <li><strong>Perfect Fourth</strong>: Five half steps (C to F)</li>
      </ul>
    </TheoryContent>
  ),
  'chords': (
    <TheoryContent>
      <Title level={3}>Chords</Title>
      <Paragraph>
        A chord is a group of three or more notes played together. The most common chords are triads, which consist of
        three notes.
      </Paragraph>

      <Title level={4}>Triads</Title>
      <Paragraph>
        A triad consists of a root note, a third, and a fifth. There are four basic types:
      </Paragraph>
      <ul>
        <li><strong>Major triad</strong>: Root, major 3rd, perfect 5th (C-E-G)</li>
        <li><strong>Minor triad</strong>: Root, minor 3rd, perfect 5th (C-E♭-G)</li>
        <li><strong>Augmented triad</strong>: Root, major 3rd, augmented 5th (C-E-G#)</li>
        <li><strong>Diminished triad</strong>: Root, minor 3rd, diminished 5th (C-E♭-G♭)</li>
      </ul>

      <Title level={4}>Chord Progressions</Title>
      <Paragraph>
        Chord progressions are sequences of chords that create the harmonic foundation of music. Common progressions in
        major keys include:
      </Paragraph>
      <ul>
        <li>I-IV-V (C-F-G in C major)</li>
        <li>I-V-vi-IV (C-G-Am-F in C major)</li>
        <li>ii-V-I (Dm-G-C in C major)</li>
      </ul>
    </TheoryContent>
  )
}
export default musicConceptData
