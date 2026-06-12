import { useState, useEffect } from "react";
import { useModal } from "../../context/ModalContext";
import { artStyle } from "../../utils/artFallback";
import { I } from "../icons/Icons";

/* Trending hero carousel. Cycles through the top trending items with a backdrop
   image + scrim, auto-advancing (unless the user prefers reduced motion). */
export default function Hero({ films = [] }) {
  const { openModal } = useModal();
  const [idx, setIdx] = useState(0);

  // Reset to the first slide when the actual lineup changes (not just its length).
  const headId = films.length ? films[0].id : null;
  useEffect(() => {
    setIdx(0);
  }, [headId]);

  useEffect(() => {
    if (films.length <= 1) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;
    const t = setInterval(() => setIdx((i) => (i + 1) % films.length), 8000);
    return () => clearInterval(t);
  }, [films.length]);

  if (!films.length) return null;

  const film = films[Math.min(idx, films.length - 1)];
  const go = (d) => setIdx((i) => (i + d + films.length) % films.length);
  const title = film.title || film.name;
  const isTv = film.media_type === "tv";

  return (
    <div className="hero">
      <div
        key={film.id}
        className="hero-art"
        style={artStyle(film.backdrop_path, film.id, "backdrop", 1280)}
      />
      <div className="hero-scrim" />

      <div className="hero-content view" key={`b${film.id}`}>
        <span className="badge">
          <span className="dot" /> 
          Trending Now
        </span>
        <span className="studio-tag">
          {isTv ? "Trending Series" : "Trending Film"}
        </span>
        <h1 className="hero-title">{title}</h1>
        {film.overview && <p className="hero-desc">{film.overview}</p>}
        <div className="hero-actions">
          <button
            className="btn btn-primary"
            onClick={() =>
              openModal({ id: film.id, media_type: film.media_type })
            }
          >
            <I.play /> Watch Now
          </button>
        </div>
      </div>

      {films.length > 1 && (
        <div className="hero-arrows">
          <button
            className="round-btn"
            onClick={() => go(-1)}
            aria-label="Previous"
          >
            <I.back />
          </button>
          <button className="round-btn" onClick={() => go(1)} aria-label="Next">
            <I.fwd />
          </button>
        </div>
      )}

      <div className="rail">
        {films.map((f, i) => (
          <button
            key={f.id}
            type="button"
            className={"thumb" + (i === idx ? " active" : "")}
            style={artStyle(f.backdrop_path, f.id, "backdrop", 780)}
            onClick={() => setIdx(i)}
            aria-label={`Show ${f.title || f.name}`}
            aria-current={i === idx ? "true" : undefined}
          >
            <span className="thumb-no">{String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
