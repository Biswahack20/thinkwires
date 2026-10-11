import React from 'react';
import { useSelector } from 'react-redux';

const BenchDossierFeatures = () => {
  const { dossierFeatures } = useSelector((state) => state.bench);

  const fallbackFeatures = [
    {
      step: '01',
      icon: 'terminal',
      title: 'Unredacted Code & PR Audits',
      description: 'Review real merge requests, pull request discussions, and architectural decisions made in production-scale repositories.',
      highlight: 'Production Git Commit History'
    },
    {
      step: '02',
      icon: 'videocam',
      title: 'Live System Design Whiteboard',
      description: 'Watch recorded 45-minute architectural defense sessions where candidates diagram distributed fault-tolerant systems in real time.',
      highlight: 'Full Screen Recording & Audio'
    },
    {
      step: '03',
      icon: 'rule',
      title: 'Standardized Rubric Scores',
      description: 'Calibrated scoring across 18 technical competencies evaluated by ThinkWires Principal Staff Engineers.',
      highlight: 'Quantitative Peer Benchmark'
    },
    {
      step: '04',
      icon: 'verified',
      title: 'Legal & EOR Pre-Clearance',
      description: 'Background verification, intellectual property protection covenants, and ready-to-execute master services agreements.',
      highlight: 'Turnkey Contract Execution'
    }
  ];

  const features = dossierFeatures && dossierFeatures.length > 0 ? dossierFeatures : fallbackFeatures;

  return (
    <section className="BenchDossierFeatures-section">
      <div className="BenchDossierFeatures-container">
        <div className="BenchDossierFeatures-header">
          <span className="BenchDossierFeatures-tag">TRANSPARENT VERIFICATION AUDIT</span>
          <h2 className="BenchDossierFeatures-title">
            What's Inside a ThinkWires Technical Dossier?
          </h2>
          <p className="BenchDossierFeatures-subtitle">
            We don't send resumes. We send auditable technical proof so your engineering leadership can make high-conviction decisions in minutes.
          </p>
        </div>

        <div className="BenchDossierFeatures-grid">
          {features.map((feat, idx) => (
            <div key={idx} className="BenchDossierFeatures-card">
              <div className="BenchDossierFeatures-cardTop">
                <span className="BenchDossierFeatures-step">{feat.step || `0${idx + 1}`}</span>
                <div className="BenchDossierFeatures-iconWrap">
                  <span className="material-symbols-outlined">{feat.icon}</span>
                </div>
              </div>
              <h3 className="BenchDossierFeatures-cardTitle">{feat.title}</h3>
              <p className="BenchDossierFeatures-cardDesc">{feat.description}</p>
              <div className="BenchDossierFeatures-cardHighlight">
                <span className="material-symbols-outlined">check</span>
                <span>{feat.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenchDossierFeatures;
