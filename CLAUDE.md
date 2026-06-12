# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server at http://localhost:5173 (npm start is an alias)
npm run build      # production build → /dist
npm run preview    # serve the built /dist locally to smoke-test the prod bundle
```

The build tooling is **Vite** (`vite.config.js`), not Create React App — `react-scripts` was removed. JSX lives in `.jsx` files (esbuild only treats `.jsx`/`.tsx` as JSX); plain-JS helpers stay `.js`. There are **no test files** and no test runner configured. Use the project slash commands `/code-reviewer` and `/security-reviewer` (in `.claude/commands/`) for review passes; they are scoped to this codebase and report-only.

## Environment & the TMDB proxy

The TMDB API key is **never exposed to the browser** — all requests go through a same-origin proxy that injects the key server-side. Client code builds URLs with `tmdbUrl(path, params)` from `src/utils/tmdb.js` (base `/api/tmdb`) and never sets `api_key` itself.

- **Dev (`npm run dev`):** the `server.proxy['/api/tmdb']` block in `vite.config.js` forwards `/api/tmdb/*` → TMDB, injecting the key from `.env` (read Node-side via `loadEnv`, so it never reaches the bundle). Create a root `.env` with `TMDB_API_KEY=<your_tmdb_api_key>` (from [TMDB](https://www.themoviedb.org/)); `REACT_APP_API_KEY=` also works as a fallback. (`npm run dev` exercises the Vite proxy, not the function — run `netlify dev` if you need to test the real function locally.)
- **Prod (Netlify):** `netlify/functions/tmdb.js` proxies `/api/tmdb/*` (redirect in `netlify.toml`, must precede the SPA catch-all) using global `fetch` (Node 18+). Set **`TMDB_API_KEY`** in Netlify → Site settings → Environment variables. The build no longer needs `REACT_APP_API_KEY`.

`.env` is gitignored. If you change the proxy path or add an endpoint, the only places to touch are `tmdbUrl` plus the two proxies (`vite.config.js` for dev, `netlify/functions/tmdb.js` for prod).

## Architecture

**Frontend-only** React 19 SPA built with **Vite**. All data comes from the TMDB REST API via Axios, routed through a same-origin proxy (see *Environment & the TMDB proxy* above). The UI is the **"Moviecon" frosted-glass design** — pure CSS, **no MUI / no component library** (they were removed). Fonts are Google Fonts (Bricolage Grotesque + Hanken Grotesk, loaded in the root `index.html`). The Vite entry is the root `index.html` (referencing `/src/index.jsx`); `public/` holds static assets (`manifest.json`, `robots.txt`, `image/`) served at the root.

### Design system
- **`src/styles/moviecon.css`** — the entire visual system (ambient background, glass surfaces, topbar, panel, hero, card grid, search, dock, modal, pager, genre/per-page chips). Imported once in `src/index.jsx`. Styling is driven by CSS custom properties (`--accent`, `--glass-blur`, `--card-min`) set on `.app-root`.
- **`src/components/icons/Icons.jsx`** — hand-rolled SVG icon set (`export const I`), replaces icon libraries.

### Shell & providers (`src/App.jsx`)
Nesting: `ThemeTweaksProvider` → `ModalProvider` → `BrowserRouter` → `Shell`. `Shell` renders `app-root` (with the `style={rootStyle}` CSS vars + `data-theme={ambient}`) → `ambient` background → `stage` (`TopBar` + `panel`) → a single app-level `ContentModal` + `TweaksPanel`. The `panel` holds the scroll container (`<Routes>`) and the floating `Dock`. Route changes reset `.panel-scroll` to top.

### Contexts
- **`ModalContext`** (`src/context/ModalContext.jsx`) — a single app-level modal. Anything calls `openModal({ id, media_type })`; the lone `ContentModal` reads the target and fetches details **lazily, only when opened**. (Cards do NOT each mount a modal — that earlier pattern fired ~2 TMDB calls per card on load.)
- **`ThemeTweaks`** (`src/context/ThemeTweaks.jsx`) — user appearance settings (`accent`, `glassBlur`, `ambient`, `density`) persisted to `localStorage` (`moviecon.tweaks`), validated on load, exposed as `rootStyle` + `ambient`. Drives the gear-button `TweaksPanel`.

### Navigation (React Router kept)
- **`TopBar`** — back/forward arrows, a search pill that routes to `/search?q=` (replace-navigation while already on search), and the appearance gear.
- **`Dock`** — floating glass nav; active item derived from `useLocation()`, navigates via `useNavigate()`.

### Pages (`src/Pages/`)
Each manages its own state and fetches from TMDB on mount / state change. All three list pages share a **per-page selector** (see below):
- **Trending** — `/trending/all/day`; filters out `person` items; first 5 of page 1 feed the `Hero` carousel, the rest fill the grid.
- **Movies / Series** — `/discover/movie` and `/discover/tv` with genre-chip filtering.
- **Search** — `/search/movie|tv`; query lives in the `?q` URL param (`useSearchParams`), segmented Movies/TV control. The query is URL-encoded by `tmdbUrl` (`URLSearchParams`).
- **Error** — glass 404.

### Per-page card count (`PerPage` + `src/utils/fetchPages.js`)
TMDB returns a fixed **20 results/page** with no page-size param. To show 20/40/60 cards, `fetchTmdbPages(buildUrl, basePage, count)` fetches `count` consecutive TMDB pages in parallel and concatenates + de-dupes them; `viewCount(totalPages, perTmdbPages)` recomputes the pager length (respecting TMDB's 500-page cap). Trending/Movies/Series each hold `perPage` state (default **40**) rendered via the `PerPage` segmented control.

### Key components
- **`MovieCard`** — poster card; `onClick` calls `openModal`. Image via `artStyle` (real TMDB poster, gradient fallback). Color-coded rating badge.
- **`ContentModal`** — the single modal. Lazy-fetches detail + `/videos`; prefers an actual YouTube `Trailer` (falls back to any YouTube clip), then validates the key against `/^[a-zA-Z0-9_-]{6,15}$/`; only the "Watch Trailer" action (real YouTube link). Header is a flex row: poster **beside** the title (not overlapping the backdrop).
- **`Hero`** — Trending carousel (auto-advance unless reduced-motion, prev/next, thumbnail rail).
- **`Genres`** — `.gchip` toggle buttons (selected vs available two-array model); toggling resets page to 1.
- **`CustomPagination`** — windowed `.pager` (prev / 1 … current±1 … last / next); takes a `page` prop for active highlight; scrolls `.panel-scroll` to top.

### Utils, hook, config
- **`src/utils/tmdb.js`** — `TMDB_BASE` (`/api/tmdb`) + `tmdbUrl(path, params)`. The single place every TMDB request URL is built (params auto-encoded, empties dropped). See the proxy section above.
- **`src/utils/fetchPages.js`** — `fetchTmdbPages(buildUrl, basePage, count)` (parallel multi-page fetch via `Promise.allSettled`, de-dupes by `media_type:id` since trending mixes movie+tv) and `viewCount()`.
- **`src/utils/artFallback.jsx`** — `artStyle(path, id, kind, size)` returns an inline style: a real TMDB image background (`size` ∈ 300/500/780/1280, quoted + `encodeURI`'d) when `path` exists, else a deterministic oklch gradient seeded from the id. Image sizes in use: cards `w300`, hero backdrop `w1280`, rail/modal backdrop `w780`, modal poster `w500`.
- **`useGenres`** (`src/hooks/useGenre.js`) — selected genre objects → comma-separated id string for `with_genres`.
- **`src/config/config.js`** — TMDB image base URLs only (`img_300/500/780/1280`).

## Deployment

Deployed to **Netlify**. `netlify.toml`:
- `[build] command = "npm run build"`, `publish = "dist"` — Vite outputs to `dist/`. Vite emits external module scripts (no inline `<script>`), so the CSP uses `script-src 'self'` without `'unsafe-inline'`.
- `[functions] directory = "netlify/functions"` for the TMDB proxy function.
- Redirects (order matters): `/api/tmdb/* → /.netlify/functions/tmdb/:splat` **before** the SPA catch-all `* → /index.html`.
- Security headers on `/*`: a tight CSP (`script-src 'self'`; `connect-src 'self'` — the browser only talks to our origin, the function calls TMDB server-side; `img-src 'self' data: https://image.tmdb.org`; Google Fonts `style-src`/`font-src`; `frame-src` YouTube; `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`, `form-action 'none'`, `upgrade-insecure-requests`) and HSTS (`max-age=31536000`).

## PWA

The service worker is generated by **`vite-plugin-pwa`** (`generateSW`, `registerType: 'autoUpdate'`) configured in `vite.config.js`, and registered from `src/index.jsx` via `import { registerSW } from 'virtual:pwa-register'`. It precaches the same-origin app shell only (no cross-origin runtime caching, so the SW never makes fetches the prod CSP `connect-src 'self'` would block); the hand-authored `public/manifest.json` is reused as-is (`manifest: false`). Icons live in `public/image/`; `manifest.json` (`display: standalone`, dark `#0c0c12` theme) is named **Moviecon**.

## Conventions

The design prototype source (`moviecon-*.{jsx,js,css}`, `Moviecon.html`, `tweaks-panel.jsx`, `screenshots/`, `uploads/`) and the generated `graphify-out/` are git-ignored reference material — **not** imported by the app. The real app code lives only under `src/`.
