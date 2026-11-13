import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import StatsJourney from '../../components/HomeComponents/StatsJourney';

describe('StatsJourney Timeline Year Glow Animation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all four milestone years (2022, 2023, 2024, 2025+)', () => {
    const { container } = renderWithProviders(<StatsJourney />);

    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('2025+')).toBeInTheDocument();

    const yearElements = container.querySelectorAll('.StatsJourney-cardYear');
    expect(yearElements).toHaveLength(4);
  });

  it('applies is-active and is-glowing classes to 2024 and 2025+ when scroll progresses', async () => {
    const { container } = renderWithProviders(<StatsJourney />);

    const spineSection = container.querySelector('.StatsJourney-spineSection');
    expect(spineSection).toBeInTheDocument();

    // Mock bounding client rects to simulate scrolling down into 2024 & 2025+
    vi.spyOn(spineSection, 'getBoundingClientRect').mockReturnValue({
      top: -600, // Scrolled into section
      bottom: 600,
      height: 1200,
      width: 800,
      left: 0,
      right: 800,
      x: 0,
      y: -600,
      toJSON: () => {},
    });

    // Trigger scroll event
    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
    });

    const yearElements = container.querySelectorAll('.StatsJourney-cardYear');
    const year2024 = Array.from(yearElements).find((el) => el.textContent === '2024');
    const year2025 = Array.from(yearElements).find((el) => el.textContent === '2025+');

    expect(year2024).toBeDefined();
    expect(year2025).toBeDefined();

    // Both 2024 and 2025+ should receive the active glow class when scrolled into their range
    expect(year2024).toHaveClass('is-active');
    expect(year2024).toHaveClass('is-glowing');
    expect(year2025).toHaveClass('is-active');
    expect(year2025).toHaveClass('is-glowing');
  });

  it('dynamically cleans up active glow when scrolling back to the top', async () => {
    const { container } = renderWithProviders(<StatsJourney />);
    const spineSection = container.querySelector('.StatsJourney-spineSection');

    // Simulate scrolled past everything (all active)
    vi.spyOn(spineSection, 'getBoundingClientRect').mockReturnValue({
      top: -800,
      bottom: 400,
      height: 1200,
      width: 800,
      left: 0,
      right: 800,
      x: 0,
      y: -800,
      toJSON: () => {},
    });

    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
      await new Promise((r) => setTimeout(r, 50));
    });

    const year2025 = Array.from(container.querySelectorAll('.StatsJourney-cardYear')).find(
      (el) => el.textContent === '2025+'
    );
    expect(year2025).toHaveClass('is-active');

    // Now simulate scrolling back to top where section is far below viewport
    vi.spyOn(spineSection, 'getBoundingClientRect').mockReturnValue({
      top: 1500, // Far below viewport
      bottom: 2700,
      height: 1200,
      width: 800,
      left: 0,
      right: 800,
      x: 0,
      y: 1500,
      toJSON: () => {},
    });

    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
      await new Promise((r) => setTimeout(r, 50));
    });

    const yearElements = container.querySelectorAll('.StatsJourney-cardYear');
    yearElements.forEach((yearEl) => {
      expect(yearEl).not.toHaveClass('is-active');
      expect(yearEl).not.toHaveClass('is-glowing');
    });
  });
});
