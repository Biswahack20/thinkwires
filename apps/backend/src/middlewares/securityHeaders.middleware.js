/**
 * Modern Security Headers Middleware
 * Protects against XSS, Clickjacking, MIME sniffing, and enforces HTTPS transport security
 */
export const securityHeaders = (req, res, next) => {
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent Clickjacking attacks
  res.setHeader('X-Frame-Options', 'DENY');

  // Modern browsers disable legacy reflective XSS auditor to avoid client-side exploitation
  res.setHeader('X-XSS-Protection', '0');

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com data:; " +
      "img-src 'self' data: https: blob:; " +
      "connect-src 'self' http://localhost:* ws://localhost:* https:; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self';"
  );

  // Strict-Transport-Security (HSTS) in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Permissions-Policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  next();
};

export default securityHeaders;
