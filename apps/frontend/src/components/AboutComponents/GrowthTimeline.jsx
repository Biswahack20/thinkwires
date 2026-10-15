import React, { useEffect, useRef, useState } from 'react';
import SectionBadge from '../common/SectionBadge';
import MilestoneCard from './MilestoneCard';
import { aboutService } from '../../services/aboutService';

/**
 * GrowthTimeline component
 *
 * Renders a balanced, centered responsive 2x2 milestone grid (2022, 2023, 2024, and 2026+)
 * for ThinkWires Growth & Evolution.
 *
 * Features:
 * - Dynamic data loading from props or fallback aboutService / mockdata.json
 * - Reusable MilestoneCard component
 * - Responsive 2x2 desktop CSS Grid, 1 column on mobile
 * - Staggered entrance animation with prefers-reduced-motion support
 * - Service layer ready for frequent backend updates
 */
const GrowthTimeline = ({ data }) => {
  const [timelineData, setTimelineData] = useState(data || null);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);

  // If data wasn't provided or needs dynamic refresh, fetch via service layer
  useEffect(() => {
    if (data && (data.milestones?.length || data.roadmap?.length)) {
      setTimelineData(data);
      return;
    }

    let isMounted = true;
    aboutService
      .getMilestones()
      .then((res) => {
        if (isMounted && res) {
          setTimelineData((prev) => ({
            ...prev,
            milestones: res.milestones || [],
            roadmap: res.roadmap || [],
          }));
        }
      })
      .catch((err) => {
        console.warn('Failed to load milestones dynamically:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [data]);

  const {
    eyebrow = 'CHRONICLE OF EXECUTION',
    heading = 'Our Growth & Evolution',
    description = 'From an agile aggregator in Sector 63, Noida to a cross-continental staffing architecture powering Fortune 500 engineering initiatives.',
    milestones = [],
    roadmap = [],
  } = timelineData || data || {};

  // Combine milestones and roadmap into one sorted/deduped 4-item milestone list
  const allMilestones = [
    ...milestones,
    ...roadmap.filter((r) => !milestones.some((m) => m.id === r.id)),
  ];

  // Subtle staggered entrance animation with reduced-motion support
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Direct reveal if user prefers reduced motion
    if (prefersReducedMotion) {
      cardRefs.current.forEach((card) => {
        if (card) {
          card.classList.add('MilestoneCard--visible');
        }
      });
      return;
    }

    // Scroll-triggered staggered reveal
    const currentGrid = gridRef.current;
    if (!currentGrid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cardRefs.current.forEach((card, index) => {
              if (card) {
                // Stagger each card by 120ms
                setTimeout(() => {
                  card.classList.add('MilestoneCard--visible');
                }, index * 120);
              }
            });
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(currentGrid);

    return () => {
      observer.disconnect();
    };
  }, [allMilestones.length]);

  return (
    <section
      className="GrowthTimeline-section"
      aria-label="Company Growth Journey and Strategic Roadmap"
      id="growth"
    >
      <div className="GrowthTimeline-container">
        {/* Section Header */}
        <header className="GrowthTimeline-header">
          <SectionBadge
            text={eyebrow}
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          />
          <h2 className="GrowthTimeline-title">{heading}</h2>
          <p className="GrowthTimeline-subtitle">{description}</p>
        </header>

        {/* Balanced Centered 2x2 Milestone Grid */}
        <div
          ref={gridRef}
          className="GrowthTimeline-milestoneGrid"
          role="list"
          aria-label="Milestones 2022 to 2026+"
        >
          {allMilestones.map((item, idx) => (
            <div
              key={item.id || item.year || idx}
              ref={(el) => (cardRefs.current[idx] = el)}
              className="GrowthTimeline-gridCell"
              role="listitem"
            >
              <MilestoneCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GrowthTimeline;
