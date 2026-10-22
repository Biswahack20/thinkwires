import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getCandidateDashboard,
  updateCandidateProfile,
  getMyApplications,
  applyForJob,
  parseResumeForAutoFill,
  getApplicationAssessment,
  submitApplicationAssessment,
  withdrawApplication,
} from '../controllers/candidatePortal.controller.js';
import {
  requireCandidateAuth,
  optionalCandidateAuth,
} from '../middlewares/auth.middleware.js';
import { resumeUpload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Rate limiter for resume parsing to prevent resource and compute exhaustion
const parseResumeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 parsing attempts per window per IP
  skip: () => process.env.NODE_ENV === 'test',
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error:
      'Too many resume parse requests from this IP. Please try again after 15 minutes.',
  },
});

// Resume Auto-fill (accessible for application form auto-population)
router.post(
  '/parse-resume',
  parseResumeRateLimiter,
  resumeUpload.single('resume'),
  parseResumeForAutoFill
);

// Candidate portal routes strictly require candidate authentication
router.use(requireCandidateAuth);

// Candidate Profile & Dashboard
router.get('/dashboard', getCandidateDashboard);
router.put('/profile', updateCandidateProfile);

// Job Applications Tracking & Intake (Strictly Authenticated Candidates Only)
router.post('/apply', resumeUpload.single('resume'), applyForJob);
router.get('/applications', getMyApplications);
router.post('/applications/:applicationId/withdraw', withdrawApplication);

// AI Screening Assessment Gatekeeper
router.get('/applications/:applicationId/assessment', getApplicationAssessment);
router.post(
  '/applications/:applicationId/assessment/submit',
  submitApplicationAssessment
);

export default router;
