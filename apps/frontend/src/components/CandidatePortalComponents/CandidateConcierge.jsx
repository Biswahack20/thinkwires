import React from 'react';
import { Link } from 'react-router-dom';

const CandidateConcierge = ({ concierge = {} }) => {
  return (
    <div className="CandidatePortal-conciergeCard">
      <div className="concierge-left">
        <div className="concierge-avatar-wrap">
          <img
            src={concierge.avatar}
            alt={concierge.name}
            className="concierge-avatar-img"
          />
          <span className="online-beacon"></span>
        </div>

        <div className="concierge-info">
          <span className="eyebrow-accent">
            Your Dedicated Concierge Partner
          </span>
          <h3 className="concierge-name">{concierge.name}</h3>
          <p className="concierge-role">{concierge.role}</p>

          <div className="concierge-meta-row">
            <a
              href={`mailto:${concierge.email || 'hr@thinkwires.com'}`}
              className="concierge-phone"
            >
              <span className="material-symbols-outlined">mail</span>
              <span>{concierge.email || 'hr@thinkwires.com'}</span>
            </a>
            <span className="sep">•</span>
            <span className="concierge-sla">
              <span className="material-symbols-outlined">timelapse</span>
              <span>
                {concierge.sla || 'Average response time: < 8 minutes'}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="concierge-actions">
        <Link to="/contact" className="btn-book-checkin">
          <span className="material-symbols-outlined">calendar_today</span>
          <span>Book 15-Min Check-In</span>
        </Link>
        <a
          href={concierge.email ? `mailto:${concierge.email}` : 'mailto:hr@thinkwires.com'}
          className="btn-whatsapp"
        >
          <span className="material-symbols-outlined">mail</span>
          <span>Email Talent Concierge</span>
        </a>
      </div>
    </div>
  );
};

export default CandidateConcierge;
