import { AutoComplete, Input } from "antd";
import { useState, useRef } from "react";
import axios from "axios";

interface MovieSearchProps {
  onSelect: (value: string) => void;
  onSearch: (value: string) => void;
  value: string;
  loading: boolean;
}

const MovieSearch = ({ onSelect, onSearch, value, loading }: MovieSearchProps) => {
  const [searchResults, setSearchResults] = useState<{ value: string; label: string }[]>([]);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await axios.post("http://127.0.0.1:5000/recommend", {
          movie: value,
        });
        const options = res.data.map((movie: any) => ({
          value: movie.title,
          label: movie.title
        }));
        setSearchResults(options);
      } catch (error) {
        setSearchResults([]);
      }
    }, 500);
  };

  return (
    <div className="text-center w-full grid grid-cols-8 grid-rows-2 gap-4 pt-10 text-2xl">
      <AutoComplete
        options={searchResults}
        value={value}
        onSearch={handleSearch}
        onChange={onSearch}
        onSelect={onSelect}
        placeholder="Enter your movie..."
        style={{ width: '100%', direction: "ltr" }}
        className="col-span-4 col-start-3 shadow-lg"
      >
        <Input.Search
          size="large"
          loading={loading}
          className="bg-primary font-bold"
          style={{ direction: "ltr" }}
        />
      </AutoComplete>
    </div>
  );
};

export default MovieSearch; 