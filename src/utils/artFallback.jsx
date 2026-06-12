/* Deterministic gradient "art" — fallback when a TMDB item has no image.
   Ported from the design prototype (moviecon-data.js), but the hue/variant
   seeds are derived from the TMDB id so each item gets stable, distinct art. */
import { img_300, img_500, img_780, img_1280 } from '../config/config';

const IMAGE_BASES = { 300: img_300, 500: img_500, 780: img_780, 1280: img_1280 };

function clampH(h) { return ((h % 360) + 360) % 360; }

// Stable seed from a TMDB id (or any number/string).
function seed(id) {
  const n = typeof id === 'number' ? id : String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    h: (n * 47) % 360,        // base hue
    s: (n * 83 + 120) % 360,  // secondary hue
    variant: n % 4,
  };
}

// Portrait poster gradient
function posterBg(id) {
  const { h: hb, s: sb, variant } = seed(id);
  const h1 = clampH(hb), h2 = clampH(sb), h3 = clampH(hb + 200);
  const variants = [
    `radial-gradient(120% 90% at 75% 18%, oklch(0.72 0.17 ${h2}) 0%, transparent 55%),
     radial-gradient(130% 100% at 12% 95%, oklch(0.45 0.16 ${h1}) 0%, transparent 60%),
     linear-gradient(155deg, oklch(0.30 0.10 ${h1}) 0%, oklch(0.16 0.07 ${h3}) 100%)`,
    `radial-gradient(80% 60% at 50% 28%, oklch(0.78 0.16 ${h2}) 0%, transparent 60%),
     linear-gradient(200deg, oklch(0.22 0.09 ${h1}) 0%, oklch(0.40 0.14 ${h2}) 55%, oklch(0.14 0.06 ${h3}) 100%)`,
    `radial-gradient(100% 70% at 80% 90%, oklch(0.70 0.18 ${h1}) 0%, transparent 55%),
     radial-gradient(90% 80% at 10% 10%, oklch(0.66 0.15 ${h2}) 0%, transparent 55%),
     linear-gradient(160deg, oklch(0.18 0.06 ${h3}) 0%, oklch(0.30 0.10 ${h1}) 100%)`,
    `conic-gradient(from 210deg at 70% 30%, oklch(0.55 0.16 ${h1}) 0deg, oklch(0.34 0.12 ${h2}) 140deg, oklch(0.16 0.06 ${h3}) 300deg, oklch(0.55 0.16 ${h1}) 360deg)`,
  ];
  return variants[variant];
}

// Wide backdrop gradient (hero / modal hero)
function backdropBg(id) {
  const { h: hb, s: sb } = seed(id);
  const h1 = clampH(hb), h2 = clampH(sb), h3 = clampH(hb + 180);
  return `radial-gradient(70% 120% at 82% 30%, oklch(0.62 0.18 ${h2}) 0%, transparent 58%),
          radial-gradient(80% 130% at 18% 95%, oklch(0.40 0.15 ${h1}) 0%, transparent 60%),
          radial-gradient(50% 80% at 55% 8%, oklch(0.50 0.10 ${h3}) 0%, transparent 60%),
          linear-gradient(120deg, oklch(0.20 0.07 ${h1}) 0%, oklch(0.12 0.05 ${h3}) 100%)`;
}

/**
 * Build an inline style for an art surface.
 * If `path` (a TMDB image path) exists, use the real image (cover).
 * Otherwise fall back to deterministic gradient art keyed off `id`.
 *
 * @param {string|undefined} path  TMDB image path (poster_path / backdrop_path)
 * @param {number|string} id       TMDB id (seeds the fallback gradient)
 * @param {'poster'|'backdrop'} kind
 * @param {number} [size=300]       TMDB image width: 300, 500, 780, or 1280
 */
export function artStyle(path, id, kind = 'poster', size = 300) {
  if (path) {
    const base = IMAGE_BASES[size] || img_300;
    // Quote + encode so a stray ")/"/whitespace in the path can't terminate the url() token.
    return { backgroundImage: `url("${base}/${encodeURI(path)}")` };
  }
  return { background: kind === 'backdrop' ? backdropBg(id) : posterBg(id) };
}

export { posterBg, backdropBg };
