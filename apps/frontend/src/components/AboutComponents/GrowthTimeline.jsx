import React from 'react';
import SectionBadge from '../common/SectionBadge';
import ScrollReveal from '../common/ScrollReveal';

const DEFAULT_MILESTONES = [
  {
    id: 'timeline-2022',
    year: '2022',
    tag: 'Founding',
    title: 'The Inception',
    description:
      'Founded in Noida with a core team dedicated to borderless recruitment, pioneering an agency aggregator network that delivers verified profiles in under 5 hours.',
    variant: 'default'
  },
  {
    id: 'timeline-2023',
    year: '2023',
    tag: 'Market Fit',
    title: 'Growth & Practice Alignment',
    description:
      'Unit economics break-even achieved. Launched specialized talent practices across SAP ABAP/HANA, Cloud/DevOps, and Enterprise Salesforce consulting.',
    variant: 'default'
  },
  {
    id: 'timeline-2024',
    year: '2024',
    tag: 'International',
    title: 'Cross-Border Expansion',
    description:
      'Inaugurated dedicated talent corridors into the United States and Canada. Rolled out comprehensive Employer of Record (EOR) and global payroll management.',
    variant: 'cobalt'
  },
  {
    id: 'timeline-2026',
    year: '2026+',
    tag: 'Next Era',
    title: 'AI-Powered Delivery',
    description:
      'Automated code telemetry vetting, generative talent search matching, and sub-48-hour global deployment pipelines across AI and PLM systems.',
    variant: 'dark-emerald'
  }
];

const GrowthTimeline = ({ data }) => {
  const {
    eyebrow = 'CHRONICLE OF EXECUTION',
    heading = 'Our Growth Evolution',
    description = 'From an agile aggregator in Sector 63, Noida to a cross-continental staffing architecture powering Fortune 500 engineering initiatives.',
    milestones = [],
    roadmap = []
  } = data || {};

  // If incoming data has milestones and roadmap, combine or fallback to Stitch default
  const sourceList = (milestones.length > 0 || roadmap.length > 0)
    ? [...milestones, ...roadmap].slice(0, 4)
    : DEFAULT_MILESTONES;

  const resolvedList = DEFAULT_MILESTONES.map((def, idx) => {
    const item = sourceList[idx] || {};
    return {
      ...def,
      ...item,
      year: item.year || def.year,
      tag: item.tag || def.tag,
      title: item.title || def.title,
      description: item.description || def.description,
      variant: idx === 3 ? 'dark-emerald' : idx === 2 ? 'cobalt' : 'default'
    };
  });

  return (
    <section
      className="GrowthTimeline-section"
      aria-label="Chronicle of Execution - Our Growth Evolution"
      id="growth"
    >
      <div className="GrowthTimeline-container">
        {/* Section Header */}
        <header className="GrowthTimeline-header">
          <SectionBadge
            text={eyebrow}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          />
          <h2 className="GrowthTimeline-title">{heading}</h2>
          <p className="GrowthTimeline-subtitle">{description}</p>
        </header>

        {/* 4 Horizontal Cards Grid matching Stitch */}
        <div className="GrowthTimeline-grid">
          {resolvedList.map((item, idx) => {
            const isDarkCard = item.variant === 'dark-emerald';
            const isCobalt = item.variant === 'cobalt';

            return (
              <ScrollReveal
                key={item.id || idx}
                direction="up"
                delay={idx * 0.08}
                distance={35}
                style={{ display: 'flex' }}
              >
                <div
                  className={`GrowthTimeline-card ${isDarkCard ? 'GrowthTimeline-card--dark' : ''}`}
                  style={{ width: '100%' }}
                >
                  {/* Card Top: Year & Tag */}
                  <div className="GrowthTimeline-cardTop">
                    <span
                      className={`GrowthTimeline-year ${
                        isDarkCard
                          ? 'GrowthTimeline-year--emerald'
                          : isCobalt
                          ? 'GrowthTimeline-year--cobalt'
                          : 'GrowthTimeline-year--muted'
                      }`}
                    >
                      {item.year}
                    </span>

                    <span
                      className={`GrowthTimeline-tag ${
                        isDarkCard
                          ? 'GrowthTimeline-tag--emerald'
                          : isCobalt
                          ? 'GrowthTimeline-tag--cobalt'
                          : 'GrowthTimeline-tag--default'
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className={`GrowthTimeline-cardTitle ${isDarkCard ? 'text-white' : ''}`}>
                    {item.title}
                  </h3>
                  <p className={`GrowthTimeline-cardDesc ${isDarkCard ? 'text-slate-300' : ''}`}>
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GrowthTimeline;
