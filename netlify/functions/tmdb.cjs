/* TMDB proxy (production). The client calls /api/tmdb/<path>?<query>; this
   function forwards to https://api.themoviedb.org/3/<path> with the api_key
   injected from a server-side env var, so the key never ships to the browser.

   Requires TMDB_API_KEY (or REACT_APP_API_KEY) in the Netlify site env.
   Uses global fetch (Node 18+). */
exports.handler = async (event) => {
  const apiKey = process.env.TMDB_API_KEY || process.env.REACT_APP_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'TMDB API key not configured' }) };
  }

  // event.path may arrive as /api/tmdb/... or /.netlify/functions/tmdb/... —
  // strip whichever prefix is present to get the real TMDB path.
  let path = (event.path || '')
    .replace(/^\/api\/tmdb/, '')
    .replace(/^\/\.netlify\/functions\/tmdb/, '');
  if (!path.startsWith('/')) path = `/${path}`;

  const params = new URLSearchParams(event.rawQuery || '');
  params.delete('api_key'); // never let the client set it
  params.set('api_key', apiKey);

  const url = `https://api.themoviedb.org/3${path}?${params.toString()}`;

  try {
    const res = await fetch(url);
    const body = await res.text();
    return {
      statusCode: res.status,
      headers: {
        'Content-Type': 'application/json',
        // TMDB data is highly cacheable; ease load and speed up repeat views.
        'Cache-Control': 'public, max-age=300',
      },
      body,
    };
  } catch {
    return { statusCode: 502, body: JSON.stringify({ error: 'TMDB request failed' }) };
  }
};
