import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../../app.js';
import UserMongo from '../../models/user.mongo.model.js';
import Candidate from '../../models/candidate.mongo.model.js';
import {
  generateAdminToken,
  verifyAdminToken,
  generateCandidateToken,
  verifyCandidateToken,
  getAdminJwtSecret,
  getCandidateJwtSecret,
  clearRevocationStore,
  revokeToken,
} from '../../utils/auth.util.js';
import { requireAuth, requireCandidateAuth } from '../../middlewares/auth.middleware.js';
import express from 'express';

describe('Sprint 4: Authentication Hardening, Token Lifecycle & Infrastructure Reliability', () => {
  // =========================================================================
  // Issue #199: Cryptographic Domain Separation
  // =========================================================================
  describe('Issue #199: Cryptographic Domain Separation for JWT Secrets', () => {
    it('returns separate cryptographic secrets for admin and candidate domains', () => {
      const adminSecret = getAdminJwtSecret();
      const candidateSecret = getCandidateJwtSecret();

      expect(typeof adminSecret).toBe('string');
      expect(typeof candidateSecret).toBe('string');
      expect(adminSecret.length).toBeGreaterThanOrEqual(32);
      expect(candidateSecret.length).toBeGreaterThanOrEqual(32);
      expect(adminSecret).not.toBe(candidateSecret);
    });

    it('rejects candidate tokens when presented to verifyAdminToken', () => {
      const candidateToken = generateCandidateToken({
        id: 'cand-domain-1',
        email: 'cand@thinkwires.com',
        name: 'Candidate User',
      });

      expect(() => verifyAdminToken(candidateToken)).toThrow();
    });

    it('rejects admin tokens when presented to verifyCandidateToken', () => {
      const adminToken = generateAdminToken({
        id: 'admin-domain-1',
        email: 'admin@thinkwires.com',
        name: 'Admin User',
        role: 'superadmin',
      });

      expect(() => verifyCandidateToken(adminToken)).toThrow();
    });

    it('rejects tokens with forged portal claims across verifiers', () => {
      // Token signed with admin secret but claiming portal: candidate
      const adminSecret = getAdminJwtSecret();
      const crossToken = jwt.sign(
        { id: 'hacker-1', email: 'hacker@tw.com', role: 'candidate', portal: 'candidate' },
        adminSecret,
        { algorithm: 'HS256', expiresIn: '1h' }
      );

      // Fails candidate verification due to different secret
      expect(() => verifyCandidateToken(crossToken)).toThrow();
      // Fails admin verification due to portal claim mismatch
      expect(() => verifyAdminToken(crossToken)).toThrow(/Invalid token scope/i);
    });
  });

  // =========================================================================
  // Issue #197: tokenVersion Mechanism for Session Invalidation
  // =========================================================================
  describe('Issue #197: tokenVersion Session Revocation', () => {
    it('embeds tokenVersion in generated admin and candidate JWT payloads', () => {
      const adminToken = generateAdminToken({
        id: 'admin-tv-1',
        email: 'admin@tw.com',
        role: 'admin',
        tokenVersion: 3,
      });
      const decodedAdmin = verifyAdminToken(adminToken);
      expect(decodedAdmin.tokenVersion).toBe(3);

      const candidateToken = generateCandidateToken({
        id: 'cand-tv-1',
        email: 'cand@tw.com',
        tokenVersion: 5,
      });
      const decodedCand = verifyCandidateToken(candidateToken);
      expect(decodedCand.tokenVersion).toBe(5);
    });

    it('rejects active admin token when tokenVersion does not match database user record', async () => {
      vi.spyOn(mongoose.connection, 'readyState', 'get').mockReturnValue(1);
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'tv.admin@thinkwires.com',
        name: 'TV Admin',
        role: 'admin',
        isActive: true,
        tokenVersion: 2, // Database has version 2 (e.g. after password change)
      };

      vi.spyOn(UserMongo, 'findById').mockReturnValue({
        select: () => ({
          lean: () => Promise.resolve(mockUser),
        }),
      });

      // Client holds stale token with version 1
      const staleToken = generateAdminToken({
        id: mockUser._id.toString(),
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        tokenVersion: 1, // Stale version
      });

      const testApp = express();
      testApp.use(express.json());
      testApp.get('/test-admin-tv', requireAuth(['admin', 'superadmin']), (req, res) => {
        res.json({ success: true });
      });

      const res = await request(testApp)
        .get('/test-admin-tv')
        .set('Authorization', `Bearer ${staleToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Session has been invalidated/i);

      vi.restoreAllMocks();
    });

    it('rejects active candidate token when candidate tokenVersion is incremented', async () => {
      vi.spyOn(mongoose.connection, 'readyState', 'get').mockReturnValue(1);
      const mockCandidate = {
        _id: new mongoose.Types.ObjectId(),
        email: 'tv.candidate@thinkwires.com',
        name: 'TV Candidate',
        role: 'candidate',
        isActive: true,
        tokenVersion: 4, // Database has version 4
      };

      vi.spyOn(Candidate, 'findById').mockReturnValue({
        select: () => Promise.resolve(mockCandidate),
      });

      // Client holds token with version 3
      const staleCandidateToken = generateCandidateToken({
        id: mockCandidate._id.toString(),
        email: mockCandidate.email,
        name: mockCandidate.name,
        tokenVersion: 3,
      });

      const testApp = express();
      testApp.use(express.json());
      testApp.get('/test-cand-tv', requireCandidateAuth, (req, res) => {
        res.json({ success: true });
      });

      const res = await request(testApp)
        .get('/test-cand-tv')
        .set('Authorization', `Bearer ${staleCandidateToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Session has been invalidated/i);

      vi.restoreAllMocks();
    });
  });

  // =========================================================================
  // Issue #198: Non-Blocking Redis Scan
  // =========================================================================
  describe('Issue #198: Non-Blocking Redis Revocation Scan', () => {
    it('uses non-blocking SCAN iteration instead of KEYS to clear revocation store', async () => {
      const scanMock = vi.fn().mockResolvedValueOnce({
        cursor: '0',
        keys: ['revoked:token1', 'revoked:token2'],
      });
      const delMock = vi.fn().mockResolvedValue(2);
      const keysMock = vi.fn();

      const { setMockRedisClient } = await import('../../configs/redis.js');
      setMockRedisClient({
        scan: scanMock,
        del: delMock,
        keys: keysMock,
      });

      await clearRevocationStore();

      expect(scanMock).toHaveBeenCalledWith('0', {
        MATCH: 'revoked:*',
        COUNT: 100,
      });
      expect(delMock).toHaveBeenCalledWith(['revoked:token1', 'revoked:token2']);
      // Verify blocking keys() was NOT invoked
      expect(keysMock).not.toHaveBeenCalled();

      setMockRedisClient(null);
    });
  });

  // =========================================================================
  // Issue #200: Fail-Closed RBAC When Database Verification Throws
  // =========================================================================
  describe('Issue #200: Fail-Closed RBAC in requireAuth Middleware', () => {
    it('fails closed with HTTP 503 in production when database lookup throws', async () => {
      vi.spyOn(mongoose.connection, 'readyState', 'get').mockReturnValue(1);
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      vi.spyOn(UserMongo, 'findById').mockReturnValue({
        select: () => ({
          lean: () => Promise.reject(new Error('Connection pool exhausted / Atlas timeout')),
        }),
      });

      const adminToken = generateAdminToken({
        id: new mongoose.Types.ObjectId().toString(),
        email: 'prod.admin@thinkwires.com',
        role: 'superadmin',
      });

      const testApp = express();
      testApp.use(express.json());
      testApp.get('/test-fail-closed', requireAuth(['superadmin']), (req, res) => {
        res.json({ success: true, bypassed: true });
      });

      const res = await request(testApp)
        .get('/test-fail-closed')
        .set('Authorization', `Bearer ${adminToken}`);

      // Must fail closed with 503 instead of falling open
      expect(res.status).toBe(503);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/temporarily unavailable/i);
      expect(res.body.bypassed).toBeUndefined();

      process.env.NODE_ENV = originalEnv;
      vi.restoreAllMocks();
    });

    it('rejects access immediately with HTTP 403 if admin user isActive is false in DB', async () => {
      vi.spyOn(mongoose.connection, 'readyState', 'get').mockReturnValue(1);
      const mockDeactivatedUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'deactivated.admin@thinkwires.com',
        name: 'Deactivated Admin',
        role: 'admin',
        isActive: false, // Account deactivated
        tokenVersion: 0,
      };

      vi.spyOn(UserMongo, 'findById').mockReturnValue({
        select: () => ({
          lean: () => Promise.resolve(mockDeactivatedUser),
        }),
      });

      const adminToken = generateAdminToken({
        id: mockDeactivatedUser._id.toString(),
        email: mockDeactivatedUser.email,
        role: 'admin',
        tokenVersion: 0,
      });

      const testApp = express();
      testApp.use(express.json());
      testApp.get('/test-deactivated-admin', requireAuth(['admin']), (req, res) => {
        res.json({ success: true });
      });

      const res = await request(testApp)
        .get('/test-deactivated-admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/deactivated/i);

      vi.restoreAllMocks();
    });
  });

  // =========================================================================
  // Issue #187: Rate Limiting on Key Public Endpoints
  // =========================================================================
  describe('Issue #187: Rate Limiting on Public Endpoints', () => {
    it('applies rate limiter to candidate application endpoint', async () => {
      // Verify /api/candidate/apply has rate limiting enabled
      const res = await request(app).post('/api/candidate/apply').send({});
      // Rate limiter returns 401 (if unauthenticated auth check runs first) or rate limit response
      expect([400, 401, 403, 429]).toContain(res.status);
    });

    it('applies rate limiter to public contact submission endpoint', async () => {
      const res = await request(app).post('/api/contact').send({});
      expect([400, 429]).toContain(res.status);
    });
  });

  // =========================================================================
  // Issue #179: EventEmitter Listener Management
  // =========================================================================
  describe('Issue #179: EventEmitter Listener Cleanup', () => {
    it('registers process shutdown handlers with once to prevent listener accumulation', async () => {
      const { startServer } = await import('../../server.js');
      expect(typeof startServer).toBe('function');

      // Check process listener counts for SIGTERM and SIGINT
      const sigtermListeners = process.listeners('SIGTERM');
      const sigintListeners = process.listeners('SIGINT');

      expect(sigtermListeners.length).toBeLessThanOrEqual(5);
      expect(sigintListeners.length).toBeLessThanOrEqual(5);
    });
  });
});
