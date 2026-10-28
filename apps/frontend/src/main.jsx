import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store';
import { ThemeProvider } from './ThemeProvider';
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary';
import { GlobalErrorProvider } from './context/GlobalErrorContext';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <GlobalErrorProvider>
            <HelmetProvider>
              <App />
            </HelmetProvider>
          </GlobalErrorProvider>
        </ThemeProvider>
      </Provider>
    </GlobalErrorBoundary>
  </React.StrictMode>
);
