import React from 'react';

const PermStaffHero = ({ data }) => {
  if (!data) return null;
  const {
    badge,
    heading,
    description,
    ctaSearchText,
    ctaRolesText,
    proofStats = [],
  } = data;

  return (
    <section className="PermStaff-heroSection">
      <div className="PermStaff-ambientGlow"></div>
      <div className="PermStaff-container">
        <div className="PermStaff-heroCenter">
          {/* Top Executive Badge */}
          <div className="PermStaff-topBadge">
            <span className="pulse-dot"></span>
            <span>{badge}</span>
          </div>

          {/* Main Headline & Description */}
          <h1 className="PermStaff-headline">{heading}</h1>
          <p className="PermStaff-desc">{description}</p>

          {/* CTAs */}
          <div className="PermStaff-heroCtas">
            <a href="#consultation-booking" className="PermStaff-btnPrimary">
              <span className="material-symbols-outlined">handshake</span>
              <span>{ctaSearchText || 'Initiate Executive Search'}</span>
            </a>
            <a href="#specialized-roles" className="PermStaff-btnSecondary">
              <span className="material-symbols-outlined">analytics</span>
              <span>{ctaRolesText || 'View Placement Track Record'}</span>
            </a>
          </div>

          {/* Executive Proof Stats Bar */}
          <div className="PermStaff-proofStatsGrid">
            {proofStats.map((stat, idx) => (
              <div key={idx} className="PermStaff-proofStatCard">
                <div className={`icon-box ${stat.color || 'primary'}`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <div className="stat-meta">
                  <div className="stat-val">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PermStaffHero;
