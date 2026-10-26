import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import ThinkWiresAnimation from '../../components/ThinkWiresAnimation';

vi.mock('three', async () => {
  const actual = await vi.importActual('three');
  function MockWebGLRenderer() {
    this.setSize = vi.fn();
    this.setPixelRatio = vi.fn();
    this.render = vi.fn();
    this.dispose = vi.fn();
    this.domElement = document.createElement('canvas');
  }
  return {
    ...actual,
    WebGLRenderer: MockWebGLRenderer,
  };
});

vi.mock('three/addons/loaders/FontLoader.js', () => {
  function MockFontLoader() {
    this.load = vi.fn();
  }
  return {
    FontLoader: MockFontLoader,
  };
});

vi.mock('three/addons/geometries/TextGeometry.js', () => {
  function MockTextGeometry() {
    this.computeBoundingBox = vi.fn();
    this.boundingBox = {
      min: { x: 0, y: 0, z: 0 },
      max: { x: 10, y: 10, z: 10 },
    };
    this.translate = vi.fn();
  }
  return {
    TextGeometry: MockTextGeometry,
  };
});

describe('ThinkWiresAnimation Mobile Fallback (Issue #118)', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function () {
      return {
        createRadialGradient: vi.fn(() => ({
          addColorStop: vi.fn(),
        })),
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        getImageData: vi.fn(() => ({ data: [] })),
        putImageData: vi.fn(),
        fillText: vi.fn(),
        measureText: vi.fn(() => ({ width: 100 })),
        beginPath: vi.fn(),
        closePath: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        arc: vi.fn(),
      };
    });
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    vi.restoreAllMocks();
  });

  it('renders lightweight mobile fallback when screen width is <= 480px', () => {
    window.innerWidth = 375; // iPhone screen width

    render(<ThinkWiresAnimation />);

    const fallback = screen.getByTestId('thinkwires-mobile-fallback');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveClass('ThinkWiresMobileFallback');
    expect(fallback).toHaveAttribute('aria-hidden', 'true');

    // Verifies orbital tech chips exist
    expect(screen.getByText('SAP')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('CLOUD')).toBeInTheDocument();
    expect(screen.getByText('REACT')).toBeInTheDocument();
  });

  it('switches to mobile fallback on resize to <= 480px', () => {
    window.innerWidth = 1024; // Desktop screen width

    const { rerender } = render(<ThinkWiresAnimation />);
    expect(screen.queryByTestId('thinkwires-mobile-fallback')).toBeNull();

    act(() => {
      window.innerWidth = 414;
      window.dispatchEvent(new Event('resize'));
    });

    rerender(<ThinkWiresAnimation />);
    expect(screen.getByTestId('thinkwires-mobile-fallback')).toBeInTheDocument();
  });
});
