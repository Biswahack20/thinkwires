import { describe, it, expect } from 'vitest';
import { api, getCandidateAuthCookie } from '../test-helper.js';

describe('Auth API (Integration Tests)', () => {
  const uniqueEmail = `test.candidate.${Date.now()}@thinkwires.com`;
  const validPassword = 'StrongPassword2026!';

  describe('POST /api/auth/register', () => {
    it('returns 400 when name is missing', async () => {
      const res = await api.post('/api/auth/register').send({
        email: 'test@tw.com',
        password: validPassword,
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/name is required/i);
    });

    it('returns 400 when email format is invalid', async () => {
      const res = await api.post('/api/auth/register').send({
        name: 'Invalid Email User',
        email: 'not-an-email',
        password: validPassword,
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/valid email/i);
    });

    it('returns 400 when password is under 12 characters', async () => {
      const res = await api.post('/api/auth/register').send({
        name: 'Short Pass User',
        email: 'shortpass@thinkwires.com',
        password: 'short',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/at least 12 characters/i);
    });

    it('returns 400 when confirmPassword does not match password', async () => {
      const res = await api.post('/api/auth/register').send({
        name: 'Mismatch Pass User',
        email: 'mismatch@thinkwires.com',
        password: validPassword,
        confirmPassword: 'DifferentPassword123!',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/passwords do not match/i);
    });

    it('successfully registers candidate, sets HttpOnly auth cookie, and returns candidate payload', async () => {
      const res = await api.post('/api/auth/register').send({
        name: 'John Candidate',
        email: uniqueEmail,
        password: validPassword,
        confirmPassword: validPassword,
        phone: '+1-555-0199',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.candidate).toBeDefined();
      expect(res.body.candidate.email).toBe(uniqueEmail);

      // Verify Set-Cookie header is issued
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const authCookie = cookies.find((c) =>
        c.startsWith('thinkwires_candidate_jwt=')
      );
      expect(authCookie).toBeDefined();
      expect(authCookie).toContain('HttpOnly');
    });

    it('rejects duplicate email registration with 409 Conflict', async () => {
      const res = await api.post('/api/auth/register').send({
        name: 'Duplicate Candidate',
        email: uniqueEmail,
        password: validPassword,
      });

      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/already exists/i);
    });
  });

  describe('POST /api/auth/login', () => {
    it('returns 400 when credentials are blank', async () => {
      const res = await api.post('/api/auth/login').send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/provide both email and password/i);
    });

    it('returns 401 when account does not exist or password is wrong', async () => {
      const res = await api.post('/api/auth/login').send({
        email: 'nonexistent.user@thinkwires.com',
        password: 'WrongPassword123!',
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid credentials/i);
    });

    it('successfully logs in with registered candidate and sets session cookie', async () => {
      const res = await api.post('/api/auth/login').send({
        email: uniqueEmail,
        password: validPassword,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.candidate.email).toBe(uniqueEmail);

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(
        cookies.some((c) => c.startsWith('thinkwires_candidate_jwt='))
      ).toBe(true);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns 401 when called without authentication cookie', async () => {
      const res = await api.get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.authenticated).toBe(false);
    });

    it('returns 200 and candidate identity when called with valid session cookie', async () => {
      const authCookie = getCandidateAuthCookie({
        id: 'cand-me-001',
        email: 'me.check@thinkwires.com',
        name: 'Me Check Candidate',
      });

      const res = await api.get('/api/auth/me').set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.authenticated).toBe(true);
      expect(res.body.candidate.email).toBe('me.check@thinkwires.com');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('clears candidate auth cookie on logout', async () => {
      const res = await api.post('/api/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const expiredCookie = cookies.find((c) =>
        c.startsWith('thinkwires_candidate_jwt=')
      );
      expect(expiredCookie).toMatch(/Expires=Thu, 01 Jan 1970/);
    });
  });
});
