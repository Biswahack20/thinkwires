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

  describe('Security Headers & Content-Security-Policy', () => {
    it('sets Content-Security-Policy and protective HTTP headers on responses', async () => {
      const res = await api.get('/api/health');

      expect(res.status).toBe(200);
      expect(res.headers['content-security-policy']).toBeDefined();
      expect(res.headers['content-security-policy']).toContain(
        "default-src 'self'"
      );
      expect(res.headers['content-security-policy']).toContain(
        'https://fonts.googleapis.com'
      );
      expect(res.headers['content-security-policy']).toContain(
        'https://fonts.gstatic.com'
      );
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    });
  });
});
