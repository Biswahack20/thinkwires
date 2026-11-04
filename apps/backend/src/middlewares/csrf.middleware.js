import crypto from 'crypto';
import { verifyAdminToken } from '../utils/auth.util.js';

export const CSRF_COOKIE_NAME = 'thinkwires_csrf_token';

export const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const setCsrfCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite =
    process.env.COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax');
  const secure = isProduction || sameSite.toLowerCase() === 'none';
  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by client JS for double-submit header
    secure,
    sameSite,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearCsrfCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite =
    process.env.COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax');
  const secure = isProduction || sameSite.toLowerCase() === 'none';
  res.cookie(CSRF_COOKIE_NAME, '', {
    httpOnly: false,
    secure,
    sameSite,
    expires: new Date(0),
    path: '/',
  });
};

export const getAllowedOrigins = () => {
  const envOrigins = (
    process.env.ALLOWED_ORIGINS ||
    process.env.CLIENT_URL ||
    process.env.FRONTEND_URL ||
    ''
  )
    .split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  const devOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5175',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
    'http://localhost:4174',
    'http://127.0.0.1:4174',
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  const defaultProductionOrigins = [
    'https://thinkwires.vercel.app',
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ];

  if (process.env.NODE_ENV === 'production') {
    return Array.from(new Set([...defaultProductionOrigins, ...envOrigins]));
  }
  return Array.from(new Set([...devOrigins, ...envOrigins]));
};

export const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Direct server-to-server or test requests
  const normalizedOrigin = origin.replace(/\/+$/, '');
  const isDev = (process.env.NODE_ENV || 'development') !== 'production';
  if (
    isDev &&
    /^http:\/\/(localhost|127\.0\.0\.1):(517[3-9]|417[3-9]|3000|5000)$/.test(
      normalizedOrigin
    )
  ) {
    return true;
  }
  const allowed = getAllowedOrigins();
  return allowed.includes(normalizedOrigin);
};

const getOriginFromReferer = (referer) => {
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
};

export const adminCsrfProtection = (req, res, next) => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  const method = req.method.toUpperCase();

  if (safeMethods.includes(method)) {
    if (!req.cookies || !req.cookies[CSRF_COOKIE_NAME]) {
      const newToken = generateCsrfToken();
      setCsrfCookie(res, newToken);
    }
    return next();
  }

  // Exempt login to establish session, and logout to guarantee unconditional signout
  const isAuthRoute =
    req.path === '/auth/login' ||
    req.path === '/auth/logout' ||
    req.path === '/auth/csrf-token' ||
    req.originalUrl?.endsWith('/auth/login') ||
    req.originalUrl?.endsWith('/auth/logout') ||
    req.originalUrl?.endsWith('/auth/csrf-token');

  if (isAuthRoute) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const effectiveOrigin = origin || getOriginFromReferer(referer);

  if (effectiveOrigin && !isAllowedOrigin(effectiveOrigin)) {
    return res.status(403).json({
      success: false,
      error: 'Cross-site request blocked: Untrusted origin or referer.',
      origin: effectiveOrigin,
    });
  }

  // OWASP standard: Requests using verified custom Authorization Bearer or x-admin-token headers
  // cannot be forged via CSRF (browsers require CORS preflight and never attach custom headers to cross-site requests).
  const authHeader = req.headers.authorization;
  const adminTokenHeader = req.headers['x-admin-token'];

  if (adminTokenHeader) {
    try {
      const verified = verifyAdminToken(adminTokenHeader);
      if (verified) return next();
    } catch {
      // Invalid token, fall through to cookie / rejection
    }
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const verified = verifyAdminToken(token);
      if (verified) return next();
    } catch {
      // Invalid token, fall through to cookie / rejection
    }
  }

  const hasAdminCookie = Boolean(
    req.cookies && req.cookies.thinkwires_admin_jwt
  );

  if (hasAdminCookie) {
    const clientToken =
      req.headers['x-csrf-token'] ||
      req.headers['csrf-token'] ||
      req.headers['x-xsrf-token'] ||
      (req.body && req.body._csrf);

    const cookieToken = req.cookies && req.cookies[CSRF_COOKIE_NAME];

    if (!clientToken || !cookieToken) {
      return res.status(403).json({
        success: false,
        error:
          'CSRF validation failed: Missing CSRF token in header or cookie. State-changing operations require a valid CSRF token.',
      });
    }

    // Constant-time comparison to prevent side-channel timing leaks
    const clientBuffer = Buffer.from(String(clientToken));
    const cookieBuffer = Buffer.from(String(cookieToken));

    if (
      clientBuffer.length !== cookieBuffer.length ||
      !crypto.timingSafeEqual(clientBuffer, cookieBuffer)
    ) {
      return res.status(403).json({
        success: false,
        error: 'CSRF validation failed: Invalid or mismatched CSRF token.',
      });
    }
  }

  next();
};

export const getCsrfTokenHandler = (req, res) => {
  let token = req.cookies?.[CSRF_COOKIE_NAME];
  if (!token) {
    token = generateCsrfToken();
    setCsrfCookie(res, token);
  }
  return res.json({
    success: true,
    csrfToken: token,
  });
};
