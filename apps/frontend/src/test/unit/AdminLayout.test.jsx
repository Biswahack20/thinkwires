import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import AdminLayout from '../../admin/AdminLayout';
import { adminApi, setAdminSession } from '../../admin/adminService';
import { renderWithProviders } from '../test-utils';

describe('AdminLayout Sidebar Requisition Badge (Issue #117)', () => {
  const mockAdminUser = {
    id: 'admin-1',
    name: 'Admin Test',
    email: 'admin@thinkwires.com',
    role: 'admin',
  };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();

    setAdminSession('dummy', mockAdminUser);
    vi.spyOn(adminApi, 'getMe').mockResolvedValue({ user: mockAdminUser });
  });

  it('does not display a hardcoded badge ("2") before dashboard stats finish loading', async () => {
    let resolveStats;
    const statsPromise = new Promise((resolve) => {
      resolveStats = resolve;
    });
    vi.spyOn(adminApi, 'getDashboardStats').mockReturnValue(statsPromise);

    renderWithProviders(<AdminLayout />, {
      initialEntries: ['/admin'],
    });

    await waitFor(() => {
      expect(screen.getByText('Requisition Requests')).toBeInTheDocument();
    });

    expect(screen.queryByText('2')).not.toBeInTheDocument();
    const reqLink = screen.getByText('Requisition Requests').closest('a');
    expect(reqLink.querySelector('.tw-nav-badge')).toBeNull();

    await act(async () => {
      resolveStats({
        kpis: { pendingRequisitionsSla: 0 },
        announcements: [],
      });
    });
  });

  it('renders badge with correct count when pending requisitions exist', async () => {
    vi.spyOn(adminApi, 'getDashboardStats').mockResolvedValue({
      kpis: { pendingRequisitionsSla: 5 },
      announcements: [],
    });

    renderWithProviders(<AdminLayout />, {
      initialEntries: ['/admin'],
    });

    await waitFor(() => {
      expect(screen.getByText('Requisition Requests')).toBeInTheDocument();
    });

    await waitFor(() => {
      const badge = screen.getByText('5');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('tw-nav-badge');
    });
  });

  it('does not render badge when pending requisitions count is 0', async () => {
    vi.spyOn(adminApi, 'getDashboardStats').mockResolvedValue({
      kpis: { pendingRequisitionsSla: 0 },
      announcements: [],
    });

    renderWithProviders(<AdminLayout />, {
      initialEntries: ['/admin'],
    });

    await waitFor(() => {
      expect(screen.getByText('Requisition Requests')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(adminApi.getDashboardStats).toHaveBeenCalled();
    });

    const reqLink = screen.getByText('Requisition Requests').closest('a');
    expect(reqLink.querySelector('.tw-nav-badge')).toBeNull();
  });
});
