import React from 'react';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Import domain reducers
import authReducer from '../store/slices/authSlice';
import homeReducer from '../store/slices/homeSlice';
import aboutReducer from '../store/slices/aboutSlice';
import blogReducer from '../store/slices/blogSlice';
import contactReducer from '../store/slices/contactSlice';
import industriesReducer from '../store/slices/industriesSlice';
import benchReducer from '../store/slices/benchSlice';
import payrollReducer from '../store/slices/payrollSlice';
import eorReducer from '../store/slices/eorSlice';
import staffAugmentationReducer from '../store/slices/staffAugmentationSlice';
import permanentStaffingReducer from '../store/slices/permanentStaffingSlice';
import findTalentReducer from '../store/slices/findTalentSlice';
import candidatePortalReducer from '../store/slices/candidatePortalSlice';

import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../ThemeProvider';

/**
 * Creates an isolated Redux store instance for testing
 */
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      home: homeReducer,
      about: aboutReducer,
      blog: blogReducer,
      contact: contactReducer,
      industries: industriesReducer,
      bench: benchReducer,
      payroll: payrollReducer,
      eor: eorReducer,
      staffAugmentation: staffAugmentationReducer,
      permanentStaffing: permanentStaffingReducer,
      findTalent: findTalentReducer,
      candidatePortal: candidatePortalReducer,
    },
    preloadedState,
  });
}

/**
 * Custom render helper that wraps the component with Redux Provider, ThemeProvider, and MemoryRouter
 */
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    initialEntries = ['/'],
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <HelmetProvider>
            <MemoryRouter initialEntries={initialEntries}>
              {children}
            </MemoryRouter>
          </HelmetProvider>
        </ThemeProvider>
      </Provider>
    );
  }

  return {
    store,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export * from '@testing-library/react';
export { userEvent };
