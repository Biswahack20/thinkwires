import React from 'react';

const CandidateMetrics = ({ metrics = [] }) => {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="CandidatePortal-metricsGrid">
      {metrics.map((m) => (
        <div
          key={m.id}
          className={`CandidatePortal-metricCard ${m.isHighlight ? 'highlight-card' : ''}`}
        >
          <div className="card-header">
            <span className="card-label">{m.title}</span>
            <div className={`card-icon-wrap icon-${m.id}`}>
              <span className="material-symbols-outlined">{m.icon}</span>
            </div>
          </div>

          <div className="card-body">
            <div className="stat-unit-row">
              <span className="stat-val">{m.stat}</span>
              {m.unit && <span className="stat-unit">{m.unit}</span>}
            </div>
            <span className="stat-subtext">{m.subtext}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidateMetrics;
