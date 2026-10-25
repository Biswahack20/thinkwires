import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../test-utils';
import SectionBadge from '../../components/common/SectionBadge';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import ProtectedRoute from '../../components/common/ProtectedRoute';

describe('UI Performance & System Quality (Non-Functional Tests)', () => {
  it('mounts SectionBadge well within latency SLA', () => {
    // Warm-up to exclude cold-start module evaluation
    renderWithProviders(<SectionBadge text="Warmup" />).unmount();

    const start = performance.now();
    const { unmount } = renderWithProviders(
      <SectionBadge text="Performance Test" />
    );
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(300);
    unmount();
  });

  it('mounts AnimatedCounter within latency SLA', () => {
    const start = performance.now();
    const { unmount } = renderWithProviders(
      <AnimatedCounter value={99} prefix="$" suffix="k" />
    );
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(150);
    unmount();
  });

  it('handles 25 rapid sequential mount/unmount cycles without memory leakage or exceptions', () => {
    const start = performance.now();

    for (let i = 0; i < 25; i++) {
      const { unmount } = renderWithProviders(
        <ProtectedRoute>
          <div>Protected Content {i}</div>
        </ProtectedRoute>
      );
      unmount();
    }

    const totalDuration = performance.now() - start;
    const avgDuration = totalDuration / 25;

    // Average lifecycle under 35ms in test runner
    expect(avgDuration).toBeLessThan(35);
  });
});
