import axios from 'axios';
import { useEffect } from 'react';
import { tmdbUrl } from '../../utils/tmdb';

/* Genre chip filter. Keeps the two-array model (selected vs available) but
   renders the design's .gchip toggles inside a .genre-bar. */
const Genres = ({ type, selectedGenres, setSelectedGenres, genres, setGenres, setPage }) => {
  const handleAddGenre = (genre) => {
    setSelectedGenres([...selectedGenres, genre]);
    setGenres(genres.filter((g) => g.id !== genre.id));
    setPage(1);
  };

  const handleRemoveGenre = (genre) => {
    setSelectedGenres(selectedGenres.filter((selected) => selected.id !== genre.id));
    setGenres([...genres, genre]);
    setPage(1);
  };

  const fetchGenres = async () => {
    try {
      const { data } = await axios.get(
        tmdbUrl(`/genre/${type}/list`, { language: 'en-US' })
      );
      setGenres(data.genres);
    } catch {
      setGenres([]);
    }
  };

  useEffect(() => {
    fetchGenres();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="genre-bar">
      {selectedGenres.map((genre) => (
        <button key={genre.id} className="gchip on" onClick={() => handleRemoveGenre(genre)}>
          {genre.name}
        </button>
      ))}
      {genres.map((genre) => (
        <button key={genre.id} className="gchip" onClick={() => handleAddGenre(genre)}>
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default Genres;
