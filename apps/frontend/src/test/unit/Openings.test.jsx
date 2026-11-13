import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Openings from '../../components/HomeComponents/Openings';

const mockOpenings = [
  {
    id: 'job-1',
    title: 'Lead AI Agentic Systems & LLM Architect',
    location: 'Bangalore',
    workMode: 'Work From Home',
    experience: '8 - 12 Years',
    jobMode: 'Permanent',
    salary: '₹45 - 60 LPA',
    noticePeriod: 'Immediate',
    description: 'Architect and deploy production agentic workflows...',
    skills: ['Agentic AI', 'LangGraph', 'PyTorch'],
    tag: 'Hot Job',
    tagColor: 'green',
    postedDate: '2026-10-13T00:00:00.000Z',
  },
  {
    id: 'job-2',
    title: 'Principal Cloud Security & DevSecOps Engineer',
    location: 'Remote (US/IND)',
    workMode: 'Work From Office',
    experience: '10+ Years',
    jobMode: 'Contract',
    salary: '₹35 - 50 LPA',
    noticePeriod: 'On Notice Period',
    description: 'Design zero-trust cloud infrastructure...',
    skills: ['AWS Security', 'Kubernetes', 'Terraform'],
    tag: 'Urgent Requirement',
    tagColor: 'blue',
    postedDate: '2026-10-13T00:00:00.000Z',
  },
];

const renderOpenings = () =>
  renderWithProviders(<Openings />, {
    preloadedState: {
      home: {
        openings: mockOpenings,
        status: { openings: 'succeeded' },
      },
    },
  });

describe('Openings High Priority Openings Component', () => {
  it('renders section header, eyebrow badge, and verified roles counter', () => {
    renderOpenings();

    expect(screen.getByText(/Live Deployment Pipeline/i)).toBeInTheDocument();
    expect(screen.getByText(/High Priority Openings/i)).toBeInTheDocument();
    expect(screen.getByText('130+')).toBeInTheDocument();
    expect(screen.getByText(/Verified Tech Roles/i)).toBeInTheDocument();
  });

  it('renders job cards with consistent header, logo, client, and title', () => {
    renderOpenings();

    // Enterprise Client name
    const clientNames = screen.getAllByText('Enterprise Client (Confidential)');
    expect(clientNames.length).toBe(2);

    // TW logo avatars
    const logos = screen.getAllByText('TW');
    expect(logos.length).toBe(2);

    // Job specs and quick apply buttons
    const viewSpecButtons = screen.getAllByText('View Job Spec');
    expect(viewSpecButtons.length).toBe(2);

    const quickApplyButtons = screen.getAllByText('Quick Apply');
    expect(quickApplyButtons.length).toBe(2);
  });

  it('renders metadata information rows (Location, Experience, Salary, Notice Period)', () => {
    const { container } = renderOpenings();

    const metaInfos = container.querySelectorAll('.Openings-metaInfo');
    expect(metaInfos.length).toBe(2);

    const primaryRows = container.querySelectorAll('.Openings-metaRowPrimary');
    expect(primaryRows.length).toBe(2);

    const secondaryRows = container.querySelectorAll(
      '.Openings-metaRowSecondary'
    );
    expect(secondaryRows.length).toBe(2);

    expect(screen.getByText(/Bangalore \(Work From Home\)/i)).toBeInTheDocument();
    expect(screen.getByText(/8 - 12 Years • Permanent/i)).toBeInTheDocument();
    expect(screen.getByText(/₹45 - 60 LPA/i)).toBeInTheDocument();
    expect(screen.getByText(/Notice: Immediate/i)).toBeInTheDocument();
  });

  it('opens QuickApplyModal when Quick Apply button is clicked', () => {
    renderOpenings();

    const quickApplyButtons = screen.getAllByText('Quick Apply');
    fireEvent.click(quickApplyButtons[0]);

    // Modal dialog opens
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('opens JobSpecModal when View Job Spec button is clicked', () => {
    renderOpenings();

    const viewSpecButtons = screen.getAllByText('View Job Spec');
    fireEvent.click(viewSpecButtons[0]);

    // Spec modal opens
    expect(
      screen.getByText(/Role Overview & Architecture Scope/i)
    ).toBeInTheDocument();
  });
});
