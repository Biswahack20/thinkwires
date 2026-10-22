import React, { useState } from 'react';
import AnimatedCounter from '../common/AnimatedCounter';
import heroImg from '../../assets/images/about-hero.jpg';

const STITCH_HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDkn9ws0q3IIO-_AlYf62BRxfNQeLGzBJt1PXrpXTOPpBFoKAnZK3w2qwyXnkTYJZoCK7YjNMYE0kY1hLQoIAPIjnoIvwvtAs5k0qRLcdmfqUrlDQazEwzXR0dda_6Pi50i_mZoab2_6td5cAQy9nE6R5ojbmxU0hZR-IEdqlzxkKA1YQm3iSbM0Wqn3Ua74w1sJyPzfJdqbIxkTA5VIbPlJ6t8HNpKjG8KDNkBj7x6jSGPevTxbM3f2Q';

const DEFAULT_STATS = [
  {
    id: 'profile-delivery',
    value: '5h',
    numericValue: 5,
    unit: 'h',
    label: 'First Curated Profiles',
    subLabel: 'Proprietary AI matching engine',
    indicator: 'dot',
    accentColor: 'blue',
  },
  {
    id: 'time-to-hire',
    value: '7d',
    numericValue: 7,
    unit: 'd',
    label: 'Time-to-Hire Target',
    subLabel: 'End-to-end interview to contract',
    indicator: 'check',
    accentColor: 'dark',
  },
  {
    id: 'executive-experience',
    value: '100+',
    numericValue: 100,
    unit: 'Yrs',
    label: 'Combined Executive Exp.',
    subLabel: 'Ex-Microsoft, IBM, BlackRock',
    indicator: 'yrs',
    accentColor: 'primary',
  },
  {
    id: 'statutory-compliance',
    value: '100%',
    numericValue: 100,
    unit: '%',
    label: 'Statutory Compliance',
    subLabel: 'Zero cross-border legal friction',
    indicator: 'shield',
    accentColor: 'green',
  },
];

const AboutHero = ({ data, stats = [] }) => {
  const [imgError, setImgError] = useState(false);

  const {
    badge = 'About ThinkWires • Transforming Global IT Talent Delivery',
    heading = 'Bridging Enterprise Innovation with',
    headingHighlight = 'Borderless Tech Talent',
    description = 'Founded in 2022 as a premier workforce advisor and staffing aggregator, ThinkWires connects high-growth enterprises with specialized engineering talent and compliant Employer of Record (EOR) infrastructure across India, the US, and Canada.',
    heroImage = STITCH_HERO_IMG,
    heroImageAlt = 'Global Talent Grid across India, USA, and Canada',
  } = data || {};

  const resolvedStats = stats && stats.length > 0 ? stats : DEFAULT_STATS;

  const handleScrollTo = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const resolvedImageSrc = imgError ? heroImg : heroImage || heroImg;

  return (
    <section
      className="AboutHero-section"
      aria-label="About ThinkWires Overview"
    >
      {/* Ambient Radial Background Glows matching Stitch */}
      <div className="AboutHero-glowPrimary" aria-hidden="true" />
      <div className="AboutHero-glowAccent" aria-hidden="true" />

      <div className="AboutHero-container">
        {/* Top 2-Column Hero Grid */}
        <div className="AboutHero-grid">
          {/* Left Column: Information */}
          <div className="AboutHero-content">
            {/* Breadcrumb & Live Ping Badge */}
            <div className="AboutHero-tagRow">
              <span className="AboutHero-pillBadge">
                <span className="AboutHero-pingDot" aria-hidden="true" />
                <span>{badge}</span>
              </span>
              <nav className="AboutHero-breadcrumbs" aria-label="Breadcrumb">
                <a href="/" className="AboutHero-breadcrumbLink">
                  Home
                </a>
                <span className="AboutHero-breadcrumbSeparator">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
                <span className="AboutHero-breadcrumbCurrent">Who We Are</span>
              </nav>
            </div>

            {/* Main Title */}
            <h1 className="AboutHero-title">
              {heading}{' '}
              <span className="AboutHero-titleHighlight">
                {headingHighlight}
              </span>
              .
            </h1>

            {/* Description */}
            <p className="AboutHero-description">{description}</p>

            {/* Action CTAs */}
            <div className="AboutHero-actions">
              <a
                href="#leadership"
                onClick={(e) => handleScrollTo(e, '#leadership')}
                className="AboutHero-btn AboutHero-btnPrimary"
              >
                <span>Meet Our Leadership</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </a>

              <a
                href="#model"
                onClick={(e) => handleScrollTo(e, '#model')}
                className="AboutHero-btn AboutHero-btnOutline"
              >
                <span>The Aggregator Model</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="19" cy="6" r="2" />
                  <circle cx="5" cy="6" r="2" />
                  <circle cx="19" cy="18" r="2" />
                  <circle cx="5" cy="18" r="2" />
                  <line x1="12" y1="9" x2="12" y2="15" />
                  <line x1="10" y1="13" x2="6.5" y2="16.5" />
                  <line x1="14" y1="13" x2="17.5" y2="16.5" />
                  <line x1="10" y1="11" x2="6.5" y2="7.5" />
                  <line x1="14" y1="11" x2="17.5" y2="7.5" />
                </svg>
              </a>
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
              <div className="AboutHero-imageOverlay" />

              {/* Global Talent Grid Corridor Badge */}
              <div className="AboutHero-floatingBadge">
                <div
                  className="AboutHero-floatingBadgeDot"
                  aria-hidden="true"
                />
                <div className="AboutHero-floatingBadgeText">
                  <span className="AboutHero-floatingBadgeTitle">
                    Global Talent Grid
                  </span>
                  <span className="AboutHero-floatingBadgeSubtitle">
                    India • United States • Canada
                  </span>
                </div>
              </div>

              {/* Corner SLA Indicator */}
              <div
                className="AboutHero-techFrame"
                aria-label="SLA Protocol: Under 5 hours"
              >
                <span className="AboutHero-techStat">SLA: &lt; 5h</span>
                <span className="AboutHero-techStatus">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Key Value Metrics Bar matching Stitch bottom hero */}
        <div className="AboutHero-metricsWrapper">
          <div className="StatsStrip-card">
            {resolvedStats.map((item, index) => {
              const suffix = item.unit
                ? ` ${item.unit}`
                : item.value && item.value.includes('+')
                  ? '+'
                  : item.value && item.value.includes('%')
                    ? '%'
                    : '';

              return (
                <div key={item.id || index} className="StatsStrip-item">
                  <div className="StatsStrip-topRow">
                    <span className="StatsStrip-value">
                      <AnimatedCounter
                        value={item.numericValue || item.value}
                        suffix={suffix}
                        duration={1600}
                      />
                    </span>

                    {item.indicator === 'dot' && (
                      <span
                        className="StatsStrip-indicatorDot"
                        title="Intake SLA"
                        aria-label="Intake SLA"
                      />
                    )}
                    {item.indicator === 'check' && (
                      <span
                        className="StatsStrip-indicatorIcon"
                        title="Verified Time-to-Hire"
                        aria-label="Verified Time-to-Hire"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                    {item.indicator === 'yrs' && (
                      <span
                        className="StatsStrip-indicatorText"
                        title="Enterprise Depth"
                        aria-label="Enterprise Depth"
                      >
                        Yrs
                      </span>
                    )}
                    {item.indicator === 'shield' && (
                      <span
                        className="StatsStrip-indicatorIcon shield"
                        title="100% Statutory Compliance"
                        aria-label="100% Statutory Compliance"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </span>
                    )}
                  </div>

                  <div className="StatsStrip-label">{item.label}</div>
                  <div className="StatsStrip-subLabel">{item.subLabel}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
