import express from 'express';
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
import { requireCandidateAuth, optionalCandidateAuth } from '../middlewares/auth.middleware.js';
import { resumeUpload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Resume Auto-fill (accessible for application form auto-population)
router.post('/parse-resume', resumeUpload.single('resume'), parseResumeForAutoFill);

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
router.post('/applications/:applicationId/assessment/submit', submitApplicationAssessment);

export default router;
