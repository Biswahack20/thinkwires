import React from 'react';

const PermStaffPillars = ({ data }) => {
  if (!data) return null;
  const { eyebrow, heading, description, slaBadge, items = [] } = data;

  return (
    <section className="PermStaff-pillarsSection">
      <div className="PermStaff-container">
        {/* Section Header Row */}
        <div className="PermStaff-pillarsHeaderRow">
          <div className="header-text">
            <span className="PermStaff-eyebrow primary">{eyebrow}</span>
            <h2 className="PermStaff-title">{heading}</h2>
            <p className="PermStaff-desc">{description}</p>
          </div>
          {slaBadge && (
            <div className="PermStaff-slaBadge">
              <span className="material-symbols-outlined">gavel</span>
              <span>{slaBadge}</span>
            </div>
          )}
        </div>

        {/* 4 Core Pillars Grid (4 in a row on desktop) */}
        <div className="PermStaff-pillarsGrid">
          {items.map((pillar, idx) => (
            <div key={idx} className="PermStaff-pillarCard">
              <div className="pillar-top">
                <div className="pillar-header-row">
                  <div className={`pillar-icon-box ${pillar.accent || 'primary'}`}>
                    <span className="material-symbols-outlined">{pillar.icon}</span>
                  </div>
                  <span className="pillar-step-tag">{pillar.step}</span>
                </div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-desc">{pillar.description}</p>
              </div>

              <ul className="pillar-points">
                {(pillar.points || []).map((pt, pIdx) => (
                  <li key={pIdx}>
                    <span className="material-symbols-outlined">check_circle</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PermStaffPillars;
