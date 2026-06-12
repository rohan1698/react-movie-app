import { useEffect, useState } from 'react';
import axios from 'axios';
import { useModal } from '../../context/ModalContext';
import { artStyle } from '../../utils/artFallback';
import { tmdbUrl } from '../../utils/tmdb';
import { I } from '../icons/Icons';

/* Single app-level content modal. Reads the open target from ModalContext and
   fetches TMDB detail + trailer lazily (only when something is opened), so the
   grid no longer fires detail/video requests per card on mount. */
export default function ContentModal() {
  const { target, closeModal } = useModal();
  const [content, setContent] = useState(null);
  const [video, setVideo] = useState(undefined);

  useEffect(() => {
    if (!target) {
      setContent(null);
      setVideo(undefined);
      return;
    }
    let active = true;
    setContent(null);
    setVideo(undefined);
    const { id, media_type } = target;

    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          tmdbUrl(`/${media_type}/${id}`, { language: 'en-US' })
        );
        if (active) setContent(data);
      } catch {
        if (active) setContent(null);
      }
    };

    const fetchVideo = async () => {
      try {
        const { data } = await axios.get(
          tmdbUrl(`/${media_type}/${id}/videos`, { language: 'en-US' })
        );
        // Prefer an actual YouTube trailer; fall back to any YouTube clip.
        const vids = data.results || [];
        const pick =
          vids.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
          vids.find((v) => v.site === 'YouTube');
        const k = pick?.key;
        if (active) setVideo(k && /^[a-zA-Z0-9_-]{6,15}$/.test(k) ? k : undefined);
      } catch {
        if (active) setVideo(undefined);
      }
    };

    fetchData();
    fetchVideo();
    return () => { active = false; };
  }, [target]);

  // Escape closes the modal.
  useEffect(() => {
    if (!target) return;
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [target, closeModal]);

  if (!target || !content) return null;

  const title = content.title || content.name;
  const year = (content.release_date || content.first_air_date || '').substring(0, 4);
  const isTv = target.media_type === 'tv';
  const rating = content.vote_average;
  const genres = content.genres || [];

  return (
    <div className="modal-back" onClick={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-hero" style={artStyle(content.backdrop_path, target.id, 'backdrop', 780)}>
          <button className="modal-close" onClick={closeModal} aria-label="Close"><I.close /></button>
        </div>
        <div className="modal-body">
          <div className="modal-head">
            <div className="modal-poster" style={artStyle(content.poster_path, target.id, 'poster', 500)} />
            <div className="modal-meta">
              <h2 className="modal-title">{title}</h2>
              <div className="modal-sub">
                {year && <span className="pt"><I.calendar style={{ width: 14, height: 14 }} /> {year}</span>}
                {rating != null && <span className="pt"><I.star style={{ width: 13, height: 13 }} /> {Number(rating).toFixed(1)}</span>}
                <span className="pt">{isTv ? 'TV Series' : 'Film'}</span>
              </div>
              {content.tagline && <p className="modal-tagline">"{content.tagline}"</p>}
            </div>
          </div>

          {content.overview && <p className="modal-overview">{content.overview}</p>}

          {genres.length > 0 && (
            <div className="chips modal-chips">
              {genres.map((g) => <span className="chip" key={g.id}>{g.name}</span>)}
            </div>
          )}

          {video && (
            <div className="modal-actions">
              <a
                className="btn btn-primary"
                href={`https://www.youtube.com/watch?v=${video}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <I.youtube /> Watch Trailer
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
