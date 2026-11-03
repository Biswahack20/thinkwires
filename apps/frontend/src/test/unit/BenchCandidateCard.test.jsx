import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
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

describe('BenchCandidateCard Avatar Integration (Issue #174)', () => {
  it('renders candidate avatar image when avatarUrl is present', () => {
    const talentWithAvatar = {
      id: 'TW-AVATAR-01',
      code: 'TW-CAND-AV1',
      role: 'Lead Cloud Infrastructure Architect',
      initials: 'AR',
      avatarUrl: '/avatars/presets/tech-engineer-1.svg',
      skills: ['AWS', 'Kubernetes'],
      score: 98,
    };

    renderWithProviders(<BenchCandidateCard talent={talentWithAvatar} />);

    const img = screen.getByRole('img', { name: /TW-CAND-AV1/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/avatars/presets/tech-engineer-1.svg');
    expect(img).toHaveClass('BenchCard-avatarImg');
  });

  it('falls back to stylized initials badge when avatarUrl is omitted', () => {
    const talentWithoutAvatar = {
      id: 'TW-NO-AVATAR-01',
      code: 'TW-CAND-NOAV',
      role: 'Senior Staff Engineer',
      initials: 'VK',
      skills: ['Go', 'Distributed Systems'],
      score: 95,
    };

    renderWithProviders(<BenchCandidateCard talent={talentWithoutAvatar} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('VK')).toBeInTheDocument();
  });

  it('gracefully falls back to initials badge when avatar image fails to load', () => {
    const talentWithBrokenAvatar = {
      id: 'TW-BROKEN-AV-01',
      code: 'TW-CAND-BROKEN',
      role: 'Staff Generative AI Engineer',
      initials: 'SM',
      avatarUrl: '/avatars/broken-image.png',
      skills: ['PyTorch', 'vLLM'],
      score: 97,
    };

    renderWithProviders(<BenchCandidateCard talent={talentWithBrokenAvatar} />);

    const img = screen.getByRole('img', { name: /TW-CAND-BROKEN/i });
    expect(img).toBeInTheDocument();

    // Trigger image error
    fireEvent.error(img);

    // Should switch to initials badge
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('SM')).toBeInTheDocument();
  });
});

describe('BenchCandidateCard Role Title Word Wrapping and RateBox Relocation', () => {
  const longTitleCandidates = [
    {
      id: 'TW-CAND-01',
      code: 'TW-CAND-01',
      role: 'Staff Distributed Systems & Payment Platform Engineer',
      skills: ['Go', 'Kafka'],
      score: 98,
      hourlyRate: '₹1.75 L',
    },
    {
      id: 'TW-CAND-02',
      code: 'TW-CAND-02',
      role: 'Lead Cloud Infrastructure & Platform Architect',
      skills: ['AWS', 'Kubernetes'],
      score: 97,
      hourlyRate: '₹1.80 L',
    },
    {
      id: 'TW-CAND-03',
      code: 'TW-CAND-03',
      role: 'Principal Generative AI & LLM Systems Engineer',
      skills: ['PyTorch', 'vLLM'],
      score: 99,
      hourlyRate: '₹2.10 L',
    },
    {
      id: 'TW-CAND-04',
      code: 'TW-CAND-04',
      role: 'Lead SAP ABAP on HANA & S/4 Cloud Specialist',
      skills: ['SAP', 'HANA'],
      score: 96,
      hourlyRate: '₹1.90 L',
    },
  ];

  it('renders long candidate role titles without truncation', () => {
    longTitleCandidates.forEach((candidate) => {
      const { unmount } = renderWithProviders(
        <BenchCandidateCard talent={candidate} />
      );
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveTextContent(candidate.role);
      expect(title).toHaveClass('BenchCard-roleTitle');
      unmount();
    });
  });

  it('relocates BenchCard-rateBox outside of BenchCard-profileRow to prevent title compression', () => {
    const { container } = renderWithProviders(
      <BenchCandidateCard talent={longTitleCandidates[0]} />
    );

    const profileRow = container.querySelector('.BenchCard-profileRow');
    const rateBox = container.querySelector('.BenchCard-rateBox');

    expect(profileRow).toBeInTheDocument();
    expect(rateBox).toBeInTheDocument();
    // rateBox must NOT be a child of profileRow
    expect(profileRow.contains(rateBox)).toBe(false);
  });
});


