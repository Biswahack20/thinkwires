import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import LoginPage from '../../pages/auth/LoginPage';

describe('LoginPage (Integration with MSW)', () => {
  it('renders login form fields and branding', () => {
    renderWithProviders(<LoginPage />);

    expect(
      screen.getByPlaceholderText(/name@example\.com/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in to candidate dashboard/i })
    ).toBeInTheDocument();
  });

  it('validates client-side required fields on empty submit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const submitBtn = screen.getByRole('button', {
      name: /sign in to candidate dashboard/i,
    });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/email address is required/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('submits valid credentials and updates authentication state', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/name@example\.com/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitBtn = screen.getByRole('button', {
      name: /sign in to candidate dashboard/i,
    });

    await user.type(emailInput, 'jane@thinkwires.com');
    await user.type(passwordInput, 'Password123!');
    await user.click(submitBtn);

    await waitFor(() => {
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user.email).toBe('jane@thinkwires.com');
    });
  });

  it('displays error banner when API returns authentication failure', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/name@example\.com/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitBtn = screen.getByRole('button', {
      name: /sign in to candidate dashboard/i,
    });

    await user.type(emailInput, 'invalid@thinkwires.com');
    await user.type(passwordInput, 'WrongPassword!');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/invalid email or password/i)
      ).toBeInTheDocument();
    });
  });
});
