import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env (all keys, no VITE_ prefix filter) for the Node-side dev proxy.
  // The key is injected server-side here and never reaches the browser bundle —
  // mirroring the production Netlify Function (netlify/functions/tmdb.js).
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.TMDB_API_KEY || env.REACT_APP_API_KEY || '';

  return {
    build: { outDir: 'dist' },

    server: {
      proxy: {
        '/api/tmdb': {
          target: 'https://api.themoviedb.org',
          changeOrigin: true,
          rewrite: (path) => {
            const clean = path.replace(/^\/api\/tmdb/, '');
            const [p, q = ''] = clean.split('?');
            const params = new URLSearchParams(q);
            params.set('api_key', apiKey);
            return `/3${p}?${params.toString()}`;
          },
        },
      },
    },

    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        // We register manually via `virtual:pwa-register` in src/index.jsx so no
        // inline <script> is injected — keeps CSP `script-src 'self'` intact.
        injectRegister: false,
        // Reuse the hand-authored public/manifest.json instead of generating one.
        manifest: false,
        workbox: {
          // Precache the same-origin app shell only. No cross-origin runtime
          // caching (image.tmdb.org / /api) so the SW never makes fetches that
          // the production CSP `connect-src 'self'` would block.
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//],
        },
      }),
    ],
  };
});
