import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchSongDetails, selectSongDetails } from '../../slices/songLibrarySlice';
import { Modal, Button, Typography, Spin } from 'antd';
import styled from 'styled-components';

const { Title, Text } = Typography;

const SongDetailContainer = styled.div`
  padding: 20px;
`;

interface SongDetailModalProps {
  songId: string;
  visible: boolean;
  onClose: () => void;
}

const SongDetailModal: React.FC<SongDetailModalProps> = ({ songId, visible, onClose }) => {
  const dispatch = useDispatch();
  const songDetails = useSelector((state: RootState) => selectSongDetails(state, songId));
  const loading = useSelector((state: RootState) => state.songLibrary.loading);

  useEffect(() => {
    if (songId && visible) {
      dispatch(fetchSongDetails(songId));
    }
  }, [dispatch, songId, visible]);

  return (
    <Modal
      title="Song Details"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Back to Library
        </Button>,
        <Button key="learn" type="primary">
          Learn Song
        </Button>,
      ]}
    >
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <SongDetailContainer>
          <Title>{songDetails?.title}</Title>
          <div>{songDetails?.artist}</div>
          <div>{songDetails?.genre}</div>
          <div>Difficulty: {songDetails?.difficulty}</div>
          <div>{songDetails?.description}</div>
        </SongDetailContainer>
      )}
    </Modal>
  );
};

export default SongDetailModal;
