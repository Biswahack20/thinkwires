import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStats } from '../../store/slices/homeSlice';
import AnimatedCounter from '../common/AnimatedCounter';

const TIMELINE_DATA = [
  {
    year: '2022',
    threshold: 0.12,
    phase: 'PHASE 01 • INCEPTION',
    title: 'The Beginning',
    desc: 'Founded with the vision that tech talent knows no borders. Elite technical recruitment core established in Noida with specialized SAP and Cloud focus.',
    tag: 'Core Pods Built',
    metric: '100% Client Retention',
  },
  {
    year: '2023',
    threshold: 0.38,
    phase: 'PHASE 02 • SCALE',
    title: 'Growth Phase',
    desc: 'Break-even accelerated through alignment of specialized SAP & Cloud technical pods with tier-1 enterprise accounts across metropolitan tech hubs.',
    tag: 'Tier-1 Accounts',
    metric: '48h Deployment SLA',
  },
  {
    year: '2024',
    threshold: 0.65,
    phase: 'PHASE 03 • GLOBAL EXPANSION',
    title: 'Global Expansion',
    desc: 'Launched bilateral cross-border US & Canada talent corridors, establishing comprehensive Employer of Record (EOR) and cross-currency payroll frameworks.',
    tag: 'Cross-Border EOR',
    metric: 'Direct Corridors Active',
  },
  {
    year: '2025+',
    threshold: 0.88,
    phase: 'PHASE 04 • INNOVATION LEADER',
    title: 'Innovation Leader',
    desc: 'Pioneering AI-driven automated vetting pipelines, predictive bench matching, and statutory multi-currency talent infrastructure for Fortune 500 enterprises.',
    tag: 'Autonomous AI Vetting',
    metric: 'Next-Gen Infrastructure',
  },
];

const StatsJourney = () => {
  const dispatch = useDispatch();
  const { stats, status } = useSelector((state) => state.home);
  const spineRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (status.stats === 'idle') {
      dispatch(fetchStats());
    }
  }, [dispatch, status.stats]);

  // Track scroll progress along the timeline spine
  useEffect(() => {
    let rafId;

    const handleScroll = () => {
      if (!spineRef.current) return;
      const rect = spineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start illuminating when top enters viewport mid-screen, complete near bottom
      const startTrigger = windowHeight * 0.75;
      const endTrigger = windowHeight * 0.35;
      const totalDistance = rect.height;
      const currentPos = startTrigger - rect.top;

      const progress = Math.max(0, Math.min(1, currentPos / (totalDistance + (startTrigger - endTrigger))));
      setScrollProgress(progress);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial calculation after render
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="StatsJourney-section" id="journey">
      <div className="StatsJourney-container">
        {/* Kinetic Telemetry Odometer Grid */}
        <div className="StatsJourney-statsGrid">
          <div className="StatsJourney-statCard tw-telemetry-box">
            <div className="StatsJourney-telemetryStatus">
              <span className="tw-radar-dot"></span>
              <span>LIVE TELEMETRY</span>
            </div>
            <div className="StatsJourney-statValue">
              <AnimatedCounter value={stats?.jobsFilled || 130} suffix="+" duration={1800} />
            </div>
            <h4 className="StatsJourney-statTitle">HOT TECH JOBS FILLED</h4>
            <p className="StatsJourney-statDesc">
              Across Tier-1 IT &amp; Product Firms
            </p>
          </div>

          <div className="StatsJourney-statCard tw-telemetry-box">
            <div className="StatsJourney-telemetryStatus">
              <span className="tw-radar-dot"></span>
              <span>LIVE TELEMETRY</span>
            </div>
            <div className="StatsJourney-statValue">
              <AnimatedCounter value={stats?.corePlacements || 55} suffix="+" duration={1800} />
            </div>
            <h4 className="StatsJourney-statTitle">ON-ROLL CORE PLACEMENTS</h4>
            <p className="StatsJourney-statDesc">
              Full-time permanent engineering leaders
            </p>
          </div>

          <div className="StatsJourney-statCard tw-telemetry-box">
            <div className="StatsJourney-telemetryStatus">
              <span className="tw-radar-dot"></span>
              <span>LIVE TELEMETRY</span>
            </div>
            <div className="StatsJourney-statValue">
              <AnimatedCounter value={stats?.contingentHired || 125} suffix="+" duration={1800} />
            </div>
            <h4 className="StatsJourney-statTitle">TOTAL CONTINGENT HIRED</h4>
            <p className="StatsJourney-statDesc">
              Deployed in agile enterprise squads
            </p>
          </div>

          <div className="StatsJourney-statCard tw-telemetry-box">
            <div className="StatsJourney-telemetryStatus">
              <span className="tw-radar-dot"></span>
              <span>LIVE TELEMETRY</span>
            </div>
            <div className="StatsJourney-statValue">
              <AnimatedCounter value={stats?.clientRetention || 95} suffix="%" duration={1800} />
            </div>
            <h4 className="StatsJourney-statTitle">CLIENT RETENTION RATE</h4>
            <p className="StatsJourney-statDesc">
              Repeat multi-quarter staffing engagements
            </p>
          </div>
        </div>

        {/* Timeline Header */}
        <div className="StatsJourney-timelineHeader">
          <span className="StatsJourney-timelineTag">OUR JOURNEY</span>
          <h2 className="StatsJourney-timelineTitle">
            Milestones of Exponential Growth
          </h2>
          <p className="StatsJourney-timelineDesc">
            From visionary inception in Noida to an international tech workforce catalyst.
          </p>
        </div>

        {/* Interactive Circuit Trace & Progress Spine */}
        <div ref={spineRef} className="StatsJourney-spineSection">
          {/* Vertical Circuit Line Track */}
          <div className="StatsJourney-spineLineTrack">
            {/* Active Illuminating Electric Wire */}
            <div
              className="StatsJourney-spineLineActive"
              style={{ height: `${scrollProgress * 100}%` }}
            >
              {/* Traveling Electric Spark */}
              {scrollProgress > 0.02 && scrollProgress < 0.99 && (
                <div className="StatsJourney-spineSpark" />
              )}
            </div>
          </div>

          {/* Timeline Rows with Junction Nodes */}
          {TIMELINE_DATA.map((item, index) => {
            const isReached = scrollProgress >= item.threshold;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={item.year}
                className={`StatsJourney-spineRow ${isLeft ? 'is-left' : 'is-right'}`}
              >
                {/* Milestone Node on the Spine */}
                <div className={`StatsJourney-spineNode ${isReached ? 'is-active' : ''}`}>
                  <div className="StatsJourney-spineNodeDot" />
                  {isReached && <span className="tw-radar-dot" style={{ position: 'absolute' }} />}
                </div>

                {/* Milestone Content Card */}
                <div className={`StatsJourney-spineCard ${isReached ? 'is-active' : ''}`}>
                  <div className="StatsJourney-cardGlowCorner" />

                  {/* Header: Phase badge & Year */}
                  <div className="StatsJourney-cardHeader">
                    <span className="StatsJourney-phaseBadge">
                      {item.phase}
                    </span>
                    <span className="StatsJourney-cardYear">
                      {item.year}
                    </span>
                  </div>

                  <h3 className="StatsJourney-timelineCardTitle">
                    {item.title}
                  </h3>
                  <p className="StatsJourney-timelineCardDesc">
                    {item.desc}
                  </p>

                  {/* Footer tags without emojis */}
                  <div className="StatsJourney-cardFooter">
                    <span className="StatsJourney-metricPill StatsJourney-metricPillPrimary">
                      <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#38bdf8' }}>
                        bolt
                      </span>
                      <span>{item.tag}</span>
                    </span>
                    <span className="StatsJourney-metricPill StatsJourney-metricPillSuccess">
                      <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#34d399' }}>
                        verified
                      </span>
                      <span>{item.metric}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsJourney;
