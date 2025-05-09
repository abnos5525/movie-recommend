import { Divider, Empty, notification, Spin } from "antd";
import axios from "axios";
import { useState } from "react";
import MovieCard from "./MovieCard";
import MovieSearch from "./MovieSearch";
import { Movie } from "../../types/movie";
import { findBestMovieMatch } from "../../services/moviePosterService";

const Home = () => {
  const [movieName, setMovieName] = useState("");
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const handleSelect = async (value: string) => {
    setMovieName(value);
    setRecommendationsLoading(true);
    try {
      const res = await axios.post<Movie[]>("http://127.0.0.1:5000/recommend", {
        movie: value,
      });
      
      const recommendationsWithPosters = await Promise.all(
        res.data.map(async (movie) => {
          const movieData = await findBestMovieMatch(movie.title);
          if (movieData && movieData.Poster !== "N/A") {
            return {
              ...movie,
              poster: movieData.Poster,
              year: movieData.Year,
              imdb_rating: movieData.imdbRating
            };
          }
          return {
            ...movie,
            poster: `https://api.dicebear.com/6.x/pixel-art/svg?seed=${encodeURIComponent(movie.title)}`
          };
        })
      );
      
      setRecommendations(recommendationsWithPosters);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        api.info({ message: "فیلم مورد نظر یافت نشد!" });
        setRecommendations([]);
      }
    }
    setRecommendationsLoading(false);
  };

  const handleSearch = (value: string) => {
    setMovieName(value);
    if (!value) {
      setRecommendations([]);
    }
  };

  return (
    <>
      {contextHolder}
      <MovieSearch
        value={movieName}
        onSelect={handleSelect}
        onSearch={handleSearch}
        loading={recommendationsLoading}
      />
      <Divider variant="solid" className="bg-fuchsia-800" />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 p-10 text-left" style={{direction:"ltr"}}>
        {recommendationsLoading ? (
          <div className="col-span-full flex justify-center items-center min-h-[400px]">
            <Spin size="large" tip="در حال دریافت پیشنهادات..." />
          </div>
        ) : recommendations.length > 0 ? (
          recommendations.map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))
        ) : (
          <Empty
            className="col-span-full mx-auto text-center w-full" 
            description="پیشنهادی یافت نشد!"
          />
        )}
      </div>
    </>
  );
};

export default Home;
