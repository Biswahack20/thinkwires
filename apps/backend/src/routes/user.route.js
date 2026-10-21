import express from 'express';
import { getProfile, updateProfile } from '../controllers/user.js';
import { authenticateCandidateOrAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * User Profile Management Routes
 * Protected by authentication middleware (JWT cookie or Bearer header)
 */
router.get('/profile', authenticateCandidateOrAdmin, getProfile);
router.put('/profile', authenticateCandidateOrAdmin, updateProfile);

export default router;
