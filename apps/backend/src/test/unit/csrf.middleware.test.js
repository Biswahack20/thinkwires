import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  isAllowedOrigin,
  getAllowedOrigins,
  adminCsrfProtection,
  CSRF_COOKIE_NAME,
  generateCsrfToken,
} from '../../middlewares/csrf.middleware.js';

describe('CSRF & Origin Verification (Unit Tests)', () => {
  const origEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...origEnv };
  });

  afterEach(() => {
    process.env = { ...origEnv };
  });

  describe('isAllowedOrigin', () => {
    it('allows missing or null origin for direct server-to-server requests', () => {
      expect(isAllowedOrigin(null)).toBe(true);
      expect(isAllowedOrigin(undefined)).toBe(true);
      expect(isAllowedOrigin('')).toBe(true);
    });

    it('allows default local development origins when not in production', () => {
      delete process.env.ALLOWED_ORIGINS;
      process.env.NODE_ENV = 'development';

      expect(isAllowedOrigin('http://localhost:5173')).toBe(true);
      expect(isAllowedOrigin('http://localhost:5000')).toBe(true);
      expect(isAllowedOrigin('http://127.0.0.1:5173')).toBe(true);
    });

    it('rejects arbitrary *.vercel.app subdomains (no wildcard trust)', () => {
      process.env.ALLOWED_ORIGINS = 'https://thinkwires.vercel.app';

      expect(isAllowedOrigin('https://attacker-pwned.vercel.app')).toBe(false);
      expect(isAllowedOrigin('https://evil.vercel.app')).toBe(false);
      expect(isAllowedOrigin('https://fake-thinkwires.vercel.app')).toBe(false);
      expect(isAllowedOrigin('https://vercel.app')).toBe(false);
    });

    it('allows exact Vercel deployment URL specified in ALLOWED_ORIGINS', () => {
      process.env.ALLOWED_ORIGINS = 'https://thinkwires.vercel.app';

      expect(isAllowedOrigin('https://thinkwires.vercel.app')).toBe(true);
    });

    it('normalizes trailing slashes in both configuration and incoming origin', () => {
      process.env.ALLOWED_ORIGINS = 'https://thinkwires.vercel.app/';

      expect(isAllowedOrigin('https://thinkwires.vercel.app')).toBe(true);
      expect(isAllowedOrigin('https://thinkwires.vercel.app/')).toBe(true);
    });

    it('enforces strict ALLOWED_ORIGINS list in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.ALLOWED_ORIGINS = 'https://production.thinkwires.com';

      // Local dev origins should be rejected in production
      expect(isAllowedOrigin('http://localhost:5173')).toBe(false);
      expect(isAllowedOrigin('http://localhost:5000')).toBe(false);

      // Only configured origin is permitted
      expect(isAllowedOrigin('https://production.thinkwires.com')).toBe(true);
      expect(isAllowedOrigin('https://untrusted.com')).toBe(false);
    });
  });

  describe('adminCsrfProtection middleware', () => {
    const createMockRes = () => {
      const res = {
        statusCode: 200,
        headers: {},
        cookies: {},
        cookie(name, val, opts) {
          this.cookies[name] = { val, opts };
        },
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.body = data;
          return this;
        },
      };
      return res;
    };

    it('blocks state-changing requests originating from untrusted *.vercel.app domain', () => {
      process.env.ALLOWED_ORIGINS = 'https://thinkwires.vercel.app';

      const req = {
        method: 'POST',
        path: '/admin/settings',
        headers: {
          origin: 'https://attacker-pwned.vercel.app',
        },
        cookies: {},
      };
      const res = createMockRes();
      let nextCalled = false;

      adminCsrfProtection(req, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(false);
      expect(res.statusCode).toBe(403);
      expect(res.body.error).toMatch(/Untrusted origin or referer/i);
    });

    it('allows requests with valid CSRF token from exact allowed origin', () => {
      process.env.ALLOWED_ORIGINS = 'https://thinkwires.vercel.app';

      const token = generateCsrfToken();
      const req = {
        method: 'POST',
        path: '/admin/update',
        headers: {
          origin: 'https://thinkwires.vercel.app',
          'x-csrf-token': token,
        },
        cookies: {
          thinkwires_admin_jwt: 'valid.token',
          [CSRF_COOKIE_NAME]: token,
        },
      };
      const res = createMockRes();
      let nextCalled = false;

      adminCsrfProtection(req, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(true);
      expect(res.statusCode).toBe(200);
    });
  });
});
