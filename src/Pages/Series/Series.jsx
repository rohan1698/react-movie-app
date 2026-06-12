import { useEffect, useState } from 'react';
import Genres from '../../components/Genres/Genres';
import MovieCard from '../../components/MovieCard/MovieCard';
import CustomPagination from '../../components/Pagination/CustomPagination';
import PerPage from '../../components/PerPage/PerPage';
import useGenres from '../../hooks/useGenre';
import { fetchTmdbPages, viewCount } from '../../utils/fetchPages';
import { tmdbUrl } from '../../utils/tmdb';
import { I } from '../../components/icons/Icons';

const Series = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(40);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState(0);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const genreforURL = useGenres(selectedGenres);

  const fetchSeries = async () => {
    try {
      const k = perPage / 20;
      const base = (page - 1) * k + 1;
      const { results, totalPages } = await fetchTmdbPages(
        (p) =>
          tmdbUrl('/discover/tv', {
            language: 'en-US',
            sort_by: 'popularity.desc',
            include_adult: false,
            include_video: false,
            page: p,
            with_genres: genreforURL,
          }),
        base,
        k
      );
      setContent(results);
      setNumOfPages(viewCount(totalPages, k));
    } catch {
      setContent([]);
      setNumOfPages(0);
    }
  };

  useEffect(() => {
    fetchSeries();
    // eslint-disable-next-line
  }, [page, genreforURL, perPage]);

  const changePerPage = (n) => {
    setPerPage(n);
    setPage(1);
  };

  return (
    <div className="view">
      <div className="page-head">
        <span className="eyebrow">Browse</span>
        <h1>TV Series</h1>
        <p>Bingeable originals and limited series. Filter by genre to find your next obsession.</p>
      </div>

      <Genres
        type="tv"
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        genres={genres}
        setGenres={setGenres}
        setPage={setPage}
      />

      <div className="section">
        <div className="list-toolbar">
          <PerPage value={perPage} onChange={changePerPage} />
        </div>

        {content && content.length > 0 ? (
          <div className="grid">
            {content.map((c, i) => (
              <MovieCard
                key={c.id}
                id={c.id}
                poster={c.poster_path}
                title={c.title || c.name}
                date={c.release_date || c.first_air_date}
                media_type="tv"
                vote_average={c.vote_average}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            <I.grid />
            <h3>Nothing matches those filters</h3>
            <span>Try removing a genre.</span>
          </div>
        )}

        {numOfPages > 1 && <CustomPagination setPage={setPage} page={page} numOfPages={numOfPages} />}
      </div>
    </div>
  );
};

export default Series;
