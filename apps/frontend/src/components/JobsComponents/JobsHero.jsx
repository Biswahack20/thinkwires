import React from 'react';

const JobsHero = ({ children }) => {
  return (
    <section className="JobsHero-heroContainer">
      <div className="JobsHero-contentWrapper">
        {/* Glowing Top Badge */}
        <div className="JobsHero-topBadge">
          <span className="JobsHero-pulseDot"></span>
          <span className="JobsHero-topBadgeText">
            🚀 DIRECT CLIENT ENGINEERING OPENINGS • Updated Today
          </span>
        </div>

        {/* Main Title */}
        <h1 className="JobsHero-mainTitle">
          Available Jobs & High-Growth <br />
          <span className="JobsHero-gradientText">Tech Careers at ThinkWires</span>
        </h1>

        {/* Subtitle */}
        <p className="JobsHero-subHeading">
          Connecting premier engineers and enterprise leaders across India, US, and Canada. 
          125+ Active Openings across Tier-1 Tech Stacks with top product enterprises and global unicorns.
        </p>

        {/* Value Pills Bar */}
        <div className="JobsHero-valuePillsRow">
          <div className="JobsHero-valuePill">
            <span className="JobsHero-pillIconGreen">✓</span>
            <span>Direct Client Hiring</span>
          </div>
          <div className="JobsHero-valuePill">
            <span className="JobsHero-pillIconBlue">💼</span>
            <span>Zero Placement Cut</span>
          </div>
          <div className="JobsHero-valuePill">
            <span className="JobsHero-pillIconYellow">⚡</span>
            <span>Fast 48-Hour Interview Turnaround</span>
          </div>
        </div>

        {/* Slot for Floating Search Bar Component */}
        {children && <div className="JobsHero-searchSlot">{children}</div>}
      </div>
    </section>
  );
};

export default JobsHero;
