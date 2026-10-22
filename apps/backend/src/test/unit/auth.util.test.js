import { describe, it, expect } from 'vitest';
import {
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
});
