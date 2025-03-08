import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store';
import { Card, Typography, Row, Col, Progress, Button, Space, List } from 'antd';
import {
  CheckCircleOutlined,
  RightOutlined,
  UnorderedListOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { setActiveConcept } from 'store/slices/musicTheorySlice';
import styled from 'styled-components';
import {EView} from 'pages/MusicTheory/index'

const { Title, Text, Paragraph } = Typography;

const Toolbar = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
`

const enum ELayout {
  LIST = 'list',
  CARD = 'card'
}

interface ConceptListProps {
  setView: (view: EView) => void;
}

const ConceptList: React.FC<ConceptListProps> = ({ setView }) => {
  const dispatch = useDispatch();
  const { conceptList } = useSelector((state: RootState) => state.musicTheory);
  const performanceQuizzes = useSelector((state: RootState) => state.performance.musicTheory.quizzes);

  const [layout, setLayout] = React.useState<ELayout>(ELayout.LIST);

  const handleConceptSelect = (conceptId: string) => {
    dispatch(setActiveConcept(conceptId));
    setView('conceptDetail');
  };

  return (
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
            const perfQuiz = performanceQuizzes[concept.id];
            const progressPercent = perfQuiz && perfQuiz.total > 0 ? Math.round((perfQuiz.answered / perfQuiz.total) * 100) : 0;
            const isCompleted = progressPercent === 100;
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
            );
          }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {conceptList.map(concept => {
            const perfQuiz = performanceQuizzes[concept.id];
            const progressPercent = perfQuiz && perfQuiz.total > 0 ? Math.round((perfQuiz.answered / perfQuiz.total) * 100) : 0;
            const isCompleted = progressPercent === 100;
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
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default ConceptList;
