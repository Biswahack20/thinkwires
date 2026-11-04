import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import {
  getCandidateAuthCookie,
  getAdminAuthCookie,
} from '../test-helper.js';
import { inMemoryData, getActivities } from '../../controllers/admin.controller.js';

describe('Sprint 3: Core Security, Authorization & Privacy Controls', () => {
  const candidateCookie = getCandidateAuthCookie({
    id: 'cand-sprint3-001',
    email: 'alice@thinkwires.com',
    name: 'Alice Candidate',
  });

  const cmsAdminCookie = getAdminAuthCookie({
    id: 'admin-cms-001',
    email: 'editor@thinkwires.com',
    name: 'CMS Editor',
    role: 'cms_admin',
  });

  const superadminCookie = getAdminAuthCookie({
    id: 'admin-super-001',
    email: 'super@thinkwires.com',
    name: 'Super Admin',
    role: 'superadmin',
  });

  // =========================================================================
  // Issue #178: Resume Directory Exposure & Authentication Protection
  // =========================================================================
  describe('Issue #178: Candidate Resume Access Protection', () => {
    it('rejects unauthenticated requests to /uploads/resumes/:filename with 401', async () => {
      const res = await request(app).get('/uploads/resumes/confidential-resume-123.pdf');
      expect(res.status).toBe(401);
      expect(res.body.authenticated).toBe(false);
      expect(res.body.error).toMatch(/Authentication required/i);
    });

    it('rejects unauthenticated requests to /api/candidate/resume/:filename with 401', async () => {
      const res = await request(app).get('/api/candidate/resume/confidential-resume-123.pdf');
      expect(res.status).toBe(401);
    });

    it('rejects path traversal attempts on resume download endpoints with 400', async () => {
      const res = await request(app)
        .get('/uploads/resumes/..%2F..%2Fetc%2Fpasswd.pdf')
        .set('Cookie', candidateCookie);
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Invalid resume file identifier/i);
    });

    it('rejects unpermitted file extensions with 400 Bad Request', async () => {
      const res = await request(app)
        .get('/uploads/resumes/malicious.sh')
        .set('Cookie', candidateCookie);
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Invalid file format/i);
    });
  });

  // =========================================================================
  // Issue #201: Candidate Duplicate Conflict Data Leakage & Identity Guard
  // =========================================================================
  describe('Issue #201: Duplicate Application Conflict PII Protection', () => {
    it('returns HTTP 409 without leaking full application or evaluation document', async () => {
      // First application
      const appPayload = {
        jobId: 'JOB-SEC-201',
        jobTitle: 'Senior Security Engineer',
        firstName: 'Alice',
        lastName: 'Candidate',
        mobileNumber: '+1 555-0199',
        agreedToTerms: true,
        skills: ['AppSec', 'Penetration Testing'],
        currentCTC: '$140,000',
        expectedCTC: '$165,000',
        currentEmployer: 'Secret Corp',
      };

      const firstRes = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(appPayload);

      // Verify first application either succeeded or already exists
      expect([201, 409]).toContain(firstRes.status);

      // Attempt duplicate submission
      const secondRes = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(appPayload);

      expect(secondRes.status).toBe(409);
      expect(secondRes.body.success).toBe(false);
      expect(secondRes.body.error).toMatch(/already applied/i);

      // Ensure the response does NOT leak existingApplication object or sensitive PII
      expect(secondRes.body.existingApplication).toBeUndefined();
      expect(secondRes.body.currentCTC).toBeUndefined();
      expect(secondRes.body.expectedCTC).toBeUndefined();
      expect(secondRes.body.evaluationReport).toBeUndefined();
      expect(secondRes.body.applicationId).toBeDefined();
    });
  });

  // =========================================================================
  // Issue #202: Public Openings API Excludes Inbound Mandates & Sanitizes Contacts
  // =========================================================================
  describe('Issue #202: Public Openings Confidentiality & Sanitization', () => {
    it('excludes unapproved inbound requisitions from public /api/openings', async () => {
      const res = await request(app).get('/api/openings');
      expect(res.status).toBe(200);

      const jobs = res.body.openings || res.body.data || res.body;
      expect(Array.isArray(jobs)).toBe(true);

      jobs.forEach((job) => {
        expect(job.isRequisition).not.toBe(true);
        expect(job.status).not.toBe('Inbound Request');
        // Check description does not expose unredacted client manager emails
        if (job.description) {
          expect(job.description).not.toMatch(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        }
      });
    });
  });

  // =========================================================================
  // Issue #203: Bench Dossier Rejects Raw ObjectIds
  // =========================================================================
  describe('Issue #203: Bench Dossier Identifier Validation', () => {
    it('rejects raw MongoDB ObjectIds with HTTP 400 Bad Request', async () => {
      const rawObjectId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/bench/dossier/${rawObjectId}`);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Invalid bench identifier format/i);
    });

    it('returns HTTP 404 for non-existent anonymous bench code', async () => {
      const res = await request(app).get('/api/bench/dossier/TW-NONEXISTENT-999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/not found/i);
    });
  });

  // =========================================================================
  // Issue #204: Timesheet Submission Authentication & Validation
  // =========================================================================
  describe('Issue #204: Timesheet Authentication and Range Validation', () => {
    it('rejects unauthenticated timesheet submission with 401 Unauthorized', async () => {
      const res = await request(app)
        .post('/api/candidate-portal/timesheet')
        .send({ hours: 40, weekEnding: '2026-11-06' });
      expect(res.status).toBe(401);
    });

    it('rejects invalid or out-of-bounds hours with 400 Bad Request', async () => {
      const invalidCases = [-5, 0, 169, 'invalid'];

      for (const badHours of invalidCases) {
        const res = await request(app)
          .post('/api/candidate-portal/timesheet')
          .set('Cookie', candidateCookie)
          .send({ hours: badHours, weekEnding: '2026-11-06' });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Valid logged hours/i);
      }
    });

    it('accepts valid authenticated timesheet submission', async () => {
      const res = await request(app)
        .post('/api/candidate-portal/timesheet')
        .set('Cookie', candidateCookie)
        .send({
          hours: 40,
          weekEnding: '2026-11-06',
          comments: 'Completed Sprint 3 milestones',
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/submitted successfully/i);
    });
  });

  // =========================================================================
  // Issue #205: Activity Stream RBAC Separation for CMS Admins
  // =========================================================================
  describe('Issue #205: Activity Logs Privilege Separation for CMS Admin', () => {
    it('filters activities for cms_admin to only CMS-related entity types', async () => {
      // Seed test activities in inMemoryData
      inMemoryData.activities = [
        {
          id: 'act-1',
          action: 'Page Created',
          entityType: 'Page',
          description: 'Created Landing Page',
        },
        {
          id: 'act-2',
          action: 'Article Published',
          entityType: 'Article',
          description: 'Published AI in Recruitment',
        },
        {
          id: 'act-3',
          action: 'Placement Confirmed',
          entityType: 'Placement',
          description: 'Placed Lead Architect at Enterprise client ($180k CTC)',
        },
        {
          id: 'act-4',
          action: 'Candidate Status Changed',
          entityType: 'Candidate',
          description: 'Candidate offer stage updated',
        },
      ];

      // Request as cms_admin
      const cmsRes = await request(app)
        .get('/api/admin/activities')
        .set('Cookie', cmsAdminCookie);

      expect(cmsRes.status).toBe(200);
      expect(cmsRes.body.success).toBe(true);

      const cmsActivities = cmsRes.body.activities;
      expect(cmsActivities.length).toBeGreaterThan(0);

      // Verify no confidential placement or candidate activities are returned
      cmsActivities.forEach((act) => {
        expect(['Page', 'Article', 'Media', 'Announcement', 'CMS']).toContain(
          act.entityType
        );
        expect(act.entityType).not.toBe('Placement');
        expect(act.entityType).not.toBe('Candidate');
      });

      // Request as superadmin
      const superRes = await request(app)
        .get('/api/admin/activities')
        .set('Cookie', superadminCookie);

      expect(superRes.status).toBe(200);
      expect(superRes.body.success).toBe(true);

      const allEntityTypes = superRes.body.activities.map((a) => a.entityType);
      expect(allEntityTypes).toContain('Placement');
      expect(allEntityTypes).toContain('Candidate');
    });
  });
});

