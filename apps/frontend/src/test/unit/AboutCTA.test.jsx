/** @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutCTA from '../../components/AboutComponents/AboutCTA';
import { renderWithProviders } from '../test-utils';

describe('AboutCTA Strategy Call Component', () => {
  it('renders the "Request a 20-Min Strategy Call" form header and fields', () => {
    renderWithProviders(<AboutCTA />);

    expect(
      screen.getByRole('heading', { name: /Request a 20-Min Strategy Call/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Receive matched engineering profiles in under 5 hours\./i)
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/Full Name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Work Email \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Primary Need/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tech Roles & Team Size/i)).toBeInTheDocument();
  });

  it('renders the Primary Need select with proper class and options', () => {
    renderWithProviders(<AboutCTA />);

    const select = screen.getByLabelText(/Primary Need/i);
    expect(select).toBeInTheDocument();
    expect(select).toHaveClass('AboutCTA-select');
    expect(select.tagName).toBe('SELECT');

    // Default value should be Staff Augmentation
    expect(select.value).toBe('Staff Augmentation');

    // All required options are present
    const options = screen.getAllByRole('option');
    const optionValues = options.map((opt) => opt.value);
    expect(optionValues).toContain('Staff Augmentation');
    expect(optionValues).toContain('Employer of Record (EOR)');
    expect(optionValues).toContain('Permanent Tech Recruitment');
    expect(optionValues).toContain('Payroll Outsourcing');

    // Should update value on user selection
    fireEvent.change(select, { target: { value: 'Employer of Record (EOR)' } });
    expect(select.value).toBe('Employer of Record (EOR)');
  });
});
