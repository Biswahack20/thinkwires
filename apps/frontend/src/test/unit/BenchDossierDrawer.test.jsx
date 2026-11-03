import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import BenchDossierDrawer from '../../components/BenchComponents/BenchDossierDrawer';

describe('BenchDossierDrawer (Issue #174: Header Renaming & Avatar Integration)', () => {
  beforeEach(() => {
    // Mock global fetch for dossier API to prevent network errors
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      })
    );
  });

  const sampleCandidate = {
    id: 'TW-BENCH-902',
    code: 'TW-BENCH-902',
    role: 'Lead Cloud Infrastructure & Platform Architect',
    initials: 'AR',
    avatarUrl: '/avatars/presets/tech-engineer-1.svg',
    specialty: 'Cloud & DevOps',
    yearsExp: '11+ Yrs Experience',
    location: 'Bengaluru (EST Overlap)',
    score: 98,
    assessmentScore: 98,
    urgency: 'Immediate (24-48h)',
    noticePeriod: 'Immediate',
    skills: ['AWS EKS', 'Terraform', 'Istio Mesh', 'FinOps'],
  };

  it('renders "Book Candidate" and "Technical Dossier & Verification Audit" in modal header', async () => {
    await act(async () => {
      renderWithProviders(<BenchDossierDrawer />, {
        preloadedState: {
          bench: {
            drawerOpen: true,
            selectedTalent: sampleCandidate,
          },
        },
      });
    });

    // Check new header title and sub-badge
    expect(screen.getByText('Book Candidate')).toBeInTheDocument();
    expect(
      screen.getByText('Technical Dossier & Verification Audit')
    ).toBeInTheDocument();

    // Verify old header string is not rendered
    expect(
      screen.queryByText('BLIND TECHNICAL SCREENING | CANDIDATE AUDIT')
    ).not.toBeInTheDocument();
  });

  it('renders candidate avatar image when avatarUrl is provided', async () => {
    await act(async () => {
      renderWithProviders(<BenchDossierDrawer />, {
        preloadedState: {
          bench: {
            drawerOpen: true,
            selectedTalent: sampleCandidate,
          },
        },
      });
    });

    const img = screen.getByRole('img', { name: /TW-BENCH-902/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/avatars/presets/tech-engineer-1.svg');
    expect(img).toHaveClass('BenchDrawer-avatarImg');
  });

  it('falls back to initials when avatar image is omitted', async () => {
    const candidateNoAvatar = {
      ...sampleCandidate,
      avatarUrl: null,
      avatar: null,
      photo: null,
      initials: 'VK',
    };

    await act(async () => {
      renderWithProviders(<BenchDossierDrawer />, {
        preloadedState: {
          bench: {
            drawerOpen: true,
            selectedTalent: candidateNoAvatar,
          },
        },
      });
    });

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('VK')).toBeInTheDocument();
  });

  it('gracefully falls back to initials when avatar image triggers error', async () => {
    const candidateBrokenAvatar = {
      ...sampleCandidate,
      avatarUrl: '/avatars/invalid-broken.png',
      initials: 'AR',
    };

    await act(async () => {
      renderWithProviders(<BenchDossierDrawer />, {
        preloadedState: {
          bench: {
            drawerOpen: true,
            selectedTalent: candidateBrokenAvatar,
          },
        },
      });
    });

    const img = screen.getByRole('img', { name: /TW-BENCH-902/i });
    expect(img).toBeInTheDocument();

    // Trigger image error inside act
    await act(async () => {
      fireEvent.error(img);
    });

    // Image is removed, replaced with initials badge
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('AR')).toBeInTheDocument();
  });

  it('renders "Executive Candidate Summary (3-4 Line Briefing)" with exactly 4 concise points', async () => {
    await act(async () => {
      renderWithProviders(<BenchDossierDrawer />, {
        preloadedState: {
          bench: {
            drawerOpen: true,
            selectedTalent: sampleCandidate,
          },
        },
      });
    });

    // Check new section title
    expect(
      screen.getByText(/Executive Candidate Summary \(3-4 Line Briefing\)/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/5-Line Client Submission Summary/i)
    ).not.toBeInTheDocument();

    // Check that exactly 4 summary items are rendered
    const listItems = screen
      .getAllByRole('listitem')
      .filter((li) =>
        li.textContent.includes('Lead Cloud Infrastructure & Platform Architect') ||
        li.textContent.includes('Demonstrated technical mastery') ||
        li.textContent.includes('Cleared multi-stage Thinkwires system design defenses') ||
        li.textContent.includes('Available for immediate engagement')
      );
    expect(listItems).toHaveLength(4);
  });

  it('preserves blind screening privacy and anonymous code', async () => {
    await act(async () => {
      renderWithProviders(<BenchDossierDrawer />, {
        preloadedState: {
          bench: {
            drawerOpen: true,
            selectedTalent: sampleCandidate,
          },
        },
      });
    });

    expect(
      screen.getByText('Identity Redacted for Blind Screening')
    ).toBeInTheDocument();
    expect(screen.getByText('Download Blind Dossier (PDF)')).toBeInTheDocument();
    expect(screen.getByText('TW-BENCH-902')).toBeInTheDocument();
  });
});

