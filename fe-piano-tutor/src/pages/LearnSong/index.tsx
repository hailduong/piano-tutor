import React, {useEffect, useState, useRef} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {Typography, Spin, Button, Row, Col, Alert, Card, Modal} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'

import {
  initializeSession,
  loadSheetMusicThunk,
  selectLearnSongState,
  selectSessionProgress,
  selectIsPlaying,
  pauseSession,
  setCurrentNote,
  setNextNote,
  seekToPosition,
  selectIsPracticing,
  togglePracticing
} from 'store/slices/learnSongSlice'

import {selectSongDetails} from 'store/slices/songLibrarySlice'
import {RootState} from 'store'
import MusicSheetContainer from 'pages/LearnSong/MusicSheetContainer'
import LearnSongControls from 'pages/LearnSong/LearnSongControls'
import {IPerformanceSummary} from 'pages/LearnSong/types/LearnSong'
import {ProgressContainer, LearnSongContainer} from 'pages/LearnSong/styles/LearnSongPage.styled'

const {Title, Text} = Typography

const LearnSongPage: React.FC = () => {
  /* Refs */
  const sessionStartTimeRef = useRef<number | null>(null)

  /* Props & Store */
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {songId} = useParams<{ songId: string }>()

  const learnSongState = useSelector(selectLearnSongState)
  const sessionProgress = useSelector(selectSessionProgress)
  const isPlaying = useSelector(selectIsPlaying)
  const isPracticing = useSelector(selectIsPracticing) // Use Redux state
  const songDetails = useSelector((state: RootState) =>
    songId ? selectSongDetails(state, songId) : null
  )

  /* States */
  const [loading, setLoading] = useState(true)
  const [showSummary, setShowSummary] = useState(false)
  const [performanceSummary, setPerformanceSummary] = useState<IPerformanceSummary | null>(null)

  /* Effects */
  // Initialize the learning session when the component mounts
  useEffect(() => {
    const initializeAndLoadSheetMusic = async () => {
      if (songId) {
        try {
          dispatch(initializeSession({songId}))
          await dispatch(loadSheetMusicThunk(songId))
          setLoading(false)
        } catch (err) {
          console.error('Failed to load sheet music:', err)
          setLoading(false)
        }
      } else {
        // Redirect back to song library if no song ID is provided
        navigate('/learn-songs')
      }
    }

    initializeAndLoadSheetMusic()
  }, [dispatch, songId])

  // Track session time
  useEffect(() => {
    if (isPlaying && !sessionStartTimeRef.current) {
      sessionStartTimeRef.current = Date.now()
    } else if (!isPlaying && sessionStartTimeRef.current) {
      // Update session time when paused
      const elapsedTime = Date.now() - sessionStartTimeRef.current
      sessionStartTimeRef.current = null
      // We could dispatch an action here to update total session time
    }
  }, [isPlaying])

  /* Handlers */
  const handleTempoChange = (tempo: number) => {
    // Additional handling if needed beyond what's in the controls
  }

  const handleSeek = (position: number) => {
    // Set the current note based on position
    const noteId = `note-${position}`
    dispatch(setCurrentNote(noteId))

    // Set the next note
    const nextNoteId = `note-${position + 1}`
    dispatch(setNextNote(nextNoteId))
  }

  const handleSessionComplete = () => {
    // Stop playing
    dispatch(pauseSession())

    // End practice mode if active
    if (isPracticing) {
      handleEndPractice()
    }

    // Generate performance summary
    const summary: IPerformanceSummary = {
      accuracy: learnSongState.sessionProgress.accuracy,
      totalNotes: learnSongState.sessionProgress.totalNotes,
      correctNotes: learnSongState.sessionProgress.correctNotes,
      incorrectNotes: learnSongState.sessionProgress.incorrectNotes,
      averageTiming: 0, // TODO Calculate from noteTimings if needed
      elapsedTime: Date.now() - (learnSongState.startTime || Date.now()),
      songId: songId || '',
      date: new Date().toISOString()
    }

    setPerformanceSummary(summary)
    setShowSummary(true)
  }

  const handleTogglePractice = (shouldPractice?: boolean) => {
    const newPracticingState = shouldPractice !== undefined ? shouldPractice : !isPracticing
    dispatch(togglePracticing(newPracticingState))

    if (newPracticingState) {
      // Reset to initial position if needed
      if (sessionProgress.currentPosition > 0) {
        dispatch(seekToPosition(0))
        handleSeek(0)
      }
    }
  }

  const handleEndPractice = () => {
    dispatch(togglePracticing(false))
  }

  /* Render */
  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <Spin tip="Loading song details and sheet music..." size="large"/>
      </div>
    )
  }

  return (
    <LearnSongContainer>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{marginBottom: 16}}>
        <Col>
          <Button
            type="text"
            icon={<ArrowLeftOutlined/>}
            onClick={() => navigate('/learn-songs')}
            style={{marginRight: 8}}
          />
          <Title level={2} style={{display: 'inline', marginRight: 16}}>
            {songDetails?.title}
          </Title>
          <Text type="secondary" style={{fontSize: 16}}>
            {songDetails?.artist}
          </Text>
        </Col>
        <Col>
          <Text>
            Difficulty: <Text strong>{songDetails?.difficulty}</Text>
          </Text>
        </Col>
      </Row>

      {/* Controls */}
      <LearnSongControls
        onTempoChange={handleTempoChange}
        onSeek={handleSeek}
        currentPosition={sessionProgress.currentPosition}
        totalNotes={sessionProgress.totalNotes}
        isPracticing={isPracticing}
        onTogglePractice={handleTogglePractice}
      />

      {/* Sheet Music */}
      <MusicSheetContainer
        songId={songId || null}
        sheetMusicXMLString={learnSongState.sheetMusic}
        tempo={learnSongState.tempo}
        isPlaying={isPlaying}
        currentPosition={sessionProgress.currentPosition}
        onSongComplete={handleSessionComplete}
      />

      {/* Progress Information */}
      <ProgressContainer>
        <Row gutter={16}>
          <Col span={6}>
            <Alert
              message="Notes Played"
              description={`${sessionProgress.notesPlayed} / ${sessionProgress.totalNotes}`}
              type="info"
            />
          </Col>
          <Col span={6}>
            <Alert
              message="Correct Notes"
              description={sessionProgress.correctNotes || '0'}
              type="success"
            />
          </Col>
          <Col span={6}>
            <Alert
              message="Incorrect Notes"
              description={sessionProgress.incorrectNotes || '0'}
              type="error"
            />
          </Col>
          <Col span={6}>
            <Alert
              message="Accuracy"
              description={`${(sessionProgress.accuracy * 100).toFixed(1)}%`}
              type="warning"
            />
          </Col>
        </Row>
      </ProgressContainer>

      {/* Performance Summary Modal */}
      <Modal
        title="Practice Session Complete"
        open={showSummary}
        onOk={() => navigate('/learn-songs')}
        onCancel={() => setShowSummary(false)}
        okText="Return to Library"
        cancelText="Practice Again"
      >
        {performanceSummary && (
          <Card>
            <Title level={4}>Your Performance</Title>
            <p><strong>Accuracy:</strong> {(performanceSummary.accuracy * 100).toFixed(1)}%</p>
            <p><strong>Notes:</strong> {performanceSummary.totalNotes}</p>
            <p><strong>Correct:</strong> {performanceSummary.correctNotes}</p>
            <p><strong>Incorrect:</strong> {performanceSummary.incorrectNotes}</p>
            <p>
              <strong>Time:</strong> {Math.floor(performanceSummary.elapsedTime / 60000)}m {Math.floor((performanceSummary.elapsedTime % 60000) / 1000)}s
            </p>
          </Card>
        )}
      </Modal>
    </LearnSongContainer>
  )
}

export default LearnSongPage
