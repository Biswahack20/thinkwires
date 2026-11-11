/** @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScopeCallModal from '../../components/common/ScopeCallModal';

describe('ScopeCallModal Component (Issue #237)', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<ScopeCallModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders all required enterprise scoping fields with accessible labels when open', () => {
    render(<ScopeCallModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Schedule Technical Scoping Call')).toBeInTheDocument();
    expect(screen.getByLabelText(/Company \/ Enterprise Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Corporate Work Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Primary Technical Domain/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hiring Volume \/ Headcount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Deployment Timeline/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preferred Consultation Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preferred Time Slot/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Project Scope & Engineering Constraints/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Schedule Scoping Call/i })).toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<ScopeCallModal isOpen={true} onClose={onClose} />);

    const closeBtn = screen.getByLabelText(/Close scoping call modal/i);
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('triggers onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<ScopeCallModal isOpen={true} onClose={onClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('triggers onClose when overlay backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<ScopeCallModal isOpen={true} onClose={onClose} />);

    const overlay = screen.getByTestId('scope-modal-overlay');
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows error banner when submitted with empty required fields', async () => {
    render(<ScopeCallModal {...defaultProps} />);

    const submitBtn = screen.getByRole('button', { name: /Schedule Scoping Call/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Company Name is required/i)).toBeInTheDocument();
  });

  it('validates corporate email format', async () => {
    render(<ScopeCallModal {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Company \/ Enterprise Name/i), {
      target: { value: 'FinTech Dynamics' },
    });
    fireEvent.change(screen.getByLabelText(/Contact Full Name/i), {
      target: { value: 'Robert Vance' },
    });
    fireEvent.change(screen.getByLabelText(/Corporate Work Email/i), {
      target: { value: 'not-an-email' },
    });

    const submitBtn = screen.getByRole('button', { name: /Schedule Scoping Call/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Please provide a valid corporate work email address/i)).toBeInTheDocument();
  });

  it('successfully submits scoping call and displays confirmation screen with mandate reference ID', async () => {
    render(<ScopeCallModal {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Company \/ Enterprise Name/i), {
      target: { value: 'Horizon Aerospace' },
    });
    fireEvent.change(screen.getByLabelText(/Contact Full Name/i), {
      target: { value: 'Elena Rostova' },
    });
    fireEvent.change(screen.getByLabelText(/Corporate Work Email/i), {
      target: { value: 'elena@horizonaero.com' },
    });
    fireEvent.change(screen.getByLabelText(/Phone \/ WhatsApp/i), {
      target: { value: '+1 (415) 890-1234' },
    });

    const submitBtn = screen.getByRole('button', { name: /Schedule Scoping Call/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('scope-modal-success')).toBeInTheDocument();
    });

    expect(screen.getByText('Scoping Call Confirmed')).toBeInTheDocument();
    expect(screen.getByText(/REQ-MOCK-237/)).toBeInTheDocument();
    expect(screen.getByText(/Horizon Aerospace/)).toBeInTheDocument();

    const doneBtn = screen.getByRole('button', { name: /Done & Close/i });
    fireEvent.click(doneBtn);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('contains zero emojis in all modal text and labels', () => {
    const { container } = render(<ScopeCallModal {...defaultProps} />);
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/u;
    expect(emojiRegex.test(container.textContent || '')).toBe(false);
  });
});

