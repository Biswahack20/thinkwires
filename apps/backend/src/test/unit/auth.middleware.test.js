import { describe, it, expect, vi } from 'vitest';
import {
  requireCandidateAuth,
  requireRole,
} from '../../middlewares/auth.middleware.js';
import {
  generateCandidateToken,
  revokeToken,
  clearRevocationStore,
} from '../../utils/auth.util.js';

describe('Auth Middleware (Unit Tests)', () => {
  const createMockReqRes = (options = {}) => {
    const req = {
      cookies: options.cookies || {},
      headers: options.headers || {},
      ...options.reqOverrides,
    };
    const res = {
      statusCode: 200,
      jsonData: null,
      status: vi.fn().mockImplementation(function (code) {
        this.statusCode = code;
        return this;
      }),
      json: vi.fn().mockImplementation(function (data) {
        this.jsonData = data;
        return this;
      }),
    };
    const next = vi.fn();
    return { req, res, next };
  };

  beforeEach(async () => {
    await clearRevocationStore();
  });

  describe('requireCandidateAuth', () => {
    it('returns 401 when no cookie or authorization header is present', async () => {
      const { req, res, next } = createMockReqRes();

      await requireCandidateAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.jsonData.authenticated).toBe(false);
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 when token is invalid or corrupted', async () => {
      const { req, res, next } = createMockReqRes({
        cookies: { thinkwires_candidate_jwt: 'invalid.corrupted.token' },
      });

      await requireCandidateAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.jsonData.error).toMatch(/invalid or forged/i);
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 when candidate token has been revoked', async () => {
      const validToken = generateCandidateToken({
        id: 'candidate-unit-revoked',
        email: 'revoked@thinkwires.com',
        name: 'Revoked User',
      });
      await revokeToken(validToken);

      const { req, res, next } = createMockReqRes({
        cookies: { thinkwires_candidate_jwt: validToken },
      });

      await requireCandidateAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.jsonData.error).toMatch(/revoked/i);
      expect(next).not.toHaveBeenCalled();
    });

    it('extracts candidate from valid cookie and invokes next()', async () => {
      const validToken = generateCandidateToken({
        id: 'candidate-unit-1',
        email: 'alex@thinkwires.com',
        name: 'Alex Unit',
      });

      const { req, res, next } = createMockReqRes({
        cookies: { thinkwires_candidate_jwt: validToken },
      });

      await requireCandidateAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.candidate).toBeDefined();
      expect(req.candidate.email).toBe('alex@thinkwires.com');
      expect(req.candidate.role).toBe('candidate');
    });

    it('extracts candidate from Bearer authorization header and invokes next()', async () => {
      const validToken = generateCandidateToken({
        id: 'candidate-unit-2',
        email: 'bearer@thinkwires.com',
        name: 'Bearer User',
      });

      const { req, res, next } = createMockReqRes({
        headers: { authorization: `Bearer ${validToken}` },
      });

      await requireCandidateAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.candidate.email).toBe('bearer@thinkwires.com');
    });
  });

  describe('requireRole', () => {
    it('allows access when user role matches allowed roles', () => {
      const middleware = requireRole(['admin', 'superadmin']);
      const { req, res, next } = createMockReqRes({
        reqOverrides: { user: { role: 'admin' } },
      });

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('blocks access with 403 Forbidden when user role is unauthorized', () => {
      const middleware = requireRole(['admin']);
      const { req, res, next } = createMockReqRes({
        reqOverrides: { user: { role: 'candidate' } },
      });

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.jsonData.error).toMatch(/access denied|not authorized/i);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
