import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { renderWithProviders } from '../test-utils';
import LoginPage from '../../pages/auth/LoginPage';
import CandidateApplicationsPage from '../../pages/candidate/CandidateApplicationsPage';

describe('UI Chaos & Exploratory Fuzzing (Exploratory Tests)', () => {
  it('handles rapid multi-click storm on login button without throwing unhandled exceptions', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const submitBtn = screen.getByRole('button', {
      name: /sign in to candidate dashboard/i,
    });

    // Rapidly click submit 10 times in a fraction of a second
    const clickStorm = [];
    for (let i = 0; i < 10; i++) {
      clickStorm.push(user.click(submitBtn));
    }
    await Promise.all(clickStorm);

    // Form handles click storm gracefully by rendering validation without crashing
    expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
  });

  it('safely handles extreme input fuzzing and script tags in form fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/name@example\.com/i);

    // Inject characters with script tag payloads
    const chaosPayload =
      "<script>alert('XSS')</script>" + 'A'.repeat(50) + '@evil.com';
    await user.type(emailInput, chaosPayload);

    // Input safely holds the string as a literal without executing or breaking React state
    expect(emailInput.value).toContain("<script>alert('XSS')</script>");
  });

  it('gracefully renders empty state when API returns empty applications array', async () => {
    // Override MSW to return empty list
    server.use(
      http.get('/api/candidate/applications', () => {
        return HttpResponse.json({
          success: true,
          applications: [],
        });
      })
    );

    renderWithProviders(<CandidateApplicationsPage />);

    // Should render empty state message instead of crashing
    await waitFor(() => {
      expect(
        screen.getByText(/no active applications found/i)
      ).toBeInTheDocument();
    });
  });

  it('safely handles corrupted API payload missing application fields', async () => {
    // Override MSW with missing properties
    server.use(
      http.get('/api/candidate/applications', () => {
        return HttpResponse.json({
          success: true,
          applications: [
            {
              _id: 'corrupt-1',
              // missing jobTitle, status, appliedAt
            },
          ],
        });
      })
    );

    renderWithProviders(<CandidateApplicationsPage />);

    // Component renders without crashing with TypeError: Cannot read properties of undefined
    await waitFor(() => {
      expect(
        screen.getByText(/my tracked job applications/i)
      ).toBeInTheDocument();
    });
  });
});
