import React, { useEffect } from 'react';

const JobSpecModal = ({ job, onClose, onApply }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!job) return null;

  const getLogoBg = (logo = '') => {
    if (logo === 'SAP') return 'linear-gradient(135deg, #0284c7, #0369a1)';
    if (logo === 'ACH') return 'linear-gradient(135deg, #0d9488, #0f766e)';
    if (logo === 'AEM') return 'linear-gradient(135deg, #2563eb, #1d4ed8)';
    if (logo === 'AI') return 'linear-gradient(135deg, #7c3aed, #6d28d9)';
    if (logo === 'K8S') return 'linear-gradient(135deg, #2563eb, #0284c7)';
    return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
  };

  const getBadgeStyle = (badgeColor = 'green') => {
    if (badgeColor === 'green') {
      return { background: '#e6f4ea', color: '#137333', border: '1px solid #ceead6' };
    }
    if (badgeColor === 'blue') {
      return { background: '#e8f0fe', color: '#1a73e8', border: '1px solid #d2e3fc' };
    }
    if (badgeColor === 'purple') {
      return { background: '#f3e8ff', color: '#7e22ce', border: '1px solid #e9d5ff' };
    }
    if (badgeColor === 'red') {
      return { background: '#fce8e6', color: '#c5221f', border: '1px solid #fad2cf' };
    }
    return { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
  };

  // Parse requirements into clean bullet items
  const renderRequirements = () => {
    if (job.requirements && typeof job.requirements === 'string' && job.requirements.trim()) {
      const lines = job.requirements
        .split('\n')
        .map((l) => l.trim().replace(/^[-*•]\s*/, ''))
        .filter((l) => l.length > 0);

      if (lines.length > 0) {
        return (
          <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0', color: '#334155', lineHeight: 1.65 }}>
            {lines.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.45rem', fontSize: '0.92rem' }}>
                {item}
              </li>
            ))}
          </ul>
        );
      }
    }

    if (Array.isArray(job.requirements) && job.requirements.length > 0) {
      return (
        <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0', color: '#334155', lineHeight: 1.65 }}>
          {job.requirements.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '0.45rem', fontSize: '0.92rem' }}>
              {item}
            </li>
          ))}
        </ul>
      );
    }

    // Default professional qualifications aligned with position tier
    return (
      <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0', color: '#334155', lineHeight: 1.65 }}>
        <li style={{ marginBottom: '0.45rem', fontSize: '0.92rem' }}>
          Demonstrated track record of {job.experience || '3+ years'} professional experience delivering scalable solutions in {job.industry || 'enterprise environments'}.
        </li>
        <li style={{ marginBottom: '0.45rem', fontSize: '0.92rem' }}>
          Deep proficiency across core technical competencies: {job.skills && job.skills.length > 0 ? job.skills.join(', ') : 'modern tech stacks'}.
        </li>
        <li style={{ marginBottom: '0.45rem', fontSize: '0.92rem' }}>
          Strong software engineering fundamentals, including automated unit/integration testing, CI/CD pipelines, and clean architecture principles.
        </li>
        <li style={{ marginBottom: '0.45rem', fontSize: '0.92rem' }}>
          High ownership, analytical problem solving, and effective cross-functional technical communication.
        </li>
      </ul>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'twFadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          maxWidth: '780px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #E2E8F0',
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem 1.25rem 1.75rem',
            borderBottom: '1px solid #F1F5F9',
            backgroundColor: '#FAFCFF',
            position: 'relative',
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close Job Specification"
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E2E8F0';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F1F5F9';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Badges Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: '#64748B',
                textTransform: 'uppercase',
              }}
            >
              {job.category || 'ENTERPRISE SYSTEMS'}
            </span>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px',
                fontWeight: 600,
                background: 'rgba(37, 99, 235, 0.08)',
                color: '#2563eb',
                border: '1px solid rgba(37, 99, 235, 0.2)',
              }}
            >
              {job.jobMode || 'Permanent'}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px',
                fontWeight: 600,
                ...getBadgeStyle(job.badgeColor),
              }}
            >
              {job.badge || job.tag || 'Immediate Joining'}
            </span>
          </div>

          {/* Title & Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
                flexShrink: 0,
                background: getLogoBg(job.logo),
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              {job.logo || (job.title ? job.title.substring(0, 2).toUpperCase() : 'TW')}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.25 }}>
                {job.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.82rem', color: '#64748B' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#10B981' }}>
                  verified_user
                </span>
                <span style={{ fontWeight: 600, color: '#334155' }}>Enterprise Client (Confidential)</span>
                <span>•</span>
                <span>Requisition Ref: {job.id || job._id || 'REQ-TW'}</span>
                <span>•</span>
                <span>Posted {job.postedDate || 'Recently'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.4rem',
          }}
        >
          {/* Confidentiality Notice Alert */}
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
              fontSize: '0.82rem',
              color: '#475569',
              lineHeight: 1.5,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#2563EB', marginTop: '1px' }}>
              lock
            </span>
            <div>
              <strong style={{ color: '#0F172A' }}>Client Partner Confidentiality:</strong> ThinkWires exclusively represents verified Tier-1 enterprise organizations and global technology centers. Exact client legal entity names and project NDA specifics are shared during the direct technical round.
            </div>
          </div>

          {/* 6 Key Specifications Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '0.75rem',
            }}
          >
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem 0.9rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Location & Work Mode
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '17px', color: '#2563EB' }}>
                  {job.workMode === 'Work From Home' ? 'home' : job.workMode === 'Work From Office' ? 'domain' : 'location_on'}
                </span>
                {job.location || 'Remote'} ({job.workMode || 'Hybrid'})
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem 0.9rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Experience Tier
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '17px', color: '#2563EB' }}>
                  work
                </span>
                {job.experience || `${job.experienceRequired || 3}+ Years`} {job.experienceTier ? `• ${job.experienceTier}` : ''}
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem 0.9rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Compensation Band
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '17px', color: '#16A34A' }}>
                  payments
                </span>
                {job.salary || job.budget || 'Competitive CTC'}
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem 0.9rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Notice Period Requirement
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '17px', color: '#2563EB' }}>
                  timer
                </span>
                {job.noticePeriod || job.joining || 'Immediate'}
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem 0.9rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Engagement Mode
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '17px', color: '#2563EB' }}>
                  badge
                </span>
                {job.jobMode || 'Permanent'}
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem 0.9rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Industry & Domain
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '17px', color: '#2563EB' }}>
                  domain_verification
                </span>
                {job.industry || job.department || 'Information Technology'}
              </div>
            </div>
          </div>

          {/* Section: Job Description / Role Overview */}
          <div>
            <h4
              style={{
                fontSize: '0.98rem',
                fontWeight: 700,
                color: '#0F172A',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#2563EB' }}>
                description
              </span>
              Role Overview & Architecture Scope
            </h4>
            <div
              style={{
                fontSize: '0.92rem',
                color: '#334155',
                lineHeight: 1.65,
                background: '#FFFFFF',
                whiteSpace: 'pre-line',
              }}
            >
              {job.description ||
                'Lead enterprise-grade software implementation, system architecture integration, and delivery milestones. Collaborate directly with engineering leadership to drive resilient, scalable solutions aligned with organizational standards.'}
            </div>
          </div>

          {/* Section: Key Requirements & Qualifications */}
          <div>
            <h4
              style={{
                fontSize: '0.98rem',
                fontWeight: 700,
                color: '#0F172A',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#2563EB' }}>
                checklist
              </span>
              Key Requirements & Qualifications
            </h4>
            {renderRequirements()}
          </div>

          {/* Section: Required Skills Chips */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h4
                style={{
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  marginBottom: '0.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#2563EB' }}>
                  psychology
                </span>
                Required Technical Competencies
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      background: '#F1F5F9',
                      color: '#1E293B',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section: Expedited Routing SLA */}
          <div
            style={{
              padding: '0.85rem 1.1rem',
              borderRadius: '8px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                speed
              </span>
              ThinkWires Direct Intake Protocol
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#1E3A8A', lineHeight: 1.5 }}>
              Candidate profiles are evaluated within 24-48 business hours. Pre-screened candidates receive direct interview routing with client engineering directors. All advisory and placement services are 100% free of charge for candidates.
            </p>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid #F1F5F9',
            backgroundColor: '#FAFCFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F8FAFC';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.color = '#475569';
            }}
          >
            Back to Positions
          </button>

          <button
            type="button"
            onClick={() => onApply(job)}
            style={{
              padding: '0.65rem 1.75rem',
              borderRadius: '8px',
              background: '#2563EB',
              border: 'none',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1D4ED8';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#2563EB';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.25)';
            }}
          >
            <span>Apply for this Position</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSpecModal;
