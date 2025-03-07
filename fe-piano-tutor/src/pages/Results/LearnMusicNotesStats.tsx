// src/pages/Results/LearnMusicNotesStats.tsx
import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const LearnMusicNotesStats: React.FC = () => {
  const { score, lastSessionScore } = useSelector((state: RootState) => state.musicNotes);
  const { accuracyRate, totalNotesPlayed } = useSelector(
    (state: RootState) => state.performance
  );

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Session Score"
              value={lastSessionScore}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total Score"
              value={score}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Accuracy"
              value={accuracyRate.toFixed(1)}
              suffix="%"
              valueStyle={{ color: accuracyRate > 80 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Notes Played"
              value={totalNotesPlayed}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default LearnMusicNotesStats;
