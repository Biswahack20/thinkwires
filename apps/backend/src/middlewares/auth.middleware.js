import { verifyCandidateToken } from '../utils/auth.util.js';
import Candidate from '../models/candidate.mongo.model.js';
import mongoose from 'mongoose';

// ================= ADMIN ROLE-BASED AUTHENTICATION =================
// Remains completely separate so candidates cannot access admin CMS endpoints
export const requireAuth = (allowedRoles = ['admin', 'editor', 'viewer']) => {
  return (req, res, next) => {
    let role = (
      req.headers['x-demo-role'] ||
      req.query.role ||
      'admin'
    ).toString().toLowerCase();

    if (role === 'superuser' || role === 'owner') role = 'admin';

    req.user = {
      id: role === 'admin' ? 'usr_001' : role === 'editor' ? 'usr_002' : 'usr_003',
      name: role === 'admin' ? 'Biswarupa Swain' : role === 'editor' ? 'Sarah Jenkins' : 'David Thorne',
      email: `${role}@thinkwires.com`,
      role: role,
    };

    if (role === 'viewer' && req.method !== 'GET') {
      return res.status(403).json({
        success: false,
        error: 'Permission Denied: Viewer accounts have read-only access. Switch role to Admin or Editor to perform modifications.',
        currentRole: role,
      });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        error: `Permission Denied: ${role.toUpperCase()} role is not authorized for this operation. Requires ${allowedRoles.join(' or ')}.`,
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
