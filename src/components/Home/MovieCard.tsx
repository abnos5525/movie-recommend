import { Card, Rate, Tooltip } from "antd";
import { StarOutlined, FireOutlined, HeartOutlined } from '@ant-design/icons';
import { Movie } from '../../types/movie';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Card
      hoverable
      className="shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      cover={
        <div className="relative h-48 overflow-hidden">
          <img
            alt={movie.title}
            src={movie.poster || `https://api.dicebear.com/6.x/pixel-art/svg?seed=${movie.title}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://api.dicebear.com/6.x/pixel-art/svg?seed=${movie.title}`;
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <h3 className="text-white font-bold text-lg truncate">{movie.title}</h3>
            {movie.year && (
              <p className="text-white text-sm">{movie.year}</p>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Tooltip title={`Rating: ${movie.rating_mean.toFixed(1)}/5`}>
            <div className="flex items-center space-x-1">
              <StarOutlined style={{ color: '#fbbf24' }} />
              <span className="font-semibold">{movie.rating_mean.toFixed(1)}</span>
            </div>
          </Tooltip>
          <Tooltip title={`Popularity: ${movie.rating_count} ratings`}>
            <div className="flex items-center space-x-1">
              <FireOutlined style={{ color: '#f97316' }} />
              <span className="font-semibold">{movie.rating_count}</span>
            </div>
          </Tooltip>
        </div>
        <div className="flex items-center justify-center space-x-2 bg-gray-100 p-2 rounded-lg">
          <HeartOutlined style={{ color: '#ef4444' }} />
          <span className="font-semibold text-gray-700">
            {(movie.correlation * 100).toFixed(1)}% Match
          </span>
        </div>
        <div className="flex justify-center">
          <Rate 
            disabled 
            defaultValue={Math.round(movie.rating_mean)} 
            className="text-yellow-400"
          />
        </div>
      </div>
    </Card>
  );
};

export default MovieCard; 