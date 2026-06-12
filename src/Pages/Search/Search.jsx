import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../../components/MovieCard/MovieCard';
import CustomPagination from '../../components/Pagination/CustomPagination';
import { I } from '../../components/icons/Icons';
import { tmdbUrl } from '../../utils/tmdb';

const SUGGESTIONS = ['Action', 'Comedy', 'Sci-Fi', 'Animation', 'Thriller'];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState('movie');
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState(0);

  const query = searchParams.get('q') || '';

  const setQuery = (q) => {
    setPage(1);
    setSearchParams(q ? { q } : {}, { replace: true });
  };

  const switchType = (t) => {
    setType(t);
    setPage(1);
  };

  const fetchSearch = async () => {
    if (!query.trim()) {
      setContent([]);
      setNumOfPages(0);
      return;
    }
    try {
      const { data } = await axios.get(
        tmdbUrl(`/search/${type}`, {
          language: 'en-US',
          query,
          page,
          include_adult: false,
        })
      );
      setContent(data.results);
      setNumOfPages(data.total_pages);
    } catch {
      setContent([]);
      setNumOfPages(0);
    }
  };

  useEffect(() => {
    fetchSearch();
    // eslint-disable-next-line
  }, [type, page, query]);

  const hasResults = content && content.length > 0;

  return (
    <div className="view">
      <div className="search-head">
        <div className="search-field">
          <I.search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={type === 'movie' ? 'Search movies…' : 'Search TV series…'}
            autoFocus
            aria-label="Search"
          />
          {query && <button type="button" className="clear" onClick={() => setQuery('')} aria-label="Clear search"><I.close /></button>}
        </div>

        <div className="seg">
          <button className={type === 'movie' ? 'on' : ''} onClick={() => switchType('movie')}>Movies</button>
          <button className={type === 'tv' ? 'on' : ''} onClick={() => switchType('tv')}>TV Series</button>
        </div>

        {!query && (
          <div className="suggest">
            <span className="lbl">Try:</span>
            {SUGGESTIONS.map((s) => (
              <button key={s} className="gchip" onClick={() => setQuery(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        {query && hasResults && (
          <section>
            <div className="row-head">
              <h2>Results</h2>
              <span className="sub">for "{query}" in {type === 'movie' ? 'Movies' : 'TV Series'}</span>
            </div>
            <div className="grid">
              {content.map((c, i) => (
                <MovieCard
                  key={c.id}
                  id={c.id}
                  poster={c.poster_path}
                  title={c.title || c.name}
                  date={c.release_date || c.first_air_date}
                  media_type={type}
                  vote_average={c.vote_average}
                  index={i}
                />
              ))}
            </div>
            {numOfPages > 1 && <CustomPagination setPage={setPage} page={page} numOfPages={numOfPages} />}
          </section>
        )}

        {query && !hasResults && (
          <div className="empty">
            <I.search />
            <h3>No {type === 'movie' ? 'movies' : 'series'} found</h3>
            <span>Nothing matched "{query}". Try another title or genre.</span>
          </div>
        )}

        {!query && (
          <div className="empty">
            <I.search />
            <h3>Search Moviecon</h3>
            <span>Find any film or series by title.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
