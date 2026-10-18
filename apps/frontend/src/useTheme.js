import { useContext } from 'react';
import { ThemeContext } from './ThemeContext.js';

/**
 * Custom React hook to access the current theme context.
 *
 * @function useTheme
 * @description
 * Returns the active theme mode and functions to manipulate it.
 * Must be called within a `<ThemeProvider>` component hierarchy.
 *
 * @returns {{
 *   theme: 'light' | 'dark',
 *   toggleTheme: () => void,
 *   setTheme: (mode: 'light' | 'dark') => void
 * }}
 *
 * @throws {Error} If called outside of a `<ThemeProvider>` component.
 *
 * @example
 * ```jsx
 * import { useTheme } from './useTheme.js';
 *
 * function ThemeToggle() {
 *   const { theme, toggleTheme } = useTheme();
 *
 *   return (
 *     <button
 *       id="theme-toggle-btn"
 *       className="btn btn-secondary"
 *       onClick={toggleTheme}
 *       aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
 *     >
 *       {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export default useTheme;
