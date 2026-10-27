import React from 'react';
import ScrollReveal from '../common/ScrollReveal';
import AnimatedCounter from '../common/AnimatedCounter';

const StaffAugSolutions = ({ data }) => {
  if (!data) return null;
  const { eyebrow, heading, description, pillars = [], spotlight = {} } = data;

  return (
    <section className="StaffAug-solutionsSection">
      <div className="StaffAug-container">
        {/* Header */}
        <ScrollReveal
          direction="up"
          distance={40}
          className="StaffAug-sectionHeader"
        >
          <span className="StaffAug-eyebrow primary">{eyebrow}</span>
          <h2 className="StaffAug-title">{heading}</h2>
          <p className="StaffAug-desc">{description}</p>
        </ScrollReveal>

        {/* 3 Pillars Grid */}
        <div className="StaffAug-pillarsGrid">
          {pillars.map((pillar, idx) => (
            <ScrollReveal
              key={idx}
              direction={idx % 2 === 0 ? 'left' : 'right'}
              delay={idx * 0.1}
              distance={60}
              style={{ display: 'flex' }}
            >
              <div className="StaffAug-pillarCard" style={{ width: '100%' }}>
                <div className="pillar-body">
                  <div className="pillar-icon">
                    <span className="material-symbols-outlined">
                      {pillar.icon}
                    </span>
                  </div>
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <p className="pillar-desc">{pillar.description}</p>
                </div>
                <div className="pillar-footer">
                  <span>{pillar.footerKey}</span>
                  <span className="val">{pillar.footerVal}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Spotlight Banner: People4People + Thinkwires Workforce Governance */}
        {spotlight && spotlight.title && (
          <ScrollReveal direction="up" distance={60}>
            <div className="StaffAug-spotlightBanner">
              <div className="StaffAug-spotlightGlow"></div>
              <div className="StaffAug-spotlightGrid">
                <div className="StaffAug-spotlightContent">
                  <div className="StaffAug-spotlightBadge">
                    <span className="material-symbols-outlined">verified</span>
                    <span>{spotlight.badge}</span>
                  </div>
                  <h3 className="StaffAug-spotlightTitle">{spotlight.title}</h3>
                  <p className="StaffAug-spotlightDesc">
                    {spotlight.description}
                  </p>

                  <div className="StaffAug-spotlightBullets">
                    {(spotlight.bullets || []).map((bullet, i) => (
                      <div key={i} className="bullet-item">
                        <span className="material-symbols-outlined">
                          check_circle
                        </span>
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
                          <span className="val">
                            <AnimatedCounter
                              value={metric.value}
                              duration={1600}
                            />
                          </span>
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
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default StaffAugSolutions;
