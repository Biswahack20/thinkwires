import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import BenchFilterBar from '../../components/BenchComponents/BenchFilterBar';
import JobSearch from '../../components/JobsComponents/JobSearch';
import NewsletterCTA from '../../components/BlogComponents/NewsletterCTA';
import BlogFilters from '../../components/BlogComponents/BlogFilters';
import BenchDossierDrawer from '../../components/BenchComponents/BenchDossierDrawer';
import CandidateEvaluationModal from '../../admin/CandidateEvaluationModal';
import { adminApi } from '../../admin/adminService';

vi.mock('../../admin/adminService', () => ({
  adminApi: {
    getCandidateDossier: vi.fn(),
    reEvaluateCandidate: vi.fn(),
  },
}));

describe('Sprint 6 (Issue #188): WCAG 2.1 Accessibility & Form Control Compliance', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      })
    );
    adminApi.getCandidateDossier.mockResolvedValue({
      success: true,
      candidate: { id: 'cand-1', name: 'Alice Developer' },
      dossier: {},
    });
  });

  describe('BenchFilterBar Accessible Select Controls & Labels', () => {
    it('provides explicit htmlFor labels and matching IDs for all filter dropdowns', () => {
      renderWithProviders(<BenchFilterBar totalCount={50} />);

      // Urgency filter
      const urgencySelect = screen.getByLabelText(/Urgency:/i);
      expect(urgencySelect).toBeInTheDocument();
      expect(urgencySelect).toHaveAttribute('id', 'bench-filter-urgency');
      expect(urgencySelect).toHaveAttribute('aria-label', 'Filter candidates by deployment urgency');

      // Notice period filter
      const noticeSelect = screen.getByLabelText(/Notice Period:/i);
      expect(noticeSelect).toBeInTheDocument();
      expect(noticeSelect).toHaveAttribute('id', 'bench-filter-notice-period');

      // Experience filter
      const expSelect = screen.getByLabelText(/Experience:/i);
      expect(expSelect).toBeInTheDocument();
      expect(expSelect).toHaveAttribute('id', 'bench-filter-experience');
      expect(expSelect).toHaveAttribute('aria-label', 'Filter candidates by experience tier');

      // Location filter
      const locSelect = screen.getByLabelText(/Location:/i);
      expect(locSelect).toBeInTheDocument();
      expect(locSelect).toHaveAttribute('id', 'bench-filter-location');
      expect(locSelect).toHaveAttribute('aria-label', 'Filter candidates by location');

      // Sort by filter
      const sortSelect = screen.getByLabelText(/Sort by:/i);
      expect(sortSelect).toBeInTheDocument();
      expect(sortSelect).toHaveAttribute('id', 'bench-filter-sort-by');
      expect(sortSelect).toHaveAttribute('aria-label', 'Sort candidates by criteria');
    });
  });

  describe('JobSearch Accessible Inputs, Selects & Actions', () => {
    it('has explicit labels, IDs, and aria-labels for keyword input and filter selects', () => {
      render(
        <JobSearch
          searchQuery="React"
          setSearchQuery={() => { }}
          locationFilter="All"
          setLocationFilter={() => { }}
          experienceFilter="Senior"
          setExperienceFilter={() => { }}
        />
      );

      // Search keyword input
      const searchInput = screen.getByLabelText(/Search by title or tech stack/i);
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('id', 'job-search-query');
      expect(searchInput).toHaveAttribute('aria-label', 'Search job titles or skills');

      // Clear search button
      const clearBtn = screen.getByRole('button', { name: /Clear search input/i });
      expect(clearBtn).toBeInTheDocument();

      // Location select
      const locationSelect = screen.getByLabelText(/Filter by Location/i);
      expect(locationSelect).toBeInTheDocument();
      expect(locationSelect).toHaveAttribute('id', 'job-search-location');
      expect(locationSelect).toHaveAttribute('aria-label', 'Filter jobs by location');

      // Experience select
      const expSelect = screen.getByLabelText(/Filter by Experience/i);
      expect(expSelect).toBeInTheDocument();
      expect(expSelect).toHaveAttribute('id', 'job-search-experience');
      expect(expSelect).toHaveAttribute('aria-label', 'Filter jobs by experience tier');

      // Submit button
      const submitBtn = screen.getByRole('button', { name: /Search Jobs/i });
      expect(submitBtn).toBeInTheDocument();
    });
  });

  describe('NewsletterCTA Accessible Forms & Labels', () => {
    it('links labels to input fields via explicit htmlFor and id attributes', () => {
      render(<NewsletterCTA />);

      const emailInput = screen.getByLabelText(/Work Email Address/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('id', 'newsletter-email');
      expect(emailInput).toHaveAttribute('aria-label', 'Work Email Address');

      const roleInput = screen.getByLabelText(/Organization Role/i);
      expect(roleInput).toBeInTheDocument();
      expect(roleInput).toHaveAttribute('id', 'newsletter-role');
      expect(roleInput).toHaveAttribute('aria-label', 'Organization Role');

      const submitBtn = screen.getByRole('button', { name: /Subscribe to Benchmark Dispatch/i });
      expect(submitBtn).toBeInTheDocument();
    });
  });

  describe('BlogFilters Accessible Keyword Input', () => {
    it('has accessible label and id for search query input', () => {
      render(
        <BlogFilters
          selectedCategory="all"
          setSelectedCategory={() => { }}
          searchQuery=""
          setSearchQuery={() => { }}
        />
      );

      const filterInput = screen.getByLabelText(/Filter insights & keywords/i);
      expect(filterInput).toBeInTheDocument();
      expect(filterInput).toHaveAttribute('id', 'blog-search-query');
      expect(filterInput).toHaveAttribute('aria-label', 'Filter insights by keyword');
    });
  });

  describe('Modal & Drawer Dismiss Buttons (Accessible Names)', () => {
    it('provides accessible aria-label on BenchDossierDrawer close button', async () => {
      const sampleCandidate = {
        id: 'TW-BENCH-999',
        code: 'TW-BENCH-999',
        role: 'Senior Staff Engineer',
        skills: ['Go', 'Kubernetes'],
      };

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

      const closeBtn = screen.getByRole('button', { name: /Close dossier drawer/i });
      expect(closeBtn).toBeInTheDocument();
      expect(closeBtn).toHaveAttribute('aria-label', 'Close dossier drawer');
    });

    it('provides accessible aria-label on CandidateEvaluationModal close button', async () => {
      await act(async () => {
        render(
          <CandidateEvaluationModal
            isOpen={true}
            candidateId="cand-1"
            candidateName="Alice Developer"
            onClose={() => { }}
          />
        );
      });

      const closeBtn = screen.getByRole('button', {
        name: /Close Candidate Evaluation Modal/i,
      });
      expect(closeBtn).toBeInTheDocument();
      expect(closeBtn).toHaveAttribute('aria-label', 'Close Candidate Evaluation Modal');
    });
  });
});
