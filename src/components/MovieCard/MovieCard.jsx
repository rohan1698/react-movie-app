import { useModal } from '../../context/ModalContext';
import { artStyle } from '../../utils/artFallback';
import { I } from '../icons/Icons';

/* Poster card. Real TMDB poster with gradient fallback, rating badge, and a
   hover "play" affordance. Clicking opens the single app-level ContentModal. */
const MovieCard = ({ id, poster, title, date, media_type, vote_average, index = 0 }) => {
  const { openModal } = useModal();
  const year = date ? String(date).substring(0, 4) : '';
  const kind = media_type === 'tv' ? 'Series' : 'Movie';
  const rating = vote_average != null ? Number(vote_average) : null;

  return (
    <div
      className="card"
      style={{ animationDelay: `${Math.min(index * 35, 400)}ms` }}
      onClick={() => openModal({ id, media_type })}
    >
      <div className="card-art" style={artStyle(poster, id, 'poster', 300)}>
        <div className="card-grain" />
        {rating != null && (
          <span className={'rating' + (rating >= 8 ? ' high' : '')}>
            <I.star /> {rating.toFixed(1)}
          </span>
        )}
        <div className="card-poster-title">{title}</div>
        <div className="card-play"><span><I.play /></span></div>
      </div>
      <div className="card-meta">
        <div className="d">{kind}{year ? ` · ${year}` : ''}</div>
      </div>
    </div>
  );
};

export default MovieCard;
