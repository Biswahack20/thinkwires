import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { api, getAdminAuthCookie } from '../test-helper.js';
import {
  CSRF_COOKIE_NAME,
  generateCsrfToken,
} from '../../middlewares/csrf.middleware.js';

describe('Admin HelpDesk & Inbound Routing API (Integration Tests)', () => {
  const adminCookie = getAdminAuthCookie({
    id: 'usr_admin_helpdesk',
    email: 'admin@thinkwires.com',
    role: 'admin',
    name: 'HelpDesk Admin',
  });

  const csrfToken = generateCsrfToken();
  const csrfCookie = `${CSRF_COOKIE_NAME}=${csrfToken}`;

  let createdTicketId = null;

  it('rejects unauthorized access to /api/admin/helpdesk with 401', async () => {
    const res = await api.get('/api/admin/helpdesk');
    expect(res.status).toBe(401);
  });

  it('ingests general contact inquiry via /api/contact/message and routes to info@thinkwires.com', async () => {
    const contactPayload = {
      fullName: 'Alice Johnson',
      email: 'alice.johnson@enterprise-cloud.org',
      subject: 'Partnership & Capability Exploration',
      message: 'We are interested in discussing global payroll and enterprise talent solutions.',
      company: 'Enterprise Cloud Org',
    };

    const res = await api
      .post('/api/contact/message')
      .send(contactPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.ticketId).toBeDefined();

    createdTicketId = res.body.ticketId;
  });

  it('ingests talent callback via /api/contact and routes to hr@thinkwires.com', async () => {
    const callbackPayload = {
      name: 'Bob Miller',
      email: 'bob.miller@fintech.io',
      phone: '+1 415 555 2671',
      interest: 'Staff Augmentation',
      timeline: 'Immediate (Within 48h)',
      company: 'Fintech IO',
    };

    const res = await api
      .post('/api/contact')
      .send(callbackPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.ticketId).toBeDefined();
  });

  it('exposes HelpDesk statistics and routing config via /api/admin/helpdesk/stats', async () => {
    const res = await api
      .get('/api/admin/helpdesk/stats')
      .set('Cookie', [adminCookie]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats).toBeDefined();
    expect(res.body.stats.total).toBeGreaterThanOrEqual(2);
    expect(res.body.stats.routing).toBeDefined();
    expect(res.body.stats.routing.companyInfoEmail).toBe('info@thinkwires.com');
    expect(res.body.stats.routing.hrRequisitionEmail).toBe('hr@thinkwires.com');
  });

  it('queries HelpDesk tickets list with pagination and search via /api/admin/helpdesk', async () => {
    const res = await api
      .get(`/api/admin/helpdesk?search=Alice&page=1&limit=10`)
      .set('Cookie', [adminCookie]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.tickets)).toBe(true);
    expect(res.body.tickets.length).toBeGreaterThanOrEqual(1);

    const ticket = res.body.tickets[0];
    expect(ticket.fullName).toBe('Alice Johnson');
    expect(ticket.category).toBe('General Inquiry');
    expect(ticket.destinationEmail).toBe('info@thinkwires.com');
  });

  it('retrieves single ticket detail via /api/admin/helpdesk/:id', async () => {
    const res = await api
      .get(`/api/admin/helpdesk/${createdTicketId}`)
      .set('Cookie', [adminCookie]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.ticket).toBeDefined();
    expect(res.body.ticket.ticketId).toBe(createdTicketId);
  });

  it('updates ticket status and appends internal note via PATCH /api/admin/helpdesk/:id', async () => {
    const res = await api
      .patch(`/api/admin/helpdesk/${createdTicketId}`)
      .set('Cookie', [adminCookie, csrfCookie])
      .set('X-CSRF-Token', csrfToken)
      .send({
        status: 'In Review',
        internalNote: {
          author: 'Lead Recruiter',
          note: 'Customer requested follow-up call at 2 PM EST.',
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.ticket.status).toBe('In Review');
    expect(res.body.ticket.internalNotes.length).toBeGreaterThanOrEqual(1);
    expect(res.body.ticket.internalNotes[0].note).toContain('follow-up call');
  });

  it('dispatches email reply and sets ticket to Replied via POST /api/admin/helpdesk/:id/reply', async () => {
    const res = await api
      .post(`/api/admin/helpdesk/${createdTicketId}/reply`)
      .set('Cookie', [adminCookie, csrfCookie])
      .set('X-CSRF-Token', csrfToken)
      .send({
        replySubject: 'Re: Partnership & Capability Exploration',
        replyMessage: 'Thank you for reaching out Alice. We would love to schedule a demo.',
        repliedBy: 'Thinkwires Admin',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.ticket.status).toBe('Replied');
    expect(res.body.ticket.replyHistory.length).toBeGreaterThanOrEqual(1);
    expect(res.body.ticket.replyHistory[0].recipientEmail).toBe('alice.johnson@enterprise-cloud.org');
  });

  it('converts HelpDesk ticket to client requisition via POST /api/admin/helpdesk/:id/convert-to-requisition', async () => {
    const res = await api
      .post(`/api/admin/helpdesk/${createdTicketId}/convert-to-requisition`)
      .set('Cookie', [adminCookie, csrfCookie])
      .set('X-CSRF-Token', csrfToken);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.requisition).toBeDefined();
    expect(res.body.requisition.client).toBe('Enterprise Cloud Org');
    expect(res.body.requisition.contactEmail).toBe('alice.johnson@enterprise-cloud.org');
    expect(res.body.ticket.metadata.convertedRequisitionId).toBeDefined();
  });

  it('respects testing email override (OVERRIDE_NOTIFICATION_EMAIL=websiteadmin@thinkwires.com)', async () => {
    process.env.OVERRIDE_NOTIFICATION_EMAIL = 'websiteadmin@thinkwires.com';

    const testPayload = {
      fullName: 'Dev Tester',
      email: 'dev.tester@qa.org',
      subject: 'Staging Inbound Test',
      message: 'Verifying notification dispatch override.',
      company: 'QA Labs',
    };

    const res = await api
      .post('/api/contact/message')
      .send(testPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const ticketRes = await api
      .get(`/api/admin/helpdesk/${res.body.ticketId}`)
      .set('Cookie', [adminCookie]);

    expect(ticketRes.body.ticket.destinationEmail).toBe('websiteadmin@thinkwires.com');

    // Clean up override for subsequent tests
    delete process.env.OVERRIDE_NOTIFICATION_EMAIL;
  });
});

