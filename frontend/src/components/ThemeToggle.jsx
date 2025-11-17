// src/components/ThemeToggle.jsx
import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'pixelPetsTheme';

// Themes the button cycles through
const THEMES = [
  { id: null, label: 'Default', glyph: '🌙' },
  { id: 'light', label: 'Light', glyph: '☀️' },
  { id: 'cola', label: 'Cola', glyph: '🥤' },
  { id: 'sunset', label: 'Sunset', glyph: '🌅' },
  { id: 'grape', label: 'Grape', glyph: '🍇' },
  // Note: "gb" is reserved for the Konami code easter egg
];

function applyTheme(themeId) {
  if (typeof document === 'undefined') return;

  const html = document.documentElement;
  const body = document.body;

  // Clear any previous body theme classes for safety
  body.classList.remove('theme-cola', 'theme-sunset', 'theme-grape', 'theme-light', 'theme-gb');

  if (!themeId) {
    // Default theme (dark)
    html.removeAttribute('data-theme');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return;
  }

  // Set the data-theme attribute
  html.setAttribute('data-theme', themeId);

  // Keep backwards compatibility with `.theme-cola` etc. selectors
  body.classList.add(`theme-${themeId}`);

  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch {
    /* ignore */
  }
}

export default function ThemeToggle() {
  const [themeId, setThemeId] = useState(null);

  // Restore on first mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const known = THEMES.find((t) => t.id === stored)?.id ?? null;
      setThemeId(known);
      applyTheme(known);
    } catch {
      // If localStorage fails, just stay on default
    }
  }, []);

  const currentTheme = useMemo(
    () => THEMES.find((t) => t.id === themeId) ?? THEMES[0],
    [themeId],
  );

  function handleClick() {
    // Rotate through the THEMES array
    const idx = THEMES.findIndex((t) => t.id === themeId);
    const next = THEMES[(idx + 1) % THEMES.length];
    setThemeId(next.id);
    applyTheme(next.id);
  }

  return (
    <button
      type="button"
      className="toggle-btn"
      onClick={handleClick}
      aria-label={`Cycle color theme (current: ${currentTheme.label})`}
    >
      <span aria-hidden="true">{currentTheme.glyph}</span>
      <span className="sr-only">Change theme</span>
    </button>
  );
}
