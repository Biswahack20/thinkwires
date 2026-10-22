import { http, HttpResponse } from 'msw';

export const mockApplicationsList = [
  {
    _id: 'app-001',
    jobId: 'job-101',
    jobTitle: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'Remote, US',
    status: 'In Review',
    stage: 'Technical Screening',
    appliedAt: '2026-03-15T10:00:00.000Z',
    assessmentStatus: 'Pending',
    assessmentScore: null,
  },
  {
    _id: 'app-002',
    jobId: 'job-102',
    jobTitle: 'AI / Machine Learning Architect',
    department: 'Artificial Intelligence',
    location: 'San Francisco, CA',
    status: 'Offered',
    stage: 'Offer Extended',
    appliedAt: '2026-03-01T14:30:00.000Z',
    assessmentStatus: 'Completed',
    assessmentScore: 94,
  },
];

export const handlers = [
  // Session check
  http.get('/api/auth/me', () => {
    return HttpResponse.json({
      authenticated: true,
      candidate: {
        id: 'cand-123',
        name: 'Jane Candidate',
        email: 'jane@thinkwires.com',
        role: 'candidate',
      },
    });
  }),

  // Candidate applications list
  http.get('/api/candidate/applications', () => {
    return HttpResponse.json({
      success: true,
      applications: mockApplicationsList,
    });
  }),

  // Withdraw candidate application
  http.post('/api/candidate/applications/:id/withdraw', ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: 'Application withdrawn successfully',
      applicationId: params.id,
    });
  }),

  // Jobs listing
  http.get('/api/jobs', () => {
    return HttpResponse.json({
      success: true,
      jobs: [
        {
          _id: 'job-101',
          title: 'Senior Full Stack Engineer',
          department: 'Engineering',
          type: 'Full-Time',
          location: 'Remote',
        },
      ],
    });
  }),

  // Candidate login
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();
    if (body.email === 'invalid@thinkwires.com') {
      return HttpResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      success: true,
      authenticated: true,
      candidate: {
        id: 'cand-123',
        name: 'Jane Candidate',
        email: body.email,
        role: 'candidate',
      },
    });
  }),
];
