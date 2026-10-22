import crypto from 'crypto';

export const CSRF_COOKIE_NAME = 'thinkwires_csrf_token';

/**
 * Generate cryptographically secure random CSRF token
 */
export const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Set client-readable CSRF cookie
 */
export const setCsrfCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be accessible to client-side JavaScript
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

/**
 * Clear CSRF cookie
 */
export const clearCsrfCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie(CSRF_COOKIE_NAME, '', {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    expires: new Date(0),
    path: '/',
  });
};

/**
 * List of trusted origins allowed to interact with the API
 */
export const getAllowedOrigins = () => {
  const envOrigins = (
    process.env.ALLOWED_ORIGINS ||
    process.env.CLIENT_URL ||
    process.env.FRONTEND_URL ||
    ''
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const devOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  if (process.env.NODE_ENV === 'production') {
    return envOrigins;
  }
  return Array.from(new Set([...devOrigins, ...envOrigins]));
};

export const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Non-browser clients, same-origin, supertest
  const allowed = getAllowedOrigins();
  return allowed.includes(origin);
};

/**
 * Extract origin from referer header URL if origin header is omitted
 */
const getOriginFromReferer = (referer) => {
  if (!referer) return null;
  try {
    const parsed = new URL(referer);
    return parsed.origin;
  } catch {
    return null;
  }
};

/**
 * CSRF Protection Middleware for Admin Endpoints
 * Combines Origin/Referer verification with Double-Submit Cookie / Synchronizer token pattern.
 */
export const adminCsrfProtection = (req, res, next) => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  const method = req.method.toUpperCase();

  // For safe read-only methods, ensure CSRF cookie is present and pass through
  if (safeMethods.includes(method)) {
    if (!req.cookies || !req.cookies[CSRF_COOKIE_NAME]) {
      const newToken = generateCsrfToken();
      setCsrfCookie(res, newToken);
    }
    return next();
  }

  // State-changing methods (POST, PUT, PATCH, DELETE)
  // Exempt public login if unauthenticated (no existing admin cookie)
  const isLoginRoute = req.path === '/auth/login' || req.originalUrl?.endsWith('/auth/login');
  const hasAdminCookie = Boolean(req.cookies && req.cookies.thinkwires_admin_jwt);

  if (isLoginRoute && !hasAdminCookie) {
    return next();
  }

  // 1. Origin / Referer validation for cross-site attack defense
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

  // 2. Token verification for cookie-authenticated requests
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

    // Timing-safe comparison to prevent side-channel timing attacks
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

/**
 * Controller to explicitly fetch or renew CSRF token
 */
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
