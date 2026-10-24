import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GlobalErrorBoundary from '../../components/common/GlobalErrorBoundary';

// Component that throws on demand
const ProblemChild = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Simulated crash in ProblemChild');
  }
  return <div data-testid="child-content">Child content rendered successfully</div>;
};

describe('GlobalErrorBoundary Component', () => {
  // Suppress console.error during expected boundary tests
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children properly when no errors are thrown', () => {
    render(
      <GlobalErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </GlobalErrorBoundary>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('catches render error and displays the recovery UI', () => {
    render(
      <GlobalErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/An Unexpected Issue Occurred/i)).toBeInTheDocument();
    expect(screen.getByText(/Reload Application/i)).toBeInTheDocument();
    expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
    expect(screen.getByText(/Return Home/i)).toBeInTheDocument();
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
  });

  it('toggles technical diagnostics drawer when toggle button is clicked', () => {
    render(
      <GlobalErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    const toggleBtn = screen.getByText(/View Technical Diagnostics/i);
    expect(toggleBtn).toBeInTheDocument();

    // Click to expand
    fireEvent.click(toggleBtn);
    expect(
      screen.getAllByText(/Simulated crash in ProblemChild/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/Hide Technical Details/i)).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(screen.getByText(/Hide Technical Details/i));
    expect(
      screen.queryAllByText(/Simulated crash in ProblemChild/i).length
    ).toBe(0);
  });

  it('calls onError callback when supplied', () => {
    const onErrorSpy = vi.fn();

    render(
      <GlobalErrorBoundary onError={onErrorSpy}>
        <ProblemChild shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    expect(onErrorSpy).toHaveBeenCalledTimes(1);
    expect(onErrorSpy.mock.calls[0][0].message).toBe('Simulated crash in ProblemChild');
  });

  it('renders custom fallback function if provided', () => {
    const customFallback = ({ error }) => (
      <div data-testid="custom-fallback">Custom Error: {error.message}</div>
    );

    render(
      <GlobalErrorBoundary fallback={customFallback}>
        <ProblemChild shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.getByText(/Custom Error: Simulated crash in ProblemChild/i)).toBeInTheDocument();
  });
});
