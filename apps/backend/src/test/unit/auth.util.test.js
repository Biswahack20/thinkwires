import { describe, it, expect } from 'vitest';
import config from '../../configs/dotenv.js';
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
});
