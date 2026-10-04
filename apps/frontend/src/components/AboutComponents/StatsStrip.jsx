import React from 'react';

const StatsStrip = ({ stats = [] }) => {
  return (
    <section className="StatsStrip-section">
      <div className="StatsStrip-container">
        <div className="StatsStrip-card">
          {stats.map((item, index) => (
            <div key={item.id || index} className="StatsStrip-item">
              <div className="StatsStrip-topRow">
                <span className="StatsStrip-value">
                  {item.value}
                  {item.unit && <span className="StatsStrip-unit">{item.unit}</span>}
                </span>

                {item.indicator === 'dot' && (
                  <span className="StatsStrip-indicatorDot" title="Real-time metric"></span>
                )}
                {item.indicator === 'check' && (
                  <span className="StatsStrip-indicatorIcon" title="Verified SLA">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                )}
                {item.indicator === 'shield' && (
                  <span className="StatsStrip-indicatorIcon shield" title="100% Compliant">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </span>
                )}
              </div>

              <div className="StatsStrip-label">{item.label}</div>
              <div className="StatsStrip-subLabel">{item.subLabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
