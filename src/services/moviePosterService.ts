import axios from 'axios';
import { MovieSearchResult } from '../types/movie';

const OMDb_API_KEY = '49b0b9c0';
const OMDb_BASE_URL = 'http://www.omdbapi.com/';

export const cleanTitle = (title: string): string => {
  if (!title || typeof title !== 'string') {
    return '';
  }
  
  return title
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/\s*\[.*?\]\s*/g, '')
    .replace(/\s*\{.*?\}\s*/g, '')
    .replace(/\s*[0-9]{4}\s*/g, '')
    .replace(/\s*[IVX]+$/, '')
    .replace(/\s*Part\s*[0-9]+$/, '')
    .replace(/\s*Chapter\s*[0-9]+$/, '')
    .trim();
};

export const findBestMovieMatch = async (title: string): Promise<MovieSearchResult | null> => {
  try {
    // Strategy 1: Exact match with original title
    const exactResponse = await axios.get(OMDb_BASE_URL, {
      params: {
        apikey: OMDb_API_KEY,
        t: title,
        plot: 'short',
        r: 'json'
      }
    });

    if (exactResponse.data.Response === "True" && exactResponse.data.Poster !== "N/A") {
      return {
        Poster: exactResponse.data.Poster,
        Year: exactResponse.data.Year,
        imdbRating: exactResponse.data.imdbRating
      };
    }

    // Strategy 2: Clean title match
    const cleanedTitle = cleanTitle(title);
    if (cleanedTitle !== title) {
      const cleanResponse = await axios.get(OMDb_BASE_URL, {
        params: {
          apikey: OMDb_API_KEY,
          t: cleanedTitle,
          plot: 'short',
          r: 'json'
        }
      });

      if (cleanResponse.data.Response === "True" && cleanResponse.data.Poster !== "N/A") {
        return {
          Poster: cleanResponse.data.Poster,
          Year: cleanResponse.data.Year,
          imdbRating: cleanResponse.data.imdbRating
        };
      }
    }

    // Strategy 3: Search API with multiple results
    const searchResponse = await axios.get(OMDb_BASE_URL, {
      params: {
        apikey: OMDb_API_KEY,
        s: title,
        r: 'json'
      }
    });

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // In the search strategy section:
    if (searchResponse.data.Response === "True" && searchResponse.data.Search.length > 0) {
      for (const result of searchResponse.data.Search) {
        await delay(100); // Add small delay between requests
        const detailResponse = await axios.get(OMDb_BASE_URL, {
          params: {
            apikey: OMDb_API_KEY,
            i: result.imdbID,
            plot: 'short',
            r: 'json'
          }
        });

        if (detailResponse.data.Response === "True" && detailResponse.data.Poster !== "N/A") {
          return {
            Poster: detailResponse.data.Poster,
            Year: detailResponse.data.Year,
            imdbRating: detailResponse.data.imdbRating
          };
        }
      }
    }

    // Strategy 4: Try with year if available
    const yearMatch = title.match(/\((\d{4})\)/);
    if (yearMatch) {
      const year = yearMatch[1];
      const titleWithoutYear = title.replace(/\s*\(\d{4}\)\s*/, '').trim();
      const yearResponse = await axios.get(OMDb_BASE_URL, {
        params: {
          apikey: OMDb_API_KEY,
          t: titleWithoutYear,
          y: year,
          plot: 'short',
          r: 'json'
        }
      });

      if (yearResponse.data.Response === "True" && yearResponse.data.Poster !== "N/A") {
        return {
          Poster: yearResponse.data.Poster,
          Year: yearResponse.data.Year,
          imdbRating: yearResponse.data.imdbRating
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding movie match:', error);
    return null;
  }
};