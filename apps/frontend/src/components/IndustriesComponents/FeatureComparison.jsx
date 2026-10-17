import React from 'react';
import { useSelector } from 'react-redux';
import ScrollReveal from '../common/ScrollReveal';

const FeatureComparison = () => {
  const comp = useSelector((state) => state.industries.featureComparison);

  const badge = comp?.badge || 'Engineering Precision Matters';
  const title = comp?.title || 'Why Industry-Specific Staffing Protects Enterprise Velocity';
  const subtitle = comp?.subtitle || 'Commodity staffing agencies forward generic resumes without technical screening. ThinkWires deploys calibrated engineering pods vetted by veteran domain architects.';

  const generalist = comp?.generalistCard || {
    title: 'Generalist Staffing',
    subtitle: 'Transactional Brokerage',
    points: [
      { title: 'Keyword matching without domain grasp', desc: 'Resumes filtered only via automated ATS parsers with no technical coding verification.' },
      { title: 'Zero regulatory comprehension', desc: 'Candidates require months of internal onboarding before learning FDA, HIPAA, or DO-178C guidelines.' },
      { title: 'Uncapped liability risks', desc: 'Informal contractor arrangements leaving your enterprise exposed to misclassification and tax penalties.' },
      { title: 'High 90-day churn', desc: 'High friction ramp-up leading to delayed project deliverables and recurring candidate backfills.' }
    ],
    metricLabel: 'Average Time-to-Productivity',
    metricValue: '60-90',
    metricUnit: 'Days'
  };

  const thinkWires = comp?.thinkWiresCard || {
    title: 'ThinkWires Pods',
    subtitle: 'Domain-Calibrated Teams',
    tierBadge: 'Enterprise Tier',
    points: [
      { title: 'Architect-led technical vetting', desc: 'Every specialist undergoes live whiteboarding and system architecture evaluations with our Lead SMEs.' },
      { title: 'Pre-certified compliance readiness', desc: 'Engineers onboard already trained in ISO 26262, AUTOSAR, HIPAA, SOC 2, or PCI-DSS workflows.' },
      { title: 'Full EOR indemnity & governance', desc: 'Complete legal liability protection, statutory local compliance, and IP ownership across Canada, US & Global.' },
      { title: '98.4% Retention across project cycles', desc: 'High cultural alignment, dedicated talent success leads, and performance-incentivized retention.' }
    ],
    metricLabel: 'Average Time-to-Productivity',
    metricValue: 'Day 1',
    metricUnit: 'Velocity'
  };

  return (
    <section className="FeatureComparison-section">
      <div className="FeatureComparison-bgBlob FeatureComparison-bgBlob--top" aria-hidden="true"></div>
      <div className="FeatureComparison-bgBlob FeatureComparison-bgBlob--bottom" aria-hidden="true"></div>

      <div className="FeatureComparison-container">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="FeatureComparison-header">
            <span className="FeatureComparison-badge">
              <span className="FeatureComparison-badgeDot"></span>
              {badge}
            </span>
            <h2 className="FeatureComparison-title">{title}</h2>
            <p className="FeatureComparison-subtitle">{subtitle}</p>
          </div>
        </ScrollReveal>

        {/* Comparison Grid */}
        <div className="FeatureComparison-grid">
          
          {/* Desktop VS Badge */}
          <div className="FeatureComparison-vsBadge" aria-hidden="true">
            <span>VS</span>
          </div>

          {/* Card: Generalist Staffing */}
          <ScrollReveal direction="left">
            <div className="FeatureComparison-card FeatureComparison-card--negative">
              <div className="FeatureComparison-cardTop">
                <div className="FeatureComparison-cardHeader">
                  <div className="FeatureComparison-iconBox FeatureComparison-iconBox--negative">
                    <span className="material-symbols-outlined">group_off</span>
                  </div>
                  <div>
                    <h3 className="FeatureComparison-cardTitle">{generalist.title}</h3>
                    <span className="FeatureComparison-cardSublabel FeatureComparison-cardSublabel--negative">
                      {generalist.subtitle}
                    </span>
                  </div>
                </div>

                <ul className="FeatureComparison-list">
                  {generalist.points.map((p, idx) => (
                    <li key={idx} className="FeatureComparison-listItem">
                      <div className="FeatureComparison-bullet FeatureComparison-bullet--negative">
                        <span className="material-symbols-outlined">close</span>
                      </div>
                      <p><strong>{p.title}:</strong> {p.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="FeatureComparison-cardFooter">
                <span className="FeatureComparison-metricLabel">{generalist.metricLabel}</span>
                <div className="FeatureComparison-metricValue FeatureComparison-metricValue--negative">
                  {generalist.metricValue} <span>{generalist.metricUnit}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card: ThinkWires Pods */}
          <ScrollReveal direction="right">
            <div className="FeatureComparison-card FeatureComparison-card--positive">
              <div className="FeatureComparison-cardTop">
                <div className="FeatureComparison-cardHeader">
                  <div className="FeatureComparison-cardHeaderLeft">
                    <div className="FeatureComparison-iconBox FeatureComparison-iconBox--positive">
                      <span className="material-symbols-outlined">verified</span>
                    </div>
                    <div>
                      <h3 className="FeatureComparison-cardTitle FeatureComparison-cardTitle--white">{thinkWires.title}</h3>
                      <span className="FeatureComparison-cardSublabel FeatureComparison-cardSublabel--positive">
                        {thinkWires.subtitle}
                      </span>
                    </div>
                  </div>
                  {thinkWires.tierBadge && (
                    <span className="FeatureComparison-tierPill">{thinkWires.tierBadge}</span>
                  )}
                </div>

                <ul className="FeatureComparison-list FeatureComparison-list--positive">
                  {thinkWires.points.map((p, idx) => (
                    <li key={idx} className="FeatureComparison-listItem">
                      <div className="FeatureComparison-bullet FeatureComparison-bullet--positive">
                        <span className="material-symbols-outlined">check</span>
                      </div>
                      <p><strong>{p.title}:</strong> {p.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="FeatureComparison-cardFooter FeatureComparison-cardFooter--positive">
                <span className="FeatureComparison-metricLabel FeatureComparison-metricLabel--light">
                  {thinkWires.metricLabel}
                </span>
                <div className="FeatureComparison-metricValue FeatureComparison-metricValue--positive">
                  {thinkWires.metricValue} <span>{thinkWires.metricUnit}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

export default FeatureComparison;
