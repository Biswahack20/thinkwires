import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
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
            <App />
          </GlobalErrorProvider>
        </ThemeProvider>
      </Provider>
    </GlobalErrorBoundary>
  </React.StrictMode>
);
