import React from 'react';
import SectionBadge from '../common/SectionBadge';

const Methodology = ({ data }) => {
  const {
    eyebrow = 'METHODOLOGY',
    heading = 'How We Work: From Spec to Squad',
    description = 'Our three-step framework eliminates recruitment friction and guarantees rapid technical alignment.',
    steps = []
  } = data || {};

  const getStepIcon = (iconName) => {
    switch (iconName) {
      case 'eye':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          </svg>
        );
      case 'bolt':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        );
      case 'checkCircle':
      default:
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
    }
  };

  return (
    <section className="Methodology-section">
      <div className="Methodology-container">
        {/* Header */}
        <div className="Methodology-header">
          <SectionBadge 
            text={eyebrow}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
            }
          />
          <h2 className="Methodology-title">{heading}</h2>
          <p className="Methodology-subtitle">{description}</p>
        </div>

        {/* 3 Step Cards */}
        <div className="Methodology-grid">
          {steps.map((step) => (
            <div key={step.id || step.number} className="Methodology-card">
              <div className="Methodology-cardHeader">
                <span className="Methodology-stepNumber">{step.number}</span>
                <div className="Methodology-iconBox">
                  {getStepIcon(step.icon)}
                </div>
              </div>

              <h3 className="Methodology-cardTitle">{step.title}</h3>
              <p className="Methodology-cardDescription">{step.description}</p>

              <div className="Methodology-cardFooter">
                <span className="Methodology-statusTag">Phase {step.number} Protocol</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Methodology;
