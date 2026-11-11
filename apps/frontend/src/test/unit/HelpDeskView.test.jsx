import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import HelpDeskView from '../../admin/HelpDeskView';
import { adminApi } from '../../admin/adminService';
import { renderWithProviders } from '../test-utils';

const mockOutletContext = {
  showToast: vi.fn(),
  activeRole: 'admin',
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useOutletContext: () => mockOutletContext,
  };
});

describe('HelpDeskView Component (Unit Tests)', () => {
  const mockStats = {
    total: 12,
    new: 3,
    inReview: 4,
    replied: 5,
    infoInquiries: 5,
    hrInquiries: 7,
    routing: {
      overrideEmail: null,
      companyInfoEmail: 'info@thinkwires.com',
      hrRequisitionEmail: 'hr@thinkwires.com',
    },
  };

  const mockTickets = [
    {
      _id: 'hd-1',
      ticketId: 'HD-2026-001',
      category: 'General Inquiry',
      destinationEmail: 'info@thinkwires.com',
      fullName: 'Sarah Connor',
      email: 'sarah.connor@cyberdyne.org',
      phone: '+1 415 555 0199',
      company: 'Cyberdyne Systems',
      subject: 'Inquiry Regarding Global Payroll',
      message: 'We are expanding to India and need EOR and Payroll services.',
      status: 'New',
      priority: 'Urgent',
      createdAt: '2026-11-11T09:00:00.000Z',
      metadata: { country: 'India', headcount: '25-50' },
      internalNotes: [],
      replyHistory: [],
    },
    {
      _id: 'hd-2',
      ticketId: 'HD-2026-002',
      category: 'Enterprise Requisition',
      destinationEmail: 'hr@thinkwires.com',
      fullName: 'Marcus Wright',
      email: 'marcus@resistance.io',
      phone: '+1 415 555 0122',
      company: 'Resistance Tech',
      subject: 'Urgent Need for 3 Senior Kubernetes Engineers',
      message: 'Looking for 3 senior DevOps / Kubernetes engineers for immediate hire.',
      status: 'In Review',
      priority: 'High',
      createdAt: '2026-11-10T14:30:00.000Z',
      metadata: { targetRole: 'DevOps Lead' },
      internalNotes: [
        { author: 'Admin', note: 'Sent preliminary profile matches.', createdAt: '2026-11-10T15:00:00.000Z' },
      ],
      replyHistory: [],
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    mockOutletContext.showToast.mockClear();

    vi.spyOn(adminApi, 'getHelpDeskStats').mockResolvedValue({
      success: true,
      stats: mockStats,
    });

    vi.spyOn(adminApi, 'getHelpDeskTickets').mockResolvedValue({
      success: true,
      tickets: mockTickets,
      total: 2,
      totalPages: 1,
      page: 1,
    });

    vi.spyOn(adminApi, 'getHelpDeskTicketById').mockImplementation((id) => {
      const match = mockTickets.find((t) => t._id === id || t.ticketId === id);
      return Promise.resolve({ success: true, ticket: match || mockTickets[0] });
    });

    vi.spyOn(adminApi, 'updateHelpDeskTicket').mockResolvedValue({
      success: true,
      ticket: { ...mockTickets[0], status: 'In Review' },
    });

    vi.spyOn(adminApi, 'replyHelpDeskTicket').mockResolvedValue({
      success: true,
      ticket: { ...mockTickets[0], status: 'Replied' },
    });

    vi.spyOn(adminApi, 'convertHelpDeskToRequisition').mockResolvedValue({
      success: true,
      requisition: { id: 'req-101', title: 'Senior Kubernetes Engineers' },
      ticket: {
        ...mockTickets[0],
        status: 'In Review',
        metadata: { convertedRequisitionId: 'req-101' },
      },
    });
  });

  it('renders the HelpDesk title, routing badges, and KPI ribbon', async () => {
    renderWithProviders(<HelpDeskView />);

    await waitFor(() => {
      expect(
        screen.getByText('HelpDesk & Inbound Communications')
      ).toBeInTheDocument();
    });

    expect(screen.getByText('5-HOUR SLA ACTIVE')).toBeInTheDocument();
    expect(screen.getByText(/General Info: info@thinkwires\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/HR & Requisitions: hr@thinkwires\.com/i)).toBeInTheDocument();

    // KPI Cards
    expect(screen.getByText('TOTAL COMMUNICATIONS')).toBeInTheDocument();
    expect(screen.getByText('NEW & UNANSWERED')).toBeInTheDocument();
    expect(screen.getByText('GENERAL INQUIRIES')).toBeInTheDocument();
    expect(screen.getByText('TALENT & REQUISITIONS')).toBeInTheDocument();
  });

  it('displays category tabs and table rows for loaded tickets', async () => {
    renderWithProviders(<HelpDeskView />);

    await waitFor(() => {
      expect(screen.getByText('Sarah Connor')).toBeInTheDocument();
      expect(screen.getByText('Marcus Wright')).toBeInTheDocument();
    });

    expect(screen.getByText('HD-2026-001')).toBeInTheDocument();
    expect(screen.getByText('Cyberdyne Systems')).toBeInTheDocument();
    expect(screen.getByText('HD-2026-002')).toBeInTheDocument();
    expect(screen.getByText('Resistance Tech')).toBeInTheDocument();

    // Check category tabs
    expect(screen.getByText('All Inquiries')).toBeInTheDocument();
    expect(screen.getByText('General Info')).toBeInTheDocument();
    expect(screen.getByText('Talent Callbacks')).toBeInTheDocument();
    expect(screen.getByText('Requisitions')).toBeInTheDocument();
  });

  it('opens slide-over drawer when clicking a ticket row and displays sender details', async () => {
    renderWithProviders(<HelpDeskView />);

    await waitFor(() => {
      expect(screen.getByText('Sarah Connor')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByRole('button', { name: /View Desk/i });
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Sender Information')).toBeInTheDocument();
      expect(screen.getByText('Inbound Message Body')).toBeInTheDocument();
      expect(
        screen.getAllByText('We are expanding to India and need EOR and Payroll services.').length
      ).toBeGreaterThanOrEqual(1);
    });

    // Check email and phone links
    const emailLink = screen.getByRole('link', { name: /sarah\.connor@cyberdyne\.org/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:sarah.connor@cyberdyne.org');

    const phoneLink = screen.getByRole('link', { name: /\+1 415 555 0199/i });
    expect(phoneLink).toHaveAttribute('href', 'tel:+1 415 555 0199');
  });

  it('supports sending direct email reply from ticket drawer', async () => {
    renderWithProviders(<HelpDeskView />);

    await waitFor(() => {
      expect(screen.getByText('Sarah Connor')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Sarah Connor'));

    await waitFor(() => {
      expect(screen.getByText('Send Direct Email Reply')).toBeInTheDocument();
    });

    const replyInput = screen.getByPlaceholderText(/Draft response to Sarah Connor/i);
    fireEvent.change(replyInput, {
      target: { value: 'Hello Sarah, we can set up your India payroll entity in 48 hours.' },
    });

    const sendBtn = screen.getByRole('button', { name: /Send Email Reply/i });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(adminApi.replyHelpDeskTicket).toHaveBeenCalledWith(
        'hd-1',
        expect.objectContaining({
          replyMessage: 'Hello Sarah, we can set up your India payroll entity in 48 hours.',
        })
      );
      expect(mockOutletContext.showToast).toHaveBeenCalledWith(
        expect.stringContaining('Reply dispatched via email')
      );
    });
  });

  it('supports 1-click converting an inquiry to a client requisition', async () => {
    renderWithProviders(<HelpDeskView />);

    await waitFor(() => {
      expect(screen.getByText('Sarah Connor')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Sarah Connor'));

    await waitFor(() => {
      expect(screen.getByText('Convert to Requisition')).toBeInTheDocument();
    });

    const convertBtn = screen.getByRole('button', { name: /Convert to Requisition/i });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(adminApi.convertHelpDeskToRequisition).toHaveBeenCalledWith('hd-1');
      expect(mockOutletContext.showToast).toHaveBeenCalledWith(
        expect.stringContaining('Inquiry converted into Client Requisition mandate')
      );
    });
  });

  it('has zero emojis anywhere in the rendered component', async () => {
    const { container } = renderWithProviders(<HelpDeskView />);

    await waitFor(() => {
      expect(screen.getByText('Sarah Connor')).toBeInTheDocument();
    });

    // Check for emojis using standard emoji Unicode regex range
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(container.innerHTML)).toBe(false);
  });
});
