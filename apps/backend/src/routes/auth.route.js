import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  registerCandidate,
  loginCandidate,
  getMe,
  logoutCandidate,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';
import { requireCandidateAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rate limiter for login and password reset to protect against brute-force attacks
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error:
      'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

// Rate limiter for candidate registration to mitigate spam account creation
const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // limit each IP to 15 registrations per hour
  skip: () => process.env.NODE_ENV === 'test',
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error:
      'Too many registration requests from this IP. Please try again after an hour.',
  },
});

// Candidate Registration & Login
router.post('/register', registerRateLimiter, registerCandidate);
router.post('/login', authRateLimiter, loginCandidate);
router.post('/logout', logoutCandidate);

// Password recovery
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);

// Session check / restoration
router.get('/me', requireCandidateAuth, getMe);

export default router;
