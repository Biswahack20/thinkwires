import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CandidateEvaluationModal from '../../admin/CandidateEvaluationModal';
import { adminApi } from '../../admin/adminService';

vi.mock('../../admin/adminService', () => ({
  adminApi: {
    getCandidateDossier: vi.fn(),
    reEvaluateCandidate: vi.fn(),
  },
}));

describe('CandidateEvaluationModal Component Resilient Array Rendering', () => {
  it('renders safely when gapsAndRisks is an object with technicalGaps and operationalRisks', async () => {
    adminApi.getCandidateDossier.mockResolvedValueOnce({
      success: true,
      candidate: {
        id: 'cand_123',
        name: 'Tanjil Alam',
        email: 'tanjil@example.com',
        phone: '+1234567890',
        jobTitle: 'Lead Software Engineer',
      },
      dossier: {
        overallMatchScore: 87,
        recommendation: 'HIGH-PRIORITY SHORTLIST',
        strengths: ['Hands-on architecture in production', 'Deep full-stack mastery'],
        gapsAndRisks: {
          technicalGaps: ['Deepen live distributed caching defense'],
          operationalRisks: ['Serving 30-day notice period constraint'],
          careerFlags: [],
        },
        clientSubmissionSummary: [
          'Candidate demonstrates strong technical alignment.',
          'Cleared multi-factor rubric benchmark.',
        ],
        requirementAlignmentMatrix: [
          {
            skill: 'React',
            jdRequirement: 'Mandatory proficiency in React',
            candidateEvidence: 'Production experience with modern hooks',
            status: 'Strong Match',
          },
        ],
      },
    });

    render(
      <CandidateEvaluationModal
        isOpen={true}
        onClose={vi.fn()}
        candidateId="cand_123"
        showToast={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Deepen live distributed caching defense/i)).toBeInTheDocument();
      expect(screen.getByText(/Serving 30-day notice period constraint/i)).toBeInTheDocument();
      expect(screen.getByText(/Tanjil Alam/i)).toBeInTheDocument();
    });
  });

  it('renders matrix safely when items lack skill and status properties (legacy/fit-only format)', async () => {
    adminApi.getCandidateDossier.mockResolvedValueOnce({
      success: true,
      candidate: {
        id: 'cand_456',
        name: 'Tanjil Alam',
        jobTitle: 'Lead Software Engineer',
      },
      dossier: {
        overallMatchScore: 87,
        requirementAlignmentMatrix: [
          {
            jdRequirement: 'JavaScript',
            candidateEvidence: 'Demonstrated hands-on experience with JAVASCRIPT',
            fit: 'Strong',
          },
          {
            jdRequirement: 'Python',
            candidateEvidence: 'Demonstrated hands-on experience with PYTHON',
            fit: 'Partial',
          },
        ],
      },
    });

    render(
      <CandidateEvaluationModal
        isOpen={true}
        onClose={vi.fn()}
        candidateId="cand_456"
        showToast={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByText('JavaScript').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Python').length).toBeGreaterThan(0);
      expect(screen.getByText('Strong Match')).toBeInTheDocument();
      expect(screen.getByText('Partial Match')).toBeInTheDocument();
      expect(screen.queryByText(/undefined/i)).not.toBeInTheDocument();
    });
  });

  it('renders Dual-Score Architecture (Resume Match vs. Verified Candidate Score) with Integrity Divergence banner', async () => {
    adminApi.getCandidateDossier.mockResolvedValueOnce({
      success: true,
      candidate: {
        id: 'cand_dual_01',
        name: 'Jordan Sparks',
        jobTitle: 'Senior Systems Architect',
      },
      dossier: {
        overallMatchScore: 92,
        recommendation: 'HIGH-PRIORITY SHORTLIST',
        scores: {
          resumeScore: {
            overall: 92,
            tier: 'Strong Fit (Paper)',
            mandatorySkillsMatch: 95,
            roleMatch: 88,
            tenureMatch: 90,
          },
          candidateScore: {
            overall: 85,
            tier: 'Verified Technical Talent',
            status: 'PASSED',
            passingThreshold: 75,
            assessmentScore: 85,
            recruiterScreenScore: 84,
            verifiedArtifactsScore: 85,
          },
          divergenceAnalysis: {
            delta: 7,
            inflationRisk: 'Low',
            penalty: 0,
            summary: 'Verified assessment confirms resume claims. Low risk of AI resume embellishment.',
          },
        },
        assessmentAudit: {
          testId: 'eval_react_node_arch_9021',
          timeSpentMinutes: 14,
          totalPointsPossible: 100,
          totalPointsEarned: 85,
          passingThreshold: 75,
          passed: true,
          questions: [
            {
              id: 'q1',
              type: 'mcq',
              category: 'Architecture & Optimization',
              prompt: 'In React, how should you optimize resource rendering?',
              candidateAnswer: 1,
              isCorrect: true,
              pointsEarned: 10,
              pointsPossible: 10,
              explanation: 'Memoization primitives and stable callbacks.',
            },
          ],
        },
      },
    });

    render(
      <CandidateEvaluationModal
        isOpen={true}
        onClose={vi.fn()}
        candidateId="cand_dual_01"
        showToast={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Resume Match Score')).toBeInTheDocument();
      expect(screen.getByText('Verified Candidate Score')).toBeInTheDocument();
      expect(screen.getAllByText('92%').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('85%').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Integrity Verification: High Alignment/i)).toBeInTheDocument();
      expect(screen.getByText(/Proctored Technical Assessment Breakdown/i)).toBeInTheDocument();
      expect(screen.getByText(/In React, how should you optimize resource rendering\?/i)).toBeInTheDocument();
    });
  });

  it('renders High Inflation Risk banner and penalty when paper claims severely diverge from empirical proof', async () => {
    adminApi.getCandidateDossier.mockResolvedValueOnce({
      success: true,
      candidate: {
        id: 'cand_inflated_02',
        name: 'AI Embellished Candidate',
        jobTitle: 'Full Stack Engineer',
      },
      dossier: {
        overallMatchScore: 96,
        scores: {
          resumeScore: {
            overall: 96,
            tier: 'Strong Fit (Paper)',
          },
          candidateScore: {
            overall: 40,
            tier: 'Below Threshold',
            status: 'FAILED',
            passingThreshold: 75,
          },
          divergenceAnalysis: {
            delta: 46,
            inflationRisk: 'High',
            penalty: 10,
            summary: 'Significant divergence detected. High AI resume embellishment risk.',
          },
        },
      },
    });

    render(
      <CandidateEvaluationModal
        isOpen={true}
        onClose={vi.fn()}
        candidateId="cand_inflated_02"
        showToast={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Integrity Verification: High Embellishment Risk/i)).toBeInTheDocument();
      expect(screen.getByText(/Penalty: -10 pts/i)).toBeInTheDocument();
      expect(screen.getByText(/Significant divergence detected/i)).toBeInTheDocument();
    });
  });
});
