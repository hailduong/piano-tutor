export interface Song {
  id: string;
  title: string;
  artist?: string;
  genre?: string;
  difficulty: number | string;
  thumbnailUrl?: string;
  sheetMusicUrl: string;
}

export type SongFilter = {
  genre?: string;
  difficulty?: string | number;
};

export type SortOption = 'title' | 'artist' | 'difficulty';
export type SortDirection = 'asc' | 'desc';

export type SortConfig = {
  option: SortOption;
  direction: SortDirection;
};
