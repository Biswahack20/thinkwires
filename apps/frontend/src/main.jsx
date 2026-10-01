/**
 * ThinkWire Frontend — Main Entry Point
 *
 * Bootstraps the React 19 application by:
 * 1. Mounting into the `#root` DOM container in `index.html`.
 * 2. Enabling React StrictMode for highlighting potential runtime issues during development.
 * 3. Wrapping the application hierarchy with `<ThemeProvider>` for global theming state.
 *
 * @see ThemeProvider.jsx — Theme context provider (light/dark mode)
 * @see App.jsx          — Root application component
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './ThemeProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
