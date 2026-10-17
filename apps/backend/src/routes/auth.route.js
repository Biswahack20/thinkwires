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
    error: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

// Candidate Registration & Login
router.post('/register', registerCandidate);
router.post('/login', authRateLimiter, loginCandidate);
router.post('/logout', logoutCandidate);

// Password recovery
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);

// Session check / restoration
router.get('/me', requireCandidateAuth, getMe);

export default router;
