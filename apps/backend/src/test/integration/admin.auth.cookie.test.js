import { describe, it, expect } from 'vitest';
import { api, getAdminAuthCookie, getAdminCsrfPair } from '../test-helper.js';
import { generateAdminToken, setAdminAuthCookie } from '../../utils/auth.util.js';

describe('Admin HttpOnly Cookie Authentication & CSRF Protection', () => {
  describe('Admin Login & Cookie Issuance', () => {
    it('issues HttpOnly cookie and does NOT expose JWT in response body', async () => {
      const res = await api
        .post('/api/admin/auth/login')
        .send({
          email: 'admin@thinkwires.com',
          password: 'Admin@123456',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('admin@thinkwires.com');

      // VULNERABILITY FIX VERIFICATION:
      // The JWT token string must NEVER be returned in the JSON response body
      expect(res.body.token).toBeUndefined();

      // Verify Set-Cookie header contains thinkwires_admin_jwt
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const adminCookie = cookies.find((c) => c.startsWith('thinkwires_admin_jwt='));
      expect(adminCookie).toBeDefined();

      // Verify HttpOnly security flag
      expect(adminCookie.toLowerCase()).toContain('httponly');
      expect(adminCookie.toLowerCase()).toContain('path=/');
      expect(adminCookie.toLowerCase()).toContain('samesite=lax');

      // Verify CSRF cookie is also issued
      const csrfCookie = cookies.find((c) => c.startsWith('tw_admin_csrf='));
      expect(csrfCookie).toBeDefined();
      expect(res.body.csrfToken).toBeDefined();
    });

    it('rejects invalid password and does not issue cookies', async () => {
      const res = await api
        .post('/api/admin/auth/login')
        .send({
          email: 'admin@thinkwires.com',
          password: 'WrongPassword999!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      const cookies = res.headers['set-cookie'] || [];
      const adminCookie = cookies.find((c) => c.startsWith('thinkwires_admin_jwt='));
      expect(adminCookie).toBeUndefined();
    });
  });

  describe('Session Restoration (GET /api/admin/auth/me)', () => {
    it('restores authenticated session using HttpOnly cookie', async () => {
      const adminCookie = getAdminAuthCookie({
        id: 'adm-001',
        email: 'superadmin@thinkwires.com',
        name: 'Super Admin',
        role: 'superadmin',
      });

      const res = await api
        .get('/api/admin/auth/me')
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('superadmin@thinkwires.com');
      expect(res.body.csrfToken).toBeDefined();
    });

    it('rejects requests with missing cookie', async () => {
      const res = await api.get('/api/admin/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.authenticated).toBe(false);
    });

    it('rejects forged or corrupted cookies', async () => {
      const res = await api
        .get('/api/admin/auth/me')
        .set('Cookie', 'thinkwires_admin_jwt=forged.bogus.jwt');

      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid or forged/i);
    });
  });

  describe('Authenticated Endpoints & Authorization', () => {
    it('allows access to protected stats endpoint with valid admin cookie', async () => {
      const adminCookie = getAdminAuthCookie({
        id: 'adm-002',
        email: 'admin@thinkwires.com',
        name: 'Sarah Chen',
        role: 'admin',
      });

      const res = await api
        .get('/api/admin/stats?period=month')
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('kpis');
      expect(res.body).toHaveProperty('charts');
    });

    it('rejects candidate session cookie attempting to access admin endpoints', async () => {
      const res = await api
        .get('/api/admin/stats')
        .set('Cookie', 'thinkwires_candidate_jwt=candidate.token.mock');

      expect(res.status).toBe(401);
    });
  });

  describe('CSRF Protection on State-Changing Admin Endpoints', () => {
    it('rejects state-changing POST request when CSRF token is missing', async () => {
      const adminCookie = getAdminAuthCookie();

      const res = await api
        .post('/api/admin/employees')
        .set('Cookie', adminCookie)
        .send({
          name: 'New Employee',
          email: 'emp@thinkwires.com',
          role: 'Frontend Engineer',
        });

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/CSRF token missing or invalid/i);
    });

    it('rejects state-changing POST request when CSRF token mismatches cookie', async () => {
      const adminCookie = getAdminAuthCookie();

      const res = await api
        .post('/api/admin/employees')
        .set('Cookie', `${adminCookie}; tw_admin_csrf=token_A`)
        .set('X-CSRF-Token', 'token_B_mismatch')
        .send({
          name: 'New Employee',
          email: 'emp@thinkwires.com',
          role: 'Frontend Engineer',
        });

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/CSRF token missing or invalid/i);
    });

    it('accepts state-changing POST request when CSRF token matches', async () => {
      const adminCookie = getAdminAuthCookie({
        id: 'adm-001',
        email: 'admin@thinkwires.com',
        name: 'Super Admin',
        role: 'superadmin',
      });
      const csrf = getAdminCsrfPair();

      const res = await api
        .post('/api/admin/employees')
        .set('Cookie', `${adminCookie}; ${csrf.cookie}`)
        .set('X-CSRF-Token', csrf.token)
        .send({
          name: 'Test Secure Employee',
          email: `secure.emp.${Date.now()}@thinkwires.com`,
          designation: 'Senior Security Architect',
          department: 'Engineering',
          status: 'Active',
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Admin Logout & Cookie Clearance', () => {
    it('clears thinkwires_admin_jwt and tw_admin_csrf cookies on logout', async () => {
      const res = await api.post('/api/admin/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();

      const adminCookie = cookies.find((c) => c.startsWith('thinkwires_admin_jwt='));
      expect(adminCookie).toBeDefined();
      expect(adminCookie).toMatch(/Expires=Thu, 01 Jan 1970|Max-Age=0/i);

      const csrfCookie = cookies.find((c) => c.startsWith('tw_admin_csrf='));
      expect(csrfCookie).toBeDefined();
      expect(csrfCookie).toMatch(/Expires=Thu, 01 Jan 1970|Max-Age=0/i);
    });
  });

  describe('CORS and Trusted Origin Enforcement', () => {
    it('allows trusted frontend origin with credentials', async () => {
      const res = await api
        .get('/api/health')
        .set('Origin', 'http://localhost:5173');

      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });

    it('rejects untrusted origin via CORS policy', async () => {
      const res = await api
        .get('/api/health')
        .set('Origin', 'https://malicious-phishing-site.xyz');

      // Rejected by CORS callback with error response
      expect([400, 403, 500]).toContain(res.status);
    });
  });
});
