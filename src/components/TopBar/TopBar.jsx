import { useNavigate, useLocation } from 'react-router-dom';
import { I } from '../icons/Icons';
import { useThemeTweaks } from '../../context/ThemeTweaks';

/* Glass top bar: back/forward arrows (browser history), a search pill that
   drives the /search route via a ?q query param, and the appearance gear. */
export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { togglePanel, panelOpen } = useThemeTweaks();

  const onSearch = new URLSearchParams(location.search);
  const query = location.pathname === '/search' ? onSearch.get('q') || '' : '';

  const goSearch = (text) => {
    const q = text ? `?q=${encodeURIComponent(text)}` : '';
    // Replace (not push) while already searching, so typing doesn't pollute history.
    navigate(`/search${q}`, { replace: location.pathname === '/search' });
  };

  return (
    <div className="topbar glass">
      <div className="nav-arrows">
        <button className="icon-btn" aria-label="Back" onClick={() => navigate(-1)}><I.back /></button>
        <button className="icon-btn" aria-label="Forward" onClick={() => navigate(1)}><I.fwd /></button>
      </div>

      <label className="searchpill">
        <I.search />
        <input
          value={query}
          onChange={(e) => goSearch(e.target.value)}
          onFocus={() => { if (location.pathname !== '/search') navigate('/search'); }}
          placeholder="Search films & series…"
          aria-label="Search"
        />
      </label>

      <button
        className={'icon-btn' + (panelOpen ? ' on' : '')}
        aria-label="Appearance settings"
        aria-pressed={panelOpen}
        onClick={togglePanel}
      >
        <I.settings />
      </button>
    </div>
  );
}
