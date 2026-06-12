/* Theme tweaks — user-facing appearance settings, persisted to localStorage.
   Provides the accent / ambient / glass-blur / card-density knobs that the
   design's "Tweaks" panel exposes, plus the shared open/close state for the
   panel (toggled from the gear button in the TopBar). */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const DEFAULTS = { accent: '#9b6bff', glassBlur: 30, ambient: 'cool', density: 'regular' };
export const ACCENTS = ['#9b6bff', '#4f9cff', '#23c7a8', '#f0a93b', '#ff6b9d'];
export const DENSITY_MIN = { compact: 148, regular: 168, comfy: 196 };
const STORAGE_KEY = 'moviecon.tweaks';

const ThemeTweaksContext = createContext(null);

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    // Validate each field against its allowed set — localStorage is tamperable,
    // and these values flow into CSS custom properties / data-theme.
    return {
      accent: ACCENTS.includes(saved.accent) ? saved.accent : DEFAULTS.accent,
      glassBlur: Number.isFinite(saved.glassBlur)
        ? Math.min(46, Math.max(6, saved.glassBlur))
        : DEFAULTS.glassBlur,
      ambient: ['cool', 'warm', 'slate'].includes(saved.ambient) ? saved.ambient : DEFAULTS.ambient,
      density: ['compact', 'regular', 'comfy'].includes(saved.density) ? saved.density : DEFAULTS.density,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function ThemeTweaksProvider({ children }) {
  const [tweaks, setTweaks] = useState(load);
  const [panelOpen, setPanelOpen] = useState(false);

  const setTweak = useCallback((key, val) => {
    setTweaks((prev) => ({ ...prev, [key]: val }));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tweaks));
    } catch {
      /* storage unavailable (private mode / quota) — settings just won't persist */
    }
  }, [tweaks]);

  // CSS custom properties applied to .app-root by App.
  const rootStyle = {
    '--accent': tweaks.accent,
    '--glass-blur': `${tweaks.glassBlur}px`,
    '--card-min': `${DENSITY_MIN[tweaks.density] || 168}px`,
  };

  const value = {
    tweaks,
    setTweak,
    rootStyle,
    ambient: tweaks.ambient,
    panelOpen,
    setPanelOpen,
    togglePanel: () => setPanelOpen((o) => !o),
  };

  return <ThemeTweaksContext.Provider value={value}>{children}</ThemeTweaksContext.Provider>;
}

export function useThemeTweaks() {
  const ctx = useContext(ThemeTweaksContext);
  if (!ctx) throw new Error('useThemeTweaks must be used within ThemeTweaksProvider');
  return ctx;
}
