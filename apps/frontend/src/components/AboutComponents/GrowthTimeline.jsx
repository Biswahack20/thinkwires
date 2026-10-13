import React from 'react';
import SectionBadge from '../common/SectionBadge';

const GrowthTimeline = ({ data }) => {
  const {
    eyebrow = 'CHRONICLE OF EXECUTION',
    heading = 'Our Growth Journey',
    description = 'From an agile aggregator in Sector 63, Noida to a cross-continental staffing architecture powering Fortune 500 engineering initiatives.',
    milestones = [],
    roadmap = []
  } = data || {};

  // Separate completed/historical milestones (2022, 2023, 2024) from future roadmap
  const pastMilestones = milestones.filter(m => m.status === 'completed' || !String(m.year).includes('+'));
  const futureRoadmap = roadmap.length > 0 ? roadmap : milestones.filter(m => m.status === 'planned' || String(m.year).includes('+'));

  return (
    <section className="GrowthTimeline-section" aria-label="Company Growth Journey and Strategic Roadmap">
      <div className="GrowthTimeline-container">
        {/* Header */}
        <div className="GrowthTimeline-header">
          <SectionBadge 
            text={eyebrow}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            }
          />
          <h2 className="GrowthTimeline-title">{heading}</h2>
          <p className="GrowthTimeline-subtitle">{description}</p>
        </div>

        {/* Desktop Single-Row 3-Card Timeline (2022 -- 2023 -- 2024) */}
        <div className="GrowthTimeline-trackWrapper">
          {/* Continuous Connecting Line Behind Nodes */}
          <div className="GrowthTimeline-connectorLine" aria-hidden="true"></div>

          <div className="GrowthTimeline-gridThree">
            {pastMilestones.map((item, idx) => (
              <div key={item.id || idx} className="GrowthTimeline-colItem">
                {/* Milestone Node on Timeline */}
                <div className="GrowthTimeline-nodeMarker">
                  <div className="GrowthTimeline-nodeDot"></div>
                  <span className="GrowthTimeline-nodeYear">{item.year}</span>
                </div>

                {/* Milestone Card */}
                <div className="GrowthTimeline-card">
                  <div className="GrowthTimeline-cardHeader">
                    <span className="GrowthTimeline-tag">{item.tag}</span>
                    <span className="GrowthTimeline-statusBadge">Achieved</span>
                  </div>
                  <h3 className="GrowthTimeline-cardTitle">{item.title}</h3>
                  <p className="GrowthTimeline-cardDesc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Future Strategic Roadmap (2026+) */}
        {futureRoadmap && futureRoadmap.length > 0 && (
          <div className="GrowthTimeline-roadmapCompact">
            {futureRoadmap.map((item, idx) => (
              <div key={item.id || idx} className="GrowthTimeline-roadmapRow">
                {/* Left Column: 2026+ and Label */}
                <div className="GrowthTimeline-roadmapLeft">
                  <span className="GrowthTimeline-roadmapYearBadge">{item.year || item.timeframe}</span>
                  <h4 className="GrowthTimeline-roadmapHeading">Future Horizons &amp; R&amp;D Pipeline</h4>
                </div>

                {/* Right Column: Title, Description, and Status */}
                <div className="GrowthTimeline-roadmapRight">
                  <div className="GrowthTimeline-roadmapRightHeader">
                    <h5 className="GrowthTimeline-roadmapTitle">{item.title}</h5>
                    <span className="GrowthTimeline-roadmapPlannedChip">Planned Initiative</span>
                  </div>
                  <p className="GrowthTimeline-roadmapDesc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GrowthTimeline;
