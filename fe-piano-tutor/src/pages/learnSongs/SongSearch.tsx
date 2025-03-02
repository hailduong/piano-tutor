import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'antd';
import styled from 'styled-components';
import { SearchOutlined } from '@ant-design/icons';
import { setSearchQuery, selectSearchQuery } from '../../slices/songLibrarySlice';

const { Search } = Input;

const SearchContainer = styled.div`
  margin-bottom: 16px;
`;

const SongSearch: React.FC = () => {
  const dispatch = useDispatch();
  const currentSearchQuery = useSelector(selectSearchQuery);
  const [inputValue, setInputValue] = useState(currentSearchQuery);

  // Debounce search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      dispatch(setSearchQuery(inputValue));
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [inputValue, dispatch]);

  return (
    <SearchContainer>
      <Search
        placeholder="Search songs by title or artist..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ width: '100%' }}
        allowClear
        prefix={<SearchOutlined />}
      />
    </SearchContainer>
  );
};

export default SongSearch;
