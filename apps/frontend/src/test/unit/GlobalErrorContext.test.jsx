import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { GlobalErrorProvider, useGlobalError } from '../../context/GlobalErrorContext';

const TestComponent = () => {
  const { showError, showWarning, showSuccess, showInfo } = useGlobalError();

  return (
    <div>
      <button onClick={() => showError('Failed to sync changes', 'Sync Error')}>
        Trigger Error
      </button>
      <button onClick={() => showWarning('Password will expire soon', 'Warning')}>
        Trigger Warning
      </button>
      <button onClick={() => showSuccess('Profile updated', 'Saved')}>
        Trigger Success
      </button>
    </div>
  );
};

describe('GlobalErrorContext & Toast System', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children and allows triggering error toasts', () => {
    render(
      <GlobalErrorProvider>
        <TestComponent />
      </GlobalErrorProvider>
    );

    const errorBtn = screen.getByText('Trigger Error');
    fireEvent.click(errorBtn);

    expect(screen.getByText('Sync Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to sync changes')).toBeInTheDocument();
  });

  it('allows dismissing a toast by clicking the close button', () => {
    render(
      <GlobalErrorProvider>
        <TestComponent />
      </GlobalErrorProvider>
    );

    fireEvent.click(screen.getByText('Trigger Error'));
    expect(screen.getByText('Sync Error')).toBeInTheDocument();

    const closeBtn = screen.getByLabelText(/close notification/i);
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Sync Error')).not.toBeInTheDocument();
  });

  it('renders different toast variants (warning, success)', () => {
    render(
      <GlobalErrorProvider>
        <TestComponent />
      </GlobalErrorProvider>
    );

    fireEvent.click(screen.getByText('Trigger Warning'));
    expect(screen.getByText('Password will expire soon')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Trigger Success'));
    expect(screen.getByText('Profile updated')).toBeInTheDocument();
  });

  it('automatically captures window unhandledrejection events and creates a toast', () => {
    render(
      <GlobalErrorProvider>
        <div>App Shell</div>
      </GlobalErrorProvider>
    );

    act(() => {
      const event = new Event('unhandledrejection');
      event.reason = new Error('Async background operation timed out');
      window.dispatchEvent(event);
    });

    expect(
      screen.getByText(/Async background operation timed out/i)
    ).toBeInTheDocument();
  });
});
