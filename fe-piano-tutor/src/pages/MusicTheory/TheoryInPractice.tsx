import React, {useState, useEffect} from 'react'
import {Card, Typography, Button, Space, Divider, Row, Col, Tooltip} from 'antd'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import {setSuggestedNote, Note} from 'slices/musicNotesSlice'
import {useMusicTheory} from 'contexts/MusicTheoryContext'
import SheetMusicRenderer from 'common/SheetMusicRenderer'
import {QuestionCircleOutlined, SoundOutlined} from '@ant-design/icons'
import musicNoteGenerator from 'services/musicNoteGeneratorService'

const {Title, Paragraph, Text} = Typography

interface TheoryInPracticeProps {
  conceptId: string;
}

// Define practice examples structure for type safety
interface PracticeExample {
  title: string;
  description: string;
  notes: Note[];
  generationOptions?: {
    type: 'scale' | 'chord' | 'interval' | 'basic-notation';
    rootNote?: string;
    octave?: number;
    scaleType?: string;
    chordType?: string;
    intervalType?: string;
    clef?: 'treble' | 'bass';
  }
}

const TheoryInPractice: React.FC<TheoryInPracticeProps> = ({conceptId}) => {
  const dispatch = useDispatch()
  const {history} = useSelector((state: RootState) => state.musicNotes)
  const {setCurrentTheoryConcept} = useMusicTheory()
  const [practiceMode, setPracticeMode] = useState<string>('')
  const [currentExample, setCurrentExample] = useState<number>(0)
  const [practiceExamples, setPracticeExamples] = useState<Record<string, PracticeExample[]>>({})

  // Initialize practice examples using the note generator service
  useEffect(() => {
    const generateExamples = () => {
      const examples: Record<string, PracticeExample[]> = {
        'basic-notation': [
          {
            title: 'Reading Notes in Treble Clef',
            description: 'Play each note as it appears on the staff',
            notes: musicNoteGenerator.generateBasicNotationNotes('treble', { noteCount: 5 }),
            generationOptions: {
              type: 'basic-notation',
              clef: 'treble'
            }
          },
          {
            title: 'Reading Notes in Bass Clef',
            description: 'Play each note as it appears on the staff',
            notes: musicNoteGenerator.generateBasicNotationNotes('bass', { noteCount: 5 }),
            generationOptions: {
              type: 'basic-notation',
              clef: 'bass'
            }
          }
        ],
        'scales-keys': [
          {
            title: 'C Major Scale',
            description: 'Play the C major scale ascending',
            notes: musicNoteGenerator.generateScale('C', 4, 'major'),
            generationOptions: {
              type: 'scale',
              rootNote: 'C',
              octave: 4,
              scaleType: 'major'
            }
          },
          {
            title: 'G Major Scale',
            description: 'Play the G major scale ascending',
            notes: musicNoteGenerator.generateScale('G', 3, 'major'),
            generationOptions: {
              type: 'scale',
              rootNote: 'G',
              octave: 3,
              scaleType: 'major'
            }
          },
          {
            title: 'A Minor Scale',
            description: 'Play the A minor scale ascending',
            notes: musicNoteGenerator.generateScale('A', 4, 'minor'),
            generationOptions: {
              type: 'scale',
              rootNote: 'A',
              octave: 4,
              scaleType: 'minor'
            }
          }
        ],
        'chords': [
          {
            title: 'C Major Chord',
            description: 'Play the notes of a C major chord',
            notes: musicNoteGenerator.generateChord('C', 4, 'major'),
            generationOptions: {
              type: 'chord',
              rootNote: 'C',
              octave: 4,
              chordType: 'major'
            }
          },
          {
            title: 'G Major Chord',
            description: 'Play the notes of a G major chord',
            notes: musicNoteGenerator.generateChord('G', 3, 'major'),
            generationOptions: {
              type: 'chord',
              rootNote: 'G',
              octave: 3,
              chordType: 'major'
            }
          },
          {
            title: 'A Minor Chord',
            description: 'Play the notes of an A minor chord',
            notes: musicNoteGenerator.generateChord('A', 4, 'minor'),
            generationOptions: {
              type: 'chord',
              rootNote: 'A',
              octave: 4,
              chordType: 'minor'
            }
          },
          {
            title: 'D Minor 7th Chord',
            description: 'Play the notes of a D minor 7th chord',
            notes: musicNoteGenerator.generateChord('D', 4, 'minor7'),
            generationOptions: {
              type: 'chord',
              rootNote: 'D',
              octave: 4,
              chordType: 'minor7'
            }
          }
        ],
        'intervals': [
          {
            title: 'Major Third Interval',
            description: 'Play the two notes that form a major third',
            notes: musicNoteGenerator.generateInterval('C', 4, 'major3'),
            generationOptions: {
              type: 'interval',
              rootNote: 'C',
              octave: 4,
              intervalType: 'major3'
            }
          },
          {
            title: 'Perfect Fifth Interval',
            description: 'Play the two notes that form a perfect fifth',
            notes: musicNoteGenerator.generateInterval('C', 4, 'perfect5'),
            generationOptions: {
              type: 'interval',
              rootNote: 'C',
              octave: 4,
              intervalType: 'perfect5'
            }
          },
          {
            title: 'Perfect Fourth Interval',
            description: 'Play the two notes that form a perfect fourth',
            notes: musicNoteGenerator.generateInterval('F', 4, 'perfect4'),
            generationOptions: {
              type: 'interval',
              rootNote: 'F',
              octave: 4,
              intervalType: 'perfect4'
            }
          }
        ],
        'rhythm-basics': [
          {
            title: 'Quarter Notes',
            description: 'Play these quarter notes in 4/4 time',
            notes: [
              {note: 'C', length: 'q', timestamp: Date.now(), octave: 4},
              {note: 'D', length: 'q', timestamp: Date.now() + 100, octave: 4},
              {note: 'E', length: 'q', timestamp: Date.now() + 200, octave: 4},
              {note: 'F', length: 'q', timestamp: Date.now() + 300, octave: 4},
            ],
            generationOptions: {
              type: 'basic-notation',
              clef: 'treble'
            }
          },
          {
            title: 'Half Notes',
            description: 'Play these half notes in 4/4 time',
            notes: [
              {note: 'G', length: 'h', timestamp: Date.now(), octave: 4},
              {note: 'A', length: 'h', timestamp: Date.now() + 100, octave: 4},
            ],
            generationOptions: {
              type: 'basic-notation',
              clef: 'treble'
            }
          }
        ]
      };

      setPracticeExamples(examples);
    };

    generateExamples();
  }, []);

  // Get current examples based on concept ID
  const currentPracticeExamples = practiceExamples[conceptId] || []
  const example = currentPracticeExamples[currentExample] || null

  useEffect(() => {
    // Set the current theory concept when this component mounts
    setCurrentTheoryConcept(conceptId)

    // Clean up when component unmounts
    return () => setCurrentTheoryConcept('')
  }, [conceptId, setCurrentTheoryConcept])

  // Reset practice mode when example changes
  useEffect(() => {
    setPracticeMode('')
  }, [currentExample])

  // Handle starting practice session
  const handleStartPractice = () => {
    setPracticeMode('play')
    // Suggest the first note to play
    if (example && example.notes.length > 0) {
      dispatch(setSuggestedNote(example.notes[0]))
    }
  }

  // Generate new examples of the same type
  const handleRegenerateExample = () => {
    if (!example || !example.generationOptions) return;

    const options = example.generationOptions;
    let newNotes: Note[] = [];

    // Generate new notes based on the example type
    switch (options.type) {
      case 'scale':
        newNotes = musicNoteGenerator.generateScale(
          options.rootNote || 'C',
          options.octave || 4,
          options.scaleType as any || 'major'
        );
        break;
      case 'chord':
        newNotes = musicNoteGenerator.generateChord(
          options.rootNote || 'C',
          options.octave || 4,
          options.chordType as any || 'major'
        );
        break;
      case 'interval':
        newNotes = musicNoteGenerator.generateInterval(
          options.rootNote || 'C',
          options.octave || 4,
          options.intervalType as any || 'perfect5'
        );
        break;
      case 'basic-notation':
        newNotes = musicNoteGenerator.generateBasicNotationNotes(
          options.clef || 'treble',
          { noteCount: 5 }
        );
        break;
    }

    // Update the current example with new notes
    const updatedExamples = { ...practiceExamples };
    if (updatedExamples[conceptId] && updatedExamples[conceptId][currentExample]) {
      updatedExamples[conceptId][currentExample].notes = newNotes;
      setPracticeExamples(updatedExamples);
    }

    // Reset practice mode
    setPracticeMode('');
  }

  // Navigation between examples
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

  // Handle each time a correct note is played
  const handleCorrectNote = (noteIndex: number) => {
    // If there are more notes in the sequence, suggest the next one
    if (example && noteIndex < example.notes.length - 1) {
      dispatch(setSuggestedNote(example.notes[noteIndex + 1]))
    } else {
      // End of sequence
      dispatch(setSuggestedNote(null))
      setPracticeMode('complete')
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
            ) : practiceMode === 'play' ? (
              <Text>
                Play the note highlighted on the virtual piano below.
                <Tooltip
                  title="The note will be highlighted on the piano keyboard. Click the key to hear how it sounds.">
                  <QuestionCircleOutlined style={{marginLeft: 8}}/>
                </Tooltip>
              </Text>
            ) : (
              <Button
                type="primary"
                onClick={handleRegenerateExample}
                block
              >
                Try Another Example
              </Button>
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
