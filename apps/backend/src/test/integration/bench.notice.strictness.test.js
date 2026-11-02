import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { parseNoticeDays } from '../../utils/pricing.utils.js';

describe('Talent Cloud Notice Period Sorting & Benchmark Strictness (Issue #166)', () => {
  it('filters out candidates with notice periods > 15 days and score < 85% by default', async () => {
    const res = await request(app).get('/api/bench/talents');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    for (const talent of res.body) {
      const days = parseNoticeDays(talent.noticePeriod || talent.urgency || talent.availability);
      const score = typeof talent.assessmentScore === 'number' && !isNaN(talent.assessmentScore) ? talent.assessmentScore : (talent.score || 0);

      // Must satisfy benchmark: notice period <= 15 days and score >= 85%
      expect(days).toBeLessThanOrEqual(15);
      expect(score).toBeGreaterThanOrEqual(85);
    }
  });

  it('orders candidates with Immediate / 48-Hour availability at the top by default', async () => {
    const res = await request(app).get('/api/bench/talents');
    expect(res.status).toBe(200);

    const firstTalent = res.body[0];
    const firstDays = parseNoticeDays(firstTalent.noticePeriod || firstTalent.urgency || firstTalent.availability);
    // Top candidate must be immediate (<= 2 days)
    expect(firstDays).toBeLessThanOrEqual(2);

    // Verify ordering is monotonically non-decreasing in notice days
    for (let i = 0; i < res.body.length - 1; i++) {
      const daysCurrent = parseNoticeDays(res.body[i].noticePeriod || res.body[i].urgency || res.body[i].availability);
      const daysNext = parseNoticeDays(res.body[i + 1].noticePeriod || res.body[i + 1].urgency || res.body[i + 1].availability);
      expect(daysCurrent).toBeLessThanOrEqual(daysNext);
    }
  });

  it('filters candidates when quick toggle queries are supplied', async () => {
    // Immediate (48h)
    const res48 = await request(app).get('/api/bench/talents?noticePeriod=Immediate%20(48h)');
    expect(res48.status).toBe(200);
    expect(res48.body.length).toBeGreaterThan(0);
    for (const t of res48.body) {
      const days = parseNoticeDays(t.noticePeriod || t.urgency);
      expect(days).toBeLessThanOrEqual(2);
    }

    // Within 7 Days
    const res7 = await request(app).get('/api/bench/talents?noticePeriod=Within%207%20Days');
    expect(res7.status).toBe(200);
    expect(res7.body.length).toBeGreaterThan(0);
    for (const t of res7.body) {
      const days = parseNoticeDays(t.noticePeriod || t.urgency);
      expect(days).toBeLessThanOrEqual(7);
    }

    // Within 15 Days
    const res15 = await request(app).get('/api/bench/talents?noticePeriod=Within%2015%20Days');
    expect(res15.status).toBe(200);
    expect(res15.body.length).toBeGreaterThan(0);
    for (const t of res15.body) {
      const days = parseNoticeDays(t.noticePeriod || t.urgency);
      expect(days).toBeLessThanOrEqual(15);
    }
  });

  it('allows querying 30 days profiles when explicitly requested', async () => {
    const res30 = await request(app).get('/api/bench/talents?noticePeriod=30%20Days');
    expect(res30.status).toBe(200);
    expect(res30.body.length).toBeGreaterThan(0);
    for (const t of res30.body) {
      const days = parseNoticeDays(t.noticePeriod || t.urgency);
      expect(days).toBe(30);
    }
  });
});
