import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import AboutHero from '../../components/AboutComponents/AboutHero';

describe('AboutHero Component & Floating Badge', () => {
  it('renders hero title and description correctly', () => {
    renderWithProviders(<AboutHero />);

    expect(
      screen.getByText(/Bridging Enterprise Innovation with/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Borderless Tech Talent/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Transforming Global IT Talent Delivery/i)
    ).toBeInTheDocument();
  });

  it('renders floating badge with crisp readable corridor text', () => {
    const { container } = renderWithProviders(<AboutHero />);

    const badge = container.querySelector('.AboutHero-floatingBadge');
    expect(badge).toBeInTheDocument();

    const badgeTitle = container.querySelector('.AboutHero-floatingBadgeTitle');
    expect(badgeTitle).toHaveTextContent(/Global Talent Grid/i);

    const badgeSubtitle = container.querySelector(
      '.AboutHero-floatingBadgeSubtitle'
    );
    expect(badgeSubtitle).toHaveTextContent(
      /India • United States • Canada/i
    );
  });
});
