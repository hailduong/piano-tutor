import React, {FC} from 'react'
import {useSelector} from 'react-redux'
import {RootState} from 'store'
import {Card, Typography, Row, Col, Progress, Statistic} from 'antd'
import {BookOutlined, CheckCircleOutlined} from '@ant-design/icons'
import {useNavigate} from 'react-router-dom'

const {Title, Text} = Typography
const formatConceptId = (conceptId: string): string => {
  return conceptId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const MusicTheoryStats: FC = () => {
  const navigate = useNavigate()
  // Get music theory data from the performance slice.
  const {conceptsCompleted, totalConcepts, quizzes} = useSelector(
    (state: RootState) => state.performance.musicTheory
  )

  // Calculate completion rate percentage.
  const completionRate = totalConcepts > 0 ? Math.round((conceptsCompleted / totalConcepts) * 100) : 0

  // Compute overall quiz progress as the average percentage of each concept.
  const quizValues = Object.values(quizzes)
  const overallProgress =
    quizValues.length > 0
      ? Math.round(
        quizValues.reduce(
          (sum, quiz) => sum + (quiz.total > 0 ? (quiz.answered / quiz.total) * 100 : 0),
          0
        ) / quizValues.length
      )
      : 0

  return (
    <Card title={<> <BookOutlined/> Music Theory Performance </>} style={{marginTop: 16}}>
      <Row gutter={16} style={{marginBottom: 16}}>
        <Col span={12}>
          <Statistic
            title="Concepts Completed"
            value={conceptsCompleted}
            suffix={`/ ${totalConcepts}`}
            valueStyle={{color: completionRate > 70 ? '#3f8600' : '#1677ff'}}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Overall Quiz Progress"
            value={overallProgress}
            suffix="%"
            valueStyle={{color: overallProgress > 70 ? '#3f8600' : '#1677ff'}}
          />
        </Col>
      </Row>

      {Object.keys(quizzes).length > 0 && <Title level={5}>Topic Breakdown:</Title>}
      {Object.keys(quizzes).map((conceptId, index) => {
        const {answered, total} = quizzes[conceptId]
        const progressPercent = total > 0 ? Math.round((answered / total) * 100) : 0
        return (
          <div
            key={conceptId}
            className="mt-4"
            style={{marginBottom: 8, cursor: 'pointer'}}
            onClick={() => navigate('/music-theory')}
          >
            <Text strong>{`Lesson: ${formatConceptId(conceptId)}`}</Text>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <Progress
                percent={progressPercent}
                size="small"
                style={{flex: 1, marginRight: 8}}
                status={progressPercent === 100 ? 'success' : 'active'}
              />
              {progressPercent === 100 && <CheckCircleOutlined style={{color: '#52c41a'}}/>}
            </div>
            <Text>{`${answered} out of ${total} quizzes answered correctly`}</Text>
          </div>
        )
      })}
    </Card>
  )
}

export default MusicTheoryStats
