import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {Card, Typography, Tag, Button, Space} from 'antd'
import styled from 'styled-components'
import {RightOutlined, InfoCircleOutlined} from '@ant-design/icons'
import {Song} from '../../models/Song'
import SongDetailModal from 'pages/SongLibrary/SongDetailModal'
import {selectSong} from 'store/slices/songLibrarySlice'
import { useDispatch } from 'react-redux'

const {Title, Text} = Typography

interface SongListItemProps {
  song: Song;
}

const StyledCard = styled(Card)`
    margin-bottom: 16px;
    transition: all 0.3s;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
`

const SongContainer = styled.div`
    display: flex;
    align-items: center;
`

const ThumbnailContainer = styled.div`
    width: 100px;
    height: 100px;
    overflow: hidden;
    border-radius: 4px;
    margin-right: 16px;
    background-color: lightgray;
    background-size: cover;
    background-position: center;
`

const Thumbnail = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: lightgray;
`

const PlaceholderThumbnail = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    font-size: 24px;
    font-weight: bold;
`

const DetailsContainer = styled.div`
    flex: 1;
`

const MetaContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 8px;
    gap: 8px;
`

const ActionsContainer = styled.div`
    display: flex;
    gap: 8px;
`

// Styled Link that looks like Ant Button
const StyledLink = styled(Link)`
    &.ant-btn {
        display: inline-flex;
        align-items: center;
    }
`

const SongListItem: React.FC<SongListItemProps> = ({song}) => {
  const dispatch = useDispatch()

  // Function to get difficulty tag color
  const getDifficultyColor = (difficulty: string | number): string => {
    const difficultyStr = difficulty.toString().toLowerCase()

    if (difficultyStr.includes('beginner')) {
      return 'success'
    } else if (difficultyStr.includes('intermediate')) {
      return 'warning'
    } else if (difficultyStr.includes('advanced')) {
      return 'error'
    }

    // Numerical difficulty
    const numDifficulty = parseInt(difficultyStr)
    if (!isNaN(numDifficulty)) {
      if (numDifficulty <= 3) return 'success'
      if (numDifficulty <= 7) return 'warning'
      return 'error'
    }

    return 'default'
  }

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleClick = () => {
    dispatch(selectSong(song.id));
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  return (
    <StyledCard>
      <SongContainer>
        <ThumbnailContainer style={{backgroundImage: song.thumbnailUrl ? `url(${song.thumbnailUrl})` : 'none'}}>
          {!song.thumbnailUrl && (
            <PlaceholderThumbnail>
              {song.title.substring(0, 2)}
            </PlaceholderThumbnail>
          )}
        </ThumbnailContainer>

        <DetailsContainer>
          <Title level={4} style={{margin: 0}}>
            {song.title}
          </Title>

          {song.artist && (
            <Text type="secondary">by {song.artist}</Text>
          )}

          <MetaContainer>
            {song.genre && (
              <Tag>{song.genre}</Tag>
            )}
            <Tag color={getDifficultyColor(song.difficulty)}>
              {song.difficulty}
            </Tag>
          </MetaContainer>
        </DetailsContainer>

        <ActionsContainer>
          <Link to={`/learn-songs/${song.id}`}>
            <Button
              type="primary"
              icon={<RightOutlined/>}
            >
              Learn Song
            </Button>
          </Link>
          <Button
            onClick={handleClick}
            icon={<InfoCircleOutlined/>}
          >
            Details
          </Button>
        </ActionsContainer>
      </SongContainer>
      <SongDetailModal songId={song.id} visible={isModalVisible} onClose={handleClose} />
    </StyledCard>
  )
}

export default SongListItem
