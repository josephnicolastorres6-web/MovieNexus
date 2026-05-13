export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
}

export interface MovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}
