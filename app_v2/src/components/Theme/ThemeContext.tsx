import React from 'react';

import { useTheme } from './useTheme';

interface ThemeContextType {
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}
