import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { renderWithProviders } from '../test-utils';
import CandidateApplicationsPage from '../../pages/candidate/CandidateApplicationsPage';

describe('CandidateApplicationsPage (Integration with MSW)', () => {
  it('displays loading state during initial applications fetch', () => {
    renderWithProviders(<CandidateApplicationsPage />);
    expect(
      screen.getByText(/retrieving your applications/i)
    ).toBeInTheDocument();
  });

  it('renders tracked applications retrieved from the API', async () => {
    renderWithProviders(<CandidateApplicationsPage />);

    // Wait for the table rows to populate from MSW mock
    await waitFor(() => {
      expect(
        screen.getByText('Senior Full Stack Engineer')
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText('AI / Machine Learning Architect')
    ).toBeInTheDocument();
    expect(screen.getByText('Technical Screening')).toBeInTheDocument();
    expect(screen.getByText('Offer Extended')).toBeInTheDocument();
  });

  it('allows candidate to withdraw an application with optimistic update and notice', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CandidateApplicationsPage />);

    // Wait for applications to load
    await waitFor(() => {
      expect(
        screen.getByText('Senior Full Stack Engineer')
      ).toBeInTheDocument();
    });

    // Find withdraw buttons
    const withdrawButtons = screen.getAllByRole('button', {
      name: /withdraw/i,
    });
    expect(withdrawButtons.length).toBeGreaterThan(0);

    // Click withdraw on the first active application
    await user.click(withdrawButtons[0]);

    // Verify success banner and updated status
    await waitFor(() => {
      expect(
        screen.getByText(/application withdrawn successfully/i)
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Withdrawn by Candidate')).toBeInTheDocument();
  });

  it('dismisses notice message when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CandidateApplicationsPage />, {
      initialEntries: ['/candidate/applications?applied=true'],
    });

    await waitFor(() => {
      expect(screen.getByText(/application submitted/i)).toBeInTheDocument();
    });

    const dismissBtn = screen.getByRole('button', { name: /dismiss alert/i });
    await user.click(dismissBtn);

    expect(
      screen.queryByText(/application submitted/i)
    ).not.toBeInTheDocument();
  });

  it('renders error alert when API request fails', async () => {
    // Override MSW handler to return 500
    server.use(
      http.get('/api/candidate/applications', () => {
        return HttpResponse.json(
          { error: 'Internal service unavailable' },
          { status: 500 }
        );
      })
    );

    renderWithProviders(<CandidateApplicationsPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Internal service unavailable')
      ).toBeInTheDocument();
    });
  });

  it('renders empty state when candidate has no applications', async () => {
    // Override MSW handler to return empty array
    server.use(
      http.get('/api/candidate/applications', () => {
        return HttpResponse.json({ success: true, applications: [] });
      })
    );

    renderWithProviders(<CandidateApplicationsPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/no active applications found/i)
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole('link', { name: /browse curated job openings/i })
    ).toBeInTheDocument();
  });
});
