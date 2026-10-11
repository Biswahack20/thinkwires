import React from 'react';
import { useSelector } from 'react-redux';

const CaseStudies = () => {
  const caseStudiesData = useSelector((state) => state.industries.caseStudies);

  const badge = caseStudiesData?.badge || 'Real-World Case Studies';
  const title = caseStudiesData?.title || 'Proven Results in Regulated Environments';
  const ctaText = caseStudiesData?.ctaText || 'Request Detailed Case Folios';

  const defaultItems = [
    {
      tag: 'Healthcare & Life Sciences',
      tagVariant: 'green',
      location: 'Boston, MA',
      title: '48-Hour FDA 21 CFR Compliance Deployment',
      desc: 'A clinical trials software provider faced critical audit remediation deadlines. ThinkWires mobilized a pod of 4 Bio-Stats engineers and a Regulatory QA Lead within 48 hours.',
      metrics: [
        { label: 'Turnaround Time', value: 'Under 48 Hours' },
        { label: 'Audit Remediation', value: '100% Passed (Zero Non-Conformances)', highlight: 'green' },
        { label: 'Engagement Scope', value: '14-Month Retainer' }
      ],
      progressVariant: 'green',
      progressLabel: 'Project Delivered Ahead of FDA Submission'
    },
    {
      tag: 'FinTech & Core Banking',
      tagVariant: 'blue',
      location: 'New York / Toronto',
      title: '15+ ISO 20022 Payment Architects for US Unicorn',
      desc: 'Scalable payment rail modernization to adopt real-time FedNow and ISO 20022 messaging protocols across cross-border settlement infrastructure.',
      metrics: [
        { label: 'Team Scaled', value: '15 Specialized Engineers' },
        { label: 'Throughput Latency', value: '-42% Latency Reduction', highlight: 'blue' },
        { label: 'Compliance', value: 'PCI-DSS 4.0 Verified' }
      ],
      progressVariant: 'blue',
      progressLabel: 'Cross-Border Settlement Pod Live'
    },
    {
      tag: 'Autonomous Mobility',
      tagVariant: 'dark',
      location: 'Munich / Detroit',
      title: 'Zero Compliance Breaches in AUTOSAR ASIL-D Pod',
      desc: 'Deployment of an 8-person embedded firmware safety squad for a tier-1 automotive supplier working on next-generation drive-by-wire steering systems.',
      metrics: [
        { label: 'Safety Rating', value: 'ASIL-D Standard Achieved' },
        { label: 'Defect Density', value: '0.02 bugs / 1,000 LOC', highlight: 'green' },
        { label: 'Talent Longevity', value: '24+ Months Continuous' }
      ],
      progressVariant: 'dark',
      progressLabel: 'Production Ready Vehicle Launch'
    }
  ];

  const items = (caseStudiesData?.items && caseStudiesData.items.length > 0)
    ? caseStudiesData.items
    : defaultItems;

  return (
    <section className="CaseStudies-section">
      <div className="CaseStudies-header">
        <div>
          <span className="CaseStudies-badge">{badge}</span>
          <h2 className="CaseStudies-title">{title}</h2>
        </div>
        <a className="CaseStudies-ctaLink" href="#capability-briefing">
          {ctaText}
          <span className="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>

      <div className="CaseStudies-grid">
        {items.map((item, index) => (
          <div key={index} className="CaseStudies-card">
            <div className="CaseStudies-cardBody">
              <div className="CaseStudies-pillRow">
                <span className={`CaseStudies-tagPill CaseStudies-tagPill--${item.tagVariant || 'green'}`}>
                  {item.tag}
                </span>
                <span className="CaseStudies-location">{item.location}</span>
              </div>
              <h3 className="CaseStudies-cardTitle">{item.title}</h3>
              <p className="CaseStudies-cardDesc">{item.desc}</p>

              <div className="CaseStudies-metricsList">
                {item.metrics && item.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="CaseStudies-metricRow">
                    <span>{m.label}:</span>
                    <strong className={m.highlight === 'green' ? 'CaseStudies-greenAccent' : m.highlight === 'blue' ? 'CaseStudies-blueAccent' : ''}>
                      {m.value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="CaseStudies-cardFooter">
              <div className="CaseStudies-progressBar">
                <div className={`CaseStudies-progressFill CaseStudies-progressFill--${item.progressVariant || 'green'}`}></div>
              </div>
              <span className={`CaseStudies-progressLabel CaseStudies-progressLabel--${item.progressVariant || 'green'}`}>
                {item.progressLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CaseStudies;
