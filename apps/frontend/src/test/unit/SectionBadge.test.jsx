import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, render } from '@testing-library/react';
import SectionBadge from '../../components/common/SectionBadge';

describe('SectionBadge Component', () => {
  it('renders badge text correctly', () => {
    render(<SectionBadge text="Enterprise Solutions" />);
    expect(screen.getByText('Enterprise Solutions')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <SectionBadge
        text="Verified Talent"
        icon={<span data-testid="test-icon">★</span>}
      />
    );

    expect(screen.getByText('Verified Talent')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('does not render icon container when icon is not provided', () => {
    const { container } = render(<SectionBadge text="Simple Badge" />);
    expect(container.querySelector('.section-badge-icon')).toBeNull();
  });
});
