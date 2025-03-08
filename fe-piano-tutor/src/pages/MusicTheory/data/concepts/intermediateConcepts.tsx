import React from 'react'
import {Typography} from 'antd'
import {TheoryContent} from 'pages/MusicTheory/data/styles/theoryContent'

const {Title, Paragraph} = Typography

export const intermediateConcepts: Record<string, React.ReactNode> = {
  'intermediate-1': (
    <TheoryContent>
      <Title level={3}>Advanced Scales and Modes</Title>
      <Paragraph>
        Scales and modes expand the musician’s ability to create melodic variety and express different emotions.
      </Paragraph>
      <Title level={4}>Pentatonic Scales</Title>
      <Paragraph>
        The pentatonic scale consists of five notes and is widely used in blues, rock, and jazz.
      </Paragraph>
      <ul>
        <li><strong>Major Pentatonic</strong>: C-D-E-G-A (lacks 4th and 7th scale degrees).</li>
        <li><strong>Minor Pentatonic</strong>: A-C-D-E-G (lacks 2nd and 6th scale degrees).</li>
      </ul>
      <Title level={4}>Blues Scale</Title>
      <Paragraph>
        The blues scale is a variation of the minor pentatonic with an added flat 5th, giving it a distinctive sound.
      </Paragraph>
      <ul>
        <li>Example: C Blues Scale - C-E♭-F-F#-G-B♭-C.</li>
      </ul>
      <Title level={4}>Chromatic Scale</Title>
      <Paragraph>
        The chromatic scale consists of all twelve notes within an octave, moving entirely in half steps.
      </Paragraph>
      <ul>
        <li>Example: C-C#-D-D#-E-F-F#-G-G#-A-A#-B-C.</li>
      </ul>
    </TheoryContent>
  ),
  'intermediate-2': (
    <TheoryContent>
      <Title level={3}>Complex Chords and Inversions</Title>
      <Paragraph>
        Chord complexity increases with the addition of extensions and alterations, making harmony richer.
      </Paragraph>
      <Title level={4}>Seventh Chords</Title>
      <Paragraph>
        Seventh chords add a fourth note to triads, introducing more depth.
      </Paragraph>
      <ul>
        <li><strong>Major 7th (Cmaj7)</strong>: C-E-G-B.</li>
        <li><strong>Minor 7th (Cm7)</strong>: C-E♭-G-B♭.</li>
        <li><strong>Dominant 7th (C7)</strong>: C-E-G-B♭.</li>
      </ul>
      <Title level={4}>Diminished and Augmented Chords</Title>
      <Paragraph>
        These altered chords create tension and are commonly used in jazz and modern music.
      </Paragraph>
      <ul>
        <li><strong>Diminished 7th (Cdim7)</strong>: C-E♭-G♭-A.</li>
        <li><strong>Augmented (Caug)</strong>: C-E-G#.</li>
      </ul>
      <Title level={4}>Chord Inversions</Title>
      <Paragraph>
        Inversions rearrange the order of chord tones to create smoother transitions.
      </Paragraph>
      <ul>
        <li><strong>Root Position</strong>: C-E-G.</li>
        <li><strong>1st Inversion</strong>: E-G-C.</li>
        <li><strong>2nd Inversion</strong>: G-C-E.</li>
      </ul>
    </TheoryContent>
  ),
  'intermediate-3': (
    <TheoryContent>
      <Title level={3}>Ear Training and Solfeggio</Title>
      <Paragraph>
        Ear training improves the ability to recognize pitches, intervals, and harmonies by ear.
      </Paragraph>
      <Title level={4}>Intervals and Pitch Recognition</Title>
      <Paragraph>
        Recognizing intervals is key to developing a strong musical ear.
      </Paragraph>
      <ul>
        <li><strong>Perfect 4th</strong>: "Here Comes the Bride" (C to F).</li>
        <li><strong>Perfect 5th</strong>: "Twinkle Twinkle Little Star" (C to G).</li>
        <li><strong>Major 6th</strong>: "My Bonnie Lies Over the Ocean" (C to A).</li>
      </ul>
      <Title level={4}>Solfeggio Singing</Title>
      <Paragraph>
        Solfeggio uses syllables (Do, Re, Mi) to develop pitch accuracy and sight-singing ability.
      </Paragraph>
      <ul>
        <li>Practice singing major scales using solfeggio.</li>
        <li>Try simple melodies and scale exercises with Do-Re-Mi notation.</li>
      </ul>
      <Title level={4}>Harmonic Recognition</Title>
      <Paragraph>
        Learning to identify chord progressions by ear strengthens harmonic awareness.
      </Paragraph>
      <ul>
        <li>Listen to and identify I-IV-V-I progressions in different keys.</li>
        <li>Practice recognizing minor and diminished chords.</li>
      </ul>
    </TheoryContent>
  ),
  'intermediate-4': (
    <TheoryContent>
      <Title level={3}>Advanced Sight-Reading</Title>
      <Paragraph>
        Sight-reading at an intermediate level involves reading more complex rhythms, key signatures, and musical
        structures.
      </Paragraph>
      <Title level={4}>Strategies for Improvement</Title>
      <ul>
        <li>Focus on recognizing patterns and common musical motifs.</li>
        <li>Practice with different time signatures and accidentals.</li>
        <li>Use a metronome to maintain steady timing.</li>
      </ul>
      <Title level={4}>Sight-Reading Exercises</Title>
      <Paragraph>
        Gradually increase the complexity of pieces you sight-read, starting with slow tempos.
      </Paragraph>
    </TheoryContent>
  ),
  'intermediate-5': (
    <TheoryContent>
      <Title level={3}>Classical Repertoire – Intermediate</Title>
      <Paragraph>
        Exploring intermediate-level classical pieces enhances technical and expressive playing.
      </Paragraph>
      <Title level={4}>Recommended Pieces</Title>
      <ul>
        <li><strong>Bach’s Inventions</strong>: Two-part counterpoint for hand coordination.</li>
        <li><strong>Beethoven’s Sonatas</strong>: Melodic development and expressive phrasing.</li>
        <li><strong>Mozart’s Piano Sonatas</strong>: Balance between melody and accompaniment.</li>
      </ul>
      <Title level={4}>Interpretation Tips</Title>
      <Paragraph>
        Study the composer’s intentions, phrasing, and articulation to deliver an expressive performance.
      </Paragraph>
    </TheoryContent>
  ),
  'intermediate-6': (
    <TheoryContent>
      <Title level={3}>Playing with Expression and Phrasing</Title>
      <Paragraph>
        Expression and phrasing bring music to life by shaping dynamics, articulation, and tempo.
      </Paragraph>
      <Title level={4}>Elements of Expression</Title>
      <ul>
        <li><strong>Dynamics</strong>: Adjusting volume levels for contrast.</li>
        <li><strong>Rubato</strong>: Slight tempo variations for emotional impact.</li>
        <li><strong>Articulation</strong>: Smooth legato vs. crisp staccato playing.</li>
      </ul>
      <Title level={4}>Exercises</Title>
      <Paragraph>
        Practice expressive techniques by playing short phrases with dynamic variations and articulation changes.
      </Paragraph>
    </TheoryContent>
  ),
  'intermediate-7': (
    <TheoryContent>
      <Title level={3}>Introduction to Music Theory</Title>
      <Paragraph>
        Intermediate music theory involves deeper harmonic analysis, counterpoint, and modulation techniques.
      </Paragraph>
      <Title level={4}>Harmonic Analysis</Title>
      <Paragraph>
        Understanding chord functions and progressions within different musical forms.
      </Paragraph>
      <ul>
        <li>Analyze chord inversions and voice leading.</li>
        <li>Identify cadences such as perfect, plagal, and deceptive.</li>
      </ul>
      <Title level={4}>Counterpoint</Title>
      <Paragraph>
        Learning how independent melodic lines interact harmonically.
      </Paragraph>
      <ul>
        <li>Practice writing simple two-part counterpoint.</li>
        <li>Study Bach’s contrapuntal techniques.</li>
      </ul>
      <Title level={4}>Modulation Techniques</Title>
      <Paragraph>
        Shifting from one key to another smoothly within a piece.
      </Paragraph>
      <ul>
        <li>Common modulations: relative major/minor, dominant modulation.</li>
        <li>Practice transitioning between keys using pivot chords.</li>
      </ul>
    </TheoryContent>
  )
}
