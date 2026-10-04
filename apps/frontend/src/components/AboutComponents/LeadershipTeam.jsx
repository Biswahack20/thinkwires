import React from 'react';
import SectionBadge from '../common/SectionBadge';

const LeadershipTeam = ({ data }) => {
  const {
    eyebrow = 'EXECUTIVE GOVERNANCE',
    heading = 'Meet Our Leadership Team',
    subheading = 'Driving cross-border vision, recruitment architecture, and operational integrity across global tech corridors.',
    members = []
  } = data || {};

  return (
    <section id="leadership" className="LeadershipTeam-section">
      <div className="LeadershipTeam-container">
        {/* Header */}
        <div className="LeadershipTeam-header">
          <SectionBadge 
            text={eyebrow}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            }
          />
          <h2 className="LeadershipTeam-title">{heading}</h2>
          <p className="LeadershipTeam-subtitle">{subheading}</p>
        </div>

        {/* Team Grid */}
        <div className="LeadershipTeam-grid">
          {members.map((member) => {
            const isWide = member.layout === 'wide';

            return (
              <div
                key={member.id}
                className={`LeadershipTeam-card ${isWide ? 'LeadershipTeam-card--wide' : ''}`}
              >
                <div className="LeadershipTeam-cardTop">
                  {/* Left avatar block */}
                  <div className="LeadershipTeam-avatarWrapper">
                    <div
                      className="LeadershipTeam-avatar"
                      style={{
                        backgroundColor: member.avatar?.bgColor || '#2563EB',
                        color: member.avatar?.textColor || '#FFFFFF'
                      }}
                    >
                      {member.avatar?.value || member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>

                  {/* Right header block */}
                  <div className="LeadershipTeam-info">
                    <div className="LeadershipTeam-nameRow">
                      <h3 className="LeadershipTeam-name">{member.name}</h3>
                      <a
                        href={member.linkedinUrl || 'https://linkedin.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="LeadershipTeam-linkedin"
                        aria-label={`${member.name} LinkedIn Profile`}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    </div>

                    <div className="LeadershipTeam-designation">{member.designation}</div>

                    {member.badge && (
                      <div className="LeadershipTeam-experienceBadge">
                        <span
                          className="LeadershipTeam-experienceDot"
                          style={{ backgroundColor: member.badge.dotColor || '#2563EB' }}
                        ></span>
                        <span>{member.badge.text}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio text */}
                <p className="LeadershipTeam-bio">{member.bio}</p>

                {/* Company chips if wide card */}
                {member.companies && member.companies.length > 0 && (
                  <div className="LeadershipTeam-companiesBlock">
                    <span className="LeadershipTeam-companiesTitle">Prior Leadership Ecosystems:</span>
                    <div className="LeadershipTeam-companyChips">
                      {member.companies.map((company, cIdx) => (
                        <span key={cIdx} className="LeadershipTeam-companyChip">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Footer Tag */}
                {member.footerTag && (
                  <div className="LeadershipTeam-footerTag">
                    <span className="LeadershipTeam-footerTagIcon">#</span>
                    <span>{member.footerTag}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LeadershipTeam;
