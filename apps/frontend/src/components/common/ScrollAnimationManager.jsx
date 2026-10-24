import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useLenisScroll from '../../hooks/useLenisScroll';

/**
 * ScrollAnimationManager
 * Delivers smooth, subtle viewport reveal animations across all sections,
 * cards, headings, and feature blocks as the user scrolls.
 * Respects prefers-reduced-motion and preserves above-the-fold content immediately.
 */

const TARGET_SELECTORS = [
  // --- Homepage ---
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
  '.StatsJourney-spineSection',
  '.Industries-header',
  '.Industries-card',
  '.Reports-header',
  '.Reports-card',
  '.CTA-card',

  // --- About Page ---
  '.AboutHero-content',
  '.AboutHero-mediaWrapper',
  '.StatsStrip-card',
  '.StatsStrip-item',
  '.CompanyOverview-section',
  '.CompanyOverview-container',
  '.AggregatorModel-header',
  '.AggregatorModel-card',
  '.Philosophy-panel',
  '.Philosophy-metricCard',
  '.LeadershipTeam-header',
  '.LeadershipTeam-card',
  '.GrowthTimeline-header',
  '.GrowthTimeline-card',
  '.MilestoneCard-card',
  '.Methodology-header',
  '.Methodology-card',
  '.AboutCTA-container',

  // --- Jobs Page ---
  '.JobsHero-container',
  '.JobSearch-floatingCard',
  '.FeaturedPositions-header',
  '.JobCard-card',
  '.TalentBench-card',
  '.JobsStats-figmaContainer',
  '.JobsStats-metricBox',
  '.CareerBenefits-card',
  '.CareerInsights-card',
  '.CandidateFAQs-card',

  // --- Bench / Talent Cloud Page ---
  '.BenchHero-container',
  '.BenchFilter-wrapper',
  '.BenchFilterBar-container',
  '.BenchCard-card',
  '.BenchGrid-grid > *',
  '.BenchDossierFeatures-card',
  '.BenchGates-gateRow',
  '.BenchRequisitionCTA-card',
  '.BenchCta-card',

  // --- Blog Page ---
  '.BlogHero-container',
  '.BlogFilters-wrapper',
  '.FeaturedArticle-card',
  '.BlogGrid-card',
  '.BlogGrid-articleCard',
  '.ResearchCollective-card',
  '.NewsletterCTA-card',
  '.ContactCTA-card',

  // --- Contact Page ---
  '.ContactHero-container',
  '.ContactChannels-card',
  '.ContactForm-wrapper',
  '.ContactFormSection-asideCard',
  '.ContactOffices-card',
  '.ContactFAQ-card',

  // --- Industries Page ---
  '.IndustriesHero-container',
  '.SectorCatalog-header',
  '.SectorCatalog-card',
  '.SectorCatalog-grid > *',
  '.FeatureComparison-tableCard',
  '.FeatureComparison-container',
  '.CaseStudies-card',
  '.CaseStudies-grid > *',
  '.CapabilityBriefing-card',

  // --- Staff Augmentation Page ---
  '.StaffAug-heroCard',
  '.StaffAug-sectionHeader',
  '.StaffAug-pillarCard',
  '.StaffAug-benefitCard',
  '.StaffAug-benefitsGrid > *',
  '.StaffAug-tableWrapper',
  '.StaffAug-spotlightBanner',
  '.StaffAug-governanceCard',
  '.StaffAug-faqItem',
  '.StaffAug-consultationCard',

  // --- Permanent Staffing Page ---
  '.PermStaff-heroCard',
  '.PermStaff-pillarsHeaderRow',
  '.PermStaff-pillarCard',
  '.PermStaff-rolesHeaderRow',
  '.PermStaff-roleCard',
  '.PermStaff-processCard',
  '.PermStaff-faqItem',
  '.PermStaff-consultationCard',

  // --- Payroll Page ---
  '.Payroll-heroCard',
  '.Payroll-sectionHeader',
  '.Payroll-pillarCard',
  '.Payroll-featureCard',
  '.Payroll-featuresGrid > *',
  '.Payroll-beneficiaryCard',
  '.Payroll-consultationCard',

  // --- EOR Page ---
  '.Eor-heroCard',
  '.Eor-kpiCard',
  '.Eor-capabilitiesGrid > *',
  '.Eor-card',
  '.Eor-comparisonTable',
  '.Eor-explanationSection',
  '.Eor-faqItem',
  '.Eor-consultationCard',

  // --- Find Talent Page ---
  '.FindTalent-heroCard',
  '.FindTalent-intakeCard',
  '.FindTalent-benchCard',
  '.FindTalent-proofCard',
  '.FindTalent-proofGrid > *',
  '.FindTalent-comparisonCard',

  // --- Candidate Portal Page ---
  '.CandidatePortal-heroCard',
  '.CandidatePortal-metricCard',
  '.CandidateMetrics-grid > *',
  '.roadmap-card',
  '.pipeline-row-card',
  '.assessment-main-card',
  '.sponsored-upskill-card',
  '.governance-card',
  '.CandidateConcierge-card',
  '.CandidatePayout-card',

  // --- Universal Fallbacks (ensures future & remaining pages are 100% covered) ---
  'main > section:not(.NewHero-heroSection):not([data-no-scroll-reveal])',
  'main > div[class*="-section"]:not(.NewHero-heroSection)',
  '[class*="-sectionHeader"]',
  '[class*="-headerRow"]',
  '[class*="-pillarsGrid"] > *',
  '[class*="-benefitsGrid"] > *',
  '[class*="-rolesGrid"] > *',
  '[class*="-featuresGrid"] > *',
  '[class*="-statsGrid"] > *',
  '[class*="-stripGrid"] > *',
  '[class*="-cardsGrid"] > *',
  '[class*="-grid"]:not(.Navbar-grid):not(.Footer-grid) > [class*="-card"]',
  '[class*="-grid"]:not(.Navbar-grid):not(.Footer-grid) > [class*="-item"]',
];

const ScrollAnimationManager = () => {
  useLenisScroll();
  const location = useLocation();
  const observerRef = useRef(null);

  useEffect(() => {
    // Respect OS-level motion reduction preference (WCAG 2.1 compliance)
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reset scroll to top on route change
    window.scrollTo(0, 0);
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }

    if (prefersReducedMotion) {
      document.documentElement.classList.add('tw-reduced-motion');
      return;
    }

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
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
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
