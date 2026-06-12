/* Dev-only TMDB proxy. CRA auto-loads this file when running `npm start`.
   Forwards /api/tmdb/* to TMDB, injecting the api_key from .env so the browser
   never sees it — mirroring the production Netlify Function. */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const apiKey = process.env.TMDB_API_KEY || process.env.REACT_APP_API_KEY || '';

  app.use(
    '/api/tmdb',
    createProxyMiddleware({
      target: 'https://api.themoviedb.org',
      changeOrigin: true,
      pathRewrite: (path) => {
        // path may or may not still include the /api/tmdb mount prefix.
        const clean = path.replace(/^\/api\/tmdb/, '');
        const [p, q = ''] = clean.split('?');
        const params = new URLSearchParams(q);
        params.set('api_key', apiKey);
        return `/3${p}?${params.toString()}`;
      },
    })
  );
};
