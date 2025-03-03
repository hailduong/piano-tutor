import React, { useState, useEffect } from 'react'
import { useMIDIHandler } from '../LearnSong/hooks/useMIDIHandler'
import { useSheetMusicParser } from '../LearnSong/hooks/useSheetMusicParser'
import { Card, Typography, Divider } from 'antd'
import Vex from 'vexflow'

const { Title, Text } = Typography

const SoundTest: React.FC = () => {
  const [vexNotes, setVexNotes] = useState<Vex.StaveNote[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { playNote, hasSupport, instrumentLoading } = useMIDIHandler()
  const { convertKeyToMIDINote } = useSheetMusicParser()

  // Create some sample notes
  useEffect(() => {
    // Create simple C major scale
    const notes = [
      new Vex.StaveNote({ keys: ["c/4"], duration: "q" }),
      new Vex.StaveNote({ keys: ["d/4"], duration: "q" }),
      new Vex.StaveNote({ keys: ["e/4"], duration: "q" }),
      new Vex.StaveNote({ keys: ["f/4"], duration: "q" }),
      new Vex.StaveNote({ keys: ["g/4"], duration: "q" }),
      new Vex.StaveNote({ keys: ["a/4"], duration: "q" }),
      new Vex.StaveNote({ keys: ["b/4"], duration: "q" }),
      new Vex.StaveNote({ keys: ["c/5"], duration: "q" }),
    ];

    // Set unique IDs
    notes.forEach((note, index) => note.setAttribute('id', `note-${index}`))
    setVexNotes(notes)
  }, [])

  const handleTestPlay = (index: number) => {
    if (index < vexNotes.length) {
      const note = vexNotes[index]
      const key = note.getKeys()[0]
      const midiNote = convertKeyToMIDINote(key)
      playNote(midiNote, 500, 96)
      console.log(`Playing note: ${key} (MIDI: ${midiNote})`)
    }
  }

  return (
    <div>
      <Title level={2}>Sound Test Page</Title>
      <Text type={instrumentLoading ? "warning" : "success"}>
        Sound Status: {instrumentLoading ? "Loading sounds..." : "Ready"}
      </Text>
      <Divider />
      <Text>
        {hasSupport ? 'MIDI support detected' : 'MIDI not supported in your browser'}
      </Text>

      <Card title="Note Playback Test" style={{ marginTop: 20 }}>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', maxWidth: '600px'}}>
          {vexNotes.map((note, index) => (
            <button
              key={index}
              onClick={() => handleTestPlay(index)}
              style={{
                padding: '8px 12px',
                background: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              disabled={instrumentLoading}
            >
              Play {note.getKeys()[0]}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            // Test playing a chord with multiple notes
            const demoNotes = [60, 64, 67] // C major chord
            demoNotes.forEach(note => playNote(note, 800))
          }}
          style={{
            margin: '10px 0',
            padding: '8px 12px',
            background: '#52c41a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          disabled={instrumentLoading}
        >
          Play C Major Chord
        </button>
      </Card>
    </div>
  )
}

export default SoundTest
