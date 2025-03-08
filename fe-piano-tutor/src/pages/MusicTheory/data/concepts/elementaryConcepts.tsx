import React from "react";
import {Typography} from 'antd'
import {TheoryContent} from 'pages/MusicTheory/data/styles/theoryContent'

const {Title, Paragraph} = Typography

export const elementaryConcepts: Record<string, React.ReactNode> = {
  'elementary-1': (
    <TheoryContent>
      <Title level={3}>Advanced Rhythm and Time Signatures</Title>
      <Paragraph>
        Rhythm is the heartbeat of music. Understanding advanced rhythmic structures helps in playing more complex pieces.
      </Paragraph>
      <Title level={4}>Dotted Notes and Syncopation</Title>
      <Paragraph>
        Dotted notes extend the duration of a note by adding half of its original value.
      </Paragraph>
      <ul>
        <li><strong>Dotted Half Note</strong>: 3 beats (2 + 1).</li>
        <li><strong>Dotted Quarter Note</strong>: 1.5 beats (1 + 0.5).</li>
      </ul>
      <Paragraph>
        Syncopation occurs when emphasis is placed on normally weak beats, creating a unique rhythmic feel.
      </Paragraph>
      <Title level={4}>Compound Time Signatures</Title>
      <Paragraph>
        Compound time signatures divide beats into groups of three instead of two.
      </Paragraph>
      <ul>
        <li><strong>6/8 Time</strong>: Two main beats per measure, each subdivided into three eighth notes.</li>
        <li><strong>9/8 Time</strong>: Three main beats per measure, each subdivided into three eighth notes.</li>
      </ul>
    </TheoryContent>
  ),
  'elementary-2': (
    <TheoryContent>
      <Title level={3}>Intermediate Scales and Arpeggios</Title>
      <Paragraph>
        Scales and arpeggios form the foundation for finger agility and musical fluency.
      </Paragraph>
      <Title level={4}>Major and Minor Scales</Title>
      <Paragraph>
        Mastering major and minor scales helps with key recognition and finger coordination.
      </Paragraph>
      <ul>
        <li><strong>C Major Scale</strong>: No sharps or flats (C-D-E-F-G-A-B-C).</li>
        <li><strong>A Minor Scale</strong>: No sharps or flats (A-B-C-D-E-F-G-A).</li>
      </ul>
      <Title level={4}>Arpeggios and Finger Patterns</Title>
      <Paragraph>
        Arpeggios are broken chords played sequentially, improving fluidity in movement.
      </Paragraph>
      <ul>
        <li>Common fingering for C Major Arpeggio: 1-2-3, 1-2-3-5.</li>
        <li>Practice smooth hand crossings and even dynamics.</li>
      </ul>
    </TheoryContent>
  ),
  'elementary-3': (
    <TheoryContent>
      <Title level={3}>Hand Independence</Title>
      <Paragraph>
        Developing hand independence allows for playing different rhythms and melodies simultaneously.
      </Paragraph>
      <Title level={4}>Finger Exercises</Title>
      <Paragraph>
        Practicing independent finger movement helps each hand function autonomously.
      </Paragraph>
      <ul>
        <li>Play scales in contrary motion (hands moving in opposite directions).</li>
        <li>Practice Hanon exercises for finger strength.</li>
      </ul>
      <Title level={4}>Left-Hand Accompaniment</Title>
      <Paragraph>
        The left hand often plays harmonic accompaniment while the right hand plays melody.
      </Paragraph>
      <ul>
        <li>Practice broken chords and Alberti bass patterns.</li>
        <li>Play simple chord progressions while improvising a melody.</li>
      </ul>
    </TheoryContent>
  ),
  'elementary-4': (
    <TheoryContent>
      <Title level={3}>Chord Progressions and Harmony</Title>
      <Paragraph>
        Chord progressions form the harmonic backbone of music. Understanding how chords move helps in composing and improvising.
      </Paragraph>
      <Title level={4}>Primary Chords</Title>
      <Paragraph>
        The most common chords in a key are the I (tonic), IV (subdominant), and V (dominant) chords.
      </Paragraph>
      <ul>
        <li><strong>C Major Key</strong>: I (C), IV (F), V (G).</li>
        <li><strong>A Minor Key</strong>: i (Am), iv (Dm), v (E).</li>
      </ul>
      <Title level={4}>Common Progressions</Title>
      <Paragraph>
        Some progressions are frequently used in various musical styles.
      </Paragraph>
      <ul>
        <li><strong>I-IV-V-I</strong>: Common in classical and pop music.</li>
        <li><strong>ii-V-I</strong>: Standard jazz progression.</li>
      </ul>
    </TheoryContent>
  ),
  'elementary-5': (
    <TheoryContent>
      <Title level={3}>Dynamics and Articulation</Title>
      <Paragraph>
        Dynamics and articulation define the expression and feel of a musical piece.
      </Paragraph>
      <Title level={4}>Dynamic Markings</Title>
      <Paragraph>
        Dynamics indicate the volume at which notes should be played.
      </Paragraph>
      <ul>
        <li><strong>p (piano)</strong>: Soft.</li>
        <li><strong>f (forte)</strong>: Loud.</li>
        <li><strong>crescendo (cresc.)</strong>: Gradually getting louder.</li>
        <li><strong>decrescendo (decresc.)</strong>: Gradually getting softer.</li>
      </ul>
      <Title level={4}>Articulation Techniques</Title>
      <Paragraph>
        Articulation defines how notes are played.
      </Paragraph>
      <ul>
        <li><strong>Legato</strong>: Smooth and connected notes.</li>
        <li><strong>Staccato</strong>: Short and detached notes.</li>
        <li><strong>Accent</strong>: Emphasizing a note.</li>
      </ul>
    </TheoryContent>
  ),
  'elementary-6': (
    <TheoryContent>
      <Title level={3}>Basic Sight-Reading</Title>
      <Paragraph>
        Sight-reading is the ability to play music from sheet notation at first sight.
      </Paragraph>
      <Title level={4}>Tips for Sight-Reading</Title>
      <Paragraph>
        Developing good habits makes sight-reading easier.
      </Paragraph>
      <ul>
        <li>Scan the piece for key signature, time signature, and tempo.</li>
        <li>Look ahead while playing to anticipate the next notes.</li>
        <li>Keep a steady tempo and avoid stopping.</li>
      </ul>
    </TheoryContent>
  ),
  'elementary-7': (
    <TheoryContent>
      <Title level={3}>Classical Repertoire</Title>
      <Paragraph>
        Learning classical pieces introduces students to structured compositions and technique refinement.
      </Paragraph>
      <Title level={4}>Beginner Classical Pieces</Title>
      <Paragraph>
        Some famous classical pieces suitable for elementary-level pianists:
      </Paragraph>
      <ul>
        <li><strong>Bach’s Minuets</strong>: Simple yet elegant.</li>
        <li><strong>Beethoven’s Sonatinas</strong>: Great for developing phrasing.</li>
        <li><strong>Schumann’s Album for the Young</strong>: Short, expressive pieces.</li>
      </ul>
    </TheoryContent>
  ),
};
