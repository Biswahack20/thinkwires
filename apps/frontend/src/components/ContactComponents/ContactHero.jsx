import React from 'react';
import { Link } from 'react-router-dom';
import SectionBadge from '../common/SectionBadge';

const ContactHero = ({ data }) => {
  const {
    badge = 'Contact Thinkwires • We Respond Within 5 Hours',
    heading = "Let's Build Your",
    headingHighlight = 'Next Engineering Squad.',
    description = 'Our staffing directors are ready. Reach out and receive pre-vetted profiles in under 5 hours.',
  } = data || {};

  return (
    <section className="ContactHero-section">
      {/* Background decorative orbs */}
      <div
        className="ContactHero-orb ContactHero-orb--blue"
        aria-hidden="true"
      ></div>
      <div
        className="ContactHero-orb ContactHero-orb--green"
        aria-hidden="true"
      ></div>
      <div className="ContactHero-container">
        {/* <nav className="ContactHero-breadcrumbs" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="ContactHero-breadcrumbItem">
                {idx > 0 && <span className="ContactHero-breadcrumbSep">›</span>}
              {idx === breadcrumbs.length - 1 ? (
                <span className="ContactHero-breadcrumbCurrent">{crumb.label}</span>
              ) : (
                <Link to={crumb.href} className="ContactHero-breadcrumbLink">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav> */}

        {/* Badge */}
        <SectionBadge
          text={badge}
          icon={
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          }
        />

        {/* Title */}
        <h1 className="ContactHero-title">
          {heading}{' '}
          <span className="ContactHero-titleHighlight">{headingHighlight}</span>
        </h1>

        {/* Description */}
        <p className="ContactHero-description">{description}</p>

        {/* SLA row */}
        <div className="ContactHero-slaRow">
          <div className="ContactHero-slaBadge">
            <span className="ContactHero-slaDot"></span>
            <span>First profiles delivered in</span>
            <strong>&lt; 5 Hours</strong>
          </div>
          <div className="ContactHero-slaDiv"></div>
          <div className="ContactHero-slaBadge">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>100% Statutory Compliance</span>
          </div>
          <div className="ContactHero-slaDiv"></div>
          <div className="ContactHero-slaBadge">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>India · USA · Canada</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
