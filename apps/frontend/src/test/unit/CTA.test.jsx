/** @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CTA from '../../components/common/CTA';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import { MemoryRouter } from 'react-router-dom';

const store = configureStore({
  reducer: { auth: authReducer },
  preloadedState: { auth: { isAuthenticated: false, user: null } },
});

describe('CTA Component Enterprise Scoping Call (Issue #237)', () => {
  it('renders "Schedule Scoping Call" button in the employer card and opens ScopeCallModal', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CTA />
        </MemoryRouter>
      </Provider>
    );

    const scopeBtn = screen.getByRole('button', { name: /Schedule Scoping Call/i });
    expect(scopeBtn).toBeInTheDocument();

    fireEvent.click(scopeBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Schedule Technical Scoping Call')).toBeInTheDocument();
  });

  it('renders callback form and Quick Apply action button', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CTA />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Work Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Phone Number/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Request Immediate Talent Callback/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Drop Resume \/ Quick Apply/i })
    ).toBeInTheDocument();
  });
});

