export interface Movie {
  title: string;
  rating_mean: number;
  rating_count: number;
  correlation: number;
  poster?: string;
  year?: string;
  imdb_rating?: string;
}

export interface MovieSearchResult {
  Poster: string;
  Year: string;
  imdbRating: string;
} 