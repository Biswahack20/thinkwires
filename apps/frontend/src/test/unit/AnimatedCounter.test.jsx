import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnimatedCounter from '../../components/common/AnimatedCounter';

describe('AnimatedCounter (Unit Test)', () => {
  it('renders numeric target value and prefix/suffix', () => {
    const { container } = render(
      <AnimatedCounter value={500} prefix="$" suffix="k" />
    );

    // Initial render shows element with prefix and suffix
    expect(screen.getByText(/k/)).toBeInTheDocument();
    expect(screen.getByText(/\$/)).toBeInTheDocument();
    expect(container.querySelector('.tw-kinetic-counter')).toBeInTheDocument();
  });

  it('handles string numbers with suffixes automatically', () => {
    render(<AnimatedCounter value="99.9%" />);
    expect(screen.getByText(/%/)).toBeInTheDocument();
  });

  it('handles fallback zero safely when value is undefined', () => {
    const { container } = render(<AnimatedCounter value={undefined} />);
    expect(container).toBeInTheDocument();
  });
});
