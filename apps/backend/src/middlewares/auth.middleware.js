import { verifyCandidateToken, verifyAdminToken, verifyCsrfToken } from '../utils/auth.util.js';
import Candidate from '../models/candidate.mongo.model.js';
import UserMongo from '../models/user.mongo.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

/**
 * CSRF Protection Middleware for Admin Endpoints
 * Enforces Double-Submit Cookie pattern and Origin/Referer verification on state-changing methods.
 */
export const requireCsrf = () => {
  return (req, res, next) => {
    // Safe HTTP methods (GET, HEAD, OPTIONS) do not modify state
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    // Allow requests with Bearer auth token header (e.g. automated tests or programmatic scripts)
    // where ambient browser cookie transmission is not used
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ') && !req.cookies?.thinkwires_admin_jwt) {
      return next();
    }

    // Verify Origin or Referer header against trusted origins if present
    const origin = req.headers.origin || req.headers.referer;
    if (origin) {
      try {
        const originUrl = new URL(origin);
        const host = originUrl.host;
        const allowedHosts = [
          'localhost:5173',
          'localhost:5000',
          'localhost:3000',
          '127.0.0.1:5173',
          '127.0.0.1:5000',
          '127.0.0.1:3000',
        ];
        if (process.env.ALLOWED_ORIGINS) {
          process.env.ALLOWED_ORIGINS.split(',').forEach((o) => {
            try {
              allowedHosts.push(new URL(o.trim()).host);
            } catch {}
          });
        }
        if (process.env.CLIENT_URL) {
          try {
            allowedHosts.push(new URL(process.env.CLIENT_URL).host);
          } catch {}
        }
        if (!allowedHosts.includes(host) && process.env.NODE_ENV === 'production') {
          return res.status(403).json({
            success: false,
            error: 'Untrusted origin rejected for state-changing administrative request.',
          });
        }
      } catch {
        return res.status(403).json({
          success: false,
          error: 'Invalid request origin header.',
        });
      }
    }

    // Validate Double-Submit CSRF cookie & header
    const cookieCsrf = req.cookies?.tw_admin_csrf;
    const headerCsrf = req.headers['x-csrf-token'];

    if (!cookieCsrf || !headerCsrf || !verifyCsrfToken(cookieCsrf, headerCsrf)) {
      return res.status(403).json({
        success: false,
        error: 'CSRF token missing or invalid. Please refresh and try again.',
      });
    }

    next();
  };
};

// ================= ADMIN ROLE-BASED AUTHENTICATION & RBAC =================
// Strictly verifies the administrator's HttpOnly JWT cookie or Authorization Bearer header
export const requireAuth = (
  allowedRoles = ['superadmin', 'admin', 'cms_admin']
) => {
  return async (req, res, next) => {
    try {
      let token = null;

      // 1. Check HttpOnly cookie or Authorization Bearer header
      if (req.cookies && req.cookies.thinkwires_admin_jwt) {
        token = req.cookies.thinkwires_admin_jwt;
      } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          authenticated: false,
          error:
            'Authentication required. Please log in with your official credentials to access the admin portal.',
        });
      }

      // 2. Decode and verify token
      let decoded;
      try {
        decoded = verifyAdminToken(token);
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            authenticated: false,
            error: 'Admin session expired. Please log in again.',
          });
        }
        return res.status(401).json({
          success: false,
          authenticated: false,
          error:
            'Invalid or forged admin authentication session. Please log in again.',
        });
      }

      if (!decoded || !decoded.email || !decoded.role) {
        return res.status(401).json({
          success: false,
          authenticated: false,
          error: 'Malformed admin authentication credentials.',
        });
      }

      // 3. Database verification if MongoDB is connected
      let userObj = {
        id: decoded.id,
        name: decoded.name || 'System Member',
        email: decoded.email,
        role: decoded.role.toLowerCase(),
        designation: decoded.designation || 'System Member',
      };

      if (mongoose.connection.readyState === 1) {
        try {
          const dbUser = mongoose.Types.ObjectId.isValid(decoded.id)
            ? await UserMongo.findById(decoded.id).select('-password').lean()
            : await UserMongo.findOne({ email: decoded.email.toLowerCase() })
                .select('-password')
                .lean();

          if (dbUser) {
            if (dbUser.isActive === false) {
              return res.status(403).json({
                success: false,
                error:
                  'Your administrative account has been deactivated. Please contact your Superadmin.',
              });
            }
            userObj = {
              id: dbUser._id ? dbUser._id.toString() : dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              role: (dbUser.role || 'admin').toLowerCase(),
              designation: dbUser.designation,
              isActive: dbUser.isActive,
            };
          }
        } catch (dbErr) {
          console.warn('Admin user DB verification notice:', dbErr.message);
        }
      }

      req.user = userObj;
      const role = (userObj.role || 'admin').toLowerCase();

      // 4. Role check (superadmin always passes)
      if (
        role !== 'superadmin' &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(role)
      ) {
        return res.status(403).json({
          success: false,
          error: `Permission Denied: Your assigned role (${role.toUpperCase()}) is not authorized for this operation. Requires ${allowedRoles.join(' or ')}.`,
          currentRole: role,
        });
      }

      next();
    } catch (error) {
      console.error('Admin requireAuth error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal authorization error.',
      });
    }
  };
};

/**
 * RBAC Helper Middleware: enforces specific roles on route groups.
 * Superadmin automatically bypasses all restrictions (full control).
 */
export const requireRole = (...allowedRoles) => {
  const rolesList = allowedRoles.flat();
  return (req, res, next) => {
    const role = (req.user?.role || 'superadmin').toLowerCase();

    // Superadmin has full uninhibited access across all portal modules
    if (role === 'superadmin') {
      return next();
    }

    if (rolesList.length > 0 && !rolesList.includes(role)) {
      const isManpowerRestricted =
        role === 'cms_admin' && !rolesList.includes('cms_admin');
      const isCmsRestricted = role === 'admin' && !rolesList.includes('admin');

      let errorMsg = `Access Denied: ${role.toUpperCase()} role is not authorized for this module. Requires ${rolesList.join(' or ')}.`;
      let code = 'RBAC_ACCESS_DENIED';

      if (isManpowerRestricted) {
        errorMsg =
          'Access Denied: Your account role is CMS Admin. CMS Admins have access restricted exclusively to the Content Management System (CMS). Manpower, Candidate, and Placement records are inaccessible.';
        code = 'RBAC_CMS_ADMIN_RESTRICTED';
      } else if (isCmsRestricted) {
        errorMsg =
          'Access Denied: Your account role is Admin. Admins have access restricted exclusively to Manpower, Workforce, and Recruitment operations. Content Management System (CMS) is inaccessible.';
        code = 'RBAC_ADMIN_CMS_RESTRICTED';
      }

      return res.status(403).json({
        success: false,
        error: errorMsg,
        code,
        requiredRoles: rolesList,
        currentRole: role,
      });
    }

    next();
  };
};

// ================= CANDIDATE PORTAL AUTHORIZATION =================
// Strictly verifies the candidate's HttpOnly cookie or Authorization Bearer token
export const requireCandidateAuth = async (req, res, next) => {
  try {
    // 1. Check for token in HttpOnly cookie or Authorization header
    let token = null;

    if (req.cookies && req.cookies.thinkwires_candidate_jwt) {
      token = req.cookies.thinkwires_candidate_jwt;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error:
          'Authentication required. Please log in to access this candidate resource.',
      });
    }

    // 2. Decode and verify token using the strictly configured JWT_SECRET
    const decoded = verifyCandidateToken(token);

    if (!decoded || !decoded.id || decoded.role !== 'candidate') {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'Invalid authentication session.',
      });
    }

    // 3. Database verification to ensure candidate still exists and is active
    let candidate = null;
    if (mongoose.connection.readyState === 1) {
      candidate = await Candidate.findById(decoded.id).select(
        '-password -resetPasswordToken -resetPasswordExpire'
      );
      if (!candidate) {
        return res.status(401).json({
          success: false,
          authenticated: false,
          error: 'Candidate account not found or has been deactivated.',
        });
      }
    } else {
      // In production, MongoDB is required for authentication
      if (process.env.NODE_ENV === 'production') {
        return res.status(503).json({
          success: false,
          error: 'Authentication database is currently unavailable.',
        });
      }
      // Non-production fallback representation from token payload
      candidate = {
        _id: decoded.id,
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: 'candidate',
      };
    }

    // Attach candidate to request context
    req.candidate = candidate;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'Session expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      authenticated: false,
      error: 'Invalid or forged authentication token.',
    });
  }
};

/**
 * Universal Authenticator for Candidate or Admin sessions
 * Verifies either candidate JWT or admin JWT and populates req.user
 */
export const authenticateCandidateOrAdmin = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.thinkwires_admin_jwt) {
      token = req.cookies.thinkwires_admin_jwt;
    } else if (req.cookies && req.cookies.thinkwires_candidate_jwt) {
      token = req.cookies.thinkwires_candidate_jwt;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'Authentication token required.',
      });
    }

    let decoded = null;
    let isAdmin = false;

    try {
      decoded = verifyAdminToken(token);
      isAdmin = true;
    } catch {
      try {
        decoded = verifyCandidateToken(token);
      } catch (candErr) {
        return res.status(401).json({
          success: false,
          authenticated: false,
          error:
            candErr.name === 'TokenExpiredError'
              ? 'Session expired.'
              : 'Invalid token.',
        });
      }
    }

    req.user = {
      id: decoded.id || decoded._id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role || (isAdmin ? 'admin' : 'candidate'),
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      error: 'Authentication failed.',
    });
  }
};

/**
 * Optional Candidate Authenticator
 * Populates req.candidate if valid session exists, but allows guest applicants through
 */
export const optionalCandidateAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.thinkwires_candidate_jwt) {
      token = req.cookies.thinkwires_candidate_jwt;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      req.candidate = null;
      return next();
    }

    try {
      const decoded = verifyCandidateToken(token);
      if (decoded && decoded.id) {
        if (mongoose.connection.readyState === 1) {
          const candidate = await Candidate.findById(decoded.id).select(
            '-password'
          );
          if (candidate) {
            req.candidate = candidate;
          }
        } else {
          req.candidate = {
            _id: decoded.id,
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: 'candidate',
          };
        }
      }
    } catch {
      req.candidate = null;
    }

    next();
  } catch {
    req.candidate = null;
    next();
  }
};

export default requireAuth;
