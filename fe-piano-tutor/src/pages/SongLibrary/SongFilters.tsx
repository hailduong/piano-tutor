import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Select, Typography} from 'antd'
import styled from 'styled-components'
import {setFilter, selectFilters, selectSongs} from 'store/slices/songLibrarySlice'
import {SongFilter} from 'models/Song'

const {Text} = Typography
const {Option} = Select

const FilterContainer = styled.div`
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
`

const FilterGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

const SongFilters: React.FC = () => {
  /* Store */
  const dispatch = useDispatch()
  const currentFilters = useSelector(selectFilters)
  const songs = useSelector(selectSongs)

  /* States */
  // Extract unique genres and difficulty levels from songs
  const [genres, setGenres] = useState<string[]>([])
  const [difficulties, setDifficulties] = useState<string[]>([])

  /* Handlers */
  const handleFilterChange = (filterType: keyof SongFilter, value: string) => {
    // If "All" is selected, remove that filter
    if (value === 'all') {
      const newFilters = {...currentFilters}
      delete newFilters[filterType]
      dispatch(setFilter(newFilters))
    } else {
      dispatch(setFilter({...currentFilters, [filterType]: value}))
    }
  }

  /* Effects */
  useEffect(() => {
    if (songs.length) {
      // Extract unique genres
      const uniqueGenres = Array.from(
        new Set(songs.filter(song => song.genre).map(song => song.genre))
      ) as string[]

      // Extract unique difficulties
      const uniqueDifficulties = Array.from(
        new Set(songs.map(song => song.difficulty.toString()))
      ) as string[]

      setGenres(uniqueGenres)
      setDifficulties(uniqueDifficulties)
    }
  }, [songs])

  /* Render */
  return (
    <FilterContainer>
      <FilterGroup>
        <Text>Genre:</Text>
        <Select
          value={currentFilters.genre || undefined}
          placeholder="All Genres"
          allowClear
          onChange={(value) => handleFilterChange('genre', value)}
          style={{width: 150}}
        >
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
          value={currentFilters.difficulty || undefined}
          placeholder="All Difficulties"
          allowClear
          onChange={(value) => handleFilterChange('difficulty', value)}
          style={{width: 150}}
        >
          {difficulties.map((difficulty) => (
            <Option key={difficulty} value={difficulty}>
              {difficulty}
            </Option>
          ))}
        </Select>
      </FilterGroup>
    </FilterContainer>
  )
}

export default SongFilters
