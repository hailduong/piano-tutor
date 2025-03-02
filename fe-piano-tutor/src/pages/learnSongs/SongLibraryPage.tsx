import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button, Space, Divider, Row, Col } from 'antd';
import styled from 'styled-components';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { fetchSongs, selectSortConfig, setSort } from '../../slices/songLibrarySlice';
import { SortOption, SortDirection } from '../../models/Song';
import SongSearch from './SongSearch';
import SongFilters from './SongFilters';
import SongList from './SongList';

const { Title, Paragraph } = Typography;

const PageContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
`;

const HeaderContainer = styled.div`
    text-align: center;
    margin-bottom: 32px;
`;

const SortContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
`;

const SortText = styled(Paragraph)`
    margin-right: 16px;
    margin-bottom: 0;
`;

const SongLibraryPage: React.FC = () => {
  const dispatch = useDispatch();
  const sortConfig = useSelector(selectSortConfig);

  // Fetch songs when component mounts
  useEffect(() => {
    dispatch(fetchSongs());
  }, [dispatch]);

  // Handle sort change
  const handleSortChange = (option: SortOption) => {
    // If clicking the same option, toggle direction
    if (option === sortConfig.option) {
      const newDirection: SortDirection = sortConfig.direction === 'asc' ? 'desc' : 'asc';
      dispatch(setSort({ option, direction: newDirection }));
    } else {
      // Default to ascending for new sort option
      dispatch(setSort({ option, direction: 'asc' }));
    }
  };

  // Render sort icon
  const renderSortIcon = (option: SortOption) => {
    if (sortConfig.option !== option) {
      return null;
    }
    return sortConfig.direction === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />;
  };

  return (
    <PageContainer>
      <HeaderContainer>
        <Title level={2}>Browse Songs</Title>
        <Paragraph>Discover and select songs to learn on the piano</Paragraph>
      </HeaderContainer>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <SongSearch />
        </Col>

        <Col xs={24}>
          <SongFilters />
        </Col>
      </Row>

      <Divider />

      <SortContainer>
        <SortText>Sort by:</SortText>
        <Space>
          <Button
            type={sortConfig.option === 'title' ? 'primary' : 'default'}
            onClick={() => handleSortChange('title')}
          >
            Title {renderSortIcon('title')}
          </Button>

          <Button
            type={sortConfig.option === 'artist' ? 'primary' : 'default'}
            onClick={() => handleSortChange('artist')}
          >
            Artist {renderSortIcon('artist')}
          </Button>

          <Button
            type={sortConfig.option === 'difficulty' ? 'primary' : 'default'}
            onClick={() => handleSortChange('difficulty')}
          >
            Difficulty {renderSortIcon('difficulty')}
          </Button>
        </Space>
      </SortContainer>

      <SongList />
    </PageContainer>
  );
};

export default SongLibraryPage;
