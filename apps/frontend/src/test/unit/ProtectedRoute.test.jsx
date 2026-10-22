import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import { renderWithProviders } from '../test-utils';

// Helper component to verify redirect destination in test router
const LoginSpy = () => {
  const location = useLocation();
  return <div data-testid="login-page">Login Page: {location.search}</div>;
};

describe('ProtectedRoute Component', () => {
  it('renders loading state while session verification is initializing', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Secret Candidate Dashboard</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            isInitializing: true,
            isAuthenticated: false,
            user: null,
          },
        },
      }
    );

    expect(screen.getByText(/verifying secure session/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/secret candidate dashboard/i)
    ).not.toBeInTheDocument();
  });

  it('redirects unauthenticated user to login with preserved redirect query param', () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute>
              <div>Secret Candidate Dashboard</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginSpy />} />
      </Routes>,
      {
        initialEntries: ['/candidate/dashboard?filter=recent'],
        preloadedState: {
          auth: {
            isInitializing: false,
            isAuthenticated: false,
            user: null,
          },
        },
      }
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    // Verify target path was properly encoded into the query param
    expect(screen.getByTestId('login-page')).toHaveTextContent(
      'redirect=%2Fcandidate%2Fdashboard%3Ffilter%3Drecent'
    );
    expect(
      screen.queryByText(/secret candidate dashboard/i)
    ).not.toBeInTheDocument();
  });

  it('renders protected children when user is authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div data-testid="dashboard-content">Welcome to Candidate Portal</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            isInitializing: false,
            isAuthenticated: true,
            user: { id: 'c123', name: 'Jane Candidate' },
          },
        },
      }
    );

    expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
    expect(screen.getByText('Welcome to Candidate Portal')).toBeInTheDocument();
    expect(
      screen.queryByText(/verifying secure session/i)
    ).not.toBeInTheDocument();
  });
});
