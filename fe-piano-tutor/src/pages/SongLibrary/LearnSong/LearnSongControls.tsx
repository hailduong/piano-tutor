import React, {FC, useRef, useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Button, Space, Radio, Tooltip, Divider, Switch, Row, Col} from 'antd'
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
  RedoOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  SoundOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import {
  pauseSession,
  resumeSession,
  startPlaying,
  updateSettings,
  seekToPosition,
  selectIsPlaying,
  selectLearnSongState
} from 'store/slices/learnSongSlice'
import {
  TempoSlider,
  ControlSection,
  SectionTitle,
  ControlsContainer
} from 'pages/SongLibrary/LearnSong/styles/LearnSongControls.styled'
import {useMIDIHandler} from './hooks/useMIDIHandler'

/* Interfaces */
interface ILearnSongControlsProps {
  onTempoChange: (tempo: number) => void;
  onSeek: (position: number) => void;
  currentPosition: number;
  totalNotes: number;
  onStartPractice?: () => void;
}

const LearnSongControls: FC<ILearnSongControlsProps> = (props) => {
  /* Props & Store */
  const {onTempoChange, onSeek, currentPosition, totalNotes, onStartPractice} = props
  const dispatch = useDispatch()
  const isPlaying = useSelector(selectIsPlaying)
  const learnSongState = useSelector(selectLearnSongState)

  /* Refs */
  // Reference to track count-in beats
  const countRef = useRef<number>(0)
  // Reference to interval timer for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  /* States */
  // UI states
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [countingIn, setCountingIn] = useState(false)

  // Mode states
  const [isPracticing, setIsPracticing] = useState(false)

  /* Hooks */
  // MIDI sounds handling
  const {playMetronomeSound} = useMIDIHandler()

  /* Effects */
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  /* Handlers */
  // Play/Pause button handler
  const handlePlayPause = () => {
    // Reset practice mode when using play mode
    if (isPracticing) {
      setIsPracticing(false)
    }

    if (isPlaying) {
      dispatch(pauseSession())
    } else {
      if (learnSongState.isPaused) {
        dispatch(resumeSession())
      } else {
        dispatch(startPlaying())
      }
    }
  }

  // Restart button handler
  const handleRestart = () => {
    // Stop playback first
    if (isPlaying) {
      dispatch(pauseSession())
    }

    // Reset position to beginning
    dispatch(seekToPosition(0))
    onSeek(0)

    // Reset practice mode if active
    if (isPracticing) {
      setIsPracticing(false)
    }
  }

  // Next note button handler
  const handleNext = () => {
    if (currentPosition < totalNotes - 1) {
      const newPosition = currentPosition + 1
      dispatch(seekToPosition(newPosition))
      onSeek(newPosition)
    }
  }

  // Previous note button handler
  const handlePrevious = () => {
    if (currentPosition > 0) {
      const newPosition = currentPosition - 1
      dispatch(seekToPosition(newPosition))
      onSeek(newPosition)
    }
  }

  // Tempo slider handler
  const handleTempoChange = (value: number) => {
    dispatch(updateSettings({tempo: value}))
    onTempoChange(value)
  }

  // Metronome toggle handler
  const handleMetronomeToggle = (checked: boolean) => {
    dispatch(updateSettings({metronomeEnabled: checked}))
  }

  // Mode change handler (practice vs play)
  const handleModeChange = (e: any) => {
    const mode = e.target.value
    dispatch(updateSettings({mode}))
  }

  // Start practice button handler with metronome count-in
  const handleStartPractice = () => {
    // Prevent starting if already counting in or playing
    if (countingIn || isPlaying) return

    // Set counting in state and reset counter
    setCountingIn(true)
    countRef.current = 0

    // Calculate beat duration based on current tempo
    const beatDuration = (60 / learnSongState.tempo) * 1000

    // Start count-in with metronome
    intervalRef.current = setInterval(() => {
      // TODO: should retrieve the number of count beats based on the time signature
      if (countRef.current < 4) {
        // Play metronome sound for each beat
        playMetronomeSound(0.8)
        countRef.current++
      } else {
        // After 4 beats, clear interval and enter practice mode
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        setCountingIn(false)

        // Enter practice mode instead of auto-playing
        setIsPracticing(true)

        // Notify parent component to set up practice mode
        if (onStartPractice) {
          onStartPractice()
        }
      }
    }, beatDuration)
  }

  /* Render */
  return (
    <ControlsContainer>
      {/* Main Controls */}
      <ControlSection>
        <SectionTitle>Playback Controls</SectionTitle>
        <Space size="middle">
          {/* Previous button */}
          <Button
            icon={<StepBackwardOutlined/>}
            onClick={handlePrevious}
            disabled={currentPosition <= 0 || countingIn}
          />

          {/* Play/Pause button */}
          <Button
            type="primary"
            shape="circle"
            icon={isPlaying ? <PauseCircleOutlined/> : <PlayCircleOutlined/>}
            onClick={handlePlayPause}
            size="large"
            disabled={countingIn}
          />

          {/* Next button */}
          <Button
            className='me-4'
            icon={<StepForwardOutlined/>}
            onClick={handleNext}
            disabled={currentPosition >= totalNotes - 1 || countingIn}
          />

          {/* Start Practice button */}
          <Button
            type="primary"
            icon={countingIn ? <LoadingOutlined/> : <SoundOutlined/>}
            onClick={handleStartPractice}
            disabled={isPlaying || countingIn}
          >
            {countingIn ? 'Count-in...' : 'Start Practice'}
          </Button>

          {/* Restart button */}
          <Button
            icon={<RedoOutlined/>}
            onClick={handleRestart}
            disabled={countingIn}
          />
        </Space>

        {/* Mode indicator */}
        {isPracticing && (
          <div style={{marginTop: 8}}>
            <span style={{color: '#1890ff'}}>Practice Mode: Play the notes yourself</span>
          </div>
        )}
      </ControlSection>

      {/* Tempo Control with right-aligned settings button */}
      <ControlSection>
        <Row justify="space-between" align="middle">
          <Col>
            <SectionTitle>Tempo: {learnSongState.tempo} BPM</SectionTitle>
          </Col>
          <Col>
            <Button
              type="text"
              icon={<SettingOutlined/>}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Advanced Options'}
            </Button>
          </Col>
        </Row>

        <TempoSlider
          min={40}
          max={240}
          defaultValue={learnSongState.tempo}
          value={learnSongState.tempo}
          onChange={handleTempoChange}
        />
      </ControlSection>

      {/* Advanced Controls (conditional) */}
      {showAdvanced && (
        <ControlSection>
          <SectionTitle>Advanced Settings</SectionTitle>
          <Space direction="vertical">
            <div>
              <span style={{marginRight: 10}}>Metronome:</span>
              <Switch
                checked={learnSongState.metronomeEnabled}
                onChange={handleMetronomeToggle}
              />
              <Tooltip title="Enable metronome during playback">
                <InfoCircleOutlined style={{marginLeft: 8}}/>
              </Tooltip>
            </div>

            <Divider style={{margin: '12px 0'}}/>

            <div>
              <span style={{marginRight: 10}}>Mode:</span>
              <Radio.Group
                value={learnSongState.mode}
                onChange={handleModeChange}
                buttonStyle="solid"
              >
                <Radio.Button value="practice">Practice</Radio.Button>
                <Radio.Button value="play">Play</Radio.Button>
                <Radio.Button value="learn">Learn</Radio.Button>
              </Radio.Group>
            </div>
          </Space>
        </ControlSection>
      )}
    </ControlsContainer>
  )
}

export default LearnSongControls
