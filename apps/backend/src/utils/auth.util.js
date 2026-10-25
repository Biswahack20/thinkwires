import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../configs/dotenv.js';

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

  // Enforce minimum 256-bit entropy in production
  if (isProduction && cleanSecret.length < 32) {
    throw new Error(
      'FATAL: JWT_SECRET in production must be at least 32 characters long.'
    );
  }

  return cleanSecret;
};

// 12 rounds provides optimal protection against GPU cracking while maintaining sub-100ms request times
export const hashPassword = async (plainPassword) => {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plainPassword, salt);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) return false;
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const generateCandidateToken = (candidate) => {
  const secret = getJwtSecret();
  const payload = {
    id: candidate._id || candidate.id,
    email: candidate.email,
    name: candidate.name,
    role: 'candidate',
    portal: 'candidate',
  };

  return jwt.sign(payload, secret, {
    expiresIn: '7d',
    algorithm: 'HS256',
  });
};

// Pin algorithm to HS256 to prevent algorithm-substitution attacks (e.g. 'none' or public key confusion)
export const verifyCandidateToken = (token) => {
  const secret = getJwtSecret();
  const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
  if (decoded && decoded.portal && decoded.portal !== 'candidate') {
    throw new Error('Invalid token scope for candidate portal.');
  }
  return decoded;
};

// Store SHA-256 hash in DB; raw token is only sent once to user email to prevent leakage from DB read replicas
export const generatePasswordResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  return {
    rawToken,
    hashedToken,
    expiresAt,
  };
};

export const hashResetToken = (rawToken) => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};

export const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite =
    process.env.COOKIE_SAME_SITE || (isProduction ? 'strict' : 'lax');
  res.cookie('thinkwires_candidate_jwt', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
};

export const clearAuthCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite =
    process.env.COOKIE_SAME_SITE || (isProduction ? 'strict' : 'lax');
  res.cookie('thinkwires_candidate_jwt', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    expires: new Date(0),
    path: '/',
  });
};

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
    algorithm: 'HS256',
  });
};

const revokedTokens = new Set();

export const revokeToken = (token) => {
  if (token && typeof token === 'string') {
    revokedTokens.add(token);
  }
};

export const isTokenRevoked = (token) => {
  if (!token || typeof token !== 'string') return false;
  return revokedTokens.has(token);
};

export const clearRevocationStore = () => {
  revokedTokens.clear();
};

export const verifyAdminToken = (token) => {
  const secret = getJwtSecret();
  const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
  if (decoded && decoded.portal && decoded.portal !== 'admin') {
    throw new Error('Invalid token scope for admin portal.');
  }
  return decoded;
};

export const ADMIN_COOKIE_NAME = 'thinkwires_admin_jwt';
export const ADMIN_COOKIE_PATH = '/api/admin';
export const ADMIN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const setAdminAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite =
    process.env.COOKIE_SAME_SITE || (isProduction ? 'strict' : 'lax');
  res.cookie(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: ADMIN_COOKIE_PATH,
  });
};

export const clearAdminAuthCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite =
    process.env.COOKIE_SAME_SITE || (isProduction ? 'strict' : 'lax');
  res.cookie(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    expires: new Date(0),
    path: ADMIN_COOKIE_PATH,
  });
  res.cookie(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    expires: new Date(0),
    path: '/',
  });
};
