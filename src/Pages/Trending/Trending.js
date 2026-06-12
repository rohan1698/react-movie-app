import { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import CustomPagination from "../../components/Pagination/CustomPagination";
import PerPage from "../../components/PerPage/PerPage";
import Hero from "../../components/Hero/Hero";
import { fetchTmdbPages, viewCount } from "../../utils/fetchPages";
import { tmdbUrl } from "../../utils/tmdb";

const Trending = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(40);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState(0);

  const fetchTrending = async () => {
    try {
      const k = perPage / 20;
      const base = (page - 1) * k + 1;
      const { results, totalPages } = await fetchTmdbPages(
        (p) => tmdbUrl("/trending/all/day", { page: p }),
        base,
        k,
      );
      // trending/all can include "person" items — keep only movies & series.
      setContent(
        results.filter(
          (c) => c.media_type === "movie" || c.media_type === "tv",
        ),
      );
      setNumOfPages(viewCount(totalPages, k));
    } catch {
      setContent([]);
      setNumOfPages(0);
    }
  };

  useEffect(() => {
    fetchTrending();
    // eslint-disable-next-line
  }, [page, perPage]);

  const changePerPage = (n) => {
    setPerPage(n);
    setPage(1);
  };

  // The hero only leads page 1; deeper pages are pure grid.
  const featured = page === 1 ? content.slice(0, 5) : [];
  const rest = page === 1 ? content.slice(5) : content;

  return (
    <div className="view">
      {featured.length > 0 && <Hero films={featured} />}

      <div className="section tight">
        <section>
          <div className="row-head">
            <h2>Trending Now</h2>
            <PerPage value={perPage} onChange={changePerPage} />
          </div>
          <div className="grid">
            {rest.map((c, i) => (
              <MovieCard
                key={`${c.media_type}-${c.id}`}
                id={c.id}
                poster={c.poster_path}
                title={c.title || c.name}
                date={c.release_date || c.first_air_date}
                media_type={c.media_type}
                vote_average={c.vote_average}
                index={i}
              />
            ))}
          </div>
        </section>

        {numOfPages > 1 && (
          <CustomPagination
            setPage={setPage}
            page={page}
            numOfPages={numOfPages}
          />
        )}
      </div>
    </div>
  );
};

export default Trending;
