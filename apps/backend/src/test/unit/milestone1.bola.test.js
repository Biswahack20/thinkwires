import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import {
  getCandidateAuthCookie,
  getAdminAuthCookie,
} from '../test-helper.js';
import { generateAdminToken } from '../../utils/auth.util.js';
import { localDevApplications } from '../../controllers/candidatePortal.controller.js';
import JobApplication from '../../models/jobApplication.mongo.model.js';

describe('Milestone 1: BOLA / IDOR & Data Protection Audit Verification', () => {
  const candidateCookie = getCandidateAuthCookie({
    id: 'cand-bola-001',
    email: 'bob@thinkwires.com',
    name: 'Bob Candidate',
  });

  const cmsAdminCookie = getAdminAuthCookie({
    id: 'admin-cms-001',
    email: 'cms.editor@thinkwires.com',
    name: 'CMS Editor',
    role: 'cms_admin',
  });

  const manpowerAdminCookie = getAdminAuthCookie({
    id: 'admin-manpower-001',
    email: 'recruiter@thinkwires.com',
    name: 'Recruiter Admin',
    role: 'admin',
  });

  const superadminCookie = getAdminAuthCookie({
    id: 'admin-super-001',
    email: 'super@thinkwires.com',
    name: 'Super Admin',
    role: 'superadmin',
  });

  beforeEach(() => {
    localDevApplications.length = 0;
  });

  // BOLA-1: Conflict PII Protection
  describe('BOLA-1: Cross-user PII leak prevention on 409 conflict', () => {
    it('returns HTTP 409 without leaking full victim application or evaluation dossier', async () => {
      const payload = {
        jobId: 'JOB-BOLA-1',
        jobTitle: 'Distributed Systems Engineer',
        firstName: 'Bob',
        lastName: 'Candidate',
        mobileNumber: '+1 555-0199',
        agreedToTerms: true,
        skills: ['Go', 'Kubernetes'],
      };

      const first = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(payload);

      expect([201, 409]).toContain(first.status);

      const second = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(payload);

      expect(second.status).toBe(409);
      expect(second.body.success).toBe(false);
      expect(second.body.error).toMatch(/already applied/i);
      expect(second.body.existingApplication).toBeUndefined();
      expect(second.body.evaluationReport).toBeUndefined();
    });
  });

  // BOLA-2: Arbitrary Resume Pointer Attachment
  describe('BOLA-2: Arbitrary resume pointer attachment prevention', () => {
    it('rejects arbitrary clientResumeUrl pointing to another user resume with 400', async () => {
      const res = await request(app)
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send({
          jobId: 'JOB-BOLA-2',
          jobTitle: 'Security Architect',
          firstName: 'Bob',
          lastName: 'Candidate',
          mobileNumber: '+1 555-0199',
          agreedToTerms: true,
          skills: ['AppSec'],
          clientResumeUrl: '/uploads/resumes/victim-confidential-resume.pdf',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/resume/i);
    });
  });

  // BOLA-3: Regex Injection & BOLA-4: CMS Admin Resume Download
  describe('BOLA-3 & BOLA-4: Resume download authorization and unescaped regex defense', () => {
    it('strictly forbids cms_admin from downloading candidate resumes with HTTP 403', async () => {
      const res = await request(app)
        .get('/uploads/resumes/candidate-resume.pdf')
        .set('Cookie', cmsAdminCookie);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/CMS Administrators are restricted|RBAC_CMS_ADMIN_RESTRICTED/i);
    });

    it('rejects unauthenticated requests to resume download endpoints with 401', async () => {
      const res = await request(app).get('/uploads/resumes/candidate-resume.pdf');
      expect(res.status).toBe(401);
      expect(res.body.authenticated).toBe(false);
    });
  });

  // BOLA-5: CMS Admin Openings Manipulation
  describe('BOLA-5: CMS admin restricted from mutating job openings', () => {
    it('rejects cms_admin attempting to mutate openings on POST /api/openings with 403', async () => {
      const res = await request(app)
        .post('/api/openings')
        .set('Cookie', cmsAdminCookie)
        .send({ openings: [] });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('permits manpower admin or superadmin to update openings', async () => {
      const res = await request(app)
        .post('/api/openings')
        .set('Cookie', manpowerAdminCookie)
        .send({ openings: [] });

      expect([200, 400]).toContain(res.status);
    });
  });

  // BOLA-6: Manpower Admin CMS Defacement Prevention
  describe('BOLA-6: Manpower admin restricted from mutating CMS marketing pages', () => {
    it('rejects manpower admin attempting to mutate /api/stats with 403', async () => {
      const res = await request(app)
        .post('/api/stats')
        .set('Cookie', manpowerAdminCookie)
        .send({ stats: {} });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('rejects manpower admin attempting to mutate /api/process with 403', async () => {
      const res = await request(app)
        .post('/api/process')
        .set('Cookie', manpowerAdminCookie)
        .send({ steps: [] });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('rejects manpower admin attempting to mutate /api/contact/offices with 403', async () => {
      const res = await request(app)
        .post('/api/contact/offices')
        .set('Cookie', manpowerAdminCookie)
        .send({ offices: [] });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('rejects manpower admin attempting to mutate /api/payroll with 403', async () => {
      const res = await request(app)
        .post('/api/payroll')
        .set('Cookie', manpowerAdminCookie)
        .send({ data: {} });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  // BOLA-7 & BOLA-10: Bench Code Entropy & ObjectId Rejection
  describe('BOLA-7 & BOLA-10: Bench dossier code validation and ObjectId rejection', () => {
    it('rejects raw MongoDB ObjectIds on public bench dossier with 400', async () => {
      const res = await request(app).get('/api/bench/dossier/507f1f77bcf86cd799439011');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Invalid bench identifier format/i);
    });

    it('rejects malformed bench codes with HTTP 400', async () => {
      const res = await request(app).get('/api/bench/dossier/malformed-bench-code');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Malformed bench code format/i);
    });

    it('accepts valid bench code format and returns 404 for non-existent candidate', async () => {
      const res = await request(app).get('/api/bench/dossier/TW-ENG-12345678-1234-1234-1234-123456789abc');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/not found/i);
    });
  });

  // BOLA-11: Placement Client Billing Exfiltration Defense
  describe('BOLA-11: Placement billing margins redaction for non-authorized roles', () => {
    it('redacts billingRate from placements when accessed by cms_admin', async () => {
      const res = await request(app)
        .get('/api/admin/placements')
        .set('Cookie', cmsAdminCookie);

      // CMS admin is blocked from admin placements by manpowerGuard (403) or redacted
      if (res.status === 200) {
        const placements = res.body.placements || [];
        placements.forEach((p) => {
          expect(p.billingRate).toBeFalsy();
          expect(p.grossMargin).toBeFalsy();
        });
      } else {
        expect(res.status).toBe(403);
      }
    });
  });

  // BOLA-12: System Member Role Escalation Defense
  describe('BOLA-12: Role escalation prevention for system members', () => {
    it('forbids non-superadmin from mutating system member role with 403', async () => {
      const token = generateAdminToken({
        id: 'admin-manpower-001',
        email: 'recruiter@thinkwires.com',
        name: 'Recruiter Admin',
        role: 'admin',
      });
      const res = await request(app)
        .put('/api/admin/system-members/sm-001')
        .set('Authorization', `Bearer ${token}`)
        .send({ role: 'superadmin' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Access Denied/i);
      expect(res.body.requiredRoles).toContain('superadmin');
    });
  });

  // BOLA-13: Avatar Preset Validation
  describe('BOLA-13: Avatar preset identifier whitelist and SSRF defense', () => {
    it('rejects arbitrary external URLs or script injections with HTTP 400', async () => {
      const maliciousCases = [
        'javascript:alert(1)',
        'https://attacker.com/malicious.svg',
        '../presets/secret.svg',
        '',
        'a'.repeat(35),
      ];

      for (const presetId of maliciousCases) {
        const res = await request(app)
          .put('/api/candidate/avatar/preset')
          .set('Cookie', candidateCookie)
          .send({ presetId });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Valid preset identifier is required/i);
      }
    });

    it('accepts valid alphanumeric presetId', async () => {
      const res = await request(app)
        .put('/api/candidate/avatar/preset')
        .set('Cookie', candidateCookie)
        .send({ presetId: 'engineer_avatar_01' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.avatarUrl).toBe('/avatars/presets/engineer_avatar_01.svg');
    });
  });

  // BOLA-14: User Profile Isolation
  describe('BOLA-14: User profile session isolation from candidate tokens', () => {
    it('rejects candidate token attempting to access /api/user/profile with 401/403', async () => {
      const res = await request(app)
        .get('/api/user/profile')
        .set('Cookie', candidateCookie);

      expect([401, 403]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });

  // BOLA-15: Zero-Crash CastError Prevention
  describe('BOLA-15: Zero-crash CastError validation guard across application routes', () => {
    const invalidIds = ['abc-123', 'invalid_id', '123', 'undefined'];

    for (const badId of invalidIds) {
      it(`returns clean HTTP 400 instead of 500 crash for assessment with id "${badId}"`, async () => {
        const res = await request(app)
          .get(`/api/candidate/applications/${badId}/assessment`)
          .set('Cookie', candidateCookie);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Invalid application identifier format/i);
      });

      it(`returns clean HTTP 400 instead of 500 crash for dossier with id "${badId}"`, async () => {
        const res = await request(app)
          .get(`/api/candidate/applications/${badId}/dossier`)
          .set('Cookie', candidateCookie);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Invalid application identifier format/i);
      });

      it(`returns clean HTTP 400 instead of 500 crash for withdraw with id "${badId}"`, async () => {
        const res = await request(app)
          .post(`/api/candidate/applications/${badId}/withdraw`)
          .set('Cookie', candidateCookie);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Invalid application identifier format/i);
      });
    }
  });

  // BOLA-16: Application Cooldown and Partial Unique Index Verification
  describe('BOLA-16: JobApplication partial unique index declaration', () => {
    it('verifies that JobApplication model includes partial unique index on active statuses', () => {
      const indexes = JobApplication.schema.indexes();
      const partialIndex = indexes.find(
        ([fields, options]) =>
          fields.candidate === 1 &&
          fields.jobId === 1 &&
          options?.partialFilterExpression?.status
      );

      expect(partialIndex).toBeDefined();
      const [, opts] = partialIndex;
      expect(opts.unique).toBe(true);
      expect(opts.partialFilterExpression.status.$in).toContain('Applied');
      expect(opts.partialFilterExpression.status.$in).toContain('Screening');
      expect(opts.partialFilterExpression.status.$in).not.toContain('Rejected');
      expect(opts.partialFilterExpression.status.$in).not.toContain('Withdrawn');
    });

    it('verifies anonymousCode has a sparse unique index', () => {
      const indexes = JobApplication.schema.indexes();
      const anonymousCodeIndex = indexes.find(
        ([fields, options]) => fields.anonymousCode === 1 && options?.sparse === true
      );

      expect(anonymousCodeIndex).toBeDefined();
      const [, opts] = anonymousCodeIndex;
      expect(opts.unique).toBe(true);
    });
  });
});
