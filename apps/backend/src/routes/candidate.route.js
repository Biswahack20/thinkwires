import express from 'express';
import {
  getCandidateDashboard,
  updateCandidateProfile,
  getMyApplications,
  applyForJob,
  parseResumeForAutoFill,
  getApplicationAssessment,
  submitApplicationAssessment,
} from '../controllers/candidatePortal.controller.js';
import { requireCandidateAuth } from '../middlewares/auth.middleware.js';
import { resumeUpload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Resume Auto-fill (accessible for application form auto-population)
router.post('/parse-resume', resumeUpload.single('resume'), parseResumeForAutoFill);

// Candidate portal routes strictly require candidate authentication
router.use(requireCandidateAuth);

// Candidate Profile & Dashboard
router.get('/dashboard', getCandidateDashboard);
router.put('/profile', updateCandidateProfile);

// Job Applications
router.get('/applications', getMyApplications);
router.post('/apply', resumeUpload.single('resume'), applyForJob);

// AI Screening Assessment Gatekeeper
router.get('/applications/:applicationId/assessment', getApplicationAssessment);
router.post('/applications/:applicationId/assessment/submit', submitApplicationAssessment);

export default router;
