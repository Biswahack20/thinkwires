import React from 'react';
import SectionBadge from '../common/SectionBadge';
import ScrollReveal from '../common/ScrollReveal';

const DEFAULT_STEPS = [
  {
    id: 'step-01',
    number: '01',
    icon: 'handshake',
    title: 'Discovery & Technical Scoping',
    description:
      'We initiate with an executive discovery session. We evaluate tech stack nuances, project deadlines, budgetary constraints, and candidate seniority to draft exact success metrics.'
  },
  {
    id: 'step-02',
    number: '02',
    icon: 'bolt',
    title: 'Precision Pre-Vetted Match (<5 Hours)',
    description:
      'Our aggregator engine coordinates across our specialized subcontractor network to deliver tested, pre-interviewed candidate dossiers within five working hours.'
  },
  {
    id: 'step-03',
    number: '03',
    icon: 'verified_user',
    title: 'Frictionless Onboarding & Governance',
    description:
      'Seamless offer negotiation, local statutory contract issuance via EOR, compliant equipment provisioning, and ongoing governance tracking ensure long-term retention.'
  }
];

const Methodology = ({ data }) => {
  const {
    eyebrow = 'METHODOLOGY',
    heading = 'How We Work: From Spec to Squad',
    description = 'Our three-step framework eliminates recruitment friction and guarantees rapid technical alignment.',
    steps = []
  } = data || {};

  const resolvedSteps = (steps && steps.length > 0)
    ? steps.map((s, idx) => ({
        ...DEFAULT_STEPS[idx],
        ...s,
        number: s.number || DEFAULT_STEPS[idx]?.number,
        title: s.title || DEFAULT_STEPS[idx]?.title,
        description: s.description || DEFAULT_STEPS[idx]?.description
      }))
    : DEFAULT_STEPS;

  const getStepIcon = (iconName, number) => {
    if (number === '01' || iconName === 'handshake') {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 17l-5-5a3 3 0 0 1 0-4.24l.76-.76a3 3 0 0 1 4.24 0L12 8l1-1a3 3 0 0 1 4.24 0l.76.76a3 3 0 0 1 0 4.24l-5 5" />
          <path d="M18 11l2 2a3 3 0 0 1 0 4.24l-.76.76a3 3 0 0 1-4.24 0L13 16" />
          <path d="M6 13l-2-2a3 3 0 0 1 0-4.24l.76-.76a3 3 0 0 1 4.24 0L11 8" />
        </svg>
      );
    }
    if (number === '02' || iconName === 'bolt') {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    }
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    );
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
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
              </svg>
            }
          />
          <h2 className="Methodology-title">{heading}</h2>
          <p className="Methodology-subtitle">{description}</p>
        </div>

        {/* 3 Step Cards */}
        <div className="Methodology-grid">
          {resolvedSteps.map((step, index) => {
            const stepNum = step.number || `0${index + 1}`;
            const numColorClass =
              stepNum === '01'
                ? 'Methodology-stepNumber--primary'
                : stepNum === '02'
                ? 'Methodology-stepNumber--cobalt'
                : 'Methodology-stepNumber--tertiary';

            const iconBoxClass =
              stepNum === '01'
                ? 'Methodology-iconBox--high'
                : stepNum === '02'
                ? 'Methodology-iconBox--secondary'
                : 'Methodology-iconBox--tertiary';

            return (
              <ScrollReveal
                key={step.id || stepNum}
                direction={index % 2 === 0 ? 'left' : 'right'}
                delay={index * 0.1}
                distance={40}
                style={{ display: 'flex' }}
              >
                <div className="Methodology-card" style={{ width: '100%' }}>
                  <div className="Methodology-cardHeader">
                    <span className={`Methodology-stepNumber ${numColorClass}`}>
                      {stepNum}
                    </span>
                    <div className={`Methodology-iconBox ${iconBoxClass}`} aria-hidden="true">
                      {getStepIcon(step.icon, stepNum)}
                    </div>
                  </div>

                  <h3 className="Methodology-cardTitle">{step.title}</h3>
                  <p className="Methodology-cardDescription">{step.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Methodology;
