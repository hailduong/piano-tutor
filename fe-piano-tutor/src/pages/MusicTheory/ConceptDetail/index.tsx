import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {RootState} from 'store'
import {Typography, Button, Tabs, List, Radio, Space, Card, message, Modal, Result} from 'antd'
import {
  BookOutlined,
  ArrowLeftOutlined,
  QuestionCircleOutlined,
  SoundOutlined
} from '@ant-design/icons'
import {updateQuizForConcept, markConceptCompleted} from 'store/slices/performanceSlice'
import {ConceptDetail as StyledConceptDetail, QuizContainer} from 'pages/MusicTheory/styles/MusicTheory.styled'
import TheoryInPractice from 'pages/MusicTheory/ConceptDetail/TheoryInPractice'
import musicTheoryConceptDetail from 'pages/MusicTheory/data/musicTheoryConceptDetail'
import {EView} from 'pages/MusicTheory/index'
import Quiz from 'pages/MusicTheory/ConceptDetail/Quiz'

const {Title, Text, Paragraph} = Typography
const {TabPane} = Tabs

interface ConceptDetailProps {
  setView: (view: EView) => void;
}

const ConceptDetail: React.FC<ConceptDetailProps> = ({setView}) => {
  const {conceptList, quizzes, activeConceptId} = useSelector(
    (state: RootState) => state.musicTheory
  )

  // Get active concept
  const activeConcept = conceptList.find(c => c.id === activeConceptId)
  const activeQuiz = activeConceptId ? quizzes[activeConceptId] : []


  const [activeTab, setActiveTab] = useState<string>('learn')

  const handleBackToList = () => {
    setView(EView.CONCEPT_LIST)
  }

  if (!activeConcept) return null

  return (
    <StyledConceptDetail style={{padding: '20px'}}>
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

        {/* Learn */}
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

        {/* Quiz */}
        <TabPane
          tab={
            <span>
              <QuestionCircleOutlined/>
              <span>Quiz</span>
            </span>
          }
          key="quiz"
        >
          <Quiz
            activeConcept={activeConcept}
            activeQuiz={activeQuiz}
            activeConceptId={activeConceptId || ''}
            setActiveTab={setActiveTab}
          />
        </TabPane>

        {/* Practice */}
        <TabPane
          tab={<span><SoundOutlined/><span>Practice</span></span>}
          key="practice"
        >
          <TheoryInPractice conceptId={activeConcept.id}/>
        </TabPane>
      </Tabs>

    </StyledConceptDetail>
  )
}

export default ConceptDetail
