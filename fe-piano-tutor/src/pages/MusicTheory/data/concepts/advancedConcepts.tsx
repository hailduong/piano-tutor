import React from 'react'
import {Typography} from 'antd'
import {TheoryContent} from 'pages/MusicTheory/data/styles/theoryContent'

const {Title, Paragraph} = Typography
export const advancedConcepts: Record<string, React.ReactNode> = {
  'advanced-1': (
    <TheoryContent>
      <Title level={3}>Mastering Technical Studies</Title>
      <Paragraph>
        Technical studies help improve finger strength, agility, and control, essential for advanced playing.
      </Paragraph>
      <Title level={4}>Recommended Exercises</Title>
      <ul>
        <li><strong>Czerny Exercises</strong>: Finger dexterity and coordination.</li>
        <li><strong>Hanon Virtuoso Pianist</strong>: Strength and endurance.</li>
        <li><strong>Liszt’s Technical Studies</strong>: Challenging techniques.</li>
      </ul>
    </TheoryContent>
  ),
  'advanced-2': (
    <TheoryContent>
      <Title level={3}>Advanced Rhythms and Polyrhythms</Title>
      <Paragraph>
        Understanding complex rhythms and polyrhythms enhances musical expression and interpretation.
      </Paragraph>
      <Title level={4}>Examples</Title>
      <ul>
        <li><strong>3 against 2</strong>: Played when one hand plays triplets while the other plays duplets.</li>
        <li><strong>5 against 4</strong>: Found in modern and jazz compositions.</li>
      </ul>
    </TheoryContent>
  ),
  'advanced-3': (
    <TheoryContent>
      <Title level={3}>Memorization Techniques</Title>
      <Paragraph>
        Memorizing music efficiently helps improve confidence and reduces performance anxiety.
      </Paragraph>
      <Title level={4}>Strategies</Title>
      <ul>
        <li>Analyze musical structures and harmonic progressions.</li>
        <li>Practice small sections repeatedly.</li>
        <li>Use mental visualization techniques.</li>
      </ul>
    </TheoryContent>
  ),
  'advanced-4': (
    <TheoryContent>
      <Title level={3}>Advanced Chord Progressions</Title>
      <Paragraph>
        Complex progressions add richness to harmonic structures and improvisation.
      </Paragraph>
      <Title level={4}>Examples</Title>
      <ul>
        <li><strong>Jazz ii-V-I</strong>: Common in jazz harmony.</li>
        <li><strong>Neapolitan Sixth</strong>: A chromatic chord found in classical music.</li>
      </ul>
    </TheoryContent>
  ),
  'advanced-5': (
    <TheoryContent>
      <Title level={3}>Advanced Sight-Reading and Ear Training</Title>
      <Paragraph>
        Developing strong sight-reading and aural skills enables faster learning of new repertoire.
      </Paragraph>
      <Title level={4}>Exercises</Title>
      <ul>
        <li>Read new pieces daily at a moderate tempo.</li>
        <li>Identify chord progressions by ear.</li>
      </ul>
    </TheoryContent>
  ),
  'advanced-6': (
    <TheoryContent>
      <Title level={3}>Classical Repertoire – Advanced</Title>
      <Paragraph>
        Playing advanced classical pieces refines technical and interpretive skills.
      </Paragraph>
      <Title level={4}>Recommended Pieces</Title>
      <ul>
        <li><strong>Chopin Etudes</strong>: Technical mastery.</li>
        <li><strong>Rachmaninoff Preludes</strong>: Expressive playing.</li>
        <li><strong>Debussy’s Preludes</strong>: Impressionistic colors.</li>
      </ul>
    </TheoryContent>
  ),
  'advanced-7': (
    <TheoryContent>
      <Title level={3}>Jazz Improvisation and Composition</Title>
      <Paragraph>
        Learning jazz improvisation and composition allows for greater musical creativity.
      </Paragraph>
      <Title level={4}>Concepts</Title>
      <ul>
        <li>Understanding chord extensions and substitutions.</li>
        <li>Practicing scales and modes over progressions.</li>
        <li>Creating melodic variations.</li>
      </ul>
    </TheoryContent>
  )
};
