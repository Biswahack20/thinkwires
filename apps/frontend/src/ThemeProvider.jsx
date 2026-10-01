import { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext.js';

const STORAGE_KEY = 'thinkwire-theme';

/**
 * ThemeProvider component that wraps the application to provide global theme context.
 *
 * @component
 * @description
 * Manages the application's light/dark mode state. It:
 * 1. Checks `localStorage` for a user's previously saved theme preference.
 * 2. Falls back to the operating system's `prefers-color-scheme` if no saved preference exists.
 * 3. Applies the active theme to `document.documentElement` via the `data-theme` attribute.
 * 4. Listens for OS theme preference changes dynamically when no explicit preference is saved.
 * 5. Persists any user toggle/change to `localStorage`.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to be rendered within the theme context.
 * @param {'light' | 'dark'} [props.defaultTheme] - Optional initial theme override ('light' | 'dark').
 *
 * @example
 * ```jsx
 * import { ThemeProvider } from './ThemeProvider.jsx';
 * import App from './App.jsx';
 *
 * function Root() {
 *   return (
 *     <ThemeProvider>
 *       <App />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export function ThemeProvider({ children, defaultTheme }) {
  const [theme, setThemeState] = useState(() => {
    if (defaultTheme) return defaultTheme;
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore localStorage write errors (e.g. private browsing quota exceeded)
    }
  }, [theme]);

  // Listen for OS theme changes if user has not explicitly set a theme in localStorage
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      if (!savedTheme) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  /**
   * Toggles the active theme between 'light' and 'dark'.
   */
  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  /**
   * Explicitly sets a specific theme mode.
   * @param {'light' | 'dark'} mode - The theme mode to set.
   */
  const setTheme = (mode) => {
    if (mode === 'light' || mode === 'dark') {
      setThemeState(mode);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
