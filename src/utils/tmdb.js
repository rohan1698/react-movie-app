/* All TMDB requests go through a same-origin proxy that injects the api_key
   server-side — the key never reaches the browser:
   - production: a Netlify Function (netlify/functions/tmdb.js)
   - development: src/setupProxy.js forwards to TMDB using the key from .env
   Build request URLs with tmdbUrl() so the client never sets api_key itself. */
export const TMDB_BASE = '/api/tmdb';

// tmdbUrl('/trending/all/day', { page: 2 }) -> /api/tmdb/trending/all/day?page=2
// Empty/null/undefined params are dropped; values are URL-encoded.
export function tmdbUrl(path, params = {}) {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  );
  const qs = new URLSearchParams(entries).toString();
  return `${TMDB_BASE}${path}${qs ? `?${qs}` : ''}`;
}
