import React from 'react';

const FindTalentProof = ({ metrics = [], testimonial = {}, hotline = {} }) => {
  return (
    <section className="FindTalent-proofSection">
      <div className="FindTalent-container">
        <div className="FindTalent-proofGrid">
          {/* Left: 4 Verified Metrics Bento */}
          <div className="metrics-bento">
            {metrics.map((m, idx) => (
              <div key={idx} className="metric-box">
                <span className={`metric-stat color-${idx}`}>{m.stat}</span>
                <span className="metric-label">{m.label}</span>
                <p className="metric-desc">{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Right: Testimonial & Escalation Hotline */}
          <div className="testimonial-column">
            {/* Dark Quote Card */}
            <div className="testimonial-card">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined star-icon">
                    star
                  </span>
                ))}
              </div>
              <p className="quote-text">“{testimonial.quote}”</p>
              <div className="author-row">
                <div className="author-avatar-icon">
                  <span className="material-symbols-outlined">engineering</span>
                </div>
                <div className="author-meta">
                  <h4 className="author-name">{testimonial.author}</h4>
                  <span className="author-role">{testimonial.designation}</span>
                </div>
              </div>
            </div>

            {/* Hotline Banner */}
            <div className="hotline-card">
              <div className="hotline-left">
                <div className="hotline-icon-wrap">
                  <span className="material-symbols-outlined">
                    support_agent
                  </span>
                </div>
                <div>
                  <h4 className="hotline-title">
                    {hotline.title || 'Enterprise Talent Briefing'}
                  </h4>
                  <p className="hotline-desc">
                    {hotline.desc ||
                      'Immediate workforce briefing with our Senior Managing Director:'}
                  </p>
                </div>
              </div>
              <div className="hotline-right">
                <a
                  href="mailto:hr@thinkwires.com"
                  className="btn-hotline"
                >
                  <span className="material-symbols-outlined">
                    mail
                  </span>
                  <span>hr@thinkwires.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindTalentProof;
