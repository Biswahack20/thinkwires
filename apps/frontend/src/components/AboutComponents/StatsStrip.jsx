import React from 'react';
import AnimatedCounter from '../common/AnimatedCounter';
import ScrollReveal from '../common/ScrollReveal';

const StatsStrip = ({ stats = [] }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <section
      className="StatsStrip-section"
      aria-label="Key Performance Metrics"
    >
      <div className="StatsStrip-container">
        <ScrollReveal direction="up" distance={40}>
          <div className="StatsStrip-card">
            {stats.map((item, index) => {
              const suffix = item.unit
                ? ` ${item.unit}`
                : item.value && item.value.includes('+')
                  ? '+'
                  : item.value && item.value.includes('%')
                    ? '%'
                    : '';

              return (
                <div key={item.id || index} className="StatsStrip-item">
                  <div className="StatsStrip-topRow">
                    <span className="StatsStrip-value">
                      <AnimatedCounter
                        value={item.numericValue || item.value}
                        suffix={suffix}
                        duration={1600}
                      />
                    </span>

                    {item.indicator === 'dot' && (
                      <span
                        className="StatsStrip-indicatorDot"
                        title="Real-time intake SLA"
                        aria-label="Real-time intake SLA"
                      ></span>
                    )}
                    {item.indicator === 'check' && (
                      <span
                        className="StatsStrip-indicatorIcon"
                        title="Verified Time-to-Hire"
                        aria-label="Verified Time-to-Hire"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                    )}
                    {item.indicator === 'shield' && (
                      <span
                        className="StatsStrip-indicatorIcon shield"
                        title="100% Statutory Compliance"
                        aria-label="100% Statutory Compliance"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      </span>
                    )}
                  </div>

                  <div className="StatsStrip-label">{item.label}</div>
                  <div className="StatsStrip-subLabel">{item.subLabel}</div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default StatsStrip;
