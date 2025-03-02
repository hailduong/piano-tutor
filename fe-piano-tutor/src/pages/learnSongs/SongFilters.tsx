import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, Space, Typography } from 'antd';
import styled from 'styled-components';
import { setFilter, selectFilters, selectSongs } from '../../slices/songLibrarySlice';
import { SongFilter } from '../../models/Song';

const { Text } = Typography;
const { Option } = Select;

const FilterContainer = styled.div`
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
`;

const FilterGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const SongFilters: React.FC = () => {
  const dispatch = useDispatch();
  const currentFilters = useSelector(selectFilters);
  const songs = useSelector(selectSongs);

  // Extract unique genres and difficulty levels from songs
  const [genres, setGenres] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);

  useEffect(() => {
    if (songs.length) {
      // Extract unique genres
      const uniqueGenres = Array.from(
        new Set(songs.filter(song => song.genre).map(song => song.genre))
      ) as string[];

      // Extract unique difficulties
      const uniqueDifficulties = Array.from(
        new Set(songs.map(song => song.difficulty.toString()))
      ) as string[];

      setGenres(uniqueGenres);
      setDifficulties(uniqueDifficulties);
    }
  }, [songs]);

  const handleFilterChange = (filterType: keyof SongFilter, value: string) => {
    // If "All" is selected, remove that filter
    if (value === 'all') {
      const newFilters = { ...currentFilters };
      delete newFilters[filterType];
      dispatch(setFilter(newFilters));
    } else {
      dispatch(setFilter({ ...currentFilters, [filterType]: value }));
    }
  };

  return (
    <FilterContainer>
      <FilterGroup>
        <Text>Genre:</Text>
        <Select
          value={currentFilters.genre || 'all'}
          allowClear
          onChange={(value) => handleFilterChange('genre', value)}
          style={{ width: 150 }}
        >
          <Option value="all">All Genres</Option>
          {genres.map((genre) => (
            <Option key={genre} value={genre}>
              {genre}
            </Option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup>
        <Text>Difficulty:</Text>
        <Select
          allowClear
          value={currentFilters.difficulty || 'all'}
          onChange={(value) => handleFilterChange('difficulty', value)}
          style={{ width: 150 }}
        >
          <Option value="all">All Difficulties</Option>
          {difficulties.map((difficulty) => (
            <Option key={difficulty} value={difficulty}>
              {difficulty}
            </Option>
          ))}
        </Select>
      </FilterGroup>
    </FilterContainer>
  );
};

export default SongFilters;
