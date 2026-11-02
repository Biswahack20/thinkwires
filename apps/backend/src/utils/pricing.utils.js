/**
 * Candidate pricing calculation utilities
 * Issue #165: Implement Monthly Rate Calculation (40% Markup) vs Expected Salary for Candidates
 */

/**
 * Calculates candidate bill pricing and formats rates based on engagement type.
 *
 * Requirements (Issue #165):
 * 1. Contract Candidates:
 *    - Total LPA = Expected Salary * 1.40 (40% markup)
 *    - Monthly Rate = Total LPA / 12 (+ Tax)
 *    - Example: Expected = 15 LPA -> Total = 21 LPA -> Monthly Rate = ₹175,000 / month + Tax
 *    - Formatted for Talent Cloud Card: ₹X.X L / mo + tax (e.g. ₹1.75 L / mo + tax)
 * 2. Full-Time Role Candidates:
 *    - No markup formula applied.
 *    - Expected Annual CTC displayed directly: ₹X - ₹Y LPA (Expected)
 *
 * @param {Object} candidate
 * @returns {Object} structured pricing object
 */
export function calculateCandidatePricing(candidate = {}) {
  // 1. Determine engagement type: 'contract' | 'full-time'
  let engagementType = candidate.engagementType;

  if (!engagementType) {
    const workMode = (candidate.workMode || '').toLowerCase();
    const urgency = (candidate.urgency || '').toLowerCase();
    const notice = (candidate.noticePeriod || '').toLowerCase();
    const availability = (candidate.availability || '').toLowerCase();

    if (workMode.includes('full-time') || workMode.includes('permanent')) {
      engagementType = 'full-time';
    } else if (
      workMode.includes('bench') ||
      workMode.includes('contract') ||
      workMode.includes('freelance')
    ) {
      engagementType = 'contract';
    } else if (
      urgency.includes('immediate') ||
      notice.includes('immediate') ||
      availability.includes('immediate') ||
      availability.includes('24h') ||
      urgency.includes('24h')
    ) {
      engagementType = 'contract';
    } else {
      engagementType = 'full-time';
    }
  } else {
    engagementType = engagementType.toLowerCase().includes('contract')
      ? 'contract'
      : 'full-time';
  }

  // 2. Parse expected salary / CTC in LPA
  const rawSalary = candidate.expectedSalary || candidate.salary || '';
  const numbersFound = (
    typeof rawSalary === 'string' ? rawSalary : String(rawSalary)
  ).match(/\d+(\.\d+)?/g);

  let baseLpa = null;
  let maxLpa = null;

  if (numbersFound && numbersFound.length > 0) {
    baseLpa = parseFloat(numbersFound[0]);
    if (numbersFound.length > 1) {
      maxLpa = parseFloat(numbersFound[1]);
    }
  }

  // Fallback estimation if salary is not provided or "Market Standard"
  if (!baseLpa || isNaN(baseLpa)) {
    const expYears =
      parseInt(
        candidate.years || candidate.experience || candidate.yearsExp || 5,
        10
      ) || 5;
    if (expYears >= 10) {
      baseLpa = 24;
      maxLpa = 30;
    } else if (expYears >= 7) {
      baseLpa = 18;
      maxLpa = 24;
    } else if (expYears >= 4) {
      baseLpa = 14;
      maxLpa = 18;
    } else {
      baseLpa = 10;
      maxLpa = 14;
    }
  }

  if (engagementType === 'contract') {
    const markupMultiplier = 1.4; // 40% markup
    const expectedLpa = baseLpa;
    const totalLpa = Number((expectedLpa * markupMultiplier).toFixed(2));
    const monthlyRateInRupees = Math.round((totalLpa * 100000) / 12);
    const monthlyRateInLakhs = Number((totalLpa / 12).toFixed(2));

    const rateNum = `₹${monthlyRateInLakhs} L`;
    const ratePeriod = '/ mo + tax';
    const rateDisplay = `${rateNum} ${ratePeriod}`;

    return {
      engagementType: 'contract',
      expectedSalary: candidate.expectedSalary || `${expectedLpa} LPA`,
      expectedLpa,
      markupPercentage: 40,
      totalLpa,
      monthlyRate: monthlyRateInRupees,
      monthlyRateInLakhs,
      rateNum,
      ratePeriod,
      rateDisplay,
    };
  } else {
    // Full-Time / Permanent Role: Do NOT apply markup formula.
    const formattedSalary =
      maxLpa && maxLpa !== baseLpa
        ? `₹${baseLpa} - ₹${maxLpa} LPA`
        : `₹${baseLpa} LPA`;

    const rateNum = formattedSalary;
    const ratePeriod = '(Expected)';
    const rateDisplay = `${rateNum} ${ratePeriod}`;

    return {
      engagementType: 'full-time',
      expectedSalary: formattedSalary,
      expectedLpa: baseLpa,
      maxLpa: maxLpa || baseLpa,
      markupPercentage: 0,
      totalLpa: baseLpa,
      monthlyRate: Math.round((baseLpa * 100000) / 12),
      monthlyRateInLakhs: Number((baseLpa / 12).toFixed(2)),
      rateNum,
      ratePeriod,
      rateDisplay,
    };
  }
}

/**
 * Parses notice period string to days.
 * Issue #166: Talent Cloud Notice Period Sorting & Benchmark Strictness
 *
 * @param {string|number} str
 * @returns {number} number of days (0 for Immediate/48h)
 */
export function parseNoticeDays(str = '') {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  const s = str.toString().toLowerCase().trim();
  if (
    s.includes('immediate') ||
    s.includes('24h') ||
    s.includes('48h') ||
    s.includes('ready')
  ) {
    return 0;
  }
  const match = s.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    if (s.includes('week')) {
      return num * 7;
    }
    if (s.includes('month')) {
      return num * 30;
    }
    return num;
  }
  return 999;
}

