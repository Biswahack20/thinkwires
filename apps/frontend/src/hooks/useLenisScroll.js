import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * useLenisScroll
 * Provides buttery-smooth momentum scrolling across the page using Lenis.
 * Respects accessibility (prefers-reduced-motion) and integrates with anchor links.
 */
export const useLenisScroll = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    // Check for reduced motion preference
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    if (window.__lenis) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.8,
      infinite: false,
      allowNestedScroll: true,
      prevent: (node) => {
        if (!node) return false;
        if (typeof node.hasAttribute === 'function') {
          if (
            node.hasAttribute('data-lenis-prevent') ||
            node.hasAttribute('data-lenis-prevent-wheel') ||
            node.hasAttribute('data-lenis-prevent-touch')
          ) {
            return true;
          }
        }
        if (typeof node.closest === 'function') {
          return Boolean(
            node.closest(
              '[data-lenis-prevent], [role="dialog"], [role="alertdialog"], .ApplyModal-overlay, .ApplyModal-content, .tw-modal-backdrop, .tw-modal-card, form, textarea, select'
            )
          );
        }
        return false;
      },
    });

    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Smoothly intercept hash link clicks (e.g., #hot-jobs, #process)
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl, { offset: -90, duration: 1.2 });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [enabled]);
};

export default useLenisScroll;
