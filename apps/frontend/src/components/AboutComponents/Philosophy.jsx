import React from 'react';
import philosophyImg from '../../assets/images/about-philosophy.jpg';

const Philosophy = ({ data }) => {
  const {
    eyebrow = 'OUR PHILOSOPHY',
    heading = '"Recruitment is Not Transactional; It is Architectural."',
    description = 'At ThinkWires, we reject the legacy headhunter pattern of resume-dumping. We treat every client intake as an engineering brief. From understanding the nuances of microservices architectures to navigating localized tax laws in Ontario or California, our teams engineer frictionless, compliant talent conduits.',
    image = philosophyImg,
    imageAlt = 'ThinkWires team in boardroom meeting',
    metrics = [
      {
        id: 'metric-1',
        value: '98.4%',
        label: 'Contract Retention Rate',
        color: 'green'
      },
      {
        id: 'metric-2',
        value: '< 48 hrs',
        label: 'Candidate Interview Turnaround',
        color: 'blue'
      }
    ]
  } = data || {};

  return (
    <section className="Philosophy-section">
      <div className="Philosophy-container">
        <div className="Philosophy-panel">
          {/* Left Column: Philosophical Thesis & Metrics */}
          <div className="Philosophy-content">
            <div className="Philosophy-badge">
              <span className="Philosophy-badgeDot"></span>
              {eyebrow}
            </div>

            <h2 className="Philosophy-heading">{heading}</h2>

            <p className="Philosophy-description">{description}</p>

            <div className="Philosophy-metricsRow">
              {metrics.map((metric) => (
                <div key={metric.id} className="Philosophy-metricCard">
                  <div className={`Philosophy-metricValue Philosophy-metric--${metric.color || 'blue'}`}>
                    {metric.value}
                  </div>
                  <div className="Philosophy-metricLabel">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Frame */}
          <div className="Philosophy-visual">
            <div className="Philosophy-imageWrapper">
              <img
                src={philosophyImg}
                alt={imageAlt}
                className="Philosophy-image"
                loading="lazy"
              />
              <div className="Philosophy-imageOverlay"></div>

              {/* Decorative Accent Tag */}
              <div className="Philosophy-imageTag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Enterprise Protocol Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
