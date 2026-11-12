import { describe, it, expect } from 'vitest';
import {
  calculateDivergence,
  calculateCandidateScore,
  calculateResumeScore,
  buildDualScoreReport,
} from '../../utils/dualScore.util.js';

describe('Dual-Score Architecture & Resume Inflation Engine (docs/resume.md)', () => {
  describe('calculateDivergence', () => {
    it('returns Low inflation risk and 0 penalty when divergence is within 10 points', () => {
      const result = calculateDivergence(92, 85);
      expect(result.delta).toBe(7);
      expect(result.inflationRisk).toBe('Low');
      expect(result.penalty).toBe(0);
      expect(result.summary).toContain('Low risk of AI resume embellishment');
    });

    it('returns Medium inflation risk and 5 penalty points when divergence is between 11 and 25 points', () => {
      const result = calculateDivergence(90, 75);
      expect(result.delta).toBe(15);
      expect(result.inflationRisk).toBe('Medium');
      expect(result.penalty).toBe(5);
      expect(result.summary).toContain('Moderate discrepancy');
    });

    it('returns High inflation risk and 10 penalty points when divergence exceeds 25 points', () => {
      // Classic resume inflation: 96% paper claims vs. 50% proctored test
      const result = calculateDivergence(96, 50);
      expect(result.delta).toBe(46);
      expect(result.inflationRisk).toBe('High');
      expect(result.penalty).toBe(10);
      expect(result.summary).toContain('High AI resume embellishment risk');
    });

    it('handles inverted cases where assessment exceeds resume without penalty', () => {
      // Candidate has modest resume (72%) but aces technical test (95%)
      const result = calculateDivergence(72, 95);
      expect(result.delta).toBe(0);
      expect(result.inflationRisk).toBe('Low');
      expect(result.penalty).toBe(0);
    });

    it('handles boundary values and string inputs gracefully', () => {
      const result = calculateDivergence('85', '85');
      expect(result.delta).toBe(0);
      expect(result.inflationRisk).toBe('Low');
      expect(result.penalty).toBe(0);

      const nullResult = calculateDivergence(null, null);
      expect(nullResult.delta).toBe(0);
      expect(nullResult.inflationRisk).toBe('Low');
    });
  });

  describe('calculateCandidateScore', () => {
    it('computes verified candidate score adhering to docs/resume.md 50/25/15 weighting', () => {
      // Assessment 88, Recruiter 84, Artifacts 85 -> normalized: 86.38 -> 86
      const scoreData = calculateCandidateScore({
        assessmentScore: 88,
        recruiterScreenScore: 84,
        artifactsScore: 85,
        resumeScore: 92,
      });

      expect(scoreData.overall).toBe(86);
      expect(scoreData.tier).toBe('Verified Technical Talent');
      expect(scoreData.status).toBe('PASSED');
      expect(scoreData.inflationRisk).toBe('Low');
      expect(scoreData.penalty).toBe(0);
    });

    it('deducts inflation penalty when candidate score suffers severe divergence', () => {
      // Resume 95, Assessment 50 (delta 45 -> High risk, -10 penalty)
      // Base: (0.50*50 + 0.25*80 + 0.15*80)/0.90 = (25 + 20 + 12)/0.90 = 57/0.90 = 63.33
      // Final: 63.33 - 10 = 53.33 -> 53
      const scoreData = calculateCandidateScore({
        assessmentScore: 50,
        recruiterScreenScore: 80,
        artifactsScore: 80,
        resumeScore: 95,
        passingThreshold: 75,
      });

      expect(scoreData.overall).toBe(53);
      expect(scoreData.status).toBe('FAILED');
      expect(scoreData.inflationRisk).toBe('High');
      expect(scoreData.penalty).toBe(10);
    });

    it('marks status as PASSED when assessmentScore meets threshold', () => {
      const passed = calculateCandidateScore({ assessmentScore: 75, passingThreshold: 75 });
      expect(passed.status).toBe('PASSED');

      const failed = calculateCandidateScore({ assessmentScore: 74, passingThreshold: 75 });
      expect(failed.status).toBe('FAILED');
    });
  });

  describe('calculateResumeScore', () => {
    it('categorizes paper resume tiers correctly', () => {
      const strong = calculateResumeScore({ score: 92 });
      expect(strong.overall).toBe(92);
      expect(strong.tier).toBe('Strong Fit (Paper)');

      const moderate = calculateResumeScore({ score: 80 });
      expect(moderate.overall).toBe(80);
      expect(moderate.tier).toBe('Moderate Fit (Paper)');

      const partial = calculateResumeScore({ score: 65 });
      expect(partial.tier).toBe('Partial Fit (Paper)');

      const weak = calculateResumeScore({ score: 45 });
      expect(weak.tier).toBe('Weak Fit (Paper)');
    });
  });

  describe('buildDualScoreReport', () => {
    it('constructs complete audit report matching docs/resume.md schema', () => {
      const mockQuestions = [
        {
          id: 'q1',
          type: 'mcq',
          category: 'React Optimization',
          prompt: 'In React, how should you optimize resource rendering?',
          correct_option_index: 1,
          points: 10,
          explanation: 'Memoization primitives and stable callbacks minimize redundant reconciliations.',
        },
        {
          id: 'q8',
          type: 'scenario',
          category: 'System Design',
          prompt: 'A client reporting dashboard experiences a 504 Gateway Timeout...',
          points: 10,
        },
      ];

      const report = buildDualScoreReport({
        resumeScore: 92,
        assessmentScore: 85,
        assessmentData: {
          testId: 'eval_react_node_arch_9021',
          passingThreshold: 75,
          questions: mockQuestions,
        },
        candidateAnswers: {
          q1: 1,
          q8: 'I would implement keyset/cursor pagination instead of OFFSET...',
        },
        evalResult: {
          total_score: 85,
          passed: true,
          detailed_feedback: [
            { question_id: 'q1', earned_points: 10, is_correct: true },
            { question_id: 'q8', earned_points: 8, is_correct: true, evaluatorFeedback: 'Demonstrates production architecture knowledge.' },
          ],
        },
        timeSpentMinutes: 14,
      });

      expect(report.scores.resumeScore.overall).toBe(92);
      expect(report.scores.resumeScore.tier).toBe('Strong Fit (Paper)');
      expect(report.scores.candidateScore.overall).toBe(85);
      expect(report.scores.candidateScore.status).toBe('PASSED');
      expect(report.scores.divergenceAnalysis.delta).toBe(7);
      expect(report.scores.divergenceAnalysis.inflationRisk).toBe('Low');

      expect(report.assessmentAudit.testId).toBe('eval_react_node_arch_9021');
      expect(report.assessmentAudit.timeSpentMinutes).toBe(14);
      expect(report.assessmentAudit.questions.length).toBe(2);

      const q1 = report.assessmentAudit.questions[0];
      expect(q1.id).toBe('q1');
      expect(q1.isCorrect).toBe(true);
      expect(q1.pointsEarned).toBe(10);
      expect(q1.candidateAnswer).toBe(1);

      const q8 = report.assessmentAudit.questions[1];
      expect(q8.id).toBe('q8');
      expect(q8.pointsEarned).toBe(8);
      expect(q8.evaluatorFeedback).toBe('Demonstrates production architecture knowledge.');
    });
  });
});

