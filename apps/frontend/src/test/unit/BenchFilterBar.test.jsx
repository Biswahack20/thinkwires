import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import BenchFilterBar from '../../components/BenchComponents/BenchFilterBar';

describe('BenchFilterBar Quick Notice Period Toggles (Issue #166)', () => {
  it('renders quick toggles for Immediate (48h), Within 7 Days, and Within 15 Days', () => {
    renderWithProviders(<BenchFilterBar totalCount={42} />);

    expect(screen.getByRole('button', { name: /immediate \(48h\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /within 7 days/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /within 15 days/i })).toBeInTheDocument();
  });

  it('sets active class when a quick toggle matches activeNoticePeriod', () => {
    const preloadedState = {
      bench: {
        activeNoticePeriod: 'Within 7 Days',
      },
    };

    renderWithProviders(<BenchFilterBar totalCount={42} />, { preloadedState });

    const btn7 = screen.getByRole('button', { name: /within 7 days/i });
    expect(btn7).toHaveClass('is-active');

    const btn48 = screen.getByRole('button', { name: /immediate \(48h\)/i });
    expect(btn48).not.toHaveClass('is-active');
  });

  it('updates state when clicking a quick toggle button', () => {
    const { store } = renderWithProviders(<BenchFilterBar totalCount={42} />);

    const btn48 = screen.getByRole('button', { name: /immediate \(48h\)/i });
    fireEvent.click(btn48);

    expect(store.getState().bench.activeNoticePeriod).toBe('Immediate (48h)');
  });
});
