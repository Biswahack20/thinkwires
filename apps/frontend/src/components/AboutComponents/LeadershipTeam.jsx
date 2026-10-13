import React, { useState } from 'react';
import SectionBadge from '../common/SectionBadge';

const LeadershipCard = ({ member, onOpenModal }) => {
  const [imgError, setImgError] = useState(false);

  const {
    name = '',
    designation = '',
    initials = '',
    bio = '',
    image = null,
    linkedinUrl = null,
    avatar = {},
    badge = {},
    companies = [],
    expertise = [],
    footerTag = ''
  } = member || {};

  const resolvedInitials = initials || avatar?.value || name.split(' ').map((n) => n[0]).join('').substring(0, 2);

  // Normalize expertise whether it's an array or string
  const normalizedExpertise = Array.isArray(expertise)
    ? expertise
    : (typeof expertise === 'string' && expertise.trim().length > 0)
      ? expertise.split(',').map(s => s.trim())
      : [];

  // 3-4 line preview limit
  const isLongBio = typeof bio === 'string' && bio.length > 170;
  const bioPreview = isLongBio ? `${bio.substring(0, 165)}...` : bio;

  // Strict check: only render LinkedIn if it contains a valid linkedin.com URL
  const hasValidLinkedIn =
    Boolean(linkedinUrl) &&
    typeof linkedinUrl === 'string' &&
    linkedinUrl.trim().length > 0 &&
    linkedinUrl.includes('linkedin.com/in/');

  return (
    <div className="LeadershipTeam-card">
      {/* 1. TOP: Avatar | Name and Designation */}
      <div className="LeadershipTeam-cardTop">
        <div className="LeadershipTeam-avatarWrapper">
          {image && !imgError ? (
            <img
              src={image}
              alt={name}
              className="LeadershipTeam-photo"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="LeadershipTeam-avatar"
              style={{
                backgroundColor: avatar?.bgColor || '#0037B0',
                color: avatar?.textColor || '#FFFFFF'
              }}
              aria-hidden="true"
            >
              {resolvedInitials}
            </div>
          )}
        </div>

        <div className="LeadershipTeam-info">
          <div className="LeadershipTeam-nameRow">
            <h3 className="LeadershipTeam-name">{name}</h3>
            {hasValidLinkedIn && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="LeadershipTeam-linkedin"
                aria-label={`${name}'s LinkedIn profile`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            )}
          </div>
          <div className="LeadershipTeam-designation">{designation}</div>
        </div>
      </div>

      {/* 2. SECOND: Experience indicator, if available */}
      {badge?.text && (
        <div className="LeadershipTeam-experienceRow">
          <div className="LeadershipTeam-experienceBadge">
            <span
              className="LeadershipTeam-experienceDot"
              style={{ backgroundColor: badge.dotColor || '#0037B0' }}
              aria-hidden="true"
            ></span>
            <span>{badge.text}</span>
          </div>
        </div>
      )}

      {/* 3. THIRD: Biography preview limited to 3-4 lines */}
      <div className="LeadershipTeam-bioWrapper">
        <p className="LeadershipTeam-bio">{bioPreview}</p>
      </div>

      {/* 4. FOURTH: Properly styled Read Full Bio action */}
      {isLongBio && (
        <div className="LeadershipTeam-actionRow">
          <button
            type="button"
            onClick={() => onOpenModal(member)}
            className="LeadershipTeam-expandBtn"
          >
            <span>Read Full Bio</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      )}

      {/* 5. FIFTH: Expertise tags */}
      {normalizedExpertise.length > 0 && (
        <div className="LeadershipTeam-expertiseSection">
          <span className="LeadershipTeam-metaLabel">Core Expertise</span>
          <div className="LeadershipTeam-expertiseRow">
            {normalizedExpertise.map((tag, idx) => (
              <span key={`${name}-exp-${idx}`} className="LeadershipTeam-expertiseTag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* OPTIONAL: Prior enterprise experience, only when available */}
      {companies && companies.length > 0 && (
        <div className="LeadershipTeam-companiesBlock">
          <span className="LeadershipTeam-metaLabel">Prior Enterprise Ecosystems</span>
          <div className="LeadershipTeam-companyChips">
            {companies.map((company, cIdx) => (
              <span key={`${name}-comp-${cIdx}`} className="LeadershipTeam-companyChip">
                {company}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Card Footer Tag */}
      {footerTag && (
        <div className="LeadershipTeam-footerTag">
          <span className="LeadershipTeam-footerTagIcon" aria-hidden="true">#</span>
          <span>{footerTag}</span>
        </div>
      )}
    </div>
  );
};

const LeadershipTeam = ({ data }) => {
  const [modalMember, setModalMember] = useState(null);

  const {
    eyebrow = 'EXECUTIVE GOVERNANCE',
    heading = 'Meet Our Leadership Team',
    subheading = 'Driving cross-border vision, recruitment architecture, and operational integrity across global technology corridors.',
    members = []
  } = data || {};

  // Separate members into 3 + 2 layout:
  // First row: first 3 members
  // Second row: remaining members centered underneath
  const topRowMembers = members.slice(0, 3);
  const bottomRowMembers = members.slice(3);

  return (
    <section id="leadership" className="LeadershipTeam-section" aria-label="Executive Leadership Governance">
      <div className="LeadershipTeam-container">
        {/* Header */}
        <div className="LeadershipTeam-header">
          <SectionBadge 
            text={eyebrow}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

        {/* 3 + 2 Responsive Layout */}
        <div className="LeadershipTeam-layoutWrapper">
          {/* Top Row: 3 cards */}
          <div className="LeadershipTeam-rowTop">
            {topRowMembers.map((member) => (
              <LeadershipCard
                key={member.id}
                member={member}
                onOpenModal={setModalMember}
              />
            ))}
          </div>

          {/* Bottom Row: 2 cards centered */}
          {bottomRowMembers.length > 0 && (
            <div className="LeadershipTeam-rowBottom">
              {bottomRowMembers.map((member) => (
                <LeadershipCard
                  key={member.id}
                  member={member}
                  onOpenModal={setModalMember}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full Biography Modal */}
      {modalMember && (
        <div
          className="LeadershipModal-overlay"
          onClick={() => setModalMember(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="leadership-modal-title"
        >
          <div className="LeadershipModal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setModalMember(null)}
              className="LeadershipModal-closeBtn"
              aria-label="Close Biography Modal"
            >
              ✕
            </button>

            <div className="LeadershipModal-header">
              <div
                className="LeadershipModal-avatar"
                style={{
                  backgroundColor: modalMember.avatar?.bgColor || '#0037B0',
                  color: modalMember.avatar?.textColor || '#FFFFFF'
                }}
              >
                {modalMember.initials || modalMember.avatar?.value || modalMember.name.split(' ').map(n => n[0]).join('')}
              </div>

              <div>
                <h3 id="leadership-modal-title" className="LeadershipModal-name">{modalMember.name}</h3>
                <div className="LeadershipModal-designation">{modalMember.designation}</div>
                {modalMember.badge?.text && (
                  <div className="LeadershipModal-badge">
                    <span>{modalMember.badge.text}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="LeadershipModal-body">
              <h4 className="LeadershipModal-bioLabel">Executive Biography</h4>
              <p className="LeadershipModal-bioText">{modalMember.bio}</p>

              {modalMember.expertise && (
                <div className="LeadershipModal-tagsGroup">
                  <span className="LeadershipModal-tagsLabel">Areas of Expertise</span>
                  <div className="LeadershipModal-tagsList">
                    {(Array.isArray(modalMember.expertise) ? modalMember.expertise : modalMember.expertise.split(',')).map((item, idx) => (
                      <span key={idx} className="LeadershipModal-tagItem">{item.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {modalMember.companies && modalMember.companies.length > 0 && (
                <div className="LeadershipModal-tagsGroup">
                  <span className="LeadershipModal-tagsLabel">Prior Enterprise Environments</span>
                  <div className="LeadershipModal-tagsList">
                    {modalMember.companies.map((comp, idx) => (
                      <span key={idx} className="LeadershipModal-companyItem">{comp}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="LeadershipModal-footer">
              <button
                type="button"
                onClick={() => setModalMember(null)}
                className="LeadershipModal-doneBtn"
              >
                Close Biography
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LeadershipTeam;
