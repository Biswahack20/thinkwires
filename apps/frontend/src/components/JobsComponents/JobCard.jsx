import React from 'react';

const JobCard = ({ job, onApplyClick }) => {
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

  const getLogoBg = (logo = '') => {
    if (logo === 'SAP') return 'linear-gradient(135deg, #0284c7, #0369a1)';
    if (logo === 'ACH') return 'linear-gradient(135deg, #0d9488, #0f766e)';
    if (logo === 'AEM') return 'linear-gradient(135deg, #2563eb, #1d4ed8)';
    if (logo === 'AI') return 'linear-gradient(135deg, #7c3aed, #6d28d9)';
    if (logo === 'K8S') return 'linear-gradient(135deg, #2563eb, #0284c7)';
    return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
  };

  return (
    <div className="JobCard-figmaCard">
      {/* Top Header Row: Category & Status Badge */}
      <div className="JobCard-topCategoryRow">
        <span className="JobCard-categoryText">
          {job.category || 'ENTERPRISE SYSTEMS • CONTRACT'}
        </span>
        <span 
          className="JobCard-badgePill"
          style={getBadgeStyle(job.badgeColor)}
        >
          {job.badge || job.tag || 'Immediate Joining'}
        </span>
      </div>

      {/* Main Title & Logo Row */}
      <div className="JobCard-titleAndLogoRow">
        <div 
          className="JobCard-logoSquare"
          style={{ background: getLogoBg(job.logo) }}
        >
          {job.logo || (job.title ? job.title.substring(0, 2).toUpperCase() : 'TW')}
        </div>
        <h3 className="JobCard-cardJobTitle">{job.title}</h3>
      </div>

      {/* Description Snippet */}
      <p className="JobCard-cardDescription">
        {job.description}
      </p>

      {/* 4 Specs Grid */}
      <div className="JobCard-specsGrid">
        <div className="JobCard-specItem">
          <span className="JobCard-specLabel">Location</span>
          <span className="JobCard-specVal">📍 {job.location}</span>
        </div>

        <div className="JobCard-specItem">
          <span className="JobCard-specLabel">Experience</span>
          <span className="JobCard-specVal">💼 {job.experience}</span>
        </div>

        <div className="JobCard-specItem">
          <span className="JobCard-specLabel">Budget Range</span>
          <span className="JobCard-specVal JobCard-salaryVal">💰 {job.salary}</span>
        </div>

        <div className="JobCard-specItem">
          <span className="JobCard-specLabel">Joining / Tier</span>
          <span className="JobCard-specVal">⚡ {job.joining || '< 15 Days'}</span>
        </div>
      </div>

      {/* Skill Chips */}
      {job.skills && job.skills.length > 0 && (
        <div className="JobCard-skillChipsRow">
          {job.skills.map((skill, idx) => (
            <span key={idx} className="JobCard-chip">
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Footer Row: View Job Spec & Apply Button */}
      <div className="JobCard-cardFooterRow">
        <button className="JobCard-viewSpecBtn" onClick={() => onApplyClick(job)}>
          <span>View Job Spec</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </button>

        <button className="JobCard-applyNowBlueBtn" onClick={() => onApplyClick(job)}>
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;
