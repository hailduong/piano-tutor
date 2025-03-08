import React, {useState} from 'react'
import {List, Radio, Button, Space, Typography, Card, message} from 'antd'
import {QuizContainer} from 'pages/MusicTheory/styles/MusicTheory.styled'
import {useDispatch} from 'react-redux'
import {updateQuizForConcept, markConceptCompleted} from 'store/slices/performanceSlice'
import ResultModal from './ResultModal'

const {Title, Paragraph, Text} = Typography

interface QuizProps {
  activeConcept: any;
  activeQuiz: any[];
  setActiveTab: (tab: string) => void;
  activeConceptId: string;
}

const Quiz: React.FC<QuizProps> = (props) => {

  /* Props */
  const {
    activeConcept,
    activeQuiz,
    setActiveTab,
    activeConceptId
  } = props

  /* Store */
  const dispatch = useDispatch()


  /* States */
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false)
  const [showResultModal, setShowResultModal] = useState<boolean>(false)
  const [quizScore, setQuizScore] = useState<number>(0)

  /* Handlers */
  // Handle quiz answer
  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answer
    })
  }

  // Handle submit quiz
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

    dispatch(updateQuizForConcept({conceptId: activeConceptId, answered: correctAnswers, total: activeQuiz.length}))
    if (score >= 70) {
      dispatch(markConceptCompleted(activeConceptId))
    }
    setShowResultModal(true)
  }

  // Handle reset quiz
  const handleResetQuiz = () => {
    setQuizAnswers({})
    setQuizSubmitted(false)
  }

  /* Render */
  return (
    <QuizContainer>
      <Title level={3}>Test Your Knowledge</Title>
      <Paragraph>
        Answer these questions to test your understanding of {activeConcept.title}.
      </Paragraph>

      {activeQuiz.length > 0 ? (
        <List
          itemLayout="vertical"
          dataSource={activeQuiz}
          renderItem={(question, index) => (
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

      <ResultModal
        showResultModal={showResultModal}
        quizScore={quizScore}
        setShowResultModal={setShowResultModal}
        setActiveTab={setActiveTab}
        handleResetQuiz={handleResetQuiz}
      />
    </QuizContainer>
  )
}

export default Quiz
