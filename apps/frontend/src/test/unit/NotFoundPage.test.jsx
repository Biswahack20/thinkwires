import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders, screen, within } from '../test-utils';
import NotFoundPage from '../../pages/NotFoundPage';

describe('NotFoundPage Component (Issue #190: Candidate Portal Link Fix)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders 404 heading and helpful guidance message', () => {
    renderWithProviders(<NotFoundPage />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Does Not Exist')).toBeInTheDocument();
    expect(screen.getByText(/The link you accessed may be outdated/i)).toBeInTheDocument();
  });

  it('verifies Candidate Portal link points directly to /candidate/dashboard', () => {
    renderWithProviders(<NotFoundPage />);

    const candidatePortalLink = screen.getByRole('link', { name: 'Candidate Portal' });
    expect(candidatePortalLink).toBeInTheDocument();
    expect(candidatePortalLink).toHaveAttribute('href', '/candidate/dashboard');
  });

  it('verifies quick directory links in main 404 section', () => {
    renderWithProviders(<NotFoundPage />);

    const mainElement = screen.getByRole('main');
    const linksInMain = within(mainElement).getAllByRole('link');
    const hrefs = linksInMain.map((link) => link.getAttribute('href'));

    expect(hrefs).toContain('/candidate/dashboard');
    expect(hrefs).toContain('/about');
    expect(hrefs).toContain('/bench');
    expect(hrefs).toContain('/contact');
  });
});
