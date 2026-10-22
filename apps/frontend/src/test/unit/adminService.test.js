import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  adminApi,
  getAdminToken,
  getAdminUser,
  getAdminRole,
  setAdminSession,
  clearAdminSession,
  isAdminAuthenticated,
  getCsrfToken,
  setCsrfToken,
} from '../../admin/adminService';

describe('adminService Security & Session Management (Unit Tests)', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    clearAdminSession();
    vi.restoreAllMocks();
  });

  describe('Storage Token Leakage Prevention', () => {
    it('ensures getAdminToken() strictly returns null and never reads tokens', () => {
      localStorage.setItem('tw_admin_token', 'attacker-stolen-token');
      expect(getAdminToken()).toBeNull();
    });

    it('setAdminSession never writes tw_admin_token to localStorage or sessionStorage', () => {
      const mockUser = {
        id: 'adm-001',
        name: 'Super Administrator',
        email: 'superadmin@thinkwires.com',
        role: 'superadmin',
      };

      // Even if legacy code passes a token parameter
      setAdminSession('secret-jwt-token-string', mockUser);

      // Verify token was NOT stored
      expect(localStorage.getItem('tw_admin_token')).toBeNull();
      expect(sessionStorage.getItem('tw_admin_token')).toBeNull();

      // Verify non-sensitive user metadata was cached
      const storedUser = JSON.parse(localStorage.getItem('tw_admin_user'));
      expect(storedUser).toEqual(mockUser);
      expect(localStorage.getItem('tw_admin_role')).toBe('superadmin');
    });

    it('clearAdminSession thoroughly purges any legacy token and user state', () => {
      // Seed storage with legacy artifacts
      localStorage.setItem('tw_admin_token', 'legacy-leak');
      sessionStorage.setItem('tw_admin_token', 'legacy-leak');
      localStorage.setItem(
        'tw_admin_user',
        JSON.stringify({ name: 'Admin', role: 'admin' })
      );
      localStorage.setItem('tw_admin_role', 'admin');

      clearAdminSession();

      expect(localStorage.getItem('tw_admin_token')).toBeNull();
      expect(sessionStorage.getItem('tw_admin_token')).toBeNull();
      expect(localStorage.getItem('tw_admin_user')).toBeNull();
      expect(localStorage.getItem('tw_admin_role')).toBeNull();
      expect(isAdminAuthenticated()).toBe(false);
      expect(getCsrfToken()).toBeNull();
    });

    it('dispatches tw_admin_auth_changed event on session set and clear', () => {
      const authListener = vi.fn();
      window.addEventListener('tw_admin_auth_changed', authListener);

      const user = { name: 'CMS Admin', role: 'cms_admin' };
      setAdminSession(user);

      expect(authListener).toHaveBeenCalledTimes(1);
      expect(authListener.mock.calls[0][0].detail.user).toEqual(user);

      clearAdminSession();
      expect(authListener).toHaveBeenCalledTimes(2);
      expect(authListener.mock.calls[1][0].detail).toBeNull();

      window.removeEventListener('tw_admin_auth_changed', authListener);
    });
  });

  describe('Session State & Role Introspection', () => {
    it('isAdminAuthenticated reflects verified user cached state', () => {
      expect(isAdminAuthenticated()).toBe(false);

      setAdminSession({ id: '1', role: 'admin' });
      expect(isAdminAuthenticated()).toBe(true);

      clearAdminSession();
      expect(isAdminAuthenticated()).toBe(false);
    });

    it('getAdminRole normalizes role to lowercase', () => {
      setAdminSession({ role: 'SUPERADMIN' });
      expect(getAdminRole()).toBe('superadmin');

      setAdminSession({ role: 'CMS_Admin' });
      expect(getAdminRole()).toBe('cms_admin');
    });
  });

  describe('adminApi Network Client (Credentials & CSRF)', () => {
    it('login sends credentials: "include" and handles response without storing token in localStorage', async () => {
      const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          csrfToken: 'csrf-token-12345',
          user: {
            id: 'admin-01',
            name: 'Alexander Vance',
            email: 'admin@thinkwires.com',
            role: 'superadmin',
          },
        }),
      });

      const res = await adminApi.login('admin@thinkwires.com', 'Pass123!');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toBe('/api/admin/auth/login');
      expect(init.method).toBe('POST');
      expect(init.credentials).toBe('include'); // Sends/receives HttpOnly cookies

      // Token must not be stored in localStorage
      expect(localStorage.getItem('tw_admin_token')).toBeNull();
      expect(getCsrfToken()).toBe('csrf-token-12345');
      expect(isAdminAuthenticated()).toBe(true);
      expect(res.user.name).toBe('Alexander Vance');
    });

    it('logout calls /api/admin/auth/logout with credentials: "include" and purges session', async () => {
      setAdminSession({ id: '1', role: 'admin' });
      setCsrfToken('logout-csrf-token');

      const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await adminApi.logout();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toBe('/api/admin/auth/logout');
      expect(init.credentials).toBe('include');
      expect(init.headers['X-CSRF-Token']).toBe('logout-csrf-token');

      // State is purged
      expect(isAdminAuthenticated()).toBe(false);
      expect(getAdminUser()).toBeNull();
      expect(getCsrfToken()).toBeNull();
    });

    it('getMe calls /api/admin/auth/me with credentials: "include" to restore session', async () => {
      const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          csrfToken: 'refreshed-csrf-token',
          user: {
            id: 'restore-user',
            name: 'Elena Rostova',
            role: 'cms_admin',
          },
        }),
      });

      const res = await adminApi.getMe();

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/admin/auth/me',
        expect.objectContaining({
          credentials: 'include',
        })
      );
      expect(res.user.name).toBe('Elena Rostova');
      expect(getCsrfToken()).toBe('refreshed-csrf-token');
      expect(getAdminRole()).toBe('cms_admin');
    });

    it('state-changing CRUD requests automatically inject X-CSRF-Token and credentials: "include"', async () => {
      setCsrfToken('active-csrf-token-abc');

      const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true, employee: { id: 'emp-1' } }),
      });

      await adminApi.createEmployee({ name: 'John Doe', role: 'Developer' });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toBe('/api/admin/employees');
      expect(init.method).toBe('POST');
      expect(init.credentials).toBe('include');
      expect(init.headers['X-CSRF-Token']).toBe('active-csrf-token-abc');
      expect(init.headers['Content-Type']).toBe('application/json');
    });

    it('automatically purges session upon receiving 401 Unauthorized', async () => {
      setAdminSession({ id: 'expired-user', role: 'admin' });
      expect(isAdminAuthenticated()).toBe(true);

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Session expired' }),
      });

      await expect(adminApi.getEmployees()).rejects.toThrow();

      // Session cleared automatically
      expect(isAdminAuthenticated()).toBe(false);
      expect(getAdminUser()).toBeNull();
    });
  });
});
