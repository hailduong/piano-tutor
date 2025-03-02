import React, {FC} from 'react'
import {Button, Typography, Card, Space, Row, Col, Statistic, Tabs} from 'antd'
import {useSelector} from 'react-redux'
import {useNavigate, useLocation} from 'react-router-dom'
import {RootState} from 'store'
import {TrophyOutlined, ArrowLeftOutlined, ReloadOutlined, BookOutlined} from '@ant-design/icons'
import MusicTheoryStats from 'components/MusicTheoryStats'

const {Title, Text} = Typography
const {TabPane} = Tabs

type TLocationState = {
  source?: string;
  message?: string;
}

const Results: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as TLocationState

  const {score, lastSessionScore} = useSelector((state: RootState) => state.musicNotes)
  const sourceActivity = state?.source || 'practice'
  const message = state?.message || 'Practice Complete'

  const {accuracyRate, averageTiming, totalNotesPlayed} = useSelector(
    (state: RootState) => state.performance
  )

  /* Render */
  return (
    <div style={{padding: '20px', textAlign: 'center'}}>
      <Card style={{maxWidth: 600, margin: '0 auto', padding: 20}}>
        <TrophyOutlined style={{fontSize: 48, color: '#faad14', marginBottom: 16}}/>
        <Title level={2}>{message}</Title>

        <Tabs defaultActiveKey="performance" centered>
          <TabPane
            tab={<span><TrophyOutlined /> Performance</span>}
            key="performance"
          >
        <Row gutter={16} style={{marginBottom: 20}}>
          <Col span={12}>
            <Card>
              <Statistic
                title="Session Score"
                value={lastSessionScore}
                valueStyle={{color: '#3f8600'}}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title="Total Score"
                value={score}
                valueStyle={{color: '#1677ff'}}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom: 20}}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Accuracy"
                value={accuracyRate.toFixed(1)}
                suffix="%"
                valueStyle={{color: accuracyRate > 80 ? '#3f8600' : '#cf1322'}}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Timing (ms)"
                value={averageTiming.toFixed(0)}
                valueStyle={{color: averageTiming < 300 ? '#3f8600' : '#cf1322'}}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Notes Played"
                value={totalNotesPlayed}
              />
            </Card>
          </Col>
        </Row>
          </TabPane>

          <TabPane
            tab={<span><BookOutlined /> Music Theory</span>}
            key="musicTheory"
          >
            <MusicTheoryStats />
          </TabPane>
        </Tabs>

        <Space style={{marginTop: 20}}>
          {sourceActivity === 'learn-music-notes' && (
            <Button
              type="primary"
              icon={<ReloadOutlined/>}
              block
              onClick={() => navigate('/learn-music-notes')}
            >
              Practice Again
            </Button>
          )}
          {sourceActivity === 'music-theory' && (
            <Button
              type="primary"
              icon={<BookOutlined/>}
              block
              onClick={() => navigate('/music-theory')}
            >
              Return to Music Theory
            </Button>
          )}
          <Button
            icon={<ArrowLeftOutlined/>}
            block
            onClick={() => navigate('/')}
          >
            Return to Main Menu
          </Button>
        </Space>
      </Card>
    </div>
  )
}

export default Results
