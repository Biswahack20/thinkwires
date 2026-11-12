import express from 'express';
import { getProfile, updateProfile } from '../controllers/user.js';
import requireAuth from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Staff User Profile Management Routes
 * Protected strictly for administrative team members (BOLA-14)
 */
const staffGuard = requireAuth(['superadmin', 'admin', 'cms_admin']);

router.get('/profile', staffGuard, getProfile);
router.put('/profile', staffGuard, updateProfile);

export default router;
