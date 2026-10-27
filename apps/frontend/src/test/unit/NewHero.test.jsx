import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import NewHero from '../../components/HomeComponents/NewHero';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('NewHero Component CTAs', () => {
  it('renders "Hire Top Tech Talent" linking and redirecting to /talent-cloud', () => {
    mockNavigate.mockClear();
    renderWithProviders(<NewHero />);

    const hireBtn = screen.getByRole('link', { name: /Hire Top Tech Talent/i });
    expect(hireBtn).toBeInTheDocument();
    expect(hireBtn).toHaveAttribute('href', '/talent-cloud');

    fireEvent.click(hireBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/talent-cloud');
  });

  it('renders "Explore Hot Jobs" linking and redirecting to /hot-jobs', () => {
    mockNavigate.mockClear();
    renderWithProviders(<NewHero />);

    const exploreBtn = screen.getByRole('link', { name: /Explore Hot Jobs/i });
    expect(exploreBtn).toBeInTheDocument();
    expect(exploreBtn).toHaveAttribute('href', '/hot-jobs');

    fireEvent.click(exploreBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/hot-jobs');
  });
});
