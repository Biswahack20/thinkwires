import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import BenchPage from '../../pages/BenchPage';

const customTalents = [
  {
    id: 'TW-CAND-01',
    code: 'TW-CAND-01',
    role: 'Staff Distributed Systems Engineer',
    initials: 'SM',
    specialty: 'Systems & Distributed',
    experienceLevel: 'Staff/Principal (10+y)',
    yearsExp: '10+ Yrs Experience',
    location: 'Pan-India (Full US Shift)',
    score: 92,
    assessmentScore: 99,
    noticePeriod: '30 Days',
    urgency: '30 Days',
    hourlyRate: '₹6,400 – ₹7,600',
    proofQuote: 'Architected distributed ledger processing 45k TPS.',
    skills: ['Java', 'Rust', 'Kafka'],
  },
  {
    id: 'TW-CAND-02',
    code: 'TW-CAND-02',
    role: 'Generative AI Specialist',
    initials: 'VK',
    specialty: 'GenAI & LLMs',
    experienceLevel: 'Staff/Principal (10+y)',
    yearsExp: '9+ Yrs (4 Yrs GenAI)',
    location: 'Hyderabad / Remote Global',
    score: 95,
    assessmentScore: 96,
    noticePeriod: '30 Days',
    urgency: '30 Days',
    hourlyRate: '₹6,000 – ₹7,200',
    proofQuote: 'Engineered sovereign agentic RAG pipeline.',
    skills: ['PyTorch', 'vLLM', 'LangChain'],
  },
  {
    id: 'TW-CAND-03',
    code: 'TW-CAND-03',
    role: 'Junior Platform Engineer (Unscored)',
    initials: 'UN',
    specialty: 'Cloud & DevOps',
    experienceLevel: 'Lead (8+y)',
    yearsExp: '8+ Yrs Experience',
    location: 'Bengaluru',
    score: 80,
    assessmentScore: null,
    noticePeriod: '30 Days',
    urgency: '30 Days',
    hourlyRate: '₹4,000 – ₹5,000',
    proofQuote: 'Assisted in infrastructure deployment.',
    skills: ['Docker'],
  },
  {
    id: 'TW-CAND-04',
    code: 'TW-CAND-04',
    role: 'Lead Cloud Architect (Immediate)',
    initials: 'AR',
    specialty: 'Cloud & DevOps',
    experienceLevel: 'Staff/Principal (10+y)',
    yearsExp: '11+ Yrs Experience',
    location: 'Bengaluru (EST Overlap)',
    score: 98,
    assessmentScore: 98,
    noticePeriod: 'Immediate',
    urgency: 'Immediate (24-48h)',
    hourlyRate: '₹5,500 – ₹6,800',
    proofQuote: 'Reduced AWS infra spend by 10 Cr/yr.',
    skills: ['AWS', 'Kubernetes'],
  },
  {
    id: 'TW-CAND-05',
    code: 'TW-CAND-05',
    role: 'Senior Data Architect (60 Days)',
    initials: 'NA',
    specialty: 'Data & Analytics',
    experienceLevel: 'Senior (6-9y)',
    yearsExp: '7+ Yrs Experience',
    location: 'Gurugram',
    score: 95,
    assessmentScore: 95,
    noticePeriod: '60 Days',
    urgency: '60 Days',
    hourlyRate: '₹4,600 – ₹5,900',
    proofQuote: 'Cut query latency by 68%.',
    skills: ['Snowflake', 'dbt'],
  },
];

const mockPreloadedState = {
  bench: {
    hero: {
      liveRepoBadge: '142 PRE-VETTED TALENTS',
      title: 'Engineers on the Bench',
      subtitle: 'Available to Deploy',
      slaCard: { tag: '48h', title: 'Pod Matching', description: 'desc' },
    },
    statsBadges: [],
    specialtyFilters: [],
    filterOptions: {
      urgency: ['All Urgency'],
      noticePeriod: ['All Notice Periods', '30 Days', 'Immediate', '60 Days'],
      experience: ['All Experience'],
      locations: ['All Locations'],
      sortOptions: ['AI Assessment', 'Highest Score', 'Fastest Availability', 'Lowest Rate'],
    },
    talents: customTalents,
    dossierFeatures: [],
    vettingGates: [],
    requisitionCta: null,
    activeSpecialty: 'All Engineering',
    activeUrgency: 'All Urgency',
    activeNoticePeriod: 'All Notice Periods',
    activeExperience: 'All Experience',
    activeLocation: 'All Locations',
    sortBy: 'AI Assessment',
    searchQuery: '',
    selectedTalent: null,
    drawerOpen: false,
    bookingStatus: 'idle',
    bookingMessage: null,
    status: 'succeeded',
    error: null,
  },
};

describe('BenchPage Candidate Filtering and AI Assessment Sorting', () => {
  beforeEach(() => {
    window.scrollTo = () => {};
  });

  it('renders candidates sorted by AI Assessment descending by default with unscored last', () => {
    renderWithProviders(<BenchPage />, {
      preloadedState: mockPreloadedState,
    });

    // All 5 candidates should be rendered initially
    const cards = screen.getAllByText(/TW-CAND-/);
    expect(cards.length).toBe(5);

    // Top card should have the highest AI assessment score (99% - TW-CAND-01)
    expect(cards[0].textContent).toContain('TW-CAND-01');
    // Second card should have score 98% (TW-CAND-04)
    expect(cards[1].textContent).toContain('TW-CAND-04');
    // Third card should have score 96% (TW-CAND-02)
    expect(cards[2].textContent).toContain('TW-CAND-02');
    // Fourth card should have score 95% (TW-CAND-05)
    expect(cards[3].textContent).toContain('TW-CAND-05');
    // Unscored candidate (TW-CAND-03) must safely appear last
    expect(cards[4].textContent).toContain('TW-CAND-03');
  });

  it('filters candidates with a 30-day notice period and sorts matching candidates by AI Assessment score', () => {
    renderWithProviders(<BenchPage />, {
      preloadedState: mockPreloadedState,
    });

    // Find Notice Period dropdown
    const noticeSelect = screen.getByLabelText(/Filter candidates by notice period/i);
    expect(noticeSelect).toBeDefined();

    // Select 30 Days notice period filter
    fireEvent.change(noticeSelect, { target: { value: '30 Days' } });

    // Only candidates with 30-day notice period should be displayed (TW-CAND-01, TW-CAND-02, TW-CAND-03)
    // 60-day (TW-CAND-05) and Immediate (TW-CAND-04) must NOT be displayed
    const matchingCards = screen.getAllByText(/TW-CAND-/);
    expect(matchingCards.length).toBe(3);

    // Check that excluded candidates are not present
    expect(screen.queryByText('TW-CAND-04')).toBeNull();
    expect(screen.queryByText('TW-CAND-05')).toBeNull();

    // Verify descending order of AI Assessment among the 30-day matching candidates:
    // TW-CAND-01 (score 99) -> TW-CAND-02 (score 96) -> TW-CAND-03 (score null, placed last)
    expect(matchingCards[0].textContent).toContain('TW-CAND-01');
    expect(matchingCards[1].textContent).toContain('TW-CAND-02');
    expect(matchingCards[2].textContent).toContain('TW-CAND-03');
  });

  it('safely handles search along with 30-day notice period filter and AI assessment sorting', () => {
    renderWithProviders(<BenchPage />, {
      preloadedState: mockPreloadedState,
    });

    // Select 30 Days filter
    const noticeSelect = screen.getByLabelText(/Filter candidates by notice period/i);
    fireEvent.change(noticeSelect, { target: { value: '30 Days' } });

    // Type a search query matching Generative AI
    const searchInput = screen.getByPlaceholderText(/Search by role, stack/i);
    fireEvent.change(searchInput, { target: { value: 'Generative' } });

    const matchingCards = screen.getAllByText(/TW-CAND-/);
    expect(matchingCards.length).toBe(1);
    expect(matchingCards[0].textContent).toContain('TW-CAND-02');
  });
});
