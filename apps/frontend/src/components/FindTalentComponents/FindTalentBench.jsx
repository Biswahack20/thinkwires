import React from 'react';

const FindTalentBench = ({ talents = [] }) => {
  if (!talents || talents.length === 0) return null;

  return (
    <section className="FindTalent-benchSection">
      <div className="FindTalent-container">
        {/* Header Bar */}
        <div className="FindTalent-benchHeader">
          <div>
            <div className="live-pill">
              <span className="live-dot"></span>
              <span className="live-text">Live Technical Inventory</span>
            </div>
            <h2 className="FindTalent-sectionTitle">Active Talent Bench Ready For Immediate Deployment</h2>
            <p className="FindTalent-sectionSubtitle">
              Pre-evaluated, code-screened senior engineers ready for initial round interviews within 24 to 48 hours.
            </p>
          </div>

          <a href="#talent-intake-form" className="FindTalent-btnBenchAction">
            <span>Request Custom Bench Dossiers</span>
            <span className="material-symbols-outlined">east</span>
          </a>
        </div>

        {/* 4 Cards in a Row on Desktop */}
        <div className="FindTalent-benchGrid">
          {talents.map((engineer) => (
            <div key={engineer.id} className="FindTalent-benchCard">
              <div className="card-top">
                <div className="status-row">
                  <span className="status-badge">
                    <span className="badge-dot"></span>
                    {engineer.statusBadge}
                  </span>
                  <span className="card-code">{engineer.id}</span>
                </div>

                <div className="avatar-row">
                  <img src={engineer.avatar} alt={engineer.role} className="avatar-img" />
                  <div className="role-meta">
                    <h3 className="role-title">{engineer.role}</h3>
                    <span className="role-tech">{engineer.tech}</span>
                  </div>
                </div>

                <div className="details-list">
                  <div className="detail-row">
                    <span className="material-symbols-outlined icon">work_history</span>
                    <span>{engineer.experience}</span>
                  </div>
                  <div className="detail-row">
                    <span className="material-symbols-outlined icon">location_on</span>
                    <span>{engineer.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="material-symbols-outlined icon">payments</span>
                    <span>{engineer.rate}</span>
                  </div>
                </div>

                <div className="tags-row">
                  {engineer.tags?.map((t, idx) => (
                    <span key={idx} className="tag-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card-bottom">
                <a href="#talent-intake-form" className="btn-schedule">
                  Schedule 48h Interview
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FindTalentBench;
