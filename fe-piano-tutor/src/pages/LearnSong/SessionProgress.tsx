import React from 'react'
import {Alert, Row, Col, Tooltip} from 'antd'
import {ProgressContainer} from './styles/LearnSongPage.styled'
import {InfoCircleOutlined} from '@ant-design/icons'
import {useSelector} from 'react-redux'
import {selectCurrentNote} from 'store/slices/learnSongSlice'
import {durationToBeats} from './sheetUtils'

interface SessionProgressProps {
  sessionProgress: {
    notesPlayed: number;
    totalNotes: number;
    correctNotes: number;
    incorrectNotes: number;
    accuracy: number;
  },
  timings: {
    expectedTiming: number;
    actualTiming: number;
    timingAccuracy: number;
    timingDiffInSeconds: number;
  },
  tempo: number;
  vexNotes: any[]; // Add vexNotes prop
}

const SessionProgress: React.FC<SessionProgressProps> = ({sessionProgress, timings, tempo, vexNotes}) => {
  // Get current note from Redux store
  const currentNoteId = useSelector(selectCurrentNote);

  // Calculate note duration based on current note
  const calculateNoteDuration = () => {
    if (!currentNoteId || !vexNotes || vexNotes.length === 0) {
      return (60 / tempo).toFixed(2); // Default to quarter note if no current note
    }

    const currentNoteObj = vexNotes.find(note => note.getAttribute('id') === currentNoteId);
    if (!currentNoteObj) return (60 / tempo).toFixed(2);

    // Get note duration from VexFlow note
    const rawDuration = currentNoteObj.getDuration();
    const noteBeats = durationToBeats(rawDuration);

    // Check if note is dotted (increases duration by 50%)
    const isDotted = currentNoteObj.isDotted();

    // Apply dotted note adjustment
    const adjustedBeats = isDotted ? noteBeats * 1.5 : noteBeats;

    // Calculate duration in seconds
    const durationInSeconds = (60 / tempo) * adjustedBeats;

    return durationInSeconds.toFixed(2);
  }

  // Timing is considered good if within ±0.2 seconds
  const isTimingAccuracyGood = Math.abs(timings.timingDiffInSeconds) <= 0.2;

  // Format timings for display
  const formatTiming = (ms: number) => {
    const seconds = (ms / 1000).toFixed(2);
    return `${seconds}s`;
  }

  // Format timing difference with + or - sign
  const formatTimingDiff = (seconds: number) => {
    const prefix = seconds > 0 ? '+' : ''
    return `${prefix}${seconds?.toFixed(2)}s`
  }

  return (
    <ProgressContainer>
      {/* Session Progress */}
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
      {/* Timing Information */}
      <Row gutter={16} className="mt-3">
        <Col span={6}>
          <Alert
            message={
              <span>
                Expected Timing
                <Tooltip
                  title="When you should have played the note based on the song's tempo. Lower numbers mean earlier in the song, higher numbers mean later.">
                  <InfoCircleOutlined style={{marginLeft: 8}}/>
                </Tooltip>
              </span>
            }
            description={formatTiming(timings.expectedTiming)}
            type="info"
          />
        </Col>
        <Col span={6}>
          <Alert
            message={
              <span>
                Actual Timing
                <Tooltip title="When you actually played the note. This shows your timing within the song.">
                  <InfoCircleOutlined style={{marginLeft: 8}}/>
                </Tooltip>
              </span>
            }
            description={formatTiming(timings.actualTiming)}
            type="info"
          />
        </Col>
        <Col span={6}>
          <Alert
            message={
              <span>
                Timing Difference
                <Tooltip
                  title="How early or late you played the note. Negative numbers (like -0.2s) mean you played early, positive numbers (like +0.2s) mean you played late. Aim to get as close to 0 as possible!">
                  <InfoCircleOutlined style={{marginLeft: 8}}/>
                </Tooltip>
              </span>
            }
            description={formatTimingDiff(timings.timingDiffInSeconds)}
            type={isTimingAccuracyGood ? 'success' : 'error'}
          />
        </Col>
        <Col span={6}>
          <Alert
            message={
              <span>
          Note Duration
          <Tooltip
                  title="How long this specific note should be played based on its type (quarter note, half note, etc.) and the tempo. This helps you understand the rhythm of the song.">
            <InfoCircleOutlined style={{marginLeft: 8}}/>
          </Tooltip>
        </span>
            }
            description={`${calculateNoteDuration()}s`}
            type="info"
          />
        </Col>
      </Row>
    </ProgressContainer>
  )
}

export default SessionProgress
