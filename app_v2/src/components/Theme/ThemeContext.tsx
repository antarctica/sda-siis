import React from 'react';

interface ThemeContextType {
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);
