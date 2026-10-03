import { createContext } from 'react';

/**
 * @typedef {'light' | 'dark'} ThemeMode
 */

/**
 * @typedef {Object} ThemeContextValue
 * @property {ThemeMode} theme - The currently active theme mode ('light' | 'dark')
 * @property {() => void} toggleTheme - Function to switch between light and dark modes
 * @property {(mode: ThemeMode) => void} setTheme - Function to explicitly set a specific theme mode
 */

/**
 * React Context instance for theme state management.
 * Isolated into its own module to comply with React Fast Refresh lint rules.
 *
 * @type {React.Context<ThemeContextValue | null>}
 */
export const ThemeContext = createContext(null);

export default ThemeContext;
