import { useState, useEffect, useCallback } from 'react';
import { type ThemeMode } from '../types';

const THEME_STORAGE_KEY = 'omnisync-theme';

/**
 * Custom hook to manage the light/dark theme state.
 * Persists user preference using localStorage.
 */
export const useTheme = () => {
  // Initialize state from local storage or default to 'light'
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (storedTheme) {
      return storedTheme;
    }
    // Check system preference if no stored theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'DARK';
    }
    return 'LIGHT';
  });

  // Effect to update the body class on theme change
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'LIGHT' ? 'DARK' : 'LIGHT'));
  }, []);

  return { theme, toggleTheme };
};
