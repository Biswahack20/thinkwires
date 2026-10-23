import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * MissionVisionExperience Component
 * "Where Purpose Meets Possibility"
 * 
 * An interactive, orbital corporate visual narrative connecting ThinkWires'
 * present-day Mission with its ambitious long-term Vision, joined through a
 * central Purpose Orb and anchored by a scroll-aware narrative milestone sequence.
 */

const MILESTONES = [
  {
    id: 'purpose',
    step: '01',
    label: 'PURPOSE',
    title: 'What drives us',
    description:
      'Dismantling cross-border talent barriers with transparent, human-first engineering pipelines.',
    icon: 'hub',
    accentColor: 'var(--color-primary, #0037b0)',
  },
  {
    id: 'action',
    step: '02',
    label: 'ACTION',
    title: 'How we create value',
    description:
      'Deploying elite tech pods in under 48 hours with rigorous vetting and compliant global infrastructure.',
    icon: 'bolt',
    accentColor: 'var(--color-cobalt-glow, #3b82f6)',
  },
  {
    id: 'impact',
    step: '03',
    label: 'IMPACT',
    title: 'What we aim to change',
    description:
      'Unlocking borderless engineering careers while helping technology leaders scale with precision.',
    icon: 'rocket_launch',
    accentColor: 'var(--color-emerald-accent, #22c55e)',
  },
];

const CONTENT_DATA = {
  mission: {
    id: 'mission',
    number: '01',
    label: 'OUR MISSION',
    pill: 'TODAY’S COMMITMENT',
    icon: 'track_changes', // directional target / compass
    headline: 'Engineering Frictionless, Hyper-Targeted Talent Conduits',
    primaryStatement:
      'To dismantle legacy recruiting friction by delivering vetted engineering pods and compliant EOR infrastructure across India, the US, and Canada within 48 to 72 hours.',
    expandedDetails:
      'We reject transactional resume dumping. Every client partnership is treated as an architectural brief — matching elite distributed talent directly with high-growth engineering organizations without recruiter commission cuts.',
    impactMetrics: [
      { label: 'SLA to Curated Squads', value: '< 48h' },
      { label: 'Contract Retention', value: '98.4%' },
      { label: 'Placement Fee Cuts', value: '0%' },
    ],
    pillars: [
      {
        icon: 'verified_user',
        title: 'Rigorous Technical Vetting',
        desc: 'Architectural code reviews and live problem-solving assessments before client submission.',
      },
      {
        icon: 'gavel',
        title: 'Full Statutory Compliance',
        desc: 'Complete Employer of Record (EOR), provincial tax, and payroll security baked in.',
      },
    ],
  },
  vision: {
    id: 'vision',
    number: '02',
    label: 'OUR VISION',
    pill: 'TOMORROW’S HORIZON',
    icon: 'visibility', // horizon / eye / future-oriented
    headline: 'A World Where Engineering Talent Knows Zero Borders',
    primaryStatement:
      'To build the premier bilateral talent cloud where geographical boundaries dissolve, empowering global leaders and engineers to collaborate seamlessly.',
    expandedDetails:
      'By combining automated AI-driven skills mapping with deep human advisory, ThinkWires is transforming distributed engineering into a dependable, borderless standard of modern software excellence.',
    impactMetrics: [
      { label: 'Active Corridors', value: '3 Continents' },
      { label: 'AI Match Accuracy', value: '99.2%' },
      { label: 'Global Compliance', value: '100%' },
    ],
    pillars: [
      {
        icon: 'language',
        title: 'Unified Talent Cloud',
        desc: 'Interconnecting elite hubs in North America and India into one high-velocity ecosystem.',
      },
      {
        icon: 'psychology',
        title: 'Predictive Pod Assembly',
        desc: 'Smart algorithmic staffing models forecasting team velocity and lifecycle fit.',
      },
    ],
  },
};

const MissionVisionExperience = ({ className = '' }) => {
  const [activeSide, setActiveSide] = useState('mission'); // 'mission' | 'vision'
  const [hoveredSide, setHoveredSide] = useState(null); // 'mission' | 'vision' | null
  const [activeMilestone, setActiveMilestone] = useState(0); // 0 | 1 | 2
  const milestonesRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Highlight state derived from hover or active click
  const highlighted = hoveredSide || activeSide;

  // Scroll listener for the 3-step narrative progression
  useEffect(() => {
    const handleScroll = () => {
      if (!milestonesRef.current) return;
      const rect = milestonesRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      // Compute relative visibility position within viewport
      const visibleRatio = (windowHeight - rect.top) / (windowHeight + rect.height);
      if (visibleRatio < 0.28) {
        setActiveMilestone(0);
      } else if (visibleRatio < 0.58) {
        setActiveMilestone(1);
      } else {
        setActiveMilestone(2);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentContent = CONTENT_DATA[activeSide];

  return (
    <section
      className={`MVE-section ${className}`}
      id="purpose-narrative"
      aria-labelledby="mve-main-heading"
    >
      {/* Ambient background geometry & glow */}
      <div className="MVE-ambientCanvas" aria-hidden="true">
        <div className="MVE-ambientGradient MVE-ambientGradient--left" />
        <div className="MVE-ambientGradient MVE-ambientGradient--center" />
        <div className="MVE-ambientGradient MVE-ambientGradient--right" />
        <div className="MVE-gridOverlay" />
      </div>

      <div className="MVE-container">
        {/* Section Header */}
        <div className="MVE-header">
          <div className="MVE-eyebrowBadge">
            <span className="MVE-eyebrowDot" aria-hidden="true" />
            <span className="MVE-eyebrowText">OUR PURPOSE</span>
          </div>

          <h2 id="mve-main-heading" className="MVE-heading">
            Where Purpose Meets <span className="MVE-headingGradient">Possibility.</span>
          </h2>

          <p className="MVE-subtitle">
            Our mission guides what we do today. Our vision shapes the possibilities
            we work toward tomorrow.
          </p>

          {/* Interactive Mode & Switcher Indicator */}
          <div
            className="MVE-segmentedControl"
            role="tablist"
            aria-label="Mission and Vision Experience Switcher"
          >
            <button
              type="button"
              role="tab"
              id="tab-mission"
              aria-selected={activeSide === 'mission'}
              aria-controls="panel-mission"
              tabIndex={activeSide === 'mission' ? 0 : -1}
              className={`MVE-segmentTab ${activeSide === 'mission' ? 'is-active' : ''}`}
              onClick={() => setActiveSide('mission')}
              onMouseEnter={() => setHoveredSide('mission')}
              onMouseLeave={() => setHoveredSide(null)}
            >
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                track_changes
              </span>
              <span>01 — THE MISSION</span>
            </button>

            <div className="MVE-segmentIndicator" aria-hidden="true">
              <span className="MVE-segmentNumber">{activeSide === 'mission' ? '01' : '02'}</span>
              <span className="MVE-segmentDivider">/</span>
              <span className="MVE-segmentTotal">02</span>
            </div>

            <button
              type="button"
              role="tab"
              id="tab-vision"
              aria-selected={activeSide === 'vision'}
              aria-controls="panel-vision"
              tabIndex={activeSide === 'vision' ? 0 : -1}
              className={`MVE-segmentTab ${activeSide === 'vision' ? 'is-active' : ''}`}
              onClick={() => setActiveSide('vision')}
              onMouseEnter={() => setHoveredSide('vision')}
              onMouseLeave={() => setHoveredSide(null)}
            >
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                visibility
              </span>
              <span>02 — THE VISION</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Core Interactive Layout: Mission — Central Orb — Vision */}
        {/* ============================================================ */}
        <div className="MVE-triadExperience">
          {/* Connecting SVG Lines (Desktop) */}
          <svg
            className="MVE-connectorSvg"
            viewBox="0 0 1200 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="mveGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0037b0" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="mveGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0037b0" stopOpacity="0.3" />
              </linearGradient>
              <filter id="mveGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Left track: Mission Card -> Central Purpose */}
            <path
              d="M 330 200 C 430 200, 470 200, 520 200"
              className={`MVE-svgTrack ${highlighted === 'mission' ? 'is-lit' : ''}`}
              stroke="url(#mveGradLeft)"
              strokeWidth={highlighted === 'mission' ? '2.5' : '1.5'}
              strokeDasharray={highlighted === 'mission' ? 'none' : '4 4'}
            />

            {/* Right track: Central Purpose -> Vision Card */}
            <path
              d="M 680 200 C 730 200, 770 200, 870 200"
              className={`MVE-svgTrack ${highlighted === 'vision' ? 'is-lit' : ''}`}
              stroke="url(#mveGradRight)"
              strokeWidth={highlighted === 'vision' ? '2.5' : '1.5'}
              strokeDasharray={highlighted === 'vision' ? 'none' : '4 4'}
            />

            {/* Pulsing signal node traversing active track */}
            {highlighted === 'mission' && !prefersReducedMotion && (
              <circle r="4" fill="#3b82f6" filter="url(#mveGlow)">
                <animateMotion
                  path="M 330 200 C 430 200, 470 200, 520 200"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            {highlighted === 'vision' && !prefersReducedMotion && (
              <circle r="4" fill="#22c55e" filter="url(#mveGlow)">
                <animateMotion
                  path="M 680 200 C 730 200, 770 200, 870 200"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </svg>

          {/* 1. Left Pillar: Mission Interactive Wing */}
          <div
            className={`MVE-wingCard MVE-wingCard--mission ${
              activeSide === 'mission' ? 'is-active' : ''
            } ${hoveredSide === 'mission' ? 'is-hovered' : ''}`}
            onClick={() => setActiveSide('mission')}
            onMouseEnter={() => setHoveredSide('mission')}
            onMouseLeave={() => setHoveredSide(null)}
            onFocus={() => setHoveredSide('mission')}
            onBlur={() => setHoveredSide(null)}
            tabIndex={0}
            role="button"
            aria-pressed={activeSide === 'mission'}
            aria-label="Select Mission: What we do today"
          >
            <div className="MVE-wingHeader">
              <div className="MVE-wingBadge MVE-wingBadge--mission">
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                  track_changes
                </span>
                <span>01 — OUR MISSION</span>
              </div>
              <span className="MVE-wingStatus" aria-hidden="true">
                {activeSide === 'mission' ? 'Active' : 'Click to explore'}
              </span>
            </div>

            <h3 className="MVE-wingTitle">
              Frictionless Engineering Pods Across Continents
            </h3>

            <p className="MVE-wingStatement">
              {CONTENT_DATA.mission.primaryStatement}
            </p>

            <div className="MVE-wingFooter">
              <div className="MVE-wingAction">
                <span>View Mission Architecture</span>
                <span className="material-symbols-outlined MVE-wingArrow" aria-hidden="true">
                  arrow_forward
                </span>
              </div>
              <div className="MVE-wingNodeDot MVE-wingNodeDot--mission" aria-hidden="true" />
            </div>
          </div>

          {/* 2. Central Purpose Orb (The anchor of the narrative) */}
          <div
            className={`MVE-purposeOrbWrapper ${
              highlighted === 'mission'
                ? 'is-bias-mission'
                : highlighted === 'vision'
                ? 'is-bias-vision'
                : ''
            }`}
            aria-label="ThinkWires Central Purpose Orbital System"
          >
            {/* Orbital Rings with Rotating Geometry */}
            <div className="MVE-orbitalStage" aria-hidden="true">
              <div className="MVE-orbitRing MVE-orbitRing--outer">
                <span className="MVE-orbitNode MVE-orbitNode--1" />
                <span className="MVE-orbitNode MVE-orbitNode--2" />
              </div>
              <div className="MVE-orbitRing MVE-orbitRing--mid">
                <span className="MVE-orbitNode MVE-orbitNode--3" />
                <span className="MVE-orbitNode MVE-orbitNode--4" />
              </div>
              <div className="MVE-orbitRing MVE-orbitRing--inner" />

              {/* Central Core Globe */}
              <div className="MVE-coreGlobe">
                <div className="MVE-coreGlow" />
                <div className="MVE-coreIconBadge">
                  <span className="material-symbols-outlined MVE-coreIcon" aria-hidden="true">
                    all_inclusive
                  </span>
                </div>
                <div className="MVE-coreBrandMark">
                  <span className="MVE-coreTag">OUR PURPOSE</span>
                  <span className="MVE-coreTitle">THE PURPOSE THAT CONNECTS US</span>
                  <span className="MVE-coreSub">Talent • Trust • Technology</span>
                </div>
              </div>
            </div>

            {/* Mobile Switch Buttons */}
            <div className="MVE-mobilePillBar">
              <button
                type="button"
                className={`MVE-mobilePillBtn ${activeSide === 'mission' ? 'is-active' : ''}`}
                onClick={() => setActiveSide('mission')}
                aria-pressed={activeSide === 'mission'}
              >
                01 Mission
              </button>
              <button
                type="button"
                className={`MVE-mobilePillBtn ${activeSide === 'vision' ? 'is-active' : ''}`}
                onClick={() => setActiveSide('vision')}
                aria-pressed={activeSide === 'vision'}
              >
                02 Vision
              </button>
            </div>
          </div>

          {/* 3. Right Pillar: Vision Interactive Wing */}
          <div
            className={`MVE-wingCard MVE-wingCard--vision ${
              activeSide === 'vision' ? 'is-active' : ''
            } ${hoveredSide === 'vision' ? 'is-hovered' : ''}`}
            onClick={() => setActiveSide('vision')}
            onMouseEnter={() => setHoveredSide('vision')}
            onMouseLeave={() => setHoveredSide(null)}
            onFocus={() => setHoveredSide('vision')}
            onBlur={() => setHoveredSide(null)}
            tabIndex={0}
            role="button"
            aria-pressed={activeSide === 'vision'}
            aria-label="Select Vision: The future we are building"
          >
            <div className="MVE-wingHeader">
              <div className="MVE-wingBadge MVE-wingBadge--vision">
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                  visibility
                </span>
                <span>02 — OUR VISION</span>
              </div>
              <span className="MVE-wingStatus" aria-hidden="true">
                {activeSide === 'vision' ? 'Active' : 'Click to explore'}
              </span>
            </div>

            <h3 className="MVE-wingTitle">
              Borderless Talent Cloud for Global Innovation
            </h3>

            <p className="MVE-wingStatement">
              {CONTENT_DATA.vision.primaryStatement}
            </p>

            <div className="MVE-wingFooter">
              <div className="MVE-wingAction">
                <span>View Vision Horizon</span>
                <span className="material-symbols-outlined MVE-wingArrow" aria-hidden="true">
                  arrow_forward
                </span>
              </div>
              <div className="MVE-wingNodeDot MVE-wingNodeDot--vision" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Expanded Content Narrative Panel (Smoothly Animated) */}
        {/* ============================================================ */}
        <div
          className="MVE-expandedPanel"
          id={`panel-${activeSide}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeSide}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSide}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: prefersReducedMotion ? 0.05 : 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="MVE-expandedContentGrid"
            >
              {/* Detailed Narrative Column */}
              <div className="MVE-narrativeCol">
                <div className="MVE-panelBadge">
                  <span className="material-symbols-outlined text-[15px]" aria-hidden="true">
                    {currentContent.icon}
                  </span>
                  <span>{currentContent.pill}</span>
                </div>

                <h3 className="MVE-panelHeadline">{currentContent.headline}</h3>

                <p className="MVE-panelDescription">
                  {currentContent.expandedDetails}
                </p>

                {/* Key Pillars */}
                <div className="MVE-pillarsList">
                  {currentContent.pillars.map((pillar, i) => (
                    <div key={i} className="MVE-pillarItem">
                      <div className="MVE-pillarIconWrap">
                        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                          {pillar.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="MVE-pillarTitle">{pillar.title}</h4>
                        <p className="MVE-pillarDesc">{pillar.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supporting Metrics Card */}
              <div className="MVE-metricsCol">
                <div className="MVE-metricsCard">
                  <div className="MVE-metricsCardHeader">
                    <span className="material-symbols-outlined text-[18px] text-primary" aria-hidden="true">
                      insights
                    </span>
                    <span className="MVE-metricsCardTitle">
                      {activeSide === 'mission'
                        ? 'Operational Benchmarks'
                        : 'Strategic Outlook'}
                    </span>
                  </div>

                  <div className="MVE-metricsList">
                    {currentContent.impactMetrics.map((metric, idx) => (
                      <div key={idx} className="MVE-metricRow">
                        <span className="MVE-metricVal">{metric.value}</span>
                        <span className="MVE-metricLbl">{metric.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="MVE-metricsFooterNote">
                    <span className="material-symbols-outlined text-[15px] text-tertiary" aria-hidden="true">
                      verified
                    </span>
                    <span>Direct engagement model — zero candidate placement cut</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ============================================================ */}
        {/* Scroll-Based Visual Progression Line: PURPOSE -> ACTION -> IMPACT */}
        {/* ============================================================ */}
        <div
          ref={milestonesRef}
          className="MVE-milestonesSection"
          aria-label="Organizational Journey: Purpose to Action to Impact"
        >
          <div className="MVE-milestonesHeader">
            <span className="MVE-milestonesCaption">THE STRATEGIC CONTINUUM</span>
            <h3 className="MVE-milestonesTitle">From Conviction to Measurable Outcome</h3>
          </div>

          <div className="MVE-milestonesTrackWrapper">
            {/* Visual connecting rail */}
            <div className="MVE-milestonesRail" aria-hidden="true">
              <div
                className="MVE-milestonesRailProgress"
                style={{
                  width: `${(activeMilestone / (MILESTONES.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Three Milestones */}
            <div className="MVE-milestonesGrid">
              {MILESTONES.map((item, index) => {
                const isActive = activeMilestone === index;
                const isPassed = activeMilestone >= index;

                return (
                  <div
                    key={item.id}
                    className={`MVE-milestoneItem ${isActive ? 'is-active' : ''} ${
                      isPassed ? 'is-passed' : ''
                    }`}
                    onClick={() => setActiveMilestone(index)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Milestone ${item.step}: ${item.label} — ${item.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setActiveMilestone(index);
                      }
                    }}
                  >
                    <div className="MVE-milestoneNode">
                      <span className="MVE-milestoneNodeInner">
                        <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                          {item.icon}
                        </span>
                      </span>
                    </div>

                    <div className="MVE-milestoneContent">
                      <div className="MVE-milestoneLabelGroup">
                        <span className="MVE-milestoneStep">{item.step}</span>
                        <span className="MVE-milestoneLabel">{item.label}</span>
                      </div>
                      <h4 className="MVE-milestoneTitle">{item.title}</h4>
                      <p className="MVE-milestoneDesc">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionExperience;
