import { describe, it, expect } from 'vitest';
import { api, getCandidateAuthCookie } from '../test-helper.js';

describe('Candidate Portal API (Integration Tests)', () => {
  const candidateCookie = getCandidateAuthCookie({
    id: 'cand-portal-001',
    email: 'portal.candidate@thinkwires.com',
    name: 'Portal Test Candidate',
  });

  describe('GET /api/candidate/dashboard', () => {
    it('rejects unauthenticated request with 401 Unauthorized', async () => {
      const res = await api.get('/api/candidate/dashboard');

      expect(res.status).toBe(401);
      expect(res.body.authenticated).toBe(false);
    });

    it('returns dashboard data and metrics when authenticated with candidate cookie', async () => {
      const res = await api
        .get('/api/candidate/dashboard')
        .set('Cookie', candidateCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.metrics).toBeDefined();
      expect(res.body.metrics.totalApplications).toBeTypeOf('number');
    });
  });

  describe('GET /api/candidate/applications', () => {
    it('rejects unauthenticated request with 401 Unauthorized', async () => {
      const res = await api.get('/api/candidate/applications');

      expect(res.status).toBe(401);
    });

    it('returns candidate applications list when authenticated', async () => {
      const res = await api
        .get('/api/candidate/applications')
        .set('Cookie', candidateCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.applications)).toBe(true);
    });
  });

  describe('PUT /api/candidate/profile', () => {
    it('updates candidate profile details when authenticated', async () => {
      const res = await api
        .put('/api/candidate/profile')
        .set('Cookie', candidateCookie)
        .send({
          headline: 'Senior Distributed Systems Architect',
          location: 'Austin, TX',
          technicalSkills: ['Go', 'TypeScript', 'Kubernetes'],
          experience: 8,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.candidate.headline).toBe(
        'Senior Distributed Systems Architect'
      );
    });
  });
});
