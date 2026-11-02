import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('GET /api/bench/talents Pricing & Monthly Rate (Issue #165)', () => {
  it('computes and returns structured pricing based on engagement type', async () => {
    const res = await request(app).get('/api/bench/talents');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    // Verify all talents have structured pricing
    for (const talent of res.body) {
      expect(talent.pricing).toBeDefined();
      expect(['contract', 'full-time']).toContain(talent.pricing.engagementType);
      expect(talent.rateNum).toBeDefined();
      expect(talent.ratePeriod).toBeDefined();

      // Legacy hardcoded rates must NOT be present
      if (talent.hourlyRate) {
        expect(talent.hourlyRate).not.toContain('$65 - $80');
        expect(talent.hourlyRate).not.toContain('$55 - $75');
        expect(talent.hourlyRate).not.toContain('5,500');
      }
    }
  });

  it('correctly calculates 40% markup and monthly rate for contract roles', async () => {
    const res = await request(app).get('/api/bench/talents?engagementType=contract');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);

    for (const talent of res.body) {
      expect(talent.engagementType).toBe('contract');
      expect(talent.pricing.markupPercentage).toBe(40);
      expect(talent.pricing.totalLpa).toBeCloseTo(talent.pricing.expectedLpa * 1.4, 1);
      expect(talent.ratePeriod).toBe('/ mo + tax');
      expect(talent.rateNum).toMatch(/^₹\d+(\.\d+)? L$/);
    }
  });

  it('correctly returns expected CTC without contractor markup for full-time roles', async () => {
    const res = await request(app).get('/api/bench/talents?engagementType=full-time');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);

    for (const talent of res.body) {
      expect(talent.engagementType).toBe('full-time');
      expect(talent.pricing.markupPercentage).toBe(0);
      expect(talent.ratePeriod).toBe('(Expected)');
      expect(talent.rateNum).toMatch(/LPA/);
    }
  });

  it('returns single talent with structured pricing from /api/bench/talents/:id', async () => {
    const res = await request(app).get('/api/bench/talents/TW-BENCH-902');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('TW-BENCH-902');
    expect(res.body.pricing).toBeDefined();
    expect(res.body.pricing.engagementType).toBe('contract');
    expect(res.body.pricing.markupPercentage).toBe(40);
    expect(res.body.ratePeriod).toBe('/ mo + tax');
  });
});
