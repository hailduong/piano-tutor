import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit'
import {Song, SongFilter, SortConfig} from 'models/Song'
import songsData from 'data/songs.json'
import {RootState} from 'store/index'

// Define types for the slice state
interface SongLibraryState {
  songs: Song[];
  filteredSongs: Song[];
  isLoading: boolean;
  error: string | null;
  filters: SongFilter;
  sortConfig: SortConfig;
  searchQuery: string;
  selectedSong: Song | null;
  loading: boolean;
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

// Define the initial state
const initialState: SongLibraryState = {
  songs: [],
  filteredSongs: [],
  isLoading: false,
  error: null,
  filters: {},
  sortConfig: {option: 'title', direction: 'asc'},
  searchQuery: '',
  selectedSong: null,
  loading: false,
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  }
}

export const fetchSongDetails = createAsyncThunk(
  'songLibrary/fetchSongDetails',
  async (songId: string) => {
    const response = await fetch(`/api/songs/${songId}`);
    const data = await response.json();
    return data as Song;
  }
);

// Create async thunks for fetching songs
export const fetchSongs = createAsyncThunk('songLibrary/fetchSongs', async () => {
  // In a real application, this would be an API call
  // For now, we're using the local JSON data
  return songsData.songs as Song[]
})

// Helper function to apply filters, sorting, and search to songs
const applyFiltersAndSort = (
  songs: Song[],
  filters: SongFilter,
  sortConfig: SortConfig,
  searchQuery: string
): Song[] => {
  // Filter songs based on criteria
  let result = songs.filter((song) => {
    // Apply genre filter
    if (filters.genre && song.genre !== filters.genre) {
      return false
    }

    // Apply difficulty filter
    if (filters.difficulty && song.difficulty !== filters.difficulty) {
      return false
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        song.title.toLowerCase().includes(query) ||
        (song.artist && song.artist.toLowerCase().includes(query))
      )
    }

    return true
  })

  // Sort songs based on sort config
  result = [...result].sort((a, b) => {
    const sortOption = sortConfig.option

    // Handle cases where the property might be undefined
    const aValue = a[sortOption] || ''
    const bValue = b[sortOption] || ''

    if (sortConfig.direction === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  return result
}

// Create the slice
const songLibrarySlice = createSlice({
  name: 'songLibrary',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<SongFilter>) => {
      state.filters = {...state.filters, ...action.payload}
      state.filteredSongs = applyFiltersAndSort(
        state.songs,
        state.filters,
        state.sortConfig,
        state.searchQuery
      )
      state.pagination.currentPage = 1 // Reset to first page
      state.pagination.totalItems = state.filteredSongs.length
    },
    setSort: (state, action: PayloadAction<SortConfig>) => {
      state.sortConfig = action.payload
      state.filteredSongs = applyFiltersAndSort(
        state.songs,
        state.filters,
        state.sortConfig,
        state.searchQuery
      )
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.filteredSongs = applyFiltersAndSort(
        state.songs,
        state.filters,
        state.sortConfig,
        state.searchQuery
      )
      state.pagination.currentPage = 1 // Reset to first page
      state.pagination.totalItems = state.filteredSongs.length
    },
    setPaginationPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload
    },
    selectSong: (state, action) => {
      state.selectedSong = state.songs.find(song => song.id === action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch Songs
    builder
      .addCase(fetchSongs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.isLoading = false
        state.songs = action.payload
        state.filteredSongs = applyFiltersAndSort(
          action.payload,
          state.filters,
          state.sortConfig,
          state.searchQuery
        )
        state.pagination.totalItems = state.filteredSongs.length
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch songs'
      })

    // Fetch song details
    builder.addCase(fetchSongDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSongDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedSong = action.payload;
    });
    builder.addCase(fetchSongDetails.rejected, (state) => {
      state.loading = false;
    });
  }
})

// Export actions
export const {setFilter, setSort, setSearchQuery, setPaginationPage} = songLibrarySlice.actions
export const { selectSong } = songLibrarySlice.actions;

// Export selectors
export const selectSongs = (state: { songLibrary: SongLibraryState }) => state.songLibrary.songs
export const selectFilteredSongs = (state: { songLibrary: SongLibraryState }) => state.songLibrary.filteredSongs
export const selectCurrentPageSongs = (state: { songLibrary: SongLibraryState }) => {
  const {currentPage, itemsPerPage} = state.songLibrary.pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return state.songLibrary.filteredSongs.slice(startIndex, endIndex)
}
export const selectPagination = (state: { songLibrary: SongLibraryState }) => state.songLibrary.pagination
export const selectFilters = (state: { songLibrary: SongLibraryState }) => state.songLibrary.filters
export const selectSortConfig = (state: { songLibrary: SongLibraryState }) => state.songLibrary.sortConfig
export const selectSearchQuery = (state: { songLibrary: SongLibraryState }) => state.songLibrary.searchQuery
export const selectIsLoading = (state: { songLibrary: SongLibraryState }) => state.songLibrary.isLoading
export const selectError = (state: { songLibrary: SongLibraryState }) => state.songLibrary.error

export const selectSongDetails = (state: RootState, songId: string) =>
  state.songLibrary.songs.find((song) => song.id === songId);


// Export reducer
const songLibraryReducer = songLibrarySlice.reducer
export default songLibraryReducer
