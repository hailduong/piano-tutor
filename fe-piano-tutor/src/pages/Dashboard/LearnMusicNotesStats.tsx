// src/pages/Dashboard/LearnMusicNotesStats.tsx
import React from 'react'
import {Row, Col, Card, Statistic} from 'antd'
import {useSelector} from 'react-redux'
import {RootState} from 'store'

const LearnMusicNotesStats: React.FC = () => {
  const {totalScore, lastSessionScore, totalNotes} = useSelector((state: RootState) => state.performance.musicNotes) // Only get totalScore from musicNotes
  const accuracyRate = totalNotes > 0 ? (totalScore / totalNotes) * 100 : 0

  return (
    <>
      <Row gutter={16} style={{marginBottom: 20}}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Last Session Score"
              value={lastSessionScore}
              valueStyle={{color: '#3f8600'}}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total Score"
              value={totalScore}
              valueStyle={{color: '#1677ff'}}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{marginBottom: 20}}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Accuracy"
              value={accuracyRate.toFixed(1)}
              suffix="%"
              valueStyle={{color: accuracyRate > 80 ? '#3f8600' : '#cf1322'}}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Notes Played"
              value={totalNotes}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default LearnMusicNotesStats
