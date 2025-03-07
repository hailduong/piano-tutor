import React, {useState, FC, useEffect, memo} from 'react'
import {Button, Typography, Space, Modal} from 'antd'
import {MusicNoteGenerator, TKeySignature} from 'pages/LearnMusicNotes/utils/musicNoteGenerator'
import SheetMusicRenderer from 'common/SheetMusicRenderer'
import {StaveNote} from 'vexflow'
import {useSelector, useDispatch} from 'react-redux'
import {RootState} from 'store'
import {useNavigate} from 'react-router-dom'
import {setSelectedLevel} from 'store/slices/musicNotesSlice' // Changed import source
import {
  startSession,
  endSession,
  setLastSessionScore,
  increaseMusicNotesTotal
} from 'store/slices/performanceSlice' // Added import
import {setSuggestedNote, setCurrentNote} from 'store/slices/virtualPianoSlice'

const LearnMusicNotes: FC = memo(() => {
  /* Props & Store */
  const {selectedLevel: storedLevel} = useSelector((state: RootState) => state.musicNotes)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const musicNoteGeneratorService = new MusicNoteGenerator()
  const {accuracyRate, totalNotesPlayed} = useSelector((state: RootState) => state.performance)
  const NUMBER_OF_NOTES = useSelector((state: RootState) => state.settings.learnMusicNotes.NUMBER_OF_NOTES)
  const TEMPO = useSelector((state: RootState) => state.settings.learnMusicNotes.TEMPO)


  /* States */
  const [notes, setNotes] = useState<StaveNote[]>([])
  const [level, setLevel] = useState<number | null>(null)
  const [sessionScore, setSessionScore] = useState<number>(0)
  const [pendingLevel, setPendingLevel] = useState<number | null>(null)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [expectedNoteStartTime, setExpectedNoteStartTime] = useState<number | null>(null)
  const [keySignature, setKeySignature] = useState<TKeySignature | undefined>(undefined)
  const [hasIncorrectAttempt, setHasIncorrectAttempt] = useState<boolean>(false)

  /* Handlers */
  const handleCorrectNote = (noteAttempted: string, timingDeviation: number) => {
    // Record performance data
    if (notes.length > 0) {
      const expectedNote = notes[0].getKeys()[0] // Gets the first key from the current note

      // Only increase totalScore if there was no incorrect attempt for this note
      if (!hasIncorrectAttempt) {
        setSessionScore(prev => prev + 1)
      }

      // Remove the played note
      const newNotes = notes.slice(1)
      setNotes(newNotes)

      // Reset incorrect attempt tracking for the next note
      setHasIncorrectAttempt(false)

      // Set timing for next note
      setExpectedNoteStartTime(Date.now())
    }
  }

  // Record incorrect note attempts
  const handleIncorrectNote = (noteAttempted: string, timingDeviation: number) => {
    if (notes.length > 0) {
      // Mark that this note has been attempted incorrectly
      setHasIncorrectAttempt(true)
    }
  }

  // Start a new practice session
  const startNewLevel = (newLevel: number) => {
    // Clear previous session state
    dispatch(setCurrentNote(null))
    dispatch(setSuggestedNote(null))
    setSessionScore(0)
    setHasIncorrectAttempt(false)

    // Set up new session
    setLevel(newLevel)
    dispatch(startSession())

    // Generate new content
    const {notes: generatedNotes, keySignature} = musicNoteGeneratorService.generateNotes(newLevel, NUMBER_OF_NOTES)
    setNotes(generatedNotes)
    setKeySignature(keySignature)
    console.log('keySignature', keySignature)

    // Start timing for the first note
    setExpectedNoteStartTime(Date.now())
  }

  // End session when complete or stopped
  const handleStopPractice = () => {
    if (level !== null && notes.length > 0) {
      dispatch(setLastSessionScore(sessionScore))
      dispatch(endSession())
      navigate('/dashboard', {
        state: {
          source: 'learn-music-notes',
          message: 'Practice Stopped'
        }
      })
      setNotes([])
      setLevel(null)
    }
  }

  const handleLevelSelect = (selectedLevel: number) => {
    // Store the selected level in Redux
    dispatch(setSelectedLevel(selectedLevel))

    // If there's already an active practice with notes remaining
    if (level !== null && notes.length > 0 && sessionScore > 0) {
      setPendingLevel(selectedLevel)
      setIsModalVisible(true)
    } else {
      // No active practice, switch immediately
      startNewLevel(selectedLevel)
    }
  }

  const handleModalConfirm = () => {
    if (pendingLevel !== null) {
      // Save the current session totalScore to Redux before switching levels
      dispatch(setLastSessionScore(sessionScore))
      dispatch(setSelectedLevel(pendingLevel))
      startNewLevel(pendingLevel)
      setPendingLevel(null)
    }
    setIsModalVisible(false)
  }

  const handleModalCancel = () => {
    setPendingLevel(null)
    setIsModalVisible(false)
  }

  /* Effects */
  // Navigate to results page when all notes are played
  useEffect(() => {
    if (level !== null && notes.length === 0 && sessionScore > 0) {
      dispatch(setLastSessionScore(sessionScore))
      dispatch(endSession())
      navigate('/dashboard', {
        state: {
          source: 'learn-music-notes',
          message: 'Practice Complete'
        }
      })
    }
  }, [notes, level, navigate, sessionScore, dispatch])

  // Initialize with the stored level
  useEffect(() => {
    if (level === null && storedLevel) {
      setLevel(storedLevel)

      // Start the level immediately
      startNewLevel(storedLevel)
    }
  }, [level, storedLevel])

  /* Renders */
  return (
    <div style={{padding: '20px'}}>
      <Typography.Title level={2}>Learn Music Notes</Typography.Title>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Typography.Text>
          Select a level to generate the music notes:
        </Typography.Text>
        <Space>
          {[1, 2, 3, 4, 5, 6, 7].map((levelNumber) => (
            <Button
              key={levelNumber}
              type={level === levelNumber ? 'primary' : 'default'}
              ghost={level === levelNumber}
              style={{
                fontWeight: level === levelNumber ? 'bold' : 'normal',
                borderColor: level === levelNumber ? '#1677ff' : ''
              }}
              onClick={() => handleLevelSelect(levelNumber)}
            >
              Level {levelNumber}
            </Button>
          ))}
        </Space>
        {level !== null && (
          <div>
            <Typography.Text>
              <strong>Selected Level: </strong> {level}
            </Typography.Text>
            <div style={{marginBottom: '10px'}}>
              <Typography.Text>
                <strong>Current Session Score: </strong> {sessionScore}
              </Typography.Text>
            </div>
            <SheetMusicRenderer
              notes={notes}
              onCorrectNote={handleCorrectNote}
              onIncorrectNote={handleIncorrectNote}
              tempo={TEMPO}
              keySignature={keySignature || undefined}
            />
            <div style={{marginTop: '20px'}}>
              <Button
                danger
                onClick={handleStopPractice}
              >
                Stop Practice
              </Button>
            </div>
          </div>
        )}
      </Space>

      {/* Confirmation Modal */}
      <Modal
        title="Switch Level Confirmation"
        open={isModalVisible}
        onOk={handleModalConfirm}
        onCancel={handleModalCancel}
        okText="Yes, switch level"
        cancelText="No, continue current practice"
      >
        <p>Switching to a new level will end your current practice session. Your current score will be saved.</p>
        <p>Are you sure you want to switch?</p>
      </Modal>
    </div>
  )
})

export default LearnMusicNotes
