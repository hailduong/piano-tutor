import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {RootState} from 'store'
import {Card, Typography, Row, Col, Progress, Button, Space, List, Divider} from 'antd'
import {CheckCircleOutlined, RightOutlined, UnorderedListOutlined, AppstoreOutlined} from '@ant-design/icons'
import {setActiveConcept} from 'store/slices/musicTheorySlice'
import styled from 'styled-components'
import {EView} from 'pages/MusicTheory/index'
import {EMusicTheoryConceptLevel} from './data/musicTheoryConceptList'

const {Title, Text, Paragraph} = Typography

const Toolbar = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
`

const LevelHeading = styled(Title)`
    margin-top: 16px;
    margin-bottom: 16px;
    text-transform: capitalize;
`

const enum ELayout {
  LIST = 'list',
  CARD = 'card'
}

interface ConceptListProps {
  setView: (view: EView) => void;
}

// Helper function to get display name for level
const getLevelDisplayName = (level: string): string => {
  switch (level) {
    case EMusicTheoryConceptLevel.Beginner:
      return 'Beginner Level'
    case EMusicTheoryConceptLevel.Elementary:
      return 'Elementary Level'
    case EMusicTheoryConceptLevel.Intermediate:
      return 'Intermediate Level'
    case EMusicTheoryConceptLevel.Advanced:
      return 'Advanced Level'
    case EMusicTheoryConceptLevel.Professional:
      return 'Professional Level'
    default:
      return level.charAt(0).toUpperCase() + level.slice(1)
  }
}

// Ordering for levels
const levelOrder = [
  EMusicTheoryConceptLevel.Beginner,
  EMusicTheoryConceptLevel.Elementary,
  EMusicTheoryConceptLevel.Intermediate,
  EMusicTheoryConceptLevel.Advanced,
  EMusicTheoryConceptLevel.Professional
]

const ConceptList: React.FC<ConceptListProps> = ({setView}) => {
  const dispatch = useDispatch()
  const {conceptList} = useSelector((state: RootState) => state.musicTheory)
  const performanceQuizzes = useSelector((state: RootState) => state.performance.musicTheory.quizzes)

  const [layout, setLayout] = React.useState<ELayout>(ELayout.LIST)

  const handleConceptSelect = (conceptId: string) => {
    dispatch(setActiveConcept(conceptId))
    setView(EView.CONCEPT_DETAIL)
  }

  // Group concepts by level
  const conceptsByLevel = React.useMemo(() => {
    const grouped = conceptList.reduce((acc, concept) => {
      if (!acc[concept.level]) {
        acc[concept.level] = []
      }
      acc[concept.level].push(concept)
      return acc
    }, {} as Record<string, typeof conceptList>)

    // Sort levels by predetermined order
    return levelOrder
      .filter(level => grouped[level])
      .map(level => ({
        level,
        displayName: getLevelDisplayName(level),
        concepts: grouped[level]
      }))
  }, [conceptList])

  return (
    <div style={{padding: '20px'}}>
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
        <div>
          {conceptsByLevel.map((levelGroup, index) => (
            <div key={levelGroup.level}>
              <LevelHeading level={3}>{index + 1 + '. ' + levelGroup.displayName}</LevelHeading>
              <List
                itemLayout="vertical"
                dataSource={levelGroup.concepts}
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
            </div>
          ))}
        </div>
      ) : (
        <div>
          {conceptsByLevel.map(levelGroup => (
            <div key={levelGroup.level}>
              <LevelHeading level={3}>{levelGroup.displayName}</LevelHeading>
              <Row gutter={[16, 16]}>
                {levelGroup.concepts.map(concept => {
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
              <Divider/>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ConceptList
