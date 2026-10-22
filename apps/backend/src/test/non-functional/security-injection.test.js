import { describe, it, expect } from 'vitest';
import { api, getCandidateAuthCookie } from '../test-helper.js';

describe('Adversarial & Injection Defense (Non-Functional Tests)', () => {
  describe('SQL Injection Defense', () => {
    it('sanitizes classic SQL injection payload in login endpoint', async () => {
      const sqlInjectionPayloads = [
        "' OR '1'='1",
        "admin'--",
        "'; DROP TABLE candidates; --",
        "1' UNION SELECT * FROM users--",
      ];

      for (const payload of sqlInjectionPayloads) {
        const res = await api.post('/api/auth/login').send({
          email: payload,
          password: 'SomePassword123!',
        });

        // The server must reject the attempt gracefully without SQL syntax errors or 500 crashes
        expect([400, 401]).toContain(res.status);
        expect(res.body.success).toBe(false);
        expect(res.body.error).not.toMatch(
          /syntax error|sequelize|postgres|psql/i
        );
      }
    });

    it('rejects SQL injection probes in profile updates', async () => {
      const candidateCookie = getCandidateAuthCookie();

      const res = await api
        .put('/api/candidate/profile')
        .set('Cookie', candidateCookie)
        .send({
          headline: "Engineer'; DROP TABLE applications; --",
          location: "Dallas' OR 1=1--",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // Treated safely as inert string literal
      expect(res.body.candidate.headline).toContain(
        "'; DROP TABLE applications; --"
      );
    });
  });

  describe('NoSQL Injection Defense', () => {
    it('handles Mongo query operator object in email field safely', async () => {
      const res = await api.post('/api/auth/login').send({
        email: { $gt: '' },
        password: 'Password123!',
      });

      // Type checking / schema validation blocks object injection in string fields
      expect([400, 401, 500]).toContain(res.status);
      expect(res.body.success).toBe(false);
      expect(res.body.candidate).toBeUndefined();
    });
  });

  describe('Cookie Security Attributes', () => {
    it('sets HttpOnly, Path=/, and SameSite on authentication cookies', async () => {
      const res = await api.post('/api/auth/register').send({
        name: 'Cookie Security Candidate',
        email: `cookiesec.${Date.now()}@thinkwires.com`,
        password: 'SecurePassword2026!',
        confirmPassword: 'SecurePassword2026!',
      });

      expect(res.status).toBe(201);
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();

      const jwtCookie = cookies.find((c) =>
        c.startsWith('thinkwires_candidate_jwt=')
      );
      expect(jwtCookie).toBeDefined();
      expect(jwtCookie).toContain('HttpOnly');
      expect(jwtCookie).toContain('Path=/');
      expect(jwtCookie).toMatch(/SameSite=(Lax|Strict)/i);
    });
  });

  describe('ReDoS & Regular Expression Injection Defense', () => {
    it('safely handles adversarial regex metacharacters in search queries without crashing', async () => {
      const adversarialSearchTerms = [
        '([a-zA-Z]+)*',
        '((a+)+)+$',
        '[[[[[[[',
        '*+?^${}()|',
        '\\',
        '(?<=abc)',
      ];

      for (const term of adversarialSearchTerms) {
        const res = await api.get(`/api/admin/employees?search=${encodeURIComponent(term)}`);
        // Must never throw 500 SyntaxError or unhandled regex crash
        expect([200, 401]).toContain(res.status);
      }
    });
  });

  describe('Master Password Backdoor Elimination', () => {
    it('strictly rejects unauthorized master password attempts', async () => {
      const backdoorPasswords = [
        'Thinkwires@2026',
        'demo_password_secure',
        'demo_password_hash_secure',
        'supersecretadmin',
      ];

      for (const pwd of backdoorPasswords) {
        const res = await api.post('/api/admin/auth/login').send({
          email: 'admin@thinkwires.com',
          password: pwd,
        });

        // Unless this specific password matches the bcrypt hash, it MUST be rejected
        // Admin@123456 is the valid seeded password, all other backdoor strings must return 401
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      }
    });
  });

  describe('Broken Access Control & CMS Mutation Defense', () => {
    it('rejects unauthenticated attempts to overwrite CMS openings', async () => {
      const res = await api.post('/api/openings').send({
        openings: [{ title: 'Malicious Injected Job', company: 'Attacker' }],
      });
      expect(res.status).toBe(401);
    });

    it('rejects unauthenticated attempts to overwrite homepage statistics', async () => {
      const res = await api.post('/api/stats').send({
        stats: { activeEmployees: 999999 },
      });
      expect(res.status).toBe(401);
    });

    it('rejects unauthenticated attempts to overwrite payroll data', async () => {
      const res = await api.post('/api/payroll').send({
        payrollData: { headline: 'Defaced Site' },
      });
      expect(res.status).toBe(401);
    });
  });

  describe('Modern HTTP Security Headers Enforcement', () => {
    it('sets protective security headers on all responses', async () => {
      const res = await api.get('/api/health');
      expect(res.status).toBe(200);

      // Verify Clickjacking protection
      expect(res.headers['x-frame-options']).toBe('DENY');

      // Verify MIME-sniffing protection
      expect(res.headers['x-content-type-options']).toBe('nosniff');

      // Verify Content Security Policy
      expect(res.headers['content-security-policy']).toBeDefined();
      expect(res.headers['content-security-policy']).toContain("frame-ancestors 'none'");

      // Verify Referrer Policy
      expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });
  });
});
