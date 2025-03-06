import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { Card, Typography, Row, Col, Progress, Statistic } from 'antd';
import { BookOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const MusicTheoryStats: FC = () => {
  const navigate = useNavigate();
  const { conceptList, completedConcepts, conceptProgress } = useSelector(
    (state: RootState) => state.musicTheory
  );

  const totalConcepts = conceptList.length;
  const completedCount = completedConcepts.length;
  const completionRate = totalConcepts > 0 ? Math.round((completedCount / totalConcepts) * 100) : 0;

  // Calculate overall progress by averaging individual concept progress
  const overallProgress = Object.values(conceptProgress).length > 0
    ? Math.round(Object.values(conceptProgress).reduce((sum, val) => sum + val, 0) / Object.values(conceptProgress).length)
    : 0;

  return (
    <Card title={<><BookOutlined /> Music Theory Progress</>} style={{ marginTop: 16 }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Statistic
            title="Concepts Completed"
            value={completedCount}
            suffix={`/ ${totalConcepts}`}
            valueStyle={{ color: completionRate > 70 ? '#3f8600' : '#1677ff' }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Overall Progress"
            value={overallProgress}
            suffix="%"
            valueStyle={{ color: overallProgress > 70 ? '#3f8600' : '#1677ff' }}
          />
        </Col>
      </Row>

      <Title level={5}>Topic Breakdown:</Title>
      {conceptList.map(concept => (
        <div key={concept.id} style={{ marginBottom: 8, cursor: 'pointer' }} onClick={() => navigate('/music-theory')}>
          <Text strong>{concept.title}</Text>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Progress
              percent={conceptProgress[concept.id] || 0}
              size="small"
              style={{ flex: 1, marginRight: 8 }}
              status={concept.completed ? "success" : "active"}
            />
            {concept.completed && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
          </div>
        </div>
      ))}
    </Card>
  );
};

export default MusicTheoryStats;
