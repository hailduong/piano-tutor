import React, {FC, useRef, useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Button, Space, Radio, Tooltip, Divider, Switch} from 'antd'
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
  selectLearnSongState,
  selectSessionProgress
} from 'store/slices/learnSongSlice'
import {updateSongPracticeStats} from 'store/slices/performanceSlice'
import {
  TempoSlider,
  ControlSection,
  SectionTitle,
  ControlsContainer
} from 'pages/LearnSong/styles/LearnSongControls.styled'
import {useMIDIHandler} from 'pages/LearnSong/hooks/useMIDIHandler'

/* Interfaces */
interface ILearnSongControlsProps {
  onTempoChange: (tempo: number) => void;
  onSeek: (position: number) => void;
  currentPosition: number;
  totalNotes: number;
  isPracticing: boolean;
  onTogglePractice: () => void;
  songId: string;
}

const Controls: FC<ILearnSongControlsProps> = (props) => {
  /* Props & Store */
  const {onTempoChange, onSeek, currentPosition, totalNotes, isPracticing, onTogglePractice, songId} = props
  const dispatch = useDispatch()
  const isPlaying = useSelector(selectIsPlaying)
  const learnSongState = useSelector(selectLearnSongState)
  const sessionProgress = useSelector(selectSessionProgress)

  /* Refs */
  // Reference to track count-in beats
  const countRef = useRef<number>(0)
  // Reference to interval timer for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  /* States */
  // UI states
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [countingIn, setCountingIn] = useState(false)

  /* Hooks */
  // MIDI sounds handling
  const {playMetronomeSound} = useMIDIHandler()

  /* Handlers */
  // Play/Pause button handler
  const handlePlayPause = () => {
    // Reset practice mode when using play mode
    if (isPracticing) {
      onTogglePractice() // Call parent toggle instead of setting local state
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
      onTogglePractice() // Call parent toggle instead of setting local state
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
  const handleTogglePractice = () => {
    // Prevent starting if already counting in or playing
    if (countingIn) return

    if (!isPracticing) {
      // Starting practice mode with count-in
      setCountingIn(true)
      countRef.current = 0

      // Calculate beat duration based on current tempo
      const beatDuration = (60 / learnSongState.tempo) * 1000

      // Start count-in with metronome
      intervalRef.current = setInterval(() => {
        if (countRef.current < 4) {
          playMetronomeSound(0.8)
          countRef.current++
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setCountingIn(false)

          // Call parent toggle method instead of setting local state
          onTogglePractice()
        }
      }, beatDuration)
    } else {
      // When stopping practice mode, update stats with latest song info.
      const practiceStats = {
        songId: songId,
        playedNotes: sessionProgress.totalNotes,
        correctNotes: sessionProgress.correctNotes,
        incorrectNotes: sessionProgress.incorrectNotes,
        noteAccuracy: sessionProgress.accuracy * 100
      }
      dispatch(updateSongPracticeStats(practiceStats))
      onTogglePractice()
    }
  }

  /* Effects */
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // If the user refresh the page, reset the practice mode
  useEffect(() => {
    if (isPracticing) {
      onTogglePractice(false)
    }
  }, [])

  /* Render */
  return (
    <ControlsContainer className="shadow">
      {/* Main Controls */}
      <ControlSection>
        {/* Start Practice button */}
        <Button
          type="primary"
          className="me-2"
          icon={countingIn ? <LoadingOutlined/> : isPracticing ? <PauseCircleOutlined/> : <SoundOutlined/>}
          onClick={handleTogglePractice}
          disabled={isPlaying || countingIn}
        >
          {countingIn ? 'Count-in...' : isPracticing ? 'Stop Practice' : 'Start Practice'}
        </Button>

        {/* Restart button */}
        <Button
          icon={<RedoOutlined/>}
          onClick={handleRestart}
          disabled={countingIn}
        />

        <SectionTitle>Playback: </SectionTitle>
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
            icon={<StepForwardOutlined/>}
            onClick={handleNext}
            disabled={currentPosition >= totalNotes - 1 || countingIn}
          />
        </Space>


        {/* Tempo Control with right-aligned settings button */}
        <SectionTitle>Tempo: {learnSongState.tempo} BPM</SectionTitle>
        <TempoSlider
          min={40}
          max={240}
          defaultValue={learnSongState.tempo}
          value={learnSongState.tempo}
          onChange={handleTempoChange}
        />

        {/* Advanced Options */}
        <Button
          className="ms-auto"
          type="text"
          icon={<SettingOutlined/>}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide' : 'Advanced Options'}
        </Button>

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

export default Controls
