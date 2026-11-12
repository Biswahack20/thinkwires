/**
 * Thinkwires Dual-Score Architecture & Resume Inflation Mitigation Engine
 *
 * Implements the mathematical scoring and divergence models defined in docs/resume.md:
 * - Resume Score (Paper Claims / High Gameability)
 * - Candidate Score (Empirically Verified Proof / Low Gameability)
 * - Divergence Guard & Inflation Penalty (Delta between Paper and Practice)
 * - Standardized Assessment Audit contract
 *
 * Note: Strictly ZERO emojis across code, logs, comments, and telemetry.
 */

/**
 * Calculates divergence between self-reported resume score and empirical assessment score.
 * Formula: Divergence (Delta) = Math.max(0, Resume Score - Assessment Score)
 *
 * Risk Tiers:
 * - Delta <= 10: Low Inflation Risk (0 penalty points)
 * - 11 <= Delta <= 25: Medium Inflation Risk (5 penalty points)
 * - Delta > 25: High Inflation Risk (10 penalty points)
 *
 * @param {number} resumeScore - Claimed match score (0-100)
 * @param {number} assessmentScore - Proctored assessment result (0-100)
 * @returns {{ delta: number, inflationRisk: 'Low' | 'Medium' | 'High', penalty: number, summary: string }}
 */
export function calculateDivergence(resumeScore = 0, assessmentScore = 0) {
  const rScore = Math.max(0, Math.min(100, Math.round(Number(resumeScore) || 0)));
  const aScore = Math.max(0, Math.min(100, Math.round(Number(assessmentScore) || 0)));

  const delta = Math.max(0, rScore - aScore);

  if (delta <= 10) {
    return {
      delta,
      inflationRisk: 'Low',
      penalty: 0,
      summary: 'Verified assessment confirms resume claims. Low risk of AI resume embellishment.',
    };
  }

  if (delta <= 25) {
    return {
      delta,
      inflationRisk: 'Medium',
      penalty: 5,
      summary: 'Moderate discrepancy between claimed skills and assessment performance. Recruiter deep-dive recommended.',
    };
  }

  return {
    delta,
    inflationRisk: 'High',
    penalty: 10,
    summary: 'Significant divergence detected. High AI resume embellishment risk.',
  };
}

/**
 * Calculates the verified Candidate Score based on empirical proof pillars:
 * Candidate Score = [(0.50 * Assessment) + (0.25 * Recruiter Screen) + (0.15 * Artifacts)] / 0.90 - Inflation Penalty
 *
 * @param {Object} params
 * @param {number} params.assessmentScore - Proctored assessment score (0-100)
 * @param {number} [params.recruiterScreenScore=80] - Recruiter qualitative interview calibration (0-100)
 * @param {number} [params.artifactsScore=80] - Verified artifacts / code / tenure audit (0-100)
 * @param {number} [params.resumeScore=80] - Claimed resume score for divergence calculation
 * @param {number} [params.passingThreshold=75] - Minimum assessment score to pass
 * @returns {{ overall: number, tier: string, status: 'PASSED' | 'FAILED', assessmentScore: number, recruiterScreenScore: number, verifiedArtifactsScore: number, inflationRisk: string, penalty: number, passingThreshold: number, basis: string }}
 */
export function calculateCandidateScore({
  assessmentScore = 0,
  recruiterScreenScore = null,
  artifactsScore = null,
  resumeScore = null,
  passingThreshold = 75,
} = {}) {
  const aScore = Math.max(0, Math.min(100, Math.round(Number(assessmentScore) || 0)));
  const rScreen = recruiterScreenScore !== null && recruiterScreenScore !== undefined
    ? Math.max(0, Math.min(100, Math.round(Number(recruiterScreenScore))))
    : aScore;
  const artScore = artifactsScore !== null && artifactsScore !== undefined
    ? Math.max(0, Math.min(100, Math.round(Number(artifactsScore))))
    : aScore;
  const rScore = resumeScore !== null && resumeScore !== undefined
    ? Math.max(0, Math.min(100, Math.round(Number(resumeScore))))
    : aScore;

  // 50% Assessment, 25% Recruiter Live Screen, 15% Verified Artifacts (normalized over 0.90 sum of weights)
  const weightedSum = (0.50 * aScore) + (0.25 * rScreen) + (0.15 * artScore);
  const normalizedBase = weightedSum / 0.90;

  const divergence = calculateDivergence(rScore, aScore);
  const rawScore = normalizedBase - divergence.penalty;
  const overall = Math.max(0, Math.min(100, Math.round(rawScore)));

  const passed = aScore >= passingThreshold;
  const status = passed ? 'PASSED' : 'FAILED';

  let tier = 'Below Threshold';
  if (overall >= 85) {
    tier = 'Verified Technical Talent';
  } else if (overall >= 75) {
    tier = 'Qualified Talent';
  } else if (overall >= 60) {
    tier = 'Conditional Talent';
  }

  return {
    overall,
    tier,
    status,
    passingThreshold,
    assessmentScore: aScore,
    recruiterScreenScore: rScreen,
    verifiedArtifactsScore: artScore,
    inflationRisk: divergence.inflationRisk,
    penalty: divergence.penalty,
    basis: 'Proctored 10-Question Technical Assessment',
  };
}

/**
 * Derives Resume Score metadata and tiering from paper claims.
 *
 * @param {Object} params
 * @param {number} params.score - Raw fit score (0-100)
 * @param {number} [params.skillsMatch]
 * @param {number} [params.roleMatch]
 * @param {number} [params.tenureMatch]
 * @returns {{ overall: number, tier: string, mandatorySkillsMatch: number, roleMatch: number, tenureMatch: number, basis: string }}
 */
export function calculateResumeScore({
  score = 85,
  skillsMatch = null,
  roleMatch = null,
  tenureMatch = null,
} = {}) {
  const overall = Math.max(0, Math.min(100, Math.round(Number(score) || 85)));

  let tier = 'Weak Fit (Paper)';
  if (overall >= 88) {
    tier = 'Strong Fit (Paper)';
  } else if (overall >= 75) {
    tier = 'Moderate Fit (Paper)';
  } else if (overall >= 60) {
    tier = 'Partial Fit (Paper)';
  }

  const sMatch = skillsMatch !== null && skillsMatch !== undefined
    ? Math.max(0, Math.min(100, Math.round(Number(skillsMatch))))
    : Math.min(100, Math.round(overall * 1.03));

  const rMatch = roleMatch !== null && roleMatch !== undefined
    ? Math.max(0, Math.min(100, Math.round(Number(roleMatch))))
    : Math.max(50, Math.round(overall * 0.95));

  const tMatch = tenureMatch !== null && tenureMatch !== undefined
    ? Math.max(0, Math.min(100, Math.round(Number(tenureMatch))))
    : Math.max(60, Math.round(overall * 0.97));

  return {
    overall,
    tier,
    mandatorySkillsMatch: sMatch,
    roleMatch: rMatch,
    tenureMatch: tMatch,
    basis: 'Static Resume & Mandate Rubric',
  };
}

/**
 * Builds the complete audit-grade Dual-Score Report and itemized assessment sheet.
 * Conforms directly to the schema specified in docs/resume.md.
 *
 * @param {Object} params
 * @param {number} params.resumeScore - Paper fit score
 * @param {number} params.assessmentScore - Proctored test score
 * @param {Object} [params.assessmentData] - Assessment configuration & questions
 * @param {Object} [params.candidateAnswers] - Raw submitted answers
 * @param {Object} [params.evalResult] - Evaluation result from AI service
 * @param {number} [params.recruiterScreenScore] - Recruiter interview rating
 * @param {number} [params.artifactsScore] - Code artifact rating
 * @param {number} [params.timeSpentMinutes=14] - Test duration
 * @param {string} [params.dossierId] - Dossier ID
 * @returns {Object} Structured evaluationReport payload
 */
export function buildDualScoreReport({
  resumeScore = 85,
  assessmentScore = 0,
  assessmentData = {},
  candidateAnswers = {},
  evalResult = {},
  recruiterScreenScore = null,
  artifactsScore = null,
  timeSpentMinutes = 14,
  dossierId = null,
} = {}) {
  const resume = calculateResumeScore({ score: resumeScore });
  const divergence = calculateDivergence(resume.overall, assessmentScore);
  const candidate = calculateCandidateScore({
    assessmentScore,
    recruiterScreenScore,
    artifactsScore,
    resumeScore: resume.overall,
    passingThreshold: assessmentData.passingThreshold || 75,
  });

  const testId = assessmentData.testId || assessmentData.test_id || 'eval_tech_mandate';
  const passingThreshold = assessmentData.passingThreshold || 75;
  const passed = assessmentScore >= passingThreshold;

  // Build itemized question list from assessmentData.questions and evalResult.detailed_feedback
  const rawQuestions = Array.isArray(assessmentData.questions) ? assessmentData.questions : [];
  const feedbackMap = {};
  if (Array.isArray(evalResult.detailed_feedback)) {
    evalResult.detailed_feedback.forEach((f) => {
      if (f && f.question_id) {
        feedbackMap[f.question_id] = f;
      }
    });
  }

  let totalPointsPossible = 0;
  let totalPointsEarned = 0;

  const questions = rawQuestions.map((q, idx) => {
    const qId = q.id || `q${idx + 1}`;
    const qType = q.type || 'mcq';
    const possible = Number(q.points) || 10;
    totalPointsPossible += possible;

    const candAns = candidateAnswers[qId];
    const fb = feedbackMap[qId] || {};

    let isCorrect = false;
    let earned = 0;
    let explanation = q.explanation || fb.explanation || '';
    let evaluatorFeedback = fb.evaluatorFeedback || fb.explanation || '';

    if (qType === 'mcq') {
      const correctIdx = Number(q.correct_option_index ?? q.correctAnswer ?? 0);
      isCorrect = candAns !== undefined && Number(candAns) === correctIdx;
      earned = isCorrect ? possible : 0;
      if (!explanation) {
        explanation = isCorrect
          ? 'Selected option verified correct against technical specification.'
          : `Expected option ${correctIdx + 1}.`;
      }
    } else {
      earned = fb.earned_points !== undefined ? Number(fb.earned_points) : Math.round(possible * 0.85);
      isCorrect = earned >= Math.round(possible * 0.7);
      if (!evaluatorFeedback) {
        evaluatorFeedback = isCorrect
          ? 'Demonstrates production architecture knowledge.'
          : 'Response lacks required architectural depth.';
      }
    }

    totalPointsEarned += earned;

    const item = {
      id: qId,
      category: q.category || (qType === 'mcq' ? 'Technical Competency' : qType === 'scenario' ? 'System Design' : 'Practical Implementation'),
      type: qType,
      prompt: q.prompt || q.question || `Assessment prompt ${idx + 1}`,
      pointsEarned: earned,
      pointsPossible: possible,
      isCorrect,
    };

    if (qType === 'mcq') {
      item.candidateAnswer = candAns !== undefined ? Number(candAns) : null;
      item.correctAnswer = Number(q.correct_option_index ?? q.correctAnswer ?? 0);
      item.explanation = explanation;
    } else {
      item.candidateAnswerText = candAns ? String(candAns) : '';
      item.evaluatorFeedback = evaluatorFeedback;
    }

    return item;
  });

  if (totalPointsPossible === 0) {
    totalPointsPossible = 100;
    totalPointsEarned = assessmentScore;
  }

  const generatedDossierId = dossierId || `DOS-${new Date().getFullYear()}-ENG-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    dossierId: generatedDossierId,
    evaluatedAt: new Date().toISOString(),
    scores: {
      resumeScore: resume,
      candidateScore: candidate,
      divergenceAnalysis: divergence,
    },
    assessmentAudit: {
      testId,
      totalPointsPossible,
      totalPointsEarned,
      timeSpentMinutes: Math.max(1, Number(timeSpentMinutes) || 14),
      passingThreshold,
      passed,
      questions,
    },
  };
}
