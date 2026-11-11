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

describe('NewHero Component Layout & Headline Visibility', () => {
  it('renders H1 headline and description with 100% full text visibility', () => {
    const { container } = renderWithProviders(<NewHero />);

    const section = container.querySelector('.NewHero-heroSection');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('NewHero-section');

    const h1Heading = screen.getByRole('heading', { level: 1 });
    expect(h1Heading).toBeInTheDocument();
    expect(h1Heading).toHaveTextContent(
      /Your Trusted Partner For\s+High-Quality IT Recruitment\s+& Talent Augmentation/i
    );

    const description = container.querySelector('.NewHero-description');
    expect(description).toBeInTheDocument();
  });
});

describe('NewHero Component CTAs and Search Form', () => {
  it('renders primary CTA linking and redirecting to /talent-cloud', () => {
    mockNavigate.mockClear();
    renderWithProviders(<NewHero />);

    const hireBtn = screen.getByRole('link', {
      name: /Deploy Bench Pool|Hire Top Tech Talent/i,
    });
    expect(hireBtn).toBeInTheDocument();

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

  it('renders search form fields with accessible labels and placeholders', () => {
    renderWithProviders(<NewHero />);

    const roleInput = screen.getByLabelText(/Role or Skill/i);
    expect(roleInput).toBeInTheDocument();
    expect(roleInput).toHaveAttribute(
      'placeholder',
      'e.g. SAP ABAP, AEM, Ledger...'
    );

    const locationSelect = screen.getByLabelText(/Location/i);
    expect(locationSelect).toBeInTheDocument();

    const expSelect = screen.getByLabelText(/Experience/i);
    expect(expSelect).toBeInTheDocument();
  });

  it('provides single-letter skill suggestions when typing in role or skill input', () => {
    renderWithProviders(<NewHero />);

    const roleInput = screen.getByLabelText(/Role or Skill/i);
    fireEvent.change(roleInput, { target: { value: 'r' } });
    fireEvent.focus(roleInput);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('navigates to /bench (Bench Pool) with query parameters upon submitting the search form', () => {
    mockNavigate.mockClear();
    renderWithProviders(<NewHero />);

    const roleInput = screen.getByLabelText(/Role or Skill/i);
    fireEvent.change(roleInput, { target: { value: 'React' } });

    const submitBtn = screen.getByRole('button', { name: /find matches/i });
    fireEvent.click(submitBtn);

    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/bench',
      search: '?search=React',
    });
  });
});
