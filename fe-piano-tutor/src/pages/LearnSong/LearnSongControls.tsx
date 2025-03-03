import React, {FC, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Slider, Button, Space, Radio, Tooltip, Divider, Switch, Row, Col} from 'antd'
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
  RedoOutlined,
  SettingOutlined,
  InfoCircleOutlined
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
} from 'pages/LearnSong/styles/LearnSongControls.styled'

interface ILearnSongControlsProps {
  onTempoChange: (tempo: number) => void;
  onSeek: (position: number) => void;
  currentPosition: number;
  totalNotes: number;
}

const LearnSongControls: FC<ILearnSongControlsProps> = (props) => {
  /* Props & Store */
  const {onTempoChange, onSeek, currentPosition, totalNotes} = props
  const dispatch = useDispatch()
  const isPlaying = useSelector(selectIsPlaying)
  const learnSongState = useSelector(selectLearnSongState)

  /* States */
  const [showAdvanced, setShowAdvanced] = useState(false)

  /* Handlers */
  const handlePlayPause = () => {
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

  const handleRestart = () => {
    // Reset to beginning and pause
    dispatch(pauseSession())
    dispatch(seekToPosition(0))
    onSeek(0)
  }

  const handleNext = () => {
    const nextPosition = Math.min(currentPosition + 1, totalNotes - 1)
    dispatch(seekToPosition(nextPosition))
    onSeek(nextPosition)
  }

  const handlePrevious = () => {
    const prevPosition = Math.max(currentPosition - 1, 0)
    dispatch(seekToPosition(prevPosition))
    onSeek(prevPosition)
  }

  const handleTempoChange = (value: number) => {
    dispatch(updateSettings({tempo: value}))
    onTempoChange(value)
  }

  const handleMetronomeToggle = (checked: boolean) => {
    dispatch(updateSettings({metronomeEnabled: checked}))
  }

  const handleHighlightToggle = (checked: boolean) => {
    dispatch(updateSettings({highlightEnabled: checked}))
  }

  const handleModeChange = (e: any) => {
    dispatch(updateSettings({mode: e.target.value}))
  }

  /* Render */
  return (
    <ControlsContainer>
      {/* Main Controls */}
      <Row gutter={16} align="middle">
        <Col>
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<StepBackwardOutlined/>}
              onClick={handlePrevious}
              disabled={currentPosition <= 0}
            />
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={isPlaying ? <PauseCircleOutlined/> : <PlayCircleOutlined/>}
              onClick={handlePlayPause}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<StepForwardOutlined/>}
              onClick={handleNext}
              disabled={currentPosition >= totalNotes - 1}
            />
            <Button
              icon={<RedoOutlined/>}
              onClick={handleRestart}
            >
              Restart
            </Button>
          </Space>
        </Col>

        <Col flex="auto">
          <Space>
            <span>Tempo:</span>
            <TempoSlider
              min={40}
              max={200}
              value={learnSongState.tempo}
              onChange={handleTempoChange}
              tooltip={{formatter: (value) => `${value} BPM`}}
            />
            <span>{learnSongState.tempo} BPM</span>
          </Space>
        </Col>

        <Col>
          <Button
            type="text"
            icon={<SettingOutlined/>}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Settings' : 'Settings'}
          </Button>
        </Col>
      </Row>

      {/* Advanced Controls */}
      {showAdvanced && (
        <>
          <Divider style={{margin: '12px 0'}}/>

          <Row gutter={[24, 16]}>
            <Col span={8}>
              <ControlSection>
                <SectionTitle>Learning Mode</SectionTitle>
                <Radio.Group
                  value={learnSongState.mode}
                  onChange={handleModeChange}
                  buttonStyle="solid"
                >
                  <Space direction="vertical">
                    <Tooltip title="Follow along with highlighted notes">
                      <Radio.Button value="guided">
                        Guided <InfoCircleOutlined/>
                      </Radio.Button>
                    </Tooltip>
                    <Tooltip title="Practice freely without assessment">
                      <Radio.Button value="practice">
                        Practice <InfoCircleOutlined/>
                      </Radio.Button>
                    </Tooltip>
                    <Tooltip title="Play through for assessment and scoring">
                      <Radio.Button value="assessment">
                        Assessment <InfoCircleOutlined/>
                      </Radio.Button>
                    </Tooltip>
                  </Space>
                </Radio.Group>
              </ControlSection>
            </Col>

            <Col span={8}>
              <ControlSection>
                <SectionTitle>Visual Aids</SectionTitle>
                <Space direction="vertical">
                  <div>
                    <Switch
                      checked={learnSongState.highlightEnabled}
                      onChange={handleHighlightToggle}
                    /> {' '}
                    Note Highlighting
                  </div>
                  <div>
                    <Switch
                      checked={learnSongState.metronomeEnabled}
                      onChange={handleMetronomeToggle}
                    /> {' '}
                    Metronome
                  </div>
                </Space>
              </ControlSection>
            </Col>

            <Col span={8}>
              <ControlSection>
                <SectionTitle>Progress</SectionTitle>
                <div>Current Note: {currentPosition + 1} / {totalNotes}</div>
                <Slider
                  min={0}
                  max={totalNotes - 1}
                  value={currentPosition}
                  onChange={(value) => {
                    dispatch(seekToPosition(value))
                    onSeek(value)
                  }}
                  tooltip={{
                    formatter: (value) => `Note ${value + 1}`
                  }}
                />
              </ControlSection>
            </Col>
          </Row>
        </>
      )}
    </ControlsContainer>
  )
}

export default LearnSongControls
