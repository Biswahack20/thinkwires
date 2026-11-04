import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminLoginPage from '../../admin/AdminLoginPage';
import * as adminService from '../../admin/adminService';

describe('Admin Signout & Login Flow (Issue #194)', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('suppresses automatic session restoration when user arrives via signout (loggedOut: true)', async () => {
    const getMeSpy = vi.spyOn(adminService.adminApi, 'getMe');

    // Simulate arriving with loggedOut state
    render(
      <MemoryRouter initialEntries={[{ pathname: '/admin/login', state: { loggedOut: true } }]}>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify getMe was NOT called because loggedOut is true
    expect(getMeSpy).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /Sign In to Admin Portal/i })).toBeInTheDocument();
  });

  it('attempts session restoration only when valid cached user exists and not explicitly logged out', async () => {
    const getMeSpy = vi.spyOn(adminService.adminApi, 'getMe').mockResolvedValueOnce({
      user: { role: 'superadmin' },
    });
    vi.spyOn(adminService, 'getAdminUser').mockReturnValue({ role: 'superadmin' });

    render(
      <MemoryRouter initialEntries={['/admin/login']}>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<div>Admin Dashboard Target</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getMeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
