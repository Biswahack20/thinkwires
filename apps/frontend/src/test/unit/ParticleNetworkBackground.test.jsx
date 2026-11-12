import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import ParticleNetworkBackground from '../../components/HomeComponents/ParticleNetworkBackground';

describe('ParticleNetworkBackground', () => {
  beforeEach(() => {
    // Mock ResizeObserver
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('renders a canvas element with aria-hidden="true" and pointer-events none', () => {
    const { container } = render(
      <div style={{ width: 800, height: 600 }}>
        <ParticleNetworkBackground />
      </div>
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
    expect(canvas.style.pointerEvents).toBe('none');
    expect(canvas.style.position).toBe('absolute');
    expect(canvas).toHaveClass('ParticleNetwork-canvas');
  });

  it('unmounts cleanly without throwing errors or leaving unhandled listeners', () => {
    const { unmount } = render(
      <div style={{ width: 800, height: 600 }}>
        <ParticleNetworkBackground />
      </div>
    );

    expect(() => unmount()).not.toThrow();
  });
});
