import React from 'react';

const FindTalentHero = ({ data }) => {
  if (!data) return null;
  const { badge, heading, description, slaCards = [] } = data;

  return (
    <section className="FindTalent-heroSection">
      <div className="FindTalent-container">
        {/* Pill Badge */}
        <div className="FindTalent-badgeRow">
          <span className="FindTalent-pillBadge">
            <span className="pulse-dot"></span>
            <span className="badge-text">{badge}</span>
          </span>
        </div>

        {/* Main Grid */}
        <div className="FindTalent-heroGrid">
          <div className="FindTalent-heroContent">
            <h1 className="FindTalent-heroTitle">
              {heading || (
                <>Deploy Pre-Vetted Tech Talent &nbsp;
                  <span className="FindTalent-titleHighlight">High-Velocity Engineering Squads.</span>
                </>
              )}
            </h1>
            <p className="FindTalent-heroDesc">{description}</p>
          </div>

          {/* Right SLA Box */}
          <div className="FindTalent-slaBox">
            <div className="sla-box-header">
              <span className="sla-header-title">
                Enterprise Service Levels
              </span>
              <span className="material-symbols-outlined icon">
                verified_user
              </span>
            </div>

            <div className="sla-items-list">
              {slaCards.map((card, idx) => (
                <div key={idx} className="sla-item">
                  <div className={`sla-item-icon color-${idx}`}>
                    <span className="material-symbols-outlined">
                      {card.icon}
                    </span>
                  </div>
                  <div className="sla-item-text">
                    <span className="sla-item-title">{card.title}</span>
                    <span className="sla-item-desc">{card.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindTalentHero;
