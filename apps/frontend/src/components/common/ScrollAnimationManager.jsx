import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollAnimationManager
 * Delivers smooth, subtle viewport reveal animations across all sections,
 * cards, headings, and feature blocks as the user scrolls.
 * Respects prefers-reduced-motion and preserves above-the-fold content immediately.
 */

const TARGET_SELECTORS = [
  // Section headers & intro text blocks
  '.TechStack-techStackSection',
  '.About-aboutContent',
  '.About-aboutVisual',
  '.About-statBox',
  '.Capabilities-header',
  '.Capabilities-card',
  '.Openings-header',
  '.Openings-card',
  '.Process-header',
  '.Process-card',
  '.StatsJourney-header',
  '.StatsJourney-statCard',
  '.StatsJourney-timelineCard',
  '.Industries-header',
  '.Industries-card',
  '.Reports-header',
  '.Reports-card',
  '.CTA-card',
  // About Page
  '.AboutHero-content',
  '.AboutHero-mediaWrapper',
  '.StatsStrip-card',
  '.AggregatorModel-card',
  '.Philosophy-panel',
  '.LeadershipTeam-card',
  '.GrowthTimeline-card',
  '.Methodology-card',
  '.AboutCTA-container',
  // Jobs Page
  '.JobSearch-floatingCard',
  '.FeaturedPositions-header',
  '.JobCard-card',
  '.TalentBench-card',
  '.JobsStats-card',
  '.CareerBenefits-card',
  '.CareerInsights-card',
  '.CandidateFAQs-card',
  // Bench / Talent Cloud Page
  '.BenchFilter-wrapper',
  '.BenchCard-root',
  '.BenchDossierFeatures-card',
  '.BenchGates-gateRow',
  '.BenchCta-card',
  // Blog Page
  '.BlogHero-container',
  '.BlogFilters-wrapper',
  '.FeaturedArticle-card',
  '.BlogGrid-card',
  '.ResearchCollective-card',
  '.NewsletterCTA-card',
  '.ContactCTA-card',
  // Contact Page
  '.ContactHero-container',
  '.ContactChannels-card',
  '.ContactForm-wrapper',
  '.ContactFormSection-asideCard',
  '.ContactOffices-card',
  '.ContactFAQ-card',
  // Service Pages (StaffAug, PermStaff, Payroll, Eor)
  '.StaffAug-card',
  '.StaffAug-pillarCard',
  '.PermStaff-card',
  '.PermStaff-pillarCard',
  '.Payroll-card',
  '.Payroll-pillarCard',
  '.Eor-card',
  '.Eor-kpiCard',
  '.Eor-capabilitiesGrid > *',
  '.Eor-separationCol',
  // Find Talent & Candidate Portal
  '.FindTalent-intakeCard',
  '.FindTalent-benchCard',
  '.FindTalent-proofGrid > *',
  '.CandidatePortal-heroCard',
  '.CandidatePortal-metricCard',
  '.roadmap-card',
  '.pipeline-row-card',
  '.assessment-main-card',
  '.sponsored-upskill-card',
  '.governance-card',
  // Fallbacks for any other cards or feature sections
  'main > section:not(.NewHero-heroSection)',
  'main > div[class*="-section"]:not(.NewHero-heroSection)',
  '[class*="-cardsGrid"] > *',
  '[class*="-grid"]:not(.Navbar-grid):not(.Footer-grid) > [class*="-card"]',
];

const ScrollAnimationManager = () => {
  const location = useLocation();
  const observerRef = useRef(null);

  useEffect(() => {
    // 1. Accessibility: Check user's motion preference
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      document.documentElement.classList.add('tw-reduced-motion');
      return;
    }

    // 2. Mark document ready for scroll animations
    document.documentElement.classList.add('tw-scroll-anim-ready');

    if (!('IntersectionObserver' in window)) {
      return;
    }

    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            target.classList.add('tw-revealed');
            obs.unobserve(target); // Reveal once only; never replay unnecessarily

            // Remove animation classes once the reveal completes to preserve clean DOM
            const onTransitionEnd = () => {
              target.classList.remove(
                'tw-scroll-reveal',
                'tw-stagger-0',
                'tw-stagger-1',
                'tw-stagger-2',
                'tw-stagger-3',
                'tw-stagger-4'
              );
              target.classList.add('tw-revealed-done');
              target.removeEventListener('transitionend', onTransitionEnd);
            };

            target.addEventListener('transitionend', onTransitionEnd);
            setTimeout(onTransitionEnd, 1000);
          }
        });
      },
      {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.05,
      }
    );

    observerRef.current = observer;

    const registerElements = () => {
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const combinedSelector = TARGET_SELECTORS.join(', ');
      const elements = Array.from(document.querySelectorAll(combinedSelector));

      elements.forEach((el) => {
        // Skip elements already observed or revealed
        if (
          el.classList.contains('tw-revealed') ||
          el.classList.contains('tw-revealed-done') ||
          el.classList.contains('tw-scroll-reveal')
        ) {
          return;
        }

        const rect = el.getBoundingClientRect();

        // Above-the-fold content: reveal immediately so the initial landing page
        // appearance is 100% preserved with zero delay or layout shift
        if (rect.top < windowHeight * 0.85 && rect.bottom > 0) {
          el.classList.add('tw-revealed-done');
          return;
        }

        // Below-the-fold content: attach smooth reveal
        el.classList.add('tw-scroll-reveal');

        // Apply subtle stagger if the element has siblings in a card grid
        const parent = el.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(
            (c) =>
              c.classList.contains('tw-scroll-reveal') ||
              c.classList.contains('tw-revealed') ||
              c.classList.contains('tw-revealed-done')
          );
          const idx = siblings.indexOf(el);
          if (idx >= 0) {
            el.classList.add(`tw-stagger-${idx % 5}`);
          }
        }

        observer.observe(el);
      });
    };

    // Run after DOM paint
    const timerId = setTimeout(() => {
      registerElements();
    }, 50);

    // Watch for dynamic/Suspense content additions
    const mutationObserver = new MutationObserver(() => {
      registerElements();
    });

    const mainElement = document.querySelector('main') || document.body;
    mutationObserver.observe(mainElement, { childList: true, subtree: true });

    return () => {
      clearTimeout(timerId);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return null;
};

export default ScrollAnimationManager;
