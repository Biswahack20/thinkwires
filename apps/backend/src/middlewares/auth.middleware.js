import { verifyCandidateToken } from '../utils/auth.util.js';
import Candidate from '../models/candidate.mongo.model.js';
import mongoose from 'mongoose';

// ================= ADMIN ROLE-BASED AUTHENTICATION & RBAC =================
// Supports RBAC roles: superadmin (full control), cms_admin (CMS only), admin (manpower & recruitment)
export const requireAuth = (allowedRoles = ['superadmin', 'admin', 'cms_admin']) => {
  return (req, res, next) => {
    let role = (
      req.headers['x-demo-role'] ||
      req.query.role ||
      'superadmin'
    ).toString().toLowerCase();

    // Map common aliases
    if (role === 'superuser' || role === 'owner') role = 'superadmin';
    if (role === 'cms-admin' || role === 'cmsadmin') role = 'cms_admin';

    let userObj = {
      id: 'usr_001',
      name: 'Alexander Vance',
      email: 'superadmin@thinkwires.com',
      role: 'superadmin',
      designation: 'Chief Technology Officer / Superadmin',
    };

    if (role === 'cms_admin') {
      userObj = {
        id: 'usr_002',
        name: 'Elena Rostova',
        email: 'cmsadmin@thinkwires.com',
        role: 'cms_admin',
        designation: 'Chief Content Officer / CMS Admin',
      };
    } else if (role === 'admin') {
      userObj = {
        id: 'usr_003',
        name: 'Biswarupa Swain',
        email: 'admin@thinkwires.com',
        role: 'admin',
        designation: 'Principal System Admin',
      };
    }

    req.user = userObj;

    // Role check (superadmin always passes)
    if (role !== 'superadmin' && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        error: `Permission Denied: ${role.toUpperCase()} role is not authorized for this operation. Requires ${allowedRoles.join(' or ')}.`,
        currentRole: role,
      });
    }

    next();
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
      const isManpowerRestricted = role === 'cms_admin' && !rolesList.includes('cms_admin');
      const isCmsRestricted = role === 'admin' && !rolesList.includes('admin');

      let errorMsg = `Access Denied: ${role.toUpperCase()} role is not authorized for this module. Requires ${rolesList.join(' or ')}.`;
      let code = 'RBAC_ACCESS_DENIED';

      if (isManpowerRestricted) {
        errorMsg = 'Access Denied: Your account role is CMS Admin. CMS Admins have access restricted exclusively to the Content Management System (CMS). Manpower, Candidate, and Placement records are inaccessible.';
        code = 'RBAC_CMS_ADMIN_RESTRICTED';
      } else if (isCmsRestricted) {
        errorMsg = 'Access Denied: Your account role is Admin. Admins have access restricted exclusively to Manpower, Workforce, and Recruitment operations. Content Management System (CMS) is inaccessible.';
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
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'Authentication required. Please log in to access this candidate resource.',
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
      candidate = await Candidate.findById(decoded.id).select('-password -resetPasswordToken -resetPasswordExpire');
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

export default requireAuth;
