// ResultModal.tsx in ConceptDetail folder
import React from 'react';
import { Modal, Result, Button } from 'antd';

interface ResultModalProps {
  showResultModal: boolean;
  quizScore: number;
  setShowResultModal: (show: boolean) => void;
  setActiveTab: (tab: string) => void;
  handleResetQuiz: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
                                                   showResultModal,
                                                   quizScore,
                                                   setShowResultModal,
                                                   setActiveTab,
                                                   handleResetQuiz
                                                 }) => {
  return (
    <Modal
      open={showResultModal}
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
              setShowResultModal(false);
              setActiveTab('learn');
            }}
          >
            Review Material
          </Button>,
          <Button
            key="reset"
            type="primary"
            onClick={() => {
              setShowResultModal(false);
              handleResetQuiz();
            }}
          >
            Try Again
          </Button>
        ]}
      />
    </Modal>
  );
};

export default ResultModal;
