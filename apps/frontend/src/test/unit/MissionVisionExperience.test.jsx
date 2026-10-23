import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import MissionVisionExperience from '../../components/HomeComponents/MissionVisionExperience';

describe('MissionVisionExperience Interactive Component', () => {
  it('renders main heading and eyebrow badge', () => {
    renderWithProviders(<MissionVisionExperience />);

    expect(screen.getAllByText('OUR PURPOSE').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Where Purpose Meets/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Our mission guides what we do today/i)
    ).toBeInTheDocument();
  });

  it('renders central purpose visual and core brand markings', () => {
    renderWithProviders(<MissionVisionExperience />);

    expect(
      screen.getByText('THE PURPOSE THAT CONNECTS US')
    ).toBeInTheDocument();
    expect(screen.getByText('Talent • Trust • Technology')).toBeInTheDocument();
  });

  it('renders interactive mission and vision wings and toggles content on click', async () => {
    renderWithProviders(<MissionVisionExperience />);

    // Initial state: Mission active
    expect(screen.getByText('01 — OUR MISSION')).toBeInTheDocument();
    expect(screen.getByText(/COMMITMENT/i)).toBeInTheDocument();

    // Click Vision selector tab
    const visionTab = screen.getByRole('tab', { name: /02 — THE VISION/i });
    fireEvent.click(visionTab);

    // After switching: Vision content should be visible
    expect(screen.getByText('02 — OUR VISION')).toBeInTheDocument();
    expect(
      await screen.findByText(/A World Where Engineering Talent Knows Zero Borders/i)
    ).toBeInTheDocument();
  });

  it('renders the 3-step narrative continuum (Purpose -> Action -> Impact)', () => {
    renderWithProviders(<MissionVisionExperience />);

    expect(
      screen.getByText('From Conviction to Measurable Outcome')
    ).toBeInTheDocument();
    expect(screen.getByText('What drives us')).toBeInTheDocument();
    expect(screen.getByText('How we create value')).toBeInTheDocument();
    expect(screen.getByText('What we aim to change')).toBeInTheDocument();

    // Clicking a milestone changes active state
    const actionMilestone = screen.getByText('How we create value');
    fireEvent.click(actionMilestone);
  });
});
