import React, {FC, useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {RootState} from 'store'
import {Card, Typography, Row, Col, Progress, Button, Space, Tabs, List, Radio, message, Modal, Result} from 'antd'
import {
  BookOutlined,
  CheckCircleOutlined,
  RightOutlined,
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  SoundOutlined,
  AppstoreOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'
import type {QuizQuestion} from 'store/slices/musicTheorySlice'
import { setActiveConcept, setActiveQuiz, toggleTheoryAnnotations, setCurrentTheoryConcept } from 'store/slices/musicTheorySlice'
import {updateQuizForConcept, markConceptCompleted, setTotalConcepts} from 'store/slices/performanceSlice'
import styled from 'styled-components'
import TheoryInPractice from 'pages/MusicTheory/TheoryInPractice'
import musicTheoryConceptDetail from 'pages/MusicTheory/data/musicTheoryConceptDetail'
import {ConceptDetail, QuizContainer} from './styles/MusicTheory.styled'

const {Title, Text, Paragraph} = Typography
export const {TabPane} = Tabs

const Toolbar = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
`

const enum EView {
  CONCEPT_LIST = 'conceptList',
  CONCEPT_DETAIL = 'conceptDetail'
}

const enum ELayout {
  LIST = 'list',
  CARD = 'card'
}

const MusicTheory: FC = () => {
  const dispatch = useDispatch()
  const { conceptList, quizzes, activeConceptId } = useSelector(
    (state: RootState) => state.musicTheory
  )
  // Get performance quiz stats from performance slice.
  const performanceQuizzes = useSelector((state: RootState) => state.performance.musicTheory.quizzes)

  // Dispatch setTotalConcepts when conceptList changes.
  useEffect(() => {
    dispatch(setTotalConcepts(conceptList.length))
  }, [dispatch, conceptList])

  // Local states
  const [view, setView] = useState<EView>(EView.CONCEPT_LIST)
  const [activeTab, setActiveTab] = useState<string>('learn')
  const [layout, setLayout] = useState<ELayout>(ELayout.LIST)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false)
  const [showResultModal, setShowResultModal] = useState<boolean>(false)
  const [quizScore, setQuizScore] = useState<number>(0)

  // Get active concept
  const activeConcept = conceptList.find(c => c.id === activeConceptId)
  // Get quiz questions for active concept
  const activeQuiz = activeConceptId ? quizzes[activeConceptId] : []

  const handleConceptSelect = (conceptId: string) => {
    dispatch(setActiveConcept(conceptId))
    setView(EView.CONCEPT_DETAIL)
    setActiveTab('learn')
    setQuizAnswers({})
    setQuizSubmitted(false)
  }

  const handleBackToList = () => {
    setView(EView.CONCEPT_LIST)
    dispatch(setActiveConcept(''))
  }

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answer
    })
  }

  const handleSubmitQuiz = () => {
    if (!activeConceptId) return

    const allQuestionsAnswered = activeQuiz.every(q => quizAnswers[q.id])

    if (!allQuestionsAnswered) {
      message.warning('Please answer all questions before submitting.')
      return
    }

    let correctAnswers = 0

    activeQuiz.forEach(question => {
      const userAnswer = quizAnswers[question.id]
      if (userAnswer === question.correctAnswer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / activeQuiz.length) * 100)
    setQuizScore(score)
    setQuizSubmitted(true)

    dispatch(updateQuizForConcept({ conceptId: activeConceptId, answered: correctAnswers, total: activeQuiz.length }))
    if (score >= 70) {
      dispatch(markConceptCompleted(activeConceptId))
    }
    setShowResultModal(true)
  }

  const handleResetQuiz = () => {
    setQuizAnswers({})
    setQuizSubmitted(false)
  }

  const renderConceptList = () => (
    <div style={{ padding: '20px' }}>
      <div className="d-flex">
        <Title level={1}>Music Theory</Title>
        <Toolbar className="ms-auto">
          <Button
            className="me-2"
            type={layout === ELayout.LIST ? 'primary' : 'default'}
            icon={<UnorderedListOutlined/>}
            onClick={() => setLayout(ELayout.LIST)}
          />
          <Button
            type={layout === ELayout.CARD ? 'primary' : 'default'}
            icon={<AppstoreOutlined/>}
            onClick={() => setLayout(ELayout.CARD)}
          />
        </Toolbar>
      </div>
      <Paragraph>
        Explore these fundamental music theory concepts to enhance your piano playing skills.
        Each topic includes learning materials and a quiz to test your knowledge.
      </Paragraph>

      {layout === ELayout.LIST ? (
        <List
          itemLayout="vertical"
          dataSource={conceptList}
          renderItem={concept => {
            const perfQuiz = performanceQuizzes[concept.id]
            const progressPercent = perfQuiz && perfQuiz.total > 0 ? Math.round((perfQuiz.answered / perfQuiz.total) * 100) : 0
            const isCompleted = progressPercent === 100
            return (
            <Card className="mb-3">
              <List.Item
                actions={[
                  <Space key="action">
                      {isCompleted ? (
                      <CheckCircleOutlined style={{color: '#52c41a'}}/>
                    ) : (
                      <RightOutlined/>
                    )}
                      <Button type="default" size={'small'}>
                        {isCompleted ? 'Completed' : 'Start Learning'}
                      </Button>
                  </Space>
                ]}
                onClick={() => handleConceptSelect(concept.id)}
              >
                <List.Item.Meta
                  title={<strong>{concept.titlePrefix}: {concept.title}</strong>}
                  description={
                    <>
                      <div>{concept.description}</div>
                      <Progress
                          percent={progressPercent}
                        size="small"
                          status={isCompleted ? 'success' : 'active'}
                      />
                    </>
                  }
                />
              </List.Item>
            </Card>
            )
          }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {conceptList.map(concept => {
            const perfQuiz = performanceQuizzes[concept.id]
            const progressPercent = perfQuiz && perfQuiz.total > 0 ? Math.round((perfQuiz.answered / perfQuiz.total) * 100) : 0
            const isCompleted = progressPercent === 100
            return (
            <Col xs={24} sm={12} md={8} key={concept.id}>
              <Card
                onClick={() => handleConceptSelect(concept.id)}
                actions={[
                  <Space>
                      {isCompleted ? (
                      <CheckCircleOutlined style={{color: '#52c41a'}}/>
                    ) : (
                      <RightOutlined/>
                    )}
                      <Text>{isCompleted ? 'Completed' : 'Start Learning'}</Text>
                  </Space>
                ]}
              >
                <Card.Meta
                  title={concept.title}
                  description={
                    <div>
                      <div style={{minHeight: '50px'}}>{concept.description}</div>
                      <Progress
                          percent={progressPercent}
                        size="small"
                          status={isCompleted ? 'success' : 'active'}
                        style={{marginTop: '10px'}}
                      />
                    </div>
                  }
                />
              </Card>
            </Col>
            )
          })}
        </Row>
      )}
    </div>
  )

  const renderConceptDetail = () => {
    if (!activeConcept) return null

    return (
      <ConceptDetail style={{padding: '20px'}}>
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
                <span>Learn</span>
              </span>
            }
            key="learn"
          >
            {musicTheoryConceptDetail[activeConcept.id] || (
              <Paragraph>Content for this concept is coming soon!</Paragraph>
            )}
          </TabPane>

          <TabPane
            tab={
              <span>
                <QuestionCircleOutlined/>
                <span>Quiz</span>
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
                    <List.Item key={question.id}>
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
            tab={<span><SoundOutlined/><span>Practice</span></span>}
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
      </ConceptDetail>
    )
  }

  return view === EView.CONCEPT_LIST ? renderConceptList() : renderConceptDetail()
}

export default MusicTheory
