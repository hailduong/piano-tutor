import React from 'react';
import { useSelector } from 'react-redux';
import { Empty, Spin, Alert } from 'antd';
import styled from 'styled-components';
import { selectCurrentPageSongs, selectIsLoading, selectError } from '../../store/slices/songLibrarySlice';
import SongListItem from './SongListItem';
import SongPagination from './SongPagination';

const ListContainer = styled.div`
  margin-top: 16px;
`;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 0;
`;

const SongList: React.FC = () => {
  const songs = useSelector(selectCurrentPageSongs);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  // Handle loading state
  if (isLoading) {
    return (
      <CenteredContainer>
        <Spin tip="Loading songs..." size="large" />
      </CenteredContainer>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Alert
        type="error"
        message="Failed to load songs"
        description={error}
        showIcon
        action={
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        }
      />
    );
  }

  // Handle empty songs list
  if (songs.length === 0) {
    return (
      <Empty
        description="No songs found. Try adjusting your filters or search query."
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <ListContainer>
      {songs.map(song => (
        <SongListItem key={song.id} song={song} />
      ))}
      <SongPagination />
    </ListContainer>
  );
};

export default SongList;
