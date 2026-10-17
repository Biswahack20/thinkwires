import express from 'express';
import {
  getCandidateDashboard,
  updateCandidateProfile,
  getMyApplications,
  applyForJob,
} from '../controllers/candidatePortal.controller.js';
import { requireCandidateAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All candidate portal routes strictly require candidate authentication
router.use(requireCandidateAuth);

router.get('/dashboard', getCandidateDashboard);
router.put('/profile', updateCandidateProfile);
router.get('/applications', getMyApplications);
router.post('/apply', applyForJob);

export default router;
