import { ThemeContext } from './ThemeContext';
import { useTheme } from './useTheme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}
