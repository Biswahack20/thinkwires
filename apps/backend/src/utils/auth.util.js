import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../configs/dotenv.js';

/**
 * Get JWT Secret safely or throw error if not configured
 */
export const getJwtSecret = () => {
  const secret = config.JWT_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing. Server cannot sign or verify tokens.');
  }
  return secret;
};

/**
 * Hash plaintext password using bcrypt
 */
export const hashPassword = async (plainPassword) => {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plainPassword, salt);
};

/**
 * Compare candidate password with stored hash
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) return false;
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Generate signed JWT for candidate authentication
 */
export const generateCandidateToken = (candidate) => {
  const secret = getJwtSecret();
  const payload = {
    id: candidate._id || candidate.id,
    email: candidate.email,
    name: candidate.name,
    role: 'candidate',
  };

  return jwt.sign(payload, secret, {
    expiresIn: '7d',
  });
};

/**
 * Verify JWT token string
 */
export const verifyCandidateToken = (token) => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};

/**
 * Generate cryptographically secure reset token
 * Returns { rawToken, hashedToken, expiresAt }
 */
export const generatePasswordResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity

  return {
    rawToken,
    hashedToken,
    expiresAt,
  };
};

/**
 * Hash raw token for verification against DB stored hash
 */
export const hashResetToken = (rawToken) => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};

/**
 * Helper to set HttpOnly auth cookie
 */
export const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('thinkwires_candidate_jwt', token, {
    httpOnly: true,
    secure: isProduction, // secure in production HTTPS
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

/**
 * Clear candidate auth cookie on logout
 */
export const clearAuthCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('thinkwires_candidate_jwt', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    expires: new Date(0),
    path: '/',
  });
};
