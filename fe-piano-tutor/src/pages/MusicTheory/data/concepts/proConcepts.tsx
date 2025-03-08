import React from 'react'
import {Typography} from 'antd'

import {TheoryContent} from 'pages/MusicTheory/data/styles/theoryContent'

const {Title, Paragraph} = Typography

export const professionalConcepts: Record<string, React.ReactNode> = {
  'professional-1': (
    <TheoryContent>
      <Title level={3}>Performance Preparation</Title>
      <Paragraph>
        Preparing for recitals and competitions requires a combination of technical mastery, emotional connection, and stage presence.
      </Paragraph>
      <Title level={4}>Strategies for Effective Preparation</Title>
      <ul>
        <li>Practice regularly with increasing performance-level intensity.</li>
        <li>Simulate performance environments to reduce anxiety.</li>
        <li>Record and analyze performances for improvements.</li>
      </ul>
    </TheoryContent>
  ),
  'professional-2': (
    <TheoryContent>
      <Title level={3}>Advanced Music Theory and Composition</Title>
      <Paragraph>
        Deep understanding of harmony, counterpoint, and form is crucial for advanced musicianship.
      </Paragraph>
      <Title level={4}>Key Areas of Study</Title>
      <ul>
        <li>Complex harmonic analysis.</li>
        <li>Orchestration and arrangement techniques.</li>
        <li>Writing fugues and structured compositions.</li>
      </ul>
    </TheoryContent>
  ),
  'professional-3': (
    <TheoryContent>
      <Title level={3}>Masterclass Interpretation</Title>
      <Paragraph>
        Refining interpretation skills through in-depth study of phrasing, dynamics, and historical context.
      </Paragraph>
      <Title level={4}>Approach</Title>
      <ul>
        <li>Analyze different performance styles.</li>
        <li>Attend or participate in masterclasses.</li>
        <li>Develop a unique artistic voice.</li>
      </ul>
    </TheoryContent>
  ),
  'professional-4': (
    <TheoryContent>
      <Title level={3}>Advanced Repertoire – Professional Level</Title>
      <Paragraph>
        Mastering highly advanced works that demand both technical and expressive depth.
      </Paragraph>
      <Title level={4}>Suggested Pieces</Title>
      <ul>
        <li><strong>Liszt’s Transcendental Etudes</strong>: Extreme technical challenge.</li>
        <li><strong>Rachmaninoff Piano Concertos</strong>: Power and expressiveness.</li>
        <li><strong>Scriabin Sonatas</strong>: Unique harmonic language.</li>
      </ul>
    </TheoryContent>
  ),
  'professional-5': (
    <TheoryContent>
      <Title level={3}>Chamber Music and Collaboration</Title>
      <Paragraph>
        Developing ensemble skills by playing with other musicians.
      </Paragraph>
      <Title level={4}>Key Skills</Title>
      <ul>
        <li>Listening and responding to other musicians.</li>
        <li>Balancing dynamics in an ensemble setting.</li>
        <li>Understanding role changes in different pieces.</li>
      </ul>
    </TheoryContent>
  ),
  'professional-6': (
    <TheoryContent>
      <Title level={3}>Preparing for Conservatory Auditions</Title>
      <Paragraph>
        Mastering audition requirements for conservatory or professional applications.
      </Paragraph>
      <Title level={4}>Preparation Strategies</Title>
      <ul>
        <li>Choosing repertoire that showcases strengths.</li>
        <li>Practicing under time constraints.</li>
        <li>Receiving feedback from experienced mentors.</li>
      </ul>
    </TheoryContent>
  ),
  'professional-7': (
    <TheoryContent>
      <Title level={3}>Final Recital Preparation</Title>
      <Paragraph>
        Preparing a complete recital program, including repertoire selection, memorization, and stage presence.
      </Paragraph>
      <Title level={4}>Steps for a Successful Recital</Title>
      <ul>
        <li>Structuring a well-balanced program.</li>
        <li>Managing nerves through mental preparation.</li>
        <li>Delivering an engaging and expressive performance.</li>
      </ul>
    </TheoryContent>
  )
};
