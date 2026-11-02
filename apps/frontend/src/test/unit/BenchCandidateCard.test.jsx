import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import BenchCandidateCard from '../../components/BenchComponents/BenchCandidateCard';

describe('BenchCandidateCard Pricing Display (Issue #165)', () => {
  it('displays ₹X.X L / mo + tax for contract roles', () => {
    const contractTalent = {
      id: 'TW-CONTRACT-01',
      code: 'TW-CAND-01',
      role: 'Cloud Infrastructure Architect',
      engagementType: 'contract',
      expectedSalary: '15 LPA',
      pricing: {
        engagementType: 'contract',
        expectedSalary: '15 LPA',
        expectedLpa: 15,
        markupPercentage: 40,
        totalLpa: 21,
        monthlyRate: 175000,
        monthlyRateInLakhs: 1.75,
        rateNum: '₹1.75 L',
        ratePeriod: '/ mo + tax',
        rateDisplay: '₹1.75 L / mo + tax',
      },
      rateNum: '₹1.75 L',
      ratePeriod: '/ mo + tax',
      proofQuote: 'Production Kubernetes and Istio mesh at scale.',
      skills: ['AWS', 'Kubernetes'],
      score: 98,
    };

    renderWithProviders(<BenchCandidateCard talent={contractTalent} />);

    expect(screen.getByText('₹1.75 L')).toBeInTheDocument();
    expect(screen.getByText('/ mo + tax')).toBeInTheDocument();
    expect(screen.queryByText(/\/ hr/i)).not.toBeInTheDocument();
  });

  it('displays ₹X - ₹Y LPA (Expected) for permanent / full-time roles', () => {
    const fullTimeTalent = {
      id: 'TW-FULLTIME-01',
      code: 'TW-CAND-02',
      role: 'Staff Generative AI Engineer',
      engagementType: 'full-time',
      expectedSalary: '₹18 - ₹22 LPA',
      pricing: {
        engagementType: 'full-time',
        expectedSalary: '₹18 - ₹22 LPA',
        expectedLpa: 18,
        maxLpa: 22,
        markupPercentage: 0,
        totalLpa: 18,
        rateNum: '₹18 - ₹22 LPA',
        ratePeriod: '(Expected)',
        rateDisplay: '₹18 - ₹22 LPA (Expected)',
      },
      rateNum: '₹18 - ₹22 LPA',
      ratePeriod: '(Expected)',
      proofQuote: 'Engineered sovereign agentic RAG pipeline.',
      skills: ['PyTorch', 'vLLM'],
      score: 96,
    };

    renderWithProviders(<BenchCandidateCard talent={fullTimeTalent} />);

    expect(screen.getByText('₹18 - ₹22 LPA')).toBeInTheDocument();
    expect(screen.getByText('(Expected)')).toBeInTheDocument();
    expect(screen.queryByText(/\/ hr/i)).not.toBeInTheDocument();
  });
});
