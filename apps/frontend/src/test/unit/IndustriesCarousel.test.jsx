import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Industries from '../../components/HomeComponents/Industries';

describe('Industries Component & Carousel Hover / Explore UI', () => {
  it('renders "Explore" on all industry cards and never "Explore Practice"', () => {
    const { container } = renderWithProviders(<Industries />);

    // Verify "Explore" is rendered
    const exploreElements = screen.getAllByText('Explore');
    expect(exploreElements.length).toBeGreaterThan(0);

    // Verify "Explore Practice" is completely gone
    expect(screen.queryByText(/Explore Practice/i)).toBeNull();

    // Verify explore links have arrow_forward and proper classes
    const exploreLinks = container.querySelectorAll('.Industries-exploreLink');
    expect(exploreLinks.length).toBe(exploreElements.length);

    exploreLinks.forEach((link) => {
      expect(link).toHaveTextContent('Explore');
      const arrowIcon = link.querySelector('.material-symbols-outlined');
      expect(arrowIcon).toBeInTheDocument();
      expect(arrowIcon).toHaveTextContent('arrow_forward');
    });
  });

  it('renders carousel wrapper and track with proper structure', () => {
    const { container } = renderWithProviders(<Industries />);

    const wrapper = container.querySelector('.Industries-carouselWrapper');
    const track = container.querySelector('.Industries-carouselTrack');
    const cards = container.querySelectorAll('.Industries-carouselCard');

    expect(wrapper).toBeInTheDocument();
    expect(track).toBeInTheDocument();
    expect(cards.length).toBeGreaterThan(0);
  });
});
