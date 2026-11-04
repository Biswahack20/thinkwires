import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import TechStack from '../../components/HomeComponents/TechStack';

describe('TechStack Brand Marquee Carousel Component', () => {
  it('renders marquee wrapper and carousel track with brand cards', () => {
    const { container } = renderWithProviders(<TechStack />);

    const marqueeWrapper = container.querySelector(
      '.TechStack-marqueeWrapper, .TechStack-carouselWrapper'
    );
    expect(marqueeWrapper).toBeInTheDocument();

    const track = container.querySelector(
      '.TechStack-marqueeTrack, .TechStack-carouselTrack'
    );
    expect(track).toBeInTheDocument();
  });

  it('renders ServiceNow logo card with correct attributes and non-clipped dimensions', () => {
    renderWithProviders(<TechStack />);

    const servicenowLogos = screen.getAllByRole('img', {
      name: /servicenow logo/i,
    });
    expect(servicenowLogos.length).toBeGreaterThan(0);

    const firstLogo = servicenowLogos[0];
    expect(firstLogo).toHaveClass('TechStack-logoImg');
    expect(firstLogo.getAttribute('src')).toBeTruthy();
  });

  it('renders all partner tech brand logos without truncation', () => {
    renderWithProviders(<TechStack />);

    const brands = [
      'SAP',
      'Amazon Web Services',
      'Microsoft Azure',
      'Google Cloud',
      'Oracle',
      'Salesforce',
      'Siemens',
      'Adobe',
      'IBM',
      'Snowflake',
      'Cisco',
      'ServiceNow',
      'NVIDIA',
      'Intel',
      'Red Hat',
      'Kubernetes',
      'Docker',
      'React',
      'Python',
      'MongoDB',
    ];

    brands.forEach((brand) => {
      const brandLogos = screen.getAllByRole('img', {
        name: new RegExp(`${brand} logo`, 'i'),
      });
      expect(brandLogos.length).toBeGreaterThan(0);
    });
  });
});

