import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const RECRUITMENT_STEPS = [
  {
    step: '01',
    title: 'Workforce Planning & Requirement Analysis',
    subtitle: 'Strategic Foundation & Scoping',
    description:
      'Analyze business needs, resource allocation, and project demands to build a solid recruitment foundation.',
    icon: 'groups',
    category: 'Workforce Strategy',
    metrics: ['Demand Analysis', 'Skill Matrix Forecasting', 'Capacity Planning'],
    deliverable: 'Tailored Workforce & Talent Blueprint',
  },
  {
    step: '02',
    title: 'Job Description & Talent Mapping',
    subtitle: 'Precision Role Calibration',
    description:
      'Define specific roles, required skills, experience levels, and map target talent pools.',
    icon: 'explore',
    category: 'Talent Mapping',
    metrics: ['Role Competency Benchmarking', 'Market Availability Scan', 'Target Sourcing Pools'],
    deliverable: 'Comprehensive Talent Persona & Role Dossier',
  },
  {
    step: '03',
    title: 'Candidate Sourcing & Attraction',
    subtitle: 'Omni-Channel Outreach',
    description:
      'Utilize job boards, professional social media, employee referrals, and campus recruitment initiatives.',
    icon: 'travel_explore',
    category: 'Talent Acquisition',
    metrics: ['Active & Passive Candidate Outreach', 'Verified Tech Networks', 'Global Hub Corridors'],
    deliverable: 'Curated Contender Pipeline',
  },
  {
    step: '04',
    title: 'Resume Screening & Shortlisting',
    subtitle: 'AI-Enhanced Filtering',
    description:
      'Evaluate candidate qualifications, experience, and cultural fit to select top-tier profiles.',
    icon: 'filter_alt',
    category: 'Vetting & Screening',
    metrics: ['AI Resume Scoring', 'Skill Gap Verification', 'Cultural Alignment Check'],
    deliverable: 'Verified Shortlist of Top 5% Talent',
  },
  {
    step: '05',
    title: 'Interviews & Technical Assessment',
    subtitle: 'Rigorous Technical Audits',
    description:
      'Conduct structured interviews, technical tests, and skill evaluations.',
    icon: 'developer_mode',
    category: 'Technical Audits',
    metrics: ['Architecture & Live Problem Solving', 'Online Test Scores', 'Peer Code Reviews'],
    deliverable: 'Evaluated Candidate Scorecard',
  },
  {
    step: '06',
    title: 'Client Evaluation & Selection',
    subtitle: 'Stakeholder Interviews',
    description:
      'Present selected candidates to clients for review, feedback, and final hiring decisions.',
    icon: 'rate_review',
    category: 'Stakeholder Alignment',
    metrics: ['Coordinated Interview Panels', 'Real-Time Feedback Loops', 'Finalist Selection'],
    deliverable: 'Client-Approved Finalist Dossier',
  },
  {
    step: '07',
    title: 'Offer Management & Negotiation',
    subtitle: 'Seamless Agreement Closure',
    description:
      'Prepare competitive offers, manage negotiations, and finalize terms smoothly.',
    icon: 'handshake',
    category: 'Offer Closure',
    metrics: ['Compensation Benchmarking', 'Terms & Joining Timelines', 'Candidate Engagement'],
    deliverable: 'Signed Offer & Transition Schedule',
  },
  {
    step: '08',
    title: 'Onboarding & Joining',
    subtitle: 'Full Lifecycle Integration',
    description:
      'Facilitate comprehensive orientation, training, and seamless integration into the company culture.',
    icon: 'badge',
    category: 'Deployment & EOR',
    metrics: ['Statutory & EOR Compliance', 'Tooling & Environment Setup', 'Cultural Immersion'],
    deliverable: 'Immediate Sprint Participation',
  },
  {
    step: '09',
    title: 'Post-Placement Follow-up & Relationship Management',
    subtitle: 'Long-Term Performance Assurance',
    description:
      'Conduct regular performance checks and feedback sessions to foster long-term professional relationships.',
    icon: 'verified',
    category: 'Retention & Success',
    metrics: ['30-60-90 Day Check-ins', 'Performance Health Checks', 'Retention Assurance'],
    deliverable: 'Ongoing Advisory & Pod Continuity',
  },
];

const Process = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = RECRUITMENT_STEPS[activeStepIndex];

  const canGoPrev = activeStepIndex > 0;
  const canGoNext = activeStepIndex < RECRUITMENT_STEPS.length - 1;

  const handlePrev = () => {
    if (canGoPrev) setActiveStepIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (canGoNext) setActiveStepIndex((prev) => prev + 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && canGoNext) handleNext();
      else if (e.key === 'ArrowLeft' && canGoPrev) handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canGoNext, canGoPrev]);

  const progressPercent = ((activeStepIndex + 1) / RECRUITMENT_STEPS.length) * 100;
  const railPercent = (activeStepIndex / (RECRUITMENT_STEPS.length - 1)) * 100;

  return (
    <section
      id="process"
      className="TW-Process-section"
      aria-label="Thinkwires Recruitment Process & Practices"
    >
      <div className="TW-Process-container">
        {/* ========================================================= */}
        {/* 1. HERO / INTRODUCTION SECTION */}
        {/* ========================================================= */}
        <div className="TW-Process-header">
          <div className="TW-Process-badgeContainer">
            <span className="TW-Process-eyebrow">
              METHODOLOGY &amp; PRACTICES
            </span>
            <span className="TW-Process-badgeDot" />
            <span className="TW-Process-subBadge">
              <span className="TW-Process-pulseIndicator" />
              9-Step Precision Engine
            </span>
          </div>

          <h2 className="TW-Process-title">
            Our Recruitment Process &amp; Practices
          </h2>

          <p className="TW-Process-introText">
            At Thinkwires, we engineer our recruitment process for quality,
            agility, and precision. We blend deep industry insights with
            advanced talent mapping to deliver top-tier candidates aligned with
            your business vision.
          </p>
        </div>

        {/* ========================================================= */}
        {/* 2. INTERACTIVE TIMELINE (DESKTOP & TABLET) */}
        {/* ========================================================= */}
        <div className="TW-Process-timelineWrapper">
          <div className="TW-Process-timelineRail">
            <div className="TW-Process-railLine" />
            <div
              className="TW-Process-railLineFill"
              style={{ width: `calc(${railPercent}% - 3rem)` }}
            />

            {RECRUITMENT_STEPS.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              const isCompleted = activeStepIndex > idx;

              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`TW-Process-nodeBtn ${isActive ? 'is-active' : ''} ${
                    isCompleted ? 'is-completed' : ''
                  }`}
                  aria-label={`Step ${step.step}: ${step.title}`}
                >
                  <div className="TW-Process-nodeCircle">
                    {isCompleted ? (
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        check
                      </span>
                    ) : (
                      step.step
                    )}
                  </div>
                  <span className="TW-Process-nodeLabel">
                    Step {step.step}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Horizontal Pill Scroller */}
          <div className="TW-Process-mobileNav">
            {RECRUITMENT_STEPS.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`TW-Process-mobilePill ${isActive ? 'is-active' : ''}`}
                >
                  <strong>{step.step}</strong>
                  <span>{step.category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. DETAILED STAGE CARD (CENTERPIECE) */}
        {/* ========================================================= */}
        <div className="TW-Process-cardWrapper">
          <div className="TW-Process-cardTopBar">
            <div className="TW-Process-cardMeta">
              <span className="TW-Process-stepPill">
                <span>Stage {activeStep.step}</span> of 09
              </span>
              <span className="TW-Process-stageCategory">
                • {activeStep.category}
              </span>
            </div>

            <div className="TW-Process-cardNavControls">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canGoPrev}
                className="TW-Process-navBtn"
                aria-label="Previous step"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  arrow_back
                </span>
                <span>Previous</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext}
                className="TW-Process-navBtn btn-primary"
                aria-label="Next step"
              >
                <span>Next</span>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="TW-Process-cardBody"
            >
              {/* Left Column: Title & Description */}
              <div className="TW-Process-cardLeft">
                <div className="TW-Process-stageHeader">
                  <span className="TW-Process-phaseCategory">
                    {activeStep.category} • {activeStep.subtitle}
                  </span>
                  <h3 className="TW-Process-stageTitle">
                    {activeStep.title}
                  </h3>
                  <p className="TW-Process-stageDesc">
                    {activeStep.description}
                  </p>
                </div>

                <div className="TW-Process-deliverableBox">
                  <div className="TW-Process-deliverableIcon">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      verified
                    </span>
                  </div>
                  <div>
                    <span className="TW-Process-deliverableLabel">
                      Standard Operating Practice Deliverable
                    </span>
                    <p className="TW-Process-deliverableText">
                      {activeStep.deliverable}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Execution Telemetry */}
              <div className="TW-Process-cardRight">
                <div>
                  <div className="TW-Process-rightHeader">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div className="TW-Process-iconBadge">
                        <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>
                          {activeStep.icon}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                          Phase Protocol
                        </span>
                        <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                          Stage {activeStep.step} Execution
                        </strong>
                      </div>
                    </div>
                    <span className="TW-Process-bigStepNum">
                      {activeStep.step}
                    </span>
                  </div>

                  <span className="TW-Process-milestonesTitle">
                    Core Operational Milestones
                  </span>
                  <div className="TW-Process-milestoneList">
                    {activeStep.metrics.map((metric, i) => (
                      <div key={i} className="TW-Process-milestoneItem">
                        <span className="TW-Process-milestoneCheck material-symbols-outlined">
                          check_circle
                        </span>
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="TW-Process-progressSection">
                  <div className="TW-Process-progressLabels">
                    <span>Lifecycle Execution</span>
                    <strong style={{ color: '#0037b0' }}>{Math.round(progressPercent)}% Completed</strong>
                  </div>
                  <div className="TW-Process-progressBarBg">
                    <div
                      className="TW-Process-progressBarFill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ========================================================= */}
        {/* 4. ALL 9 STAGES QUICK-ACCESS GRID */}
        {/* ========================================================= */}
        <div className="TW-Process-gridTitle">
          Complete End-to-End Recruitment Lifecycle
        </div>

        <div className="TW-Process-grid">
          {RECRUITMENT_STEPS.map((step, idx) => {
            const isCurrent = activeStepIndex === idx;

            return (
              <div
                key={step.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`TW-Process-gridItem ${isCurrent ? 'is-active' : ''}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setActiveStepIndex(idx);
                }}
              >
                <div className="TW-Process-gridItemNumber">
                  {step.step}
                </div>
                <div className="TW-Process-gridItemText">
                  <h4 className="TW-Process-gridItemTitle">
                    {step.title}
                  </h4>
                  <p className="TW-Process-gridItemCategory">
                    {step.category}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
