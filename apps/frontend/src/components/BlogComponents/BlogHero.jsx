import React from 'react';

const BlogHero = ({ children }) => {
  return (
    <section className="BlogHero-container">
      <div className="BlogHero-inner blog-container">
        {/* Top Header Bar inside Hero */}
        <div className="BlogHero-topBar">
          <div className="BlogHero-badge">
            <span className="BlogHero-badgePulse" />
            <span>ThinkWires Strategic Intelligence • Vol. 2026 Edition</span>
          </div>

          <div className="BlogHero-peerMeta">
            <span className="BlogHero-peerItem">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Peer-Reviewed Talent Research
            </span>
            <span className="BlogHero-peerDot">•</span>
            <span className="BlogHero-peerItem">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Updated Weekly
            </span>
          </div>
        </div>

        {/* 2-Column Hero Body */}
        <div className="BlogHero-mainGrid">
          {/* Left Column: Headline & Subtitle */}
          <div className="BlogHero-leftCol">
            <h1 className="BlogHero-title">
              Talent &amp; Tech Advisory Insights
            </h1>
            <p className="BlogHero-subtitle">
              Deep-dive analysis on the future of work, AI engineering, global
              capability centers (GCCs), and talent acquisition trends across
              high-growth engineering markets.
            </p>
          </div>

          {/* Right Column: Floating Hiring Index Velocity Card */}
          <div className="BlogHero-rightCol">
            <div className="BlogHero-velocityCard">
              <div className="BlogHero-velocityHeader">
                <span className="BlogHero-velocityLabel">
                  HIRING INDEX VELOCITY
                </span>
                <span className="BlogHero-velocityBadge">+14.8% Q3</span>
              </div>

              <div className="BlogHero-velocityValueRow">
                <span className="BlogHero-velocityValue">125,000+</span>
                <span className="BlogHero-velocitySubLabel">
                  Tech mandates
                  <br />
                  tracked
                </span>
              </div>

              <p className="BlogHero-velocityDescription">
                Aggregated cross-GCC hiring telemetry from Bengaluru, Hyderabad,
                Pune, and NCR hubs.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter Component Container */}
        {children && <div className="BlogHero-filtersSlot">{children}</div>}
      </div>
    </section>
  );
};

export default BlogHero;
