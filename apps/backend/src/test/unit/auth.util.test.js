import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import config from '../../configs/dotenv.js';
import { setMockRedisClient } from '../../configs/redis.js';
import {
  getJwtSecret,
  hashPassword,
  comparePassword,
  generateCandidateToken,
  verifyCandidateToken,
  generateAdminToken,
  verifyAdminToken,
  generatePasswordResetToken,
  hashResetToken,
  revokeToken,
  isTokenRevoked,
  clearRevocationStore,
} from '../../utils/auth.util.js';

describe('Auth Utilities (Unit Tests)', () => {
  describe('Password Hashing & Comparison', () => {
    it('hashes plain text password using bcrypt salt', async () => {
      const password = 'SecurePassword123!';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2')).toBe(true);
    });

    it('successfully compares correct password with stored hash', async () => {
      const password = 'CandidateSecretPass2026';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(password, hash);

      expect(isMatch).toBe(true);
    });

    it('rejects incorrect password comparison', async () => {
      const password = 'CorrectPassword';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword('WrongPassword', hash);

      expect(isMatch).toBe(false);
    });

    it('returns false when password or hash is missing', async () => {
      expect(await comparePassword('', 'somehash')).toBe(false);
      expect(await comparePassword('password', '')).toBe(false);
    });
  });

  describe('JWT Token Generation & Verification', () => {
    it('generates and verifies valid candidate JWT token', () => {
      const mockCandidate = {
        _id: 'cand-999',
        email: 'alex.morgan@thinkwires.com',
        name: 'Alex Morgan',
      };

      const token = generateCandidateToken(mockCandidate);
      expect(typeof token).toBe('string');

      const decoded = verifyCandidateToken(token);
      expect(decoded.id).toBe('cand-999');
      expect(decoded.email).toBe('alex.morgan@thinkwires.com');
      expect(decoded.role).toBe('candidate');
    });

    it('generates and verifies valid admin JWT token with role claims', () => {
      const mockAdmin = {
        _id: 'admin-007',
        email: 'lead.recruiter@thinkwires.com',
        name: 'Sarah Connor',
        role: 'recruiter',
        designation: 'Senior Technical Recruiter',
      };

      const token = generateAdminToken(mockAdmin);
      const decoded = verifyAdminToken(token);

      expect(decoded.id).toBe('admin-007');
      expect(decoded.role).toBe('recruiter');
      expect(decoded.portal).toBe('admin');
    });

    it('fails verification on tampered JWT token', () => {
      const validToken = generateCandidateToken({
        id: '123',
        email: 'test@tw.com',
        name: 'Test',
      });
      const tamperedToken = validToken.slice(0, -6) + 'xxxxxx';

      expect(() => verifyCandidateToken(tamperedToken)).toThrow();
    });
  });

  describe('Password Reset Token Helpers', () => {
    it('generates a 64-character raw hex token and its sha256 hash with 1 hour expiration', () => {
      const { rawToken, hashedToken, expiresAt } = generatePasswordResetToken();

      expect(rawToken.length).toBe(64);
      expect(hashedToken.length).toBe(64);
      expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
      expect(hashResetToken(rawToken)).toBe(hashedToken);
    });
  });

  describe('JWT Secret Validation (getJwtSecret)', () => {
    it('returns the secret when valid', () => {
      const secret = getJwtSecret();
      expect(secret).toBeDefined();
      expect(typeof secret).toBe('string');
      expect(secret.length).toBeGreaterThanOrEqual(32);
    });

    it('throws fatal error when JWT_SECRET is missing or empty', () => {
      const origConfig = config.JWT_SECRET;
      const origEnv = process.env.JWT_SECRET;
      try {
        config.JWT_SECRET = '';
        delete process.env.JWT_SECRET;
        expect(() => getJwtSecret()).toThrow(
          /FATAL: JWT_SECRET environment variable is missing/i
        );
      } finally {
        config.JWT_SECRET = origConfig;
        process.env.JWT_SECRET = origEnv;
      }
    });

    it('throws fatal error when fallback secret thinkwires_default_jwt_secret_change_in_production is used', () => {
      const origConfig = config.JWT_SECRET;
      const origEnv = process.env.JWT_SECRET;
      try {
        config.JWT_SECRET =
          'thinkwires_default_jwt_secret_change_in_production';
        process.env.JWT_SECRET =
          'thinkwires_default_jwt_secret_change_in_production';
        expect(() => getJwtSecret()).toThrow(
          /FATAL: Insecure default JWT_SECRET detected/i
        );
      } finally {
        config.JWT_SECRET = origConfig;
        process.env.JWT_SECRET = origEnv;
      }
    });

    it('throws fatal error for other insecure default secrets', () => {
      const origConfig = config.JWT_SECRET;
      const origEnv = process.env.JWT_SECRET;
      try {
        for (const badSecret of [
          'changeme',
          'secret',
          'default_secret',
          'your_jwt_secret_here',
          'your_secure_random_jwt_secret_here',
        ]) {
          config.JWT_SECRET = badSecret;
          process.env.JWT_SECRET = badSecret;
          expect(() => getJwtSecret()).toThrow(
            /FATAL: Insecure default JWT_SECRET detected/i
          );
        }
      } finally {
        config.JWT_SECRET = origConfig;
        process.env.JWT_SECRET = origEnv;
      }
    });

    it('throws fatal error in production when JWT_SECRET is shorter than 32 characters', () => {
      const origConfig = config.JWT_SECRET;
      const origEnvSecret = process.env.JWT_SECRET;
      const origEnvNode = process.env.NODE_ENV;
      const origConfigNode = config.NODE_ENV;
      try {
        config.JWT_SECRET = 'short_secret_under_32_chars';
        process.env.JWT_SECRET = 'short_secret_under_32_chars';
        config.NODE_ENV = 'production';
        process.env.NODE_ENV = 'production';
        expect(() => getJwtSecret()).toThrow(
          /FATAL: JWT_SECRET in production must be at least 32 characters long/i
        );
      } finally {
        config.JWT_SECRET = origConfig;
        process.env.JWT_SECRET = origEnvSecret;
        config.NODE_ENV = origConfigNode;
        process.env.NODE_ENV = origEnvNode;
      }
    });
  });

  describe('JWT Token Revocation & Redis Persistence', () => {
    beforeEach(async () => {
      setMockRedisClient(null);
      await clearRevocationStore();
    });

    afterEach(async () => {
      setMockRedisClient(null);
      await clearRevocationStore();
    });

    it('returns false for unrevoked tokens and handles invalid token inputs safely', async () => {
      expect(await isTokenRevoked('unrevoked-random-jwt-token')).toBe(false);
      expect(await isTokenRevoked('')).toBe(false);
      expect(await isTokenRevoked(null)).toBe(false);
      expect(await isTokenRevoked(undefined)).toBe(false);
      expect(await isTokenRevoked(12345)).toBe(false);
    });

    it('revokes a token and verifies it is revoked in local store', async () => {
      const token = 'test-token-to-revoke-123';
      expect(await isTokenRevoked(token)).toBe(false);

      await revokeToken(token);
      expect(await isTokenRevoked(token)).toBe(true);
    });

    it('clears all revoked tokens from store', async () => {
      const token = 'token-to-clear';
      await revokeToken(token);
      expect(await isTokenRevoked(token)).toBe(true);

      await clearRevocationStore();
      expect(await isTokenRevoked(token)).toBe(false);
    });

    it('persists revoked token to Redis with 7-day TTL and survives in-memory cache wipe', async () => {
      const redisStore = new Map();
      const mockRedis = {
        set: vi.fn(async (key, value, options) => {
          redisStore.set(key, { value, options });
        }),
        get: vi.fn(async (key) => {
          const entry = redisStore.get(key);
          return entry ? entry.value : null;
        }),
        keys: vi.fn(async (pattern) => {
          return Array.from(redisStore.keys()).filter((k) =>
            k.startsWith(pattern.replace('*', ''))
          );
        }),
        del: vi.fn(async (keys) => {
          for (const k of keys) redisStore.delete(k);
        }),
      };

      setMockRedisClient(mockRedis);

      const token = 'sample-jwt-token-redis-persisted';
      await revokeToken(token);

      // Verify Redis was called with 7-day TTL (7 * 24 * 60 * 60 = 604800 seconds)
      expect(mockRedis.set).toHaveBeenCalledWith(
        `revoked:${token}`,
        '1',
        { EX: 7 * 24 * 60 * 60 }
      );

      // Simulate a server restart: in-memory set is wiped, but Redis retains key
      setMockRedisClient(null);
      await clearRevocationStore();
      setMockRedisClient(mockRedis);

      // Querying token should check Redis and find it revoked
      const isRevokedAfterReboot = await isTokenRevoked(token);
      expect(isRevokedAfterReboot).toBe(true);
      expect(mockRedis.get).toHaveBeenCalledWith(`revoked:${token}`);
    });

    it('clears keys from Redis when clearRevocationStore is invoked', async () => {
      const redisStore = new Map();
      const mockRedis = {
        set: vi.fn(async (key, value) => {
          redisStore.set(key, value);
        }),
        get: vi.fn(async (key) => redisStore.get(key) || null),
        keys: vi.fn(async () => Array.from(redisStore.keys())),
        del: vi.fn(async (keys) => {
          for (const k of keys) redisStore.delete(k);
        }),
      };

      setMockRedisClient(mockRedis);

      await revokeToken('token-1');
      await revokeToken('token-2');
      expect(redisStore.size).toBe(2);

      await clearRevocationStore();
      expect(redisStore.size).toBe(0);
      expect(mockRedis.del).toHaveBeenCalled();
    });

    it('handles Redis connection or command failures gracefully without throwing', async () => {
      const failingRedis = {
        set: vi.fn(async () => {
          throw new Error('Redis connection timed out');
        }),
        get: vi.fn(async () => {
          throw new Error('Redis ECONNRESET');
        }),
        keys: vi.fn(async () => {
          throw new Error('Redis unreachable');
        }),
      };

      setMockRedisClient(failingRedis);

      await expect(revokeToken('token-fail-test')).resolves.not.toThrow();
      await expect(isTokenRevoked('token-fail-test')).resolves.toBe(true);
      await expect(isTokenRevoked('unknown-token')).resolves.toBe(false);
      await expect(clearRevocationStore()).resolves.not.toThrow();
    });
  });
});
