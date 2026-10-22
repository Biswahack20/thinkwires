import { describe, it, expect, beforeAll } from 'vitest';
import { api, getCandidateAuthCookie } from '../test-helper.js';

describe('Cross-Service Distributed System Tests (Node.js Express <-> Python FastAPI)', () => {
  let isAiServiceLive = false;
  let candidateCookie;
  let testCandidate;
  let createdApplicationId;
  let assessmentData;

  beforeAll(async () => {
    testCandidate = {
      id: `sys-cand-${Date.now()}`,
      email: `system.candidate.${Date.now()}@thinkwires.com`,
      name: 'Dr. Evelyn Vance',
      role: 'candidate',
    };
    candidateCookie = getCandidateAuthCookie(testCandidate);

    // Verify live AI microservice connectivity
    try {
      const response = await fetch('http://localhost:8000/health', {
        signal: AbortSignal.timeout(3000),
      });
      if (response.ok) {
        const data = await response.json();
        isAiServiceLive = data.status === 'healthy';
      }
    } catch {
      isAiServiceLive = false;
    }
  });

  describe('Distributed System Health & Inter-Service Handshake', () => {
    it('verifies Node.js Express API health endpoint is healthy', async () => {
      const res = await api.get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'healthy');
      expect(res.body).toHaveProperty('timestamp');
    });

    it('verifies FastAPI Python AI microservice is responsive with latency SLA < 250ms', async () => {
      const start = performance.now();
      let status = 'offline';
      try {
        const response = await fetch('http://localhost:8000/health', {
          signal: AbortSignal.timeout(2000),
        });
        if (response.ok) {
          const data = await response.json();
          status = data.status;
        }
      } catch {
        status = 'offline';
      }
      const durationMs = performance.now() - start;

      if (isAiServiceLive) {
        expect(status).toBe('healthy');
        expect(durationMs).toBeLessThan(250);
      } else {
        expect(['healthy', 'offline']).toContain(status);
      }
    });
  });

  describe('System Flow 1: Distributed Resume Parsing Stream (Express -> FastAPI NLP -> Express)', () => {
    it('streams resume text through Express to FastAPI and returns structured NLP extraction', async () => {
      const sampleResumeText = `
        Dr. Evelyn Vance
        evelyn.vance@thinkwires.com
        +1 (555) 234-5678
        San Francisco, CA
        Principal Cloud Architect with 8 years of production experience in React, TypeScript, Node.js, PostgreSQL, Docker, AWS, Kubernetes, and Python.
        Built distributed high-throughput microservices serving 10M+ daily active requests.
      `;

      const res = await api
        .post('/api/candidate/parse-resume')
        .send({ resumeText: sampleResumeText })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Resume parsed');
      expect(res.body).toHaveProperty('parsed');

      const parsed = res.body.parsed;
      expect(parsed.email).toBe('evelyn.vance@thinkwires.com');
      expect(parsed.mobileNumber).toContain('555');
      expect(Array.isArray(parsed.skills)).toBe(true);

      // Verify core technical skills extracted across languages
      const lowercaseSkills = parsed.skills.map((s) => s.toLowerCase());
      expect(lowercaseSkills).toContain('react');
      expect(lowercaseSkills).toContain('node.js');
      expect(lowercaseSkills).toContain('postgresql');
      expect(lowercaseSkills).toContain('docker');
    });

    it('rejects resume parse request when no file or text payload is provided', async () => {
      const res = await api
        .post('/api/candidate/parse-resume')
        .send({})
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Please upload a resume file');
    });
  });

  describe('System Flow 2: Live Job Application & ATS Match Scoring', () => {
    it('submits job application, invokes AI ATS match scorer, and records fit score', async () => {
      const applicationPayload = {
        jobId: `job-sys-${Date.now()}`,
        jobTitle: 'Principal Cloud Architect',
        department: 'Infrastructure & AI Platforms',
        location: 'San Francisco, CA (Hybrid)',
        employmentType: 'Full-time',
        firstName: 'Evelyn',
        lastName: 'Vance',
        email: testCandidate.email,
        mobileNumber: '+1 555-234-5678',
        applicationType: 'Direct',
        noticePeriod: '1 Month',
        city: 'San Francisco',
        state: 'CA',
        totalExperienceYears: 8,
        relevantExperienceYears: 6,
        currentEmployer: 'CloudScale Systems',
        currentCTC: '$190,000',
        expectedCTC: '$220,000',
        skillSet:
          'React, TypeScript, Node.js, PostgreSQL, Docker, AWS, Kubernetes',
        skills: [
          'React',
          'TypeScript',
          'Node.js',
          'PostgreSQL',
          'Docker',
          'AWS',
          'Kubernetes',
        ],
        candidateNote:
          'Passionate about distributed system reliability and resilient microservice architectures.',
        agreedToTerms: true,
      };

      const res = await api
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(applicationPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Application submitted successfully');
      expect(res.body).toHaveProperty('application');
      expect(res.body).toHaveProperty('fitScore');
      expect(res.body).toHaveProperty('fitBadge');

      const app = res.body.application;
      createdApplicationId = app._id || app.id;
      expect(createdApplicationId).toBeDefined();
      expect(app.jobTitle).toBe('Principal Cloud Architect');
      expect(app.email).toBe(testCandidate.email);

      // Verify ATS fit score is calculated within valid percentage bounds
      expect(typeof res.body.fitScore).toBe('number');
      expect(res.body.fitScore).toBeGreaterThanOrEqual(50);
      expect(res.body.fitScore).toBeLessThanOrEqual(100);
      expect(typeof res.body.fitBadge).toBe('string');

      // If assessment was generated during application, capture it
      if (res.body.assessment) {
        assessmentData = res.body.assessment;
      }
    });

    it('rejects application submission when mandatory terms & conditions agreement is omitted', async () => {
      const invalidPayload = {
        jobId: 'job-err-1',
        jobTitle: 'Staff Engineer',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@thinkwires.com',
        mobileNumber: '555-0100',
        agreedToTerms: false,
      };

      const res = await api
        .post('/api/candidate/apply')
        .set('Cookie', candidateCookie)
        .send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Terms & Conditions');
    });
  });

  describe('System Flow 3: Live Proctored Screening Assessment Generation', () => {
    it('retrieves proctored screening assessment generated by Python AI for the application', async () => {
      expect(createdApplicationId).toBeDefined();

      const res = await api
        .get(`/api/candidate/applications/${createdApplicationId}/assessment`)
        .set('Cookie', candidateCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('assessment');
      expect(res.body).toHaveProperty('application');

      assessmentData = res.body.assessment;
      expect(assessmentData).toHaveProperty('questions');
      expect(Array.isArray(assessmentData.questions)).toBe(true);
      expect(assessmentData.questions.length).toBeGreaterThanOrEqual(1);

      // Verify question schema contracts
      const firstQ = assessmentData.questions[0];
      expect(firstQ).toHaveProperty('id');
      expect(firstQ).toHaveProperty('type');
      expect(firstQ).toHaveProperty('question');
      expect(firstQ).toHaveProperty('points');

      if (firstQ.type === 'mcq') {
        expect(Array.isArray(firstQ.options)).toBe(true);
        expect(firstQ.options.length).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe('System Flow 4: Live Assessment Submission & Automated Gatekeeper Grading', () => {
    it('submits assessment answers, evaluates through Python AI, and finalizes status', async () => {
      expect(createdApplicationId).toBeDefined();
      expect(assessmentData).toBeDefined();

      // Formulate answers targeting full marks
      const answers = {};
      (assessmentData.questions || []).forEach((q) => {
        if (q.type === 'mcq') {
          // Use correct option if known, else default to option 1 or 0
          const correctIdx =
            q.correct_option_index !== undefined ? q.correct_option_index : 1;
          answers[q.id] = correctIdx;
        } else {
          // Provide an exhaustive architectural scenario answer (>= 40 words for full rubric points)
          answers[q.id] =
            'We enforce high reliability and fault tolerance across microservices by combining idempotent event messaging with Apache Kafka, robust circuit breakers via Resilience4j, distributed OpenTelemetry tracing, and automated horizontal pod autoscaling with Redis caching to prevent database bottlenecks.';
        }
      });

      const res = await api
        .post(
          `/api/candidate/applications/${createdApplicationId}/assessment/submit`
        )
        .set('Cookie', candidateCookie)
        .send({ answers });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('evaluation');

      const evaluation = res.body.evaluation;
      expect(typeof evaluation.total_score).toBe('number');
      expect(evaluation.total_score).toBeGreaterThanOrEqual(0);
      expect(evaluation.total_score).toBeLessThanOrEqual(100);
      expect(typeof evaluation.passed).toBe('boolean');
      expect(evaluation).toHaveProperty('gatekeeper_status');

      // If answers were optimal, score should pass gatekeeper threshold (>= 75%)
      if (evaluation.passed) {
        expect(evaluation.total_score).toBeGreaterThanOrEqual(75);
        expect(evaluation.gatekeeper_status).toContain('Accepted');
      }
    });

    it('verifies application status and score are persisted on candidate applications list', async () => {
      const res = await api
        .get('/api/candidate/applications')
        .set('Cookie', candidateCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.applications)).toBe(true);

      const app = res.body.applications.find(
        (a) => String(a._id || a.id) === String(createdApplicationId)
      );
      expect(app).toBeDefined();
      expect(app.jobTitle).toBe('Principal Cloud Architect');
      expect(app.assessmentScore).toBeDefined();
      expect(app.assessmentStatus).toBeDefined();
    });
  });

  describe('System Flow 5: Security & Distributed Route Guards', () => {
    it('strictly denies unauthenticated requests to protected candidate assessment endpoints', async () => {
      const res = await api.get(
        '/api/candidate/applications/any-id/assessment'
      );
      expect(res.status).toBe(401);
      expect(res.body.authenticated).toBe(false);
    });

    it('strictly denies candidate from accessing admin restricted endpoints', async () => {
      const res = await api
        .get('/api/admin/employees')
        .set('Cookie', candidateCookie);

      // Admin middleware strictly denies candidate session cookie from accessing admin portal
      expect(res.status).toBe(401);
      expect(res.body.authenticated).toBe(false);
    });
  });
});
