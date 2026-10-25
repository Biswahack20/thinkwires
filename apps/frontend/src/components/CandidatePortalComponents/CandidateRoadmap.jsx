import React from 'react';

const CandidateRoadmap = ({ stages = [] }) => {
  return (
    <div className="CandidatePortal-cardSection">
      <div className="section-header-bar">
        <div>
          <span className="eyebrow-accent">Thinkwires Enterprise Protocol</span>
          <h2 className="section-main-title">
            Candidate Syndication &amp; Vetting Roadmap
          </h2>
        </div>
        <span className="status-tag">
          Current Position: Active Bench Phase (Stage 3)
        </span>
      </div>

      {/* 4 Cards in a Row on Desktop */}
      <div className="CandidatePortal-roadmapGrid">
        {stages.map((st) => (
          <div
            key={st.stage}
            className={`roadmap-card ${st.isActive ? 'active-card' : ''} ${st.isDone ? 'done-card' : ''}`}
          >
            <div className="card-top">
              <span className="stage-num-badge">
                {st.isDone ? (
                  <span className="material-symbols-outlined check-icon">
                    check
                  </span>
                ) : (
                  st.stage
                )}
              </span>
              <span className="stage-status-pill">
                {st.isActive ? 'ACTIVE NOW' : `STAGE ${st.stage}`}
              </span>
            </div>

            <div className="card-middle">
              <h3 className="stage-heading">{st.title}</h3>
              <p className="stage-description">{st.desc}</p>
            </div>

            <div className="card-bottom">
              <span className="material-symbols-outlined status-icon">
                {st.isDone ? 'lock' : st.isActive ? 'visibility' : 'sync'}
              </span>
              <span className="status-label">{st.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateRoadmap;
