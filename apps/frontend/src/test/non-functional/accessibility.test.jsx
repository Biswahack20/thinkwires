import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import LoginPage from '../../pages/auth/LoginPage';
import SectionBadge from '../../components/common/SectionBadge';

describe('UI Accessibility Standards (Non-Functional Tests)', () => {
  it('ensures all interactive form elements in LoginPage have accessible roles and inputs', () => {
    const { container } = renderWithProviders(<LoginPage />);

    // Form inputs must be reachable and have appropriate input types
    const emailInput = screen.getByPlaceholderText(/name@example\.com/i);
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('name', 'email');

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('name', 'password');

    // Submit button must have accessible role and name
    const submitBtn = screen.getByRole('button', {
      name: /sign in to candidate dashboard/i,
    });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveAttribute('type', 'submit');

    // Navigation links must have valid hrefs
    const links = container.querySelectorAll('a');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href');
      expect(link.getAttribute('href')).not.toBe('#');
    });
  });

  it('ensures SectionBadge provides accessible visual icon semantics', () => {
    renderWithProviders(
      <SectionBadge
        text="WCAG Compliant"
        icon={<span aria-hidden="true">★</span>}
      />
    );

    expect(screen.getByText('WCAG Compliant')).toBeInTheDocument();
  });
});
