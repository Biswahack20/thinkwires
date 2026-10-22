import { describe, it, expect } from 'vitest';
import { api } from '../test-helper.js';

describe('Candidate Lifecycle (Functional End-to-End API Flow)', () => {
  const timestamp = Date.now();
  const candidateEmail = `journey.candidate.${timestamp}@thinkwires.com`;
  const candidatePass = 'ComplexPassword2026!';
  let sessionCookie = '';

  it('Step 1: Unauthenticated candidate cannot access protected portal', async () => {
    const res = await api.get('/api/candidate/dashboard');
    expect(res.status).toBe(401);
  });

  it('Step 2: Candidate signs up and receives authenticated HttpOnly session cookie', async () => {
    const res = await api.post('/api/auth/register').send({
      name: 'Morgan Journey',
      email: candidateEmail,
      password: candidatePass,
      confirmPassword: candidatePass,
      phone: '+1-555-0988',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    sessionCookie = cookies.find((c) =>
      c.startsWith('thinkwires_candidate_jwt=')
    );
    expect(sessionCookie).toBeDefined();
  });

  it('Step 3: Candidate verifies session identity with issued cookie', async () => {
    const res = await api.get('/api/auth/me').set('Cookie', sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body.authenticated).toBe(true);
    expect(res.body.candidate.email).toBe(candidateEmail);
  });

  it('Step 4: Candidate accesses portal dashboard and updates career profile', async () => {
    const dashboardRes = await api
      .get('/api/candidate/dashboard')
      .set('Cookie', sessionCookie);
    expect(dashboardRes.status).toBe(200);
    expect(dashboardRes.body.success).toBe(true);

    const profileRes = await api
      .put('/api/candidate/profile')
      .set('Cookie', sessionCookie)
      .send({
        headline: 'Staff Full Stack Cloud Engineer',
        technicalSkills: ['React', 'Node.js', 'PostgreSQL'],
        experience: 7,
      });

    expect(profileRes.status).toBe(200);
    expect(profileRes.body.candidate.headline).toBe(
      'Staff Full Stack Cloud Engineer'
    );
  });

  it('Step 5: Candidate views tracked applications list', async () => {
    const res = await api
      .get('/api/candidate/applications')
      .set('Cookie', sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.applications)).toBe(true);
  });

  it('Step 6: Candidate logs out and session is terminated', async () => {
    const logoutRes = await api
      .post('/api/auth/logout')
      .set('Cookie', sessionCookie);
    expect(logoutRes.status).toBe(200);

    // Grab the cleared cookie
    const expiredCookie = logoutRes.headers['set-cookie'].find((c) =>
      c.startsWith('thinkwires_candidate_jwt=')
    );

    // Accessing protected route with expired cookie fails with 401
    const accessRes = await api
      .get('/api/candidate/dashboard')
      .set('Cookie', expiredCookie);
    expect(accessRes.status).toBe(401);
  });
});
