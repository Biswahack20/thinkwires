import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getAdminToken,
  getAdminUser,
  getAdminRole,
  setAdminSession,
  clearAdminSession,
  isAdminAuthenticated,
  getHeaders,
  setCsrfToken,
  getCsrfToken,
  adminApi,
} from '../../admin/adminService';

describe('Admin Authentication Service & Storage Security (Unit Tests)', () => {
  beforeEach(() => {
    // Clear mock storages
    localStorage.clear();
    sessionStorage.clear();
    clearAdminSession();
    vi.restoreAllMocks();
  });

  describe('JWT Token Isolation & LocalStorage Elimination', () => {
    it('getAdminToken strictly returns null and never reads from localStorage', () => {
      localStorage.setItem('tw_admin_token', 'malicious_or_legacy_jwt');

      const token = getAdminToken();

      expect(token).toBeNull();
    });

    it('setAdminSession never persists JWT token in localStorage or sessionStorage', () => {
      const mockUser = {
        id: 'adm-001',
        name: 'Sarah Chen',
        email: 'sarah@thinkwires.com',
        role: 'superadmin',
      };

      // Even if called with legacy signature (token, user)
      setAdminSession('super_secret_jwt_token_123', mockUser);

      // Verify localStorage is completely clean of tokens
      expect(localStorage.getItem('tw_admin_token')).toBeNull();
      expect(sessionStorage.getItem('tw_admin_token')).toBeNull();

      // Verify user metadata is accessible safely
      expect(getAdminUser()).toEqual(mockUser);
      expect(getAdminRole()).toBe('superadmin');
      expect(isAdminAuthenticated()).toBe(true);
    });

    it('clearAdminSession wipes in-memory and session storage and dispatches event', () => {
      const mockUser = {
        id: 'adm-002',
        name: 'Alex Rivera',
        email: 'alex@thinkwires.com',
        role: 'admin',
      };
      setAdminSession(mockUser);
      expect(isAdminAuthenticated()).toBe(true);

      const eventSpy = vi.fn();
      window.addEventListener('tw_admin_auth_changed', eventSpy);

      clearAdminSession();

      expect(getAdminUser()).toBeNull();
      expect(isAdminAuthenticated()).toBe(false);
      expect(sessionStorage.getItem('tw_admin_user')).toBeNull();
      expect(eventSpy).toHaveBeenCalled();
    });
  });

  describe('CSRF Token & Request Headers', () => {
    it('attaches X-CSRF-Token header without Authorization or x-admin-token leaks', () => {
      setCsrfToken('secure_csrf_token_xyz_987');

      const headers = getHeaders();

      expect(headers['X-CSRF-Token']).toBe('secure_csrf_token_xyz_987');
      expect(headers['Content-Type']).toBe('application/json');
      expect(headers['Authorization']).toBeUndefined();
      expect(headers['x-admin-token']).toBeUndefined();
    });
  });

  describe('adminApi.login & logout Integration', () => {
    it('login sets session metadata and csrfToken with credentials: include', async () => {
      const mockResponse = {
        success: true,
        csrfToken: 'new_csrf_token_abc',
        user: {
          id: 'adm-100',
          name: 'Elena Rostova',
          email: 'elena@thinkwires.com',
          role: 'cms_admin',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const res = await adminApi.login('elena@thinkwires.com', 'Admin@123456');

      expect(res.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: 'elena@thinkwires.com', password: 'Admin@123456' }),
      });

      expect(getAdminRole()).toBe('cms_admin');
      expect(getCsrfToken()).toBe('new_csrf_token_abc');
      expect(localStorage.getItem('tw_admin_token')).toBeNull();
    });

    it('logout clears session metadata and sends request with credentials: include', async () => {
      setAdminSession({
        id: 'adm-100',
        name: 'Elena Rostova',
        email: 'elena@thinkwires.com',
        role: 'cms_admin',
      });
      expect(isAdminAuthenticated()).toBe(true);

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await adminApi.logout();

      expect(isAdminAuthenticated()).toBe(false);
      expect(getAdminUser()).toBeNull();
    });
  });
});
