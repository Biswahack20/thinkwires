import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../configs/dotenv.js';

/**
 * Get JWT Secret safely or throw error if not configured
 */
const INSECURE_DEFAULT_SECRETS = new Set([
  'your_jwt_secret_here',
  'super_secret_jwt_key_here',
  'your_secure_random_jwt_secret',
  'default_secret',
  'secret',
  'changeme',
]);

export const getJwtSecret = () => {
  const secret = config.JWT_SECRET || process.env.JWT_SECRET;
  if (!secret || typeof secret !== 'string' || !secret.trim()) {
    throw new Error(
      'FATAL: JWT_SECRET environment variable is missing. Server cannot sign or verify tokens.'
    );
  }

  const cleanSecret = secret.trim();
  const isProduction =
    (config.NODE_ENV || process.env.NODE_ENV) === 'production';

  if (INSECURE_DEFAULT_SECRETS.has(cleanSecret.toLowerCase())) {
    throw new Error(
      'FATAL: Insecure default JWT_SECRET detected. You must set a unique, cryptographically strong JWT_SECRET in your environment.'
    );
  }

  if (isProduction && cleanSecret.length < 32) {
    throw new Error(
      'FATAL: JWT_SECRET in production must be at least 32 characters long.'
    );
  }

  return cleanSecret;
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
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');
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

/**
 * Generate signed JWT for Admin Portal members (superadmin, admin, cms_admin)
 */
export const generateAdminToken = (user) => {
  const secret = getJwtSecret();
  const payload = {
    id: user._id ? user._id.toString() : user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    designation: user.designation || 'System Member',
    portal: 'admin',
  };

  return jwt.sign(payload, secret, {
    expiresIn: '7d',
  });
};

/**
 * Verify Admin JWT token string
 */
export const verifyAdminToken = (token) => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};

/**
 * Generate cryptographically secure CSRF token
 */
export const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Timing-safe CSRF token comparison
 */
export const verifyCsrfToken = (cookieToken, headerToken) => {
  if (!cookieToken || !headerToken) return false;
  if (typeof cookieToken !== 'string' || typeof headerToken !== 'string') return false;
  if (cookieToken.length !== headerToken.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken, 'utf-8'),
      Buffer.from(headerToken, 'utf-8')
    );
  } catch {
    return false;
  }
};

/**
 * Helper to set readable CSRF cookie for client-side synchronizer/double-submit validation
 */
export const setCsrfCookie = (res, csrfToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('tw_admin_csrf', csrfToken, {
    httpOnly: false, // Must be readable by client JS to attach in request headers
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

/**
 * Clear CSRF cookie on logout
 */
export const clearCsrfCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('tw_admin_csrf', '', {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    expires: new Date(0),
    path: '/',
  });
};

/**
 * Helper to set HttpOnly Admin auth cookie
 */
export const setAdminAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('thinkwires_admin_jwt', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

/**
 * Clear Admin auth cookie on logout
 */
export const clearAdminAuthCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('thinkwires_admin_jwt', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    expires: new Date(0),
    path: '/',
  });
  clearCsrfCookie(res);
};
