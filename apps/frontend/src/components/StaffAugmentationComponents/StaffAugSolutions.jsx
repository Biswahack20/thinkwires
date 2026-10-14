import React from 'react';

const StaffAugSolutions = ({ data }) => {
  if (!data) return null;
  const { eyebrow, heading, description, pillars = [], spotlight = {} } = data;

  return (
    <section className="StaffAug-solutionsSection">
      <div className="StaffAug-container">
        {/* Header */}
        <div className="StaffAug-sectionHeader">
          <span className="StaffAug-eyebrow primary">{eyebrow}</span>
          <h2 className="StaffAug-title">{heading}</h2>
          <p className="StaffAug-desc">{description}</p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="StaffAug-pillarsGrid">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="StaffAug-pillarCard">
              <div className="pillar-body">
                <div className="pillar-icon">
                  <span className="material-symbols-outlined">{pillar.icon}</span>
                </div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-desc">{pillar.description}</p>
              </div>
              <div className="pillar-footer">
                <span>{pillar.footerKey}</span>
                <span className="val">{pillar.footerVal}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Spotlight Banner: People4People + ThinkWires Workforce Governance */}
        {spotlight && spotlight.title && (
          <div className="StaffAug-spotlightBanner">
            <div className="StaffAug-spotlightGlow"></div>
            <div className="StaffAug-spotlightGrid">
              <div className="StaffAug-spotlightContent">
                <div className="StaffAug-spotlightBadge">
                  <span className="material-symbols-outlined">verified</span>
                  <span>{spotlight.badge}</span>
                </div>
                <h3 className="StaffAug-spotlightTitle">{spotlight.title}</h3>
                <p className="StaffAug-spotlightDesc">{spotlight.description}</p>

                <div className="StaffAug-spotlightBullets">
                  {(spotlight.bullets || []).map((bullet, i) => (
                    <div key={i} className="bullet-item">
                      <span className="material-symbols-outlined">check_circle</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="StaffAug-spotlightCardCol">
                <div className="StaffAug-governanceCard">
                  <div className="card-header">Managed Governance</div>
                  <div className="card-metrics">
                    {(spotlight.metrics || []).map((metric, i) => (
                      <div key={i} className="metric-row">
                        <span>{metric.label}</span>
                        <span className="val">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                  <a href="#consultation-form" className="card-btn">
                    Request Pod Proposal
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StaffAugSolutions;
