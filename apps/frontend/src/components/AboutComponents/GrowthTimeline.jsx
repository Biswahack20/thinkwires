import React from 'react';
import SectionBadge from '../common/SectionBadge';

const GrowthTimeline = ({ data }) => {
  const {
    eyebrow = 'CHRONICLE OF EXECUTION',
    heading = 'Our Growth Evolution',
    description = 'From an agile aggregator in Sector 63, Noida to a cross-continental staffing architecture powering Fortune 500 engineering initiatives.',
    milestones = []
  } = data || {};

  return (
    <section className="GrowthTimeline-section">
      <div className="GrowthTimeline-container">
        {/* Header */}
        <div className="GrowthTimeline-header">
          <SectionBadge 
            text={eyebrow}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            }
          />
          <h2 className="GrowthTimeline-title">{heading}</h2>
          <p className="GrowthTimeline-subtitle">{description}</p>
        </div>

        {/* Milestone Grid */}
        <div className="GrowthTimeline-grid">
          {milestones.map((milestone, idx) => {
            const isHighlight = milestone.variant === 'active' || milestone.variant === 'future';

            return (
              <div
                key={milestone.id || idx}
                className={`GrowthTimeline-card ${isHighlight ? `GrowthTimeline-card--${milestone.variant}` : ''}`}
              >
                <div className="GrowthTimeline-cardHeader">
                  <span className="GrowthTimeline-year">{milestone.year}</span>
                  <span className={`GrowthTimeline-tag GrowthTimeline-tag--${milestone.variant || 'default'}`}>
                    {milestone.tag}
                  </span>
                </div>

                <div className="GrowthTimeline-cardBody">
                  <h3 className="GrowthTimeline-cardTitle">{milestone.title}</h3>
                  <p className="GrowthTimeline-cardDescription">{milestone.description}</p>
                </div>

                <div className="GrowthTimeline-cardFooter">
                  <div className="GrowthTimeline-stepIndicator">
                    <span className="GrowthTimeline-stepDot"></span>
                    <span className="GrowthTimeline-stepLine"></span>
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

export default GrowthTimeline;
