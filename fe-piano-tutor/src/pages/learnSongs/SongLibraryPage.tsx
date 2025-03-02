import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongs, selectSortConfig, setSort } from '../../slices/songLibrarySlice';
import { SortOption, SortDirection } from '../../models/Song';
import SongSearch from './SongSearch';
import SongFilters from './SongFilters';
import SongList from './SongList';

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
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="song-library-page">
      <div className="song-library-header">
        <h1>Browse Songs</h1>
        <p>Discover and select songs to learn on the piano</p>
      </div>

      <div className="song-library-tools">
        <SongSearch />
        <SongFilters />
      </div>

      <div className="song-library-sort">
        <span>Sort by:</span>
        <button
          onClick={() => handleSortChange('title')}
          className={sortConfig.option === 'title' ? 'active' : ''}
        >
          Title {renderSortIcon('title')}
        </button>
        <button
          onClick={() => handleSortChange('artist')}
          className={sortConfig.option === 'artist' ? 'active' : ''}
        >
          Artist {renderSortIcon('artist')}
        </button>
        <button
          onClick={() => handleSortChange('difficulty')}
          className={sortConfig.option === 'difficulty' ? 'active' : ''}
        >
          Difficulty {renderSortIcon('difficulty')}
        </button>
      </div>

      <SongList />
    </div>
  );
};

export default SongLibraryPage;
