import React, { useState } from 'react';
import SectionBadge from '../common/SectionBadge';
import heroImg from '../../assets/images/about-hero.jpg';

const AboutHero = ({ data }) => {
  const [imgError, setImgError] = useState(false);

  const {
    badge = 'About ThinkWires • Transforming Global IT Talent Delivery',
    breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: 'Who We Are', href: '/about' }
    ],
    heading = 'Connecting Global Ambition with',
    headingHighlight = 'Exceptional Tech Talent.',
    description = 'Founded in 2022 as a premier workforce advisor and staffing aggregator, ThinkWires connects high-growth enterprises with specialized engineering talent and compliant Employer of Record (EOR) infrastructure across India, the US, and Canada.',
    heroImage = '/images/about-hero.jpg',
    heroImageAlt = 'ThinkWires Global Talent Delivery Grid across India, USA, and Canada',
    ctaButtons = [
      { label: 'Meet Our Leadership', href: '#leadership', variant: 'primary', icon: 'arrowDown' },
      { label: 'Explore Our Approach', href: '#aggregator', variant: 'outline', icon: 'settings' }
    ]
  } = data || {};

  const handleScrollTo = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Fallback to local imported asset if public URL fails or vice-versa
  const resolvedImageSrc = imgError ? heroImg : (heroImage || heroImg);

  return (
    <section className="AboutHero-section" aria-label="About ThinkWires Overview">
      <div className="AboutHero-container">
        {/* Left Column: Information */}
        <div className="AboutHero-content">
          {/* Breadcrumb Navigation */}
          <nav className="AboutHero-breadcrumbs" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="AboutHero-breadcrumbItem">
                {idx > 0 && <span className="AboutHero-breadcrumbSeparator">/</span>}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="AboutHero-breadcrumbCurrent">{crumb.label}</span>
                ) : (
                  <a href={crumb.href} className="AboutHero-breadcrumbLink">{crumb.label}</a>
                )}
              </span>
            ))}
          </nav>

          {/* Section Badge */}
          <SectionBadge 
            text={badge} 
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            }
          />

          {/* Main Title */}
          <h1 className="AboutHero-title">
            {heading} <span className="AboutHero-titleHighlight">{headingHighlight}</span>
          </h1>

          {/* Description */}
          <p className="AboutHero-description">
            {description}
          </p>

          {/* Action CTAs */}
          <div className="AboutHero-actions">
            {ctaButtons.map((btn, idx) => (
              <a
                key={idx}
                href={btn.href}
                onClick={(e) => handleScrollTo(e, btn.href)}
                className={`AboutHero-btn ${btn.variant === 'primary' ? 'AboutHero-btnPrimary' : 'AboutHero-btnOutline'}`}
              >
                {btn.icon === 'arrowDown' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                )}
                {btn.icon === 'settings' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                )}
                <span>{btn.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Right Column: Visual Frame */}
        <div className="AboutHero-mediaWrapper">
          <div className="AboutHero-imageCard">
            <img
              src={resolvedImageSrc}
              alt={heroImageAlt}
              className="AboutHero-image"
              loading="eager"
              onError={() => setImgError(true)}
            />
            <div className="AboutHero-imageOverlay"></div>
            
            {/* Global Talent Grid Corridor Badge */}
            <div className="AboutHero-floatingBadge">
              <div className="AboutHero-floatingBadgeDot" aria-hidden="true"></div>
              <div className="AboutHero-floatingBadgeText">
                <span className="AboutHero-floatingBadgeTitle">Global Talent Grid</span>
                <span className="AboutHero-floatingBadgeSubtitle">India • United States • Canada</span>
              </div>
            </div>

            {/* Corner SLA Indicator */}
            <div className="AboutHero-techFrame" aria-label="SLA Protocol: Under 5 hours">
              <span className="AboutHero-techStat">SLA: &lt; 5h</span>
              <span className="AboutHero-techStatus">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
