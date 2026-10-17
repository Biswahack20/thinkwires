import React from 'react';
import SectionBadge from '../common/SectionBadge';
import ScrollReveal from '../common/ScrollReveal';

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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        );
      case 'bolt':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        );
      case 'checkCircle':
      default:
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
    }
  };

  return (
    <section id="methodology" className="Methodology-section" aria-label="Our Three-Step Methodology">
      <div className="Methodology-container">
        {/* Header */}
        <div className="Methodology-header">
          <SectionBadge 
            text={eyebrow}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
              </svg>
            }
          />
          <h2 className="Methodology-title">{heading}</h2>
          <p className="Methodology-subtitle">{description}</p>
        </div>

        {/* 3 Step Cards */}
        <div className="Methodology-grid">
          {steps.map((step, index) => (
            <ScrollReveal
              key={step.id || step.number || index}
              direction={index % 2 === 0 ? 'left' : 'right'}
              delay={index * 0.12}
              distance={80}
              style={{ display: 'flex' }}
            >
              <div className="Methodology-card" style={{ width: '100%' }}>
                <div className="Methodology-cardHeader">
                  <span className="Methodology-stepNumber">{step.number}</span>
                  <div className="Methodology-iconBox" aria-hidden="true">
                    {getStepIcon(step.icon)}
                  </div>
                </div>

                <h3 className="Methodology-cardTitle">{step.title}</h3>
                <p className="Methodology-cardDescription">{step.description}</p>

                {step.deliverable && (
                  <div className="Methodology-deliverable">
                    <span className="Methodology-deliverableLabel">Deliverable:</span>
                    <span className="Methodology-deliverableText">{step.deliverable}</span>
                  </div>
                )}

                <div className="Methodology-cardFooter">
                  <span className="Methodology-statusTag">Phase {step.number} Protocol</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Methodology;
