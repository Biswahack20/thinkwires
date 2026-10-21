import React, { useState } from 'react';
import AnimatedCounter from '../common/AnimatedCounter';
import ScrollReveal from '../common/ScrollReveal';
import fallbackPhilosophyImg from '../../assets/images/about-philosophy.jpg';

const STITCH_PHILOSOPHY_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDsW7LH2V-OUK-cVsQPoEqGK2uEOIX5taBSnNXCRr82C51WCcN_56oG9c6e_JGFtP5P8Vz5NV4MVV1pfIixtetDOD-7YPNR0wdYrjn2HItjbkg9fhnVlQk_wN9EN7_5Dhg7AmOcZI2WdDx42id_UZLt5YvNnyAOX0ENwMc8XAzIJ66CkT490D5kbF1tEnoT85ejcXwscse6o88-evvO35FkBEauAkj6D4ZXucUag9wKCUrtqFwTvYgfGA';

const DEFAULT_METRICS = [
  {
    id: 'retention-rate',
    value: '98.4%',
    numericValue: 98.4,
    unit: '%',
    label: 'Contract Retention Rate',
    color: 'emerald'
  },
  {
    id: 'turnaround-time',
    value: '< 48 hrs',
    numericValue: 48,
    unit: 'hrs',
    prefix: '< ',
    label: 'Candidate Interview Turnaround',
    color: 'cobalt'
  }
];

const Philosophy = ({ data }) => {
  const [imgError, setImgError] = useState(false);

  const {
    eyebrow = 'OUR PHILOSOPHY',
    heading = '"Recruitment is Not Transactional; It is Architectural."',
    description = 'At ThinkWires, we reject the legacy headhunter pattern of resume-dumping. We treat every client intake as an engineering brief. From understanding the nuances of microservices architectures to navigating localized tax laws in Ontario or California, our teams engineer frictionless, compliant talent conduits.',
    image = STITCH_PHILOSOPHY_IMG,
    imageAlt = 'ThinkWires executive technology meeting room and talent architecture planning',
    metrics = []
  } = data || {};

  const resolvedImage = imgError ? fallbackPhilosophyImg : (image || fallbackPhilosophyImg);
  const resolvedMetrics = (metrics && metrics.length > 0) ? metrics : DEFAULT_METRICS;

  return (
    <section className="Philosophy-section" aria-label="Corporate Philosophy and Thesis">
      <div className="Philosophy-container">
        <div className="Philosophy-panel">
          {/* Ambient Glow in background */}
          <div className="Philosophy-ambientGlow" aria-hidden="true" />

          {/* Left Column: Philosophical Thesis & Metrics */}
          <ScrollReveal direction="left" distance={50} className="Philosophy-content">
            <div className="Philosophy-badge">
              <span className="Philosophy-badgeDot" aria-hidden="true" />
              <span>{eyebrow}</span>
            </div>

            <h2 className="Philosophy-heading">{heading}</h2>

            <p className="Philosophy-description">{description}</p>

            <div className="Philosophy-metricsRow">
              {resolvedMetrics.map((metric) => (
                <div key={metric.id} className="Philosophy-metricCard">
                  <div className={`Philosophy-metricValue Philosophy-metric--${metric.color || 'emerald'}`}>
                    <AnimatedCounter
                      value={metric.numericValue || metric.value}
                      prefix={metric.prefix || ''}
                      suffix={metric.unit ? ` ${metric.unit}` : (metric.value && metric.value.includes('%') ? '%' : '')}
                      duration={1600}
                    />
                  </div>
                  <div className="Philosophy-metricLabel">{metric.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Right Column: Visual Frame */}
          <ScrollReveal direction="right" distance={50} className="Philosophy-visual">
            <div className="Philosophy-imageWrapper">
              <img
                src={resolvedImage}
                alt={imageAlt}
                className="Philosophy-image"
                loading="lazy"
                onError={() => setImgError(true)}
              />
              <div className="Philosophy-imageOverlay" />

              {/* Verified Architecture Tag */}
              <div className="Philosophy-imageTag" aria-label="Enterprise Workforce Architecture">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Enterprise Workforce Architecture</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
