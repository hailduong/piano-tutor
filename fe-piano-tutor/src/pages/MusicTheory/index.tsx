import React, {FC, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {RootState} from 'store'
import {Card, Typography, Row, Col, Progress, Button, Space, Tabs, List, Radio, message, Modal, Result} from 'antd'
import {
  BookOutlined,
  CheckCircleOutlined,
  RightOutlined,
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  SoundOutlined
} from '@ant-design/icons'
import type {QuizQuestion} from 'slices/musicTheorySlice'
import {setActiveConcept, answerQuizQuestion, markConceptAsCompleted, resetQuiz} from 'slices/musicTheorySlice'
import styled from 'styled-components'
import TheoryInPractice from 'pages/MusicTheory/TheoryInPractice'
import musicTheoryConcept from 'pages/MusicTheory/data/musicTheoryConcept'

const {Title, Text, Paragraph} = Typography
const {TabPane} = Tabs

// Styled components
const ConceptCard = styled(Card)<{ completed: boolean }>`
    cursor: pointer;
    transition: all 0.3s;
    border: ${({completed}) => (completed ? '2px solid #52c41a' : '1px solid #d9d9d9')};

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-5px);
    }
`

const ConceptImage = styled.div<{ imgSrc?: string }>`
    width: 100%;
    height: 150px;
    border-radius: 4px;
    margin-bottom: 16px;
    background: ${props => props.imgSrc ? `url(${props.imgSrc}) center/cover no-repeat` : '#f0f2f5'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 18px;
`;

const QuizContainer = styled.div`
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
    margin-top: 20px;
`

// Placeholder content for concepts


const MusicTheory: FC = () => {
  const dispatch = useDispatch()
  const {concepts, quizzes, activeConceptId, completedConcepts, conceptProgress} = useSelector(
    (state: RootState) => state.musicTheory
  )

  // Local states
  const [view, setView] = useState<'list' | 'concept'>('list')
  const [activeTab, setActiveTab] = useState<string>('learn')
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false)
  const [showResultModal, setShowResultModal] = useState<boolean>(false)
  const [quizScore, setQuizScore] = useState<number>(0)

  // Get active concept
  const activeConcept = concepts.find(c => c.id === activeConceptId)
  // Get quiz questions for active concept
  const activeQuiz = activeConceptId ? quizzes[activeConceptId] : []

  // Handler to select a concept
  const handleConceptSelect = (conceptId: string) => {
    dispatch(setActiveConcept(conceptId))
    setView('concept')
    setActiveTab('learn')
    setQuizAnswers({})
    setQuizSubmitted(false)
  }

  // Handler to go back to concept list
  const handleBackToList = () => {
    setView('list')
    dispatch(setActiveConcept(''))
  }

  // Handler for quiz answer selection
  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answer
    })
  }

  // Handler to submit quiz
  const handleSubmitQuiz = () => {
    if (!activeConceptId) return

    // Check if all questions have been answered
    const allQuestionsAnswered = activeQuiz.every(q => quizAnswers[q.id])

    if (!allQuestionsAnswered) {
      message.warning('Please answer all questions before submitting.')
      return
    }

    // Calculate score
    let correctAnswers = 0

    activeQuiz.forEach(question => {
      const userAnswer = quizAnswers[question.id]
      if (userAnswer === question.correctAnswer) {
        correctAnswers++
      }

      // Save answers to Redux
      dispatch(answerQuizQuestion({
        conceptId: activeConceptId,
        questionId: question.id,
        answer: userAnswer
      }))
    })

    const score = Math.round((correctAnswers / activeQuiz.length) * 100)
    setQuizScore(score)
    setQuizSubmitted(true)

    // Show result modal
    setShowResultModal(true)

    // Mark concept as completed if score is 70% or higher
    if (score >= 70) {
      dispatch(markConceptAsCompleted(activeConceptId))
    }
  }

  // Handler to reset quiz
  const handleResetQuiz = () => {
    if (!activeConceptId) return

    dispatch(resetQuiz(activeConceptId))
    setQuizAnswers({})
    setQuizSubmitted(false)
  }

  // Render concept list view
  const renderConceptList = () => (
    <div style={{padding: '20px'}}>
      <Title level={2}>Music Theory</Title>
      <Paragraph>
        Explore these fundamental music theory concepts to enhance your piano playing skills.
        Each topic includes learning materials and a quiz to test your knowledge.
      </Paragraph>

      <Row gutter={[16, 16]}>
        {concepts.map(concept => (
          <Col xs={24} sm={12} md={8} key={concept.id}>
            <ConceptCard
              completed={concept.completed}
              onClick={() => handleConceptSelect(concept.id)}
              actions={[
                <Space>
                  {concept.completed ? (
                    <CheckCircleOutlined style={{color: '#52c41a'}}/>
                  ) : (
                    <RightOutlined/>
                  )}
                  <Text>{concept.completed ? 'Completed' : 'Start Learning'}</Text>
                </Space>
              ]}
            >
              {concept.image ? (
                <ConceptImage/>
              ) : (
                <ConceptImage>
                  <span>{concept.title}</span>
                </ConceptImage>
              )}
              <Card.Meta
                title={concept.title}
                description={
                  <div>
                    <Text>{concept.description}</Text>
                    <Progress
                      percent={conceptProgress[concept.id] || 0}
                      size="small"
                      status={concept.completed ? 'success' : 'active'}
                      style={{marginTop: '10px'}}
                    />
                  </div>
                }
              />
            </ConceptCard>
          </Col>
        ))}
      </Row>
    </div>
  )

  // Render concept detail view
  const renderConceptDetail = () => {
    if (!activeConcept) return null

    return (
      <div style={{padding: '20px'}}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined/>}
          onClick={handleBackToList}
          style={{marginBottom: '16px'}}
        >
          Back to All Concepts
        </Button>

        <Title level={2}>{activeConcept.title}</Title>

        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          <TabPane
            tab={
              <span>
                <BookOutlined/>
                Learn
              </span>
            }
            key="learn"
          >
            {musicTheoryConcept[activeConcept.id] || (
              <Paragraph>Content for this concept is coming soon!</Paragraph>
            )}
          </TabPane>

          <TabPane
            tab={
              <span>
                <QuestionCircleOutlined/>
                Quiz
              </span>
            }
            key="quiz"
          >
            <QuizContainer>
              <Title level={3}>Test Your Knowledge</Title>
              <Paragraph>
                Answer these questions to test your understanding of {activeConcept.title}.
              </Paragraph>

              {activeQuiz.length > 0 ? (
                <List
                  itemLayout="vertical"
                  dataSource={activeQuiz}
                  renderItem={(question: QuizQuestion, index) => (
                    <List.Item>
                      <Card>
                        <Title level={4}>Question {index + 1}</Title>
                        <Paragraph>{question.question}</Paragraph>

                        <Radio.Group
                          onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                          value={quizAnswers[question.id]}
                          disabled={quizSubmitted}
                        >
                          <Space direction="vertical" style={{width: '100%'}}>
                            {question.options.map(option => (
                              <Radio key={option} value={option} style={{marginBottom: '8px'}}>
                                {option}
                              </Radio>
                            ))}
                          </Space>
                        </Radio.Group>

                        {quizSubmitted && (
                          <div style={{marginTop: '12px'}}>
                            <Text
                              type={quizAnswers[question.id] === question.correctAnswer ? 'success' : 'danger'}
                              strong
                            >
                              {quizAnswers[question.id] === question.correctAnswer
                                ? 'Correct!'
                                : `Incorrect. The correct answer is: ${question.correctAnswer}`}
                            </Text>
                          </div>
                        )}
                      </Card>
                    </List.Item>
                  )}
                />
              ) : (
                <Paragraph>Quiz questions for this concept are coming soon!</Paragraph>
              )}

              {activeQuiz.length > 0 && (
                <div style={{marginTop: '20px', textAlign: 'center'}}>
                  <Space>
                    <Button
                      type="primary"
                      onClick={handleSubmitQuiz}
                      disabled={quizSubmitted}
                    >
                      Submit Answers
                    </Button>
                    <Button
                      onClick={handleResetQuiz}
                      disabled={!quizSubmitted}
                    >
                      Reset Quiz
                    </Button>
                  </Space>
                </div>
              )}
            </QuizContainer>
          </TabPane>
          <TabPane
            tab={<span><SoundOutlined/>Practice</span>}
            key="practice"
          >
            <TheoryInPractice conceptId={activeConcept.id}/>
          </TabPane>
        </Tabs>

        {/* Result Modal */}
        <Modal
          visible={showResultModal}
          title="Quiz Results"
          footer={null}
          onCancel={() => setShowResultModal(false)}
          centered
        >
          <Result
            status={quizScore >= 70 ? 'success' : 'warning'}
            title={`Your Score: ${quizScore}%`}
            subTitle={
              quizScore >= 70
                ? 'Congratulations! You\'ve passed this quiz.'
                : 'You might want to review this topic and try again.'
            }
            extra={[
              <Button
                key="back"
                onClick={() => {
                  setShowResultModal(false)
                  setActiveTab('learn')
                }}
              >
                Review Material
              </Button>,
              <Button
                key="reset"
                type="primary"
                onClick={() => {
                  setShowResultModal(false)
                  handleResetQuiz()
                }}
              >
                Try Again
              </Button>
            ]}
          />
        </Modal>
      </div>
    )
  }

  return view === 'list' ? renderConceptList() : renderConceptDetail()
}

export default MusicTheory
