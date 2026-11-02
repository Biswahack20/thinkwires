import { describe, it, expect } from 'vitest';
import { calculateCandidatePricing } from '../../utils/pricing.utils.js';

describe('Candidate Pricing Calculation (Issue #165)', () => {
  it('correctly calculates 40% markup and monthly rate for contract candidates', () => {
    // Review meeting example: Expected = 15 LPA -> Total = 21 LPA -> Monthly Rate = ₹175,000 / month + Tax (₹1.75 L / mo + tax)
    const pricing = calculateCandidatePricing({
      engagementType: 'contract',
      expectedSalary: '15 LPA',
    });

    expect(pricing.engagementType).toBe('contract');
    expect(pricing.expectedLpa).toBe(15);
    expect(pricing.markupPercentage).toBe(40);
    expect(pricing.totalLpa).toBe(21);
    expect(pricing.monthlyRate).toBe(175000);
    expect(pricing.monthlyRateInLakhs).toBe(1.75);
    expect(pricing.rateNum).toBe('₹1.75 L');
    expect(pricing.ratePeriod).toBe('/ mo + tax');
    expect(pricing.rateDisplay).toBe('₹1.75 L / mo + tax');
  });

  it('correctly displays annual CTC for full-time candidates without contractor markup', () => {
    const pricing = calculateCandidatePricing({
      engagementType: 'full-time',
      expectedSalary: '₹18 - ₹22 LPA',
    });

    expect(pricing.engagementType).toBe('full-time');
    expect(pricing.expectedLpa).toBe(18);
    expect(pricing.maxLpa).toBe(22);
    expect(pricing.markupPercentage).toBe(0);
    expect(pricing.rateNum).toBe('₹18 - ₹22 LPA');
    expect(pricing.ratePeriod).toBe('(Expected)');
    expect(pricing.rateDisplay).toBe('₹18 - ₹22 LPA (Expected)');
  });

  it('correctly infers contract engagement from workMode: On-Bench', () => {
    const pricing = calculateCandidatePricing({
      workMode: 'On-Bench',
      expectedSalary: '20 LPA',
    });

    expect(pricing.engagementType).toBe('contract');
    expect(pricing.expectedLpa).toBe(20);
    expect(pricing.totalLpa).toBe(28); // 20 * 1.4 = 28
    expect(pricing.monthlyRateInLakhs).toBe(2.33);
    expect(pricing.rateNum).toBe('₹2.33 L');
    expect(pricing.ratePeriod).toBe('/ mo + tax');
  });

  it('correctly infers full-time engagement from workMode: Full-Time Looking', () => {
    const pricing = calculateCandidatePricing({
      workMode: 'Full-Time Looking',
      expectedSalary: '25 LPA',
    });

    expect(pricing.engagementType).toBe('full-time');
    expect(pricing.rateNum).toBe('₹25 LPA');
    expect(pricing.ratePeriod).toBe('(Expected)');
    expect(pricing.rateDisplay).toBe('₹25 LPA (Expected)');
  });
});
