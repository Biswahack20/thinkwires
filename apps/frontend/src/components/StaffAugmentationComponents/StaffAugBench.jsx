import React from 'react';

const StaffAugBench = ({ data }) => {
  if (!data) return null;
  const { eyebrow, heading, description, activeCount, engineers = [] } = data;

  return (
    <section className="StaffAug-benchSection" id="bench-pool">
      <div className="StaffAug-container">
        <div className="StaffAug-benchHeaderRow">
          <div>
            <span className="StaffAug-eyebrow primary">{eyebrow}</span>
            <h2 className="StaffAug-title">{heading}</h2>
            <p className="StaffAug-desc">{description}</p>
          </div>
          {activeCount && (
            <div className="StaffAug-benchLiveBadge">
              <span className="ping-dot"></span>
              <span>{activeCount}</span>
            </div>
          )}
        </div>

        <div className="StaffAug-benchGrid">
          {engineers.map((eng, idx) => (
            <div key={idx} className="StaffAug-engineerCard">
              <div>
                <div className="card-top-row">
                  <div className="avatar-meta">
                    <div className="avatar-box">{eng.initials}</div>
                    <div>
                      <h4 className="role-title">{eng.role}</h4>
                      <p className="role-stack">{eng.stack}</p>
                    </div>
                  </div>
                  <span className="sla-pill">
                    <span className="dot"></span> {eng.sla}
                  </span>
                </div>

                <div className="meta-stats-grid">
                  <div className="meta-box">
                    <span className="label">Experience</span>
                    <span className="val">{eng.experience}</span>
                  </div>
                  <div className="meta-box">
                    <span className="label">Timezone Overlap</span>
                    <span className="val">{eng.overlap}</span>
                  </div>
                </div>

                <div className="skills-row">
                  {(eng.skills || []).map((skill, sIdx) => (
                    <span key={sIdx} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <a href="#consultation-form" className="request-btn">
                Request Interview Slot
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffAugBench;
