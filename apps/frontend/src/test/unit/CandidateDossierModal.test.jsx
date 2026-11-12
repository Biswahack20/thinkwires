import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CandidateDossierModal from '../../components/candidate/CandidateDossierModal';

describe('CandidateDossierModal Component (Dual-Score Architecture)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Dual-Score architecture and 10-question audit breakdown', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          dossier: {
            candidateName: 'Candidate User',
            jobTitle: 'Senior Full Stack Engineer',
            overallMatchScore: 92,
            evaluationReport: {
              matchScore: 92,
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
          },
        }),
    });

    render(
      <CandidateDossierModal
        isOpen={true}
        onClose={vi.fn()}
        applicationId="app_9876"
        applicationData={{
          jobTitle: 'Senior Full Stack Engineer',
          fitScore: 92,
        }}
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
});

