import {useState, FC, useEffect, memo} from 'react'
import {Button, Typography, Space, Modal} from 'antd'
import {MusicNoteGenerator} from 'utils/musicNoteGenerator'
import SheetMusicRenderer from 'common/SheetMusicRenderer'
import {StaveNote} from 'vexflow'
import {useSelector, useDispatch} from 'react-redux'
import {RootState} from 'store'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import {setLastSessionScore} from 'store/slices/musicNotesSlice'
import {recordNotePerformance, startSession, endSession} from 'store/slices/performanceSlice'

const LearnMusicNotes: FC = memo(() => {
  /* Props & Store */
  const {score} = useSelector((state: RootState) => state.musicNotes)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const musicNoteGeneratorService = new MusicNoteGenerator()
  const { accuracyRate, totalNotesPlayed } = useSelector((state: RootState) => state.performance);

  /* States */
  const [notes, setNotes] = useState<StaveNote[]>([])
  const [level, setLevel] = useState<number | null>(null)
  const [sessionScore, setSessionScore] = useState<number>(0)
  const [pendingLevel, setPendingLevel] = useState<number | null>(null)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [expectedNoteStartTime, setExpectedNoteStartTime] = useState<number | null>(null);

  /* Handlers */
  const handleCorrectNote = (noteAttempted: string, timingDeviation: number) => {
    // Record performance data
    if (notes.length > 0) {
      const expectedNote = notes[0].getKeys()[0]; // Gets the first key from the current note

      dispatch(recordNotePerformance({
        noteAttempted,
        noteExpected: expectedNote,
        isCorrect: true,
        timingDeviation,
        difficultyLevel: level || 1,
        timestamp: Date.now()
      }));

      // Remove the played note
      const newNotes = notes.slice(1);
      setNotes(newNotes);
      setSessionScore(prev => prev + 1);

      // Set timing for next note
      setExpectedNoteStartTime(Date.now());
    }
  };

  // Record incorrect note attempts
  const handleIncorrectNote = (noteAttempted: string, timingDeviation: number) => {
    if (notes.length > 0) {
      const expectedNote = notes[0].getKeys()[0];

      dispatch(recordNotePerformance({
        noteAttempted,
        noteExpected: expectedNote,
        isCorrect: false,
        timingDeviation,
        difficultyLevel: level || 1,
        timestamp: Date.now()
      }));
    }
  };

  // Start a new practice session
  const startNewLevel = (newLevel: number) => {
    setLevel(newLevel);
    const generatedNotes = musicNoteGeneratorService.generateNotes(newLevel);
    setNotes(generatedNotes);
    setSessionScore(0);
    dispatch(startSession());
    setExpectedNoteStartTime(Date.now());
  };

  // End session when complete or stopped
  const handleStopPractice = () => {
    if (level !== null && notes.length > 0) {
      dispatch(setLastSessionScore(sessionScore));
      dispatch(endSession());
      navigate('/results', {
        state: {
          source: 'learn-music-notes',
          message: 'Practice Stopped'
        }
      });
      setNotes([]);
      setLevel(null);
    }
  };

  const handleLevelSelect = (selectedLevel: number) => {
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
      // Save the current session score to Redux before switching levels
      dispatch(setLastSessionScore(sessionScore))
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
      dispatch(setLastSessionScore(sessionScore));
      dispatch(endSession());
      navigate('/results', {
        state: {
          source: 'learn-music-notes',
          message: 'Practice Complete'
        }
      })
    }
  }, [notes, level, navigate, sessionScore, dispatch])

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
              type={level === levelNumber ? "primary" : "default"}
              ghost={level === levelNumber}
              style={{
                fontWeight: level === levelNumber ? 'bold' : 'normal',
                borderColor: level === levelNumber ? '#1677ff' : '',
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
            <SheetMusicRenderer notes={notes} onCorrectNote={handleCorrectNote}/>
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
