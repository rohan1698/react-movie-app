import { useNavigate, useLocation } from 'react-router-dom';
import { I } from '../icons/Icons';

const ITEMS = [
  { path: '/', label: 'Trending', icon: I.flame },
  { path: '/movies', label: 'Movies', icon: I.film },
  { path: '/series', label: 'TV Series', icon: I.tv },
  { path: '/search', label: 'Search', icon: I.search },
];

/* Floating glass dock. Drives React Router navigation; active item is derived
   from the current pathname (so deep links / refresh highlight correctly). */
export default function Dock() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="dock-wrap">
      <nav className="dock">
        {ITEMS.map((it) => {
          const active = pathname === it.path;
          const Icon = it.icon;
          return (
            <button
              key={it.path}
              className={'dock-btn' + (active ? ' on' : '')}
              onClick={() => navigate(it.path)}
              aria-label={it.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon />
              <span className="dock-tip">{it.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
