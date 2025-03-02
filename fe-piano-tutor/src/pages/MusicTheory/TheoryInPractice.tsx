import React, {useState, useEffect} from 'react'
import {Card, Typography, Button, Space, Divider, Row, Col, Tooltip} from 'antd'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import {setSuggestedNote} from 'slices/musicNotesSlice'
import {useMusicTheory} from 'contexts/MusicTheoryContext'
import SheetMusicRenderer from 'common/SheetMusicRenderer'
import {QuestionCircleOutlined, SoundOutlined} from '@ant-design/icons'

const {Title, Paragraph, Text} = Typography

interface TheoryInPracticeProps {
  conceptId: string;
}

const TheoryInPractice: React.FC<TheoryInPracticeProps> = ({conceptId}) => {
  const dispatch = useDispatch()
  const {history} = useSelector((state: RootState) => state.musicNotes)
  const {setCurrentTheoryConcept} = useMusicTheory()
  const [practiceMode, setPracticeMode] = useState<string>('')
  const [currentExample, setCurrentExample] = useState<number>(0)

  // Examples for different theory concepts
  const practiceExamples: Record<string, any[]> = {
    'basic-notation': [
      {
        title: 'Reading Notes in Treble Clef',
        description: 'Play each note as it appears on the staff',
        notes: [
          {note: 'C', length: 'q', timestamp: Date.now(), octave: 4},
          {note: 'D', length: 'q', timestamp: Date.now() + 100, octave: 4},
          {note: 'E', length: 'q', timestamp: Date.now() + 200, octave: 4}
        ]
      },
      {
        title: 'Reading Notes in Bass Clef',
        description: 'Play each note as it appears on the staff',
        notes: [
          {note: 'F', length: 'q', timestamp: Date.now(), octave: 3},
          {note: 'G', length: 'q', timestamp: Date.now() + 100, octave: 3},
          {note: 'A', length: 'q', timestamp: Date.now() + 200, octave: 3}
        ]
      }
    ],
    'scales-keys': [
      {
        title: 'C Major Scale',
        description: 'Play the C major scale ascending',
        notes: [
          {note: 'C', length: 'q', timestamp: Date.now(), octave: 4},
          {note: 'D', length: 'q', timestamp: Date.now() + 100, octave: 4},
          {note: 'E', length: 'q', timestamp: Date.now() + 200, octave: 4},
          {note: 'F', length: 'q', timestamp: Date.now() + 300, octave: 4},
          {note: 'G', length: 'q', timestamp: Date.now() + 400, octave: 4},
          {note: 'A', length: 'q', timestamp: Date.now() + 500, octave: 4},
          {note: 'B', length: 'q', timestamp: Date.now() + 600, octave: 4},
          {note: 'C', length: 'q', timestamp: Date.now() + 700, octave: 5}
        ]
      },
      {
        title: 'G Major Scale',
        description: 'Play the G major scale ascending',
        notes: [
          {note: 'G', length: 'q', timestamp: Date.now(), octave: 3},
          {note: 'A', length: 'q', timestamp: Date.now() + 100, octave: 3},
          {note: 'B', length: 'q', timestamp: Date.now() + 200, octave: 3},
          {note: 'C', length: 'q', timestamp: Date.now() + 300, octave: 4},
          {note: 'D', length: 'q', timestamp: Date.now() + 400, octave: 4},
          {note: 'E', length: 'q', timestamp: Date.now() + 500, octave: 4},
          {note: 'F#', length: 'q', timestamp: Date.now() + 600, octave: 4},
          {note: 'G', length: 'q', timestamp: Date.now() + 700, octave: 4}
        ]
      }
    ],
    'chords': [
      {
        title: 'C Major Chord',
        description: 'Play the notes of a C major chord',
        notes: [
          {note: 'C', length: 'q', timestamp: Date.now(), octave: 4},
          {note: 'E', length: 'q', timestamp: Date.now() + 100, octave: 4},
          {note: 'G', length: 'q', timestamp: Date.now() + 200, octave: 4}
        ]
      },
      {
        title: 'G Major Chord',
        description: 'Play the notes of a G major chord',
        notes: [
          {note: 'G', length: 'q', timestamp: Date.now(), octave: 3},
          {note: 'B', length: 'q', timestamp: Date.now() + 100, octave: 3},
          {note: 'D', length: 'q', timestamp: Date.now() + 200, octave: 4}
        ]
      }
    ],
    'intervals': [
      {
        title: 'Major Third Interval',
        description: 'Play the two notes that form a major third',
        notes: [
          {note: 'C', length: 'q', timestamp: Date.now(), octave: 4},
          {note: 'E', length: 'q', timestamp: Date.now() + 100, octave: 4}
        ]
      },
      {
        title: 'Perfect Fifth Interval',
        description: 'Play the two notes that form a perfect fifth',
        notes: [
          {note: 'C', length: 'q', timestamp: Date.now(), octave: 4},
          {note: 'G', length: 'q', timestamp: Date.now() + 100, octave: 4}
        ]
      }
    ]
  }

  const currentPracticeExamples = practiceExamples[conceptId] || []
  const example = currentPracticeExamples[currentExample] || null

  useEffect(() => {
    // Set the current theory concept when this component mounts
    setCurrentTheoryConcept(conceptId)

    // Clean up when component unmounts
    return () => setCurrentTheoryConcept('')
  }, [conceptId, setCurrentTheoryConcept])

  const handleStartPractice = () => {
    setPracticeMode('play')
    // Suggest the first note to play
    if (example && example.notes.length > 0) {
      dispatch(setSuggestedNote(example.notes[0]))
    }
  }

  const handleNextExample = () => {
    if (currentExample < currentPracticeExamples.length - 1) {
      setCurrentExample(currentExample + 1)
      setPracticeMode('')
    }
  }

  const handlePreviousExample = () => {
    if (currentExample > 0) {
      setCurrentExample(currentExample - 1)
      setPracticeMode('')
    }
  }

  return (
    <div style={{marginTop: '20px'}}>
      <Title level={3}>Practice with Theory</Title>
      <Paragraph>
        Apply your knowledge of {conceptId.replace('-', ' ')} with these practice exercises.
        Play the notes on the piano to hear how they sound.
      </Paragraph>

      {example ? (
        <Card title={example.title}>
          <Paragraph>{example.description}</Paragraph>

          <Row gutter={16}>
            <Col span={24}>
              <SheetMusicRenderer
                notes={example.notes}
                width={600}
                height={150}
                showTheoryHints={true}
                selectedConcept={conceptId}
              />
            </Col>
          </Row>

          <Divider/>

          <Space direction="vertical" style={{width: '100%'}}>
            {!practiceMode ? (
              <Button
                type="primary"
                icon={<SoundOutlined/>}
                onClick={handleStartPractice}
                block
              >
                Start Practice
              </Button>
            ) : (
              <Text>
                Play the note highlighted on the virtual piano below.
                <Tooltip
                  title="The note will be highlighted on the piano keyboard. Click the key to hear how it sounds.">
                  <QuestionCircleOutlined style={{marginLeft: 8}}/>
                </Tooltip>
              </Text>
            )}

            <Space style={{marginTop: 16, justifyContent: 'center', width: '100%'}}>
              <Button
                onClick={handlePreviousExample}
                disabled={currentExample === 0}
              >
                Previous Example
              </Button>
              <Button
                onClick={handleNextExample}
                disabled={currentExample >= currentPracticeExamples.length - 1}
              >
                Next Example
              </Button>
            </Space>
          </Space>
        </Card>
      ) : (
        <Card>
          <Paragraph>No practice examples available for this concept yet.
          </Paragraph>
          <Button type="primary" disabled>No Examples Available</Button>
        </Card>
      )}
    </div>
  )
}

export default TheoryInPractice
