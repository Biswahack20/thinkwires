import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Reports from '../../components/HomeComponents/Reports';

describe('Reports Carousel Component & Badge Layout', () => {
  it('renders section title and carousel track with report cards', () => {
    const { container } = renderWithProviders(<Reports />);

    expect(
      screen.getByRole('heading', { name: /Our Latest Tech & Market Reports/i })
    ).toBeInTheDocument();

    const track = container.querySelector('.Reports-carouselTrack');
    expect(track).toBeInTheDocument();

    const slides = container.querySelectorAll('.Reports-slide');
    expect(slides.length).toBeGreaterThan(0);

    const cards = container.querySelectorAll('.Reports-card');
    expect(cards.length).toBe(slides.length);
  });

  it('renders image container with top-left category badge and top-right reading badge', () => {
    const { container } = renderWithProviders(<Reports />);

    const imageContainers = container.querySelectorAll('.Reports-imageContainer');
    expect(imageContainers.length).toBeGreaterThan(0);

    imageContainers.forEach((imgContainer) => {
      const img = imgContainer.querySelector('.Reports-image');
      expect(img).toBeInTheDocument();

      const tagBadge = imgContainer.querySelector('.Reports-tagBadge');
      expect(tagBadge).toBeInTheDocument();
      expect(tagBadge.textContent.trim().length).toBeGreaterThan(0);

      const readBadge = imgContainer.querySelector('.Reports-readBadge');
      if (readBadge) {
        expect(readBadge).toHaveTextContent(/min read/i);
      }
    });
  });

  it('renders cardBody and card footer with author info and Read Analysis link', () => {
    const { container } = renderWithProviders(<Reports />);

    const cards = container.querySelectorAll('.Reports-card');
    cards.forEach((card) => {
      const cardBody = card.querySelector('.Reports-cardBody');
      expect(cardBody).toBeInTheDocument();

      const footer = card.querySelector('.Reports-footer');
      expect(footer).toBeInTheDocument();

      const readLink = footer.querySelector('.Reports-readLink');
      expect(readLink).toBeInTheDocument();
      expect(readLink).toHaveTextContent(/Read Analysis/i);
    });
  });
});
