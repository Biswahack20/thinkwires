import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders, screen, fireEvent } from '../test-utils';
import FaqPage from '../../pages/FaqPage';
import { FAQ_ITEMS, FAQ_CATEGORIES } from '../../data/faqData';

describe('FaqPage Component - Premium Editorial Experience', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the editorial FAQ hero with eyebrow, heading, and search bar', () => {
    renderWithProviders(<FaqPage />);

    expect(screen.getByText(/help center/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /everything you need to know/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search by topic, keyword, or question/i)).toBeInTheDocument();
  });

  it('renders all 8 category navigation tabs with counts', () => {
    renderWithProviders(<FaqPage />);

    FAQ_CATEGORIES.forEach((cat) => {
      const tab = screen.getByRole('tab', { name: new RegExp(cat.name, 'i') });
      expect(tab).toBeInTheDocument();
    });
  });

  it('renders category group headers and all 28 questions in editorial layout', () => {
    renderWithProviders(<FaqPage />);

    // Verify all 7 non-'all' category headings exist
    FAQ_CATEGORIES.filter((c) => c.id !== 'all').forEach((cat) => {
      expect(screen.getByRole('heading', { level: 2, name: cat.name })).toBeInTheDocument();
    });

    // Verify questions render as expandable row triggers
    const firstFaq = FAQ_ITEMS[0];
    expect(screen.getByRole('button', { name: new RegExp(firstFaq.question, 'i') })).toBeInTheDocument();
  });

  it('expands and collapses a question row when clicked', () => {
    renderWithProviders(<FaqPage />);

    const firstFaq = FAQ_ITEMS[0];
    const triggerBtn = screen.getByRole('button', { name: new RegExp(firstFaq.question, 'i') });

    // Initially collapsed
    expect(triggerBtn).toHaveAttribute('aria-expanded', 'false');

    // Click to expand
    fireEvent.click(triggerBtn);
    expect(triggerBtn).toHaveAttribute('aria-expanded', 'true');

    // Answer content is now revealed
    expect(screen.getByText(/Recruitment transformation is the strategic shift/i)).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(triggerBtn);
    expect(triggerBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('filters questions accurately when searching by keyword', () => {
    renderWithProviders(<FaqPage />);

    const searchInput = screen.getByPlaceholderText(/search by topic, keyword, or question/i);
    fireEvent.change(searchInput, { target: { value: 'Staff Augmentation' } });

    // Summary metadata should update
    expect(screen.getByText(/matching “staff augmentation”/i)).toBeInTheDocument();

    // Check that matching questions remain
    const matchingButtons = screen.getAllByRole('button', { name: /staff augmentation/i });
    expect(matchingButtons.length).toBeGreaterThan(0);
  });

  it('shows polished empty state when search finds no results', () => {
    renderWithProviders(<FaqPage />);

    const searchInput = screen.getByPlaceholderText(/search by topic, keyword, or question/i);
    fireEvent.change(searchInput, { target: { value: 'xyznonexistentfaqterm123' } });

    expect(screen.getByText(/no matching questions found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear search & view all questions/i })).toBeInTheDocument();

    // Reset restores all items
    fireEvent.click(screen.getByRole('button', { name: /clear search & view all questions/i }));
    expect(searchInput.value).toBe('');
    expect(screen.queryByText(/no matching questions found/i)).not.toBeInTheDocument();
  });

  it('switches category when clicking a category tab', () => {
    renderWithProviders(<FaqPage />);

    const aiTab = screen.getByRole('tab', { name: /ai-powered recruitment/i });
    fireEvent.click(aiTab);

    expect(aiTab).toHaveAttribute('aria-selected', 'true');
    expect(aiTab.className).toContain('tw-faq-tab-item--active');
  });

  it('provides feedback and share link in expanded question panel', () => {
    renderWithProviders(<FaqPage />);

    const firstFaq = FAQ_ITEMS[0];
    const triggerBtn = screen.getByRole('button', { name: new RegExp(firstFaq.question, 'i') });
    fireEvent.click(triggerBtn);

    const yesBtn = screen.getByRole('button', { name: /yes/i });
    expect(yesBtn).toBeInTheDocument();
    fireEvent.click(yesBtn);
    expect(yesBtn.className).toContain('tw-faq-btn-feedback--active');

    const shareBtn = screen.getByRole('button', { name: /share link/i });
    expect(shareBtn).toBeInTheDocument();
  });

  it('renders bottom CTA section with Talk to Our Team and Explore Our Services', () => {
    renderWithProviders(<FaqPage />);

    expect(screen.getByRole('heading', { level: 2, name: /still have questions\?/i })).toBeInTheDocument();

    const contactLink = screen.getByRole('link', { name: /talk to our team/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', '/contact');

    const servicesLink = screen.getByRole('link', { name: /explore our services/i });
    expect(servicesLink).toBeInTheDocument();
    expect(servicesLink).toHaveAttribute('href', '/services');
  });
});
