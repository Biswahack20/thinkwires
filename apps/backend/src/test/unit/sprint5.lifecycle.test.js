import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import {
  getCandidateAuthCookie,
  getAdminAuthCookie,
} from '../test-helper.js';
import { generateAdminToken } from '../../utils/auth.util.js';
import { localDevApplications } from '../../controllers/candidatePortal.controller.js';

describe('Sprint 5: Candidate Lifecycle, High-Performance AI Pipeline & Database Fault Tolerance', () => {
  const candidateId = 'cand-sprint5-001';
  const candidateCookie = getCandidateAuthCookie({
    id: candidateId,
    email: 'charlie@thinkwires.com',
    name: 'Charlie Candidate',
    phone: '+1 555-0199',
  });

  const adminToken = generateAdminToken({
    id: 'admin-super-001',
    email: 'super@thinkwires.com',
    name: 'Super Admin',
    role: 'superadmin',
  });

  const makeAppPayload = (overrides = {}) => ({
    jobId: 'job-s5-001',
    jobTitle: 'Fullstack Cloud Architect',
    firstName: 'Charlie',
    lastName: 'Candidate',
    mobileNumber: '+1 555-0199',
    skills: ['Node.js', 'React', 'MongoDB', 'AWS'],
    currentCTC: '$130,000',
    expectedCTC: '$150,000',
    currentEmployer: 'Acme Cloud',
    agreedToTerms: true,
    ...overrides,
  });

  let originalNodeEnv;

  beforeEach(() => {
    originalNodeEnv = process.env.NODE_ENV;
    // Clear in-memory applications before each test
    localDevApplications.length = 0;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  // =========================================================================
  // Issue #196: Fail Closed in Production on Database Outages
  // =========================================================================
  describe('Issue #196: Silent Data Loss Prevention (Fail-Closed in Production)', () => {
    it('returns HTTP 503 on admin write mutations when DB is disconnected in production', async () => {
      process.env.NODE_ENV = 'production';

      const employeeRes = await request(app)
        .post('/api/admin/employees')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Employee',
          email: 'employee@thinkwires.com',
          role: 'employee',
        });

      expect(employeeRes.status).toBe(503);
      expect(employeeRes.body.success).toBe(false);
      expect(employeeRes.body.error).toMatch(/Database connection temporarily unavailable/i);
      expect(employeeRes.body.retryAfterSeconds).toBe(5);

      const jobRes = await request(app)
        .post('/api/admin/jobs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Senior Architect',
          client: 'Acme Cloud',
        });

      expect(jobRes.status).toBe(503);
      expect(jobRes.body.success).toBe(false);
      expect(jobRes.body.error).toMatch(/Database connection temporarily unavailable/i);
    });

    it('returns HTTP 503 on candidate write mutations when DB is disconnected in production', async () => {
      process.env.NODE_ENV = 'production';

      const applyRes = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(makeAppPayload({ jobId: 'job-prod-001' }));

      expect(applyRes.status).toBe(503);
      expect(applyRes.body.success).toBe(false);
      expect(applyRes.body.error).toMatch(/database.*unavailable/i);

      const profileRes = await request(app)
        .put('/api/candidate/profile')
        .set('Cookie', candidateCookie)
        .send({
          name: 'Updated Candidate',
        });

      expect(profileRes.status).toBe(503);
      expect(profileRes.body.success).toBe(false);
      expect(profileRes.body.error).toMatch(/database.*unavailable/i);
    });

    it('returns HTTP 503 on talent requisitions & timesheet submissions when DB is disconnected in production', async () => {
      process.env.NODE_ENV = 'production';

      const reqRes = await request(app)
        .post('/api/find-talent/requisition')
        .send({
          fullName: 'Jane Enterprise',
          corporateEmail: 'jane@enterprise.com',
          targetRole: 'Staff DevOps Engineer',
        });

      expect(reqRes.status).toBe(503);
      expect(reqRes.body.success).toBe(false);
      expect(reqRes.body.error).toMatch(/database.*unavailable/i);

      const timesheetRes = await request(app)
        .post('/api/candidate-portal/timesheet')
        .set('Cookie', candidateCookie)
        .send({
          hours: 40,
          weekEnding: '2026-11-01',
          comments: 'Regular 40 hours sprint',
        });

      expect(timesheetRes.status).toBe(503);
      expect(timesheetRes.body.success).toBe(false);
      expect(timesheetRes.body.error).toMatch(/database.*unavailable/i);
    });

    it('allows fallback in-memory mutations in development and test environments', async () => {
      process.env.NODE_ENV = 'test';

      const applyRes = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(makeAppPayload({ jobId: 'job-test-001' }));

      expect(applyRes.status).toBe(201);
      expect(applyRes.body.success).toBe(true);
      expect(applyRes.body.application).toBeDefined();
    });
  });

  // =========================================================================
  // Issue #206: Parallel AI Execution & Timeout Protection
  // =========================================================================
  describe('Issue #206: Bounded Parallel AI Execution Pipeline', () => {
    it('executes AI pipeline concurrently and responds rapidly with fitScore, fitBadge, and assessment', async () => {
      process.env.NODE_ENV = 'test';

      const startTime = Date.now();
      const res = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(makeAppPayload({ jobId: 'job-ai-001' }));

      const elapsedMs = Date.now() - startTime;

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.fitScore).toBeDefined();
      expect(res.body.fitBadge).toBeDefined();
      expect(res.body.assessment).toBeDefined();
      expect(elapsedMs).toBeLessThan(8000);
    });
  });

  // =========================================================================
  // Issue #207: Assessment Draft Auto-Save and Disconnect Recovery
  // =========================================================================
  describe('Issue #207: Screening Assessment Draft Persistence & Recovery', () => {
    it('saves draft answers, retrieves them on assessment load, and resets upon submission', async () => {
      process.env.NODE_ENV = 'test';

      // 1. Submit initial application to generate assessment
      const applyRes = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(makeAppPayload({ jobId: 'job-assessment-001' }));

      expect(applyRes.status).toBe(201);
      const applicationId = applyRes.body.application._id || applyRes.body.application.id;
      expect(applicationId).toBeDefined();

      // 2. Save partial draft answers
      const draftAnswers = {
        q1: 2,
        q2: 'Distributed consensus requires quorum voting.',
      };

      const saveDraftRes = await request(app)
        .put(`/api/candidate/applications/${applicationId}/assessment/draft`)
        .set('Cookie', candidateCookie)
        .send({ answers: draftAnswers });

      expect(saveDraftRes.status).toBe(200);
      expect(saveDraftRes.body.success).toBe(true);
      expect(saveDraftRes.body.draftAnswers).toEqual(draftAnswers);

      // 3. Load assessment and verify draft answers are recovered
      const getAssessmentRes = await request(app)
        .get(`/api/candidate/applications/${applicationId}/assessment`)
        .set('Cookie', candidateCookie);

      expect(getAssessmentRes.status).toBe(200);
      expect(getAssessmentRes.body.success).toBe(true);
      expect(getAssessmentRes.body.draftAnswers).toEqual(draftAnswers);

      // 4. Submit assessment for final grading
      const submitRes = await request(app)
        .post(`/api/candidate/applications/${applicationId}/assessment/submit`)
        .set('Cookie', candidateCookie)
        .send({ answers: draftAnswers });

      expect(submitRes.status).toBe(200);
      expect(submitRes.body.success).toBe(true);

      // 5. Verify draft answers are reset after completion
      const checkDraftCleared = await request(app)
        .get(`/api/candidate/applications/${applicationId}/assessment`)
        .set('Cookie', candidateCookie);

      expect(checkDraftCleared.status).toBe(200);
      expect(checkDraftCleared.body.draftAnswers).toEqual({});
    });
  });

  // =========================================================================
  // Issue #208: 90-Day Cooldown Policy for Re-applications
  // =========================================================================
  describe('Issue #208: Candidate Re-Application 90-Day Cooldown Window', () => {
    it('blocks duplicate application when active application exists', async () => {
      process.env.NODE_ENV = 'test';

      const firstApp = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(makeAppPayload({ jobId: 'job-cooldown-001' }));

      expect(firstApp.status).toBe(201);

      // Re-applying to same active job
      const duplicateApp = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(makeAppPayload({ jobId: 'job-cooldown-001' }));

      expect(duplicateApp.status).toBe(409);
      expect(duplicateApp.body.success).toBe(false);
      expect(duplicateApp.body.error).toMatch(/already applied/i);
      expect(duplicateApp.body.error).toMatch(/active application under review/i);
    });

    it('blocks re-application within 90 days of rejection with clear cooldown notice', async () => {
      process.env.NODE_ENV = 'test';

      const applyRes = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(makeAppPayload({ jobId: 'job-cooldown-002' }));

      expect(applyRes.status).toBe(201);

      // Simulate application being rejected 30 days ago
      const appRecord = localDevApplications.find(
        (a) => String(a.jobId) === 'job-cooldown-002'
      );
      expect(appRecord).toBeDefined();
      appRecord.status = 'Rejected';
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      appRecord.updatedAt = thirtyDaysAgo.toISOString();

      // Attempt to re-apply during cooldown
      const retryRes = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(makeAppPayload({ jobId: 'job-cooldown-002' }));

      expect(retryRes.status).toBe(409);
      expect(retryRes.body.success).toBe(false);
      expect(retryRes.body.error).toMatch(/already applied/i);
      expect(retryRes.body.error).toMatch(/open 90 days after closure/i);
    });

    it('permits candidate re-application after 90 days cooldown has elapsed', async () => {
      process.env.NODE_ENV = 'test';

      const applyRes = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(makeAppPayload({ jobId: 'job-cooldown-003' }));

      expect(applyRes.status).toBe(201);

      // Simulate application was rejected 95 days ago
      const appRecord = localDevApplications.find(
        (a) => String(a.jobId) === 'job-cooldown-003'
      );
      expect(appRecord).toBeDefined();
      appRecord.status = 'Rejected';
      const ninetyFiveDaysAgo = new Date();
      ninetyFiveDaysAgo.setDate(ninetyFiveDaysAgo.getDate() - 95);
      appRecord.updatedAt = ninetyFiveDaysAgo.toISOString();

      // Candidate re-applies after 90 days cooldown
      const reApplyRes = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(makeAppPayload({ jobId: 'job-cooldown-003' }));

      expect(reApplyRes.status).toBe(201);
      expect(reApplyRes.body.success).toBe(true);
      expect(reApplyRes.body.application).toBeDefined();
    });
  });

  // =========================================================================
  // Issue #209: Transactional Dispatch Queue for Alerts
  // =========================================================================
  describe('Issue #209: Transactional Notification Dispatch Queue Tracking', () => {
    it('sets emailNotificationStatus to Sent upon successful application creation', async () => {
      process.env.NODE_ENV = 'test';

      const res = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(makeAppPayload({ jobId: 'job-email-001' }));

      expect(res.status).toBe(201);
      expect(res.body.application.emailNotificationStatus).toBe('Sent');
    });
  });
});
