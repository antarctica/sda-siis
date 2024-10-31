import React from 'react';
import { useTernaryDarkMode } from 'usehooks-ts';

import { ThemeContext } from './ThemeContext';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = `${import.meta.env.VITE_CACHE_ID}:theme`;

export function useTheme() {
  const { isDarkMode, setTernaryDarkMode } = useTernaryDarkMode({
    defaultValue: 'system',
    initializeWithValue: true,
    localStorageKey: THEME_STORAGE_KEY,
  });
  const theme: Theme = isDarkMode ? 'dark' : 'light';

  React.useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    document.body.setAttribute('data-color-mode', theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const toggle = () => {
    setTernaryDarkMode(isDarkMode ? 'light' : 'dark');
  };

  return {
    currentTheme: theme,
    toggleTheme: toggle,
  };
}

export function useThemeContext() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
