import React from 'react';
import { useSelector } from 'react-redux';

const Hero = () => {
  const heroData = useSelector((state) => state.industries.hero);

  const badge1 = heroData?.badge1 || '12+ Specialized Industry Sectors';
  const badge2 = heroData?.badge2 || 'Pre-screened Domain SMEs';
  const badge3 = heroData?.badge3 || 'Cross-Border Regulatory Compliance';
  const title = heroData?.title || 'Domain Expertise & ';
  const titleHighlight = heroData?.titleHighlight || 'Industries We Empower';
  const subtitle = heroData?.subtitle || "In today's competitive landscape, organizations require diverse hiring skills to identify and attract top talent across multiple sectors and industries.";
  const stats = heroData?.stats || [
    { value: '48', unit: 'h', label: 'Fast-Track SME Match', accent: 'green' },
    { value: '100', unit: '%', label: 'Audit Pass Rate', accent: 'blue' },
    { value: '98.4', unit: '%', label: 'POD Retention (12mo)', accent: 'green' },
    { value: '0', unit: '#', label: 'Statutory Violations', accent: 'green' },
  ];

  return (
    <section className="IndustriesHero-section">
      <div className="IndustriesHero-bgGlow IndustriesHero-bgGlow--left" aria-hidden="true"></div>
      <div className="IndustriesHero-bgGlow IndustriesHero-bgGlow--right" aria-hidden="true"></div>

      <div className="IndustriesHero-container">
        {/* Badges / Pill row */}
        <div className="IndustriesHero-badgesRow">
          <span className="IndustriesHero-badge">
            <span className="IndustriesHero-dotPulse"></span>
            {badge1}
          </span>
          <span className="IndustriesHero-badge IndustriesHero-badge--subtle">
            <span className="material-symbols-outlined IndustriesHero-icon">verified</span>
            {badge2}
          </span>
          <span className="IndustriesHero-badge IndustriesHero-badge--subtle">
            <span className="material-symbols-outlined IndustriesHero-icon">policy</span>
            {badge3}
          </span>
        </div>

        {/* Hero Heading */}
        <h1 className="IndustriesHero-title">
          {title}{' '}
          <span className="IndustriesHero-gradientText">{titleHighlight}</span>
        </h1>

        <p className="IndustriesHero-subtitle">
          {subtitle}
        </p>

        {/* Action Buttons */}
        <div className="IndustriesHero-actions">
          <a href="#sectors-catalog" className="IndustriesHero-primaryBtn">
            Explore Sector Matrix
            <span className="material-symbols-outlined">arrow_downward</span>
          </a>
          <a href="#capability-briefing" className="IndustriesHero-secondaryBtn">
            Request Sector Capability Briefing
            <span className="material-symbols-outlined">article</span>
          </a>
        </div>

        {/* Key Metrics / Stats Bar */}
        <div className="IndustriesHero-statsBar">
          {stats.map((stat, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <div className="IndustriesHero-statDivider"></div>}
              <div className="IndustriesHero-statItem">
                <div className="IndustriesHero-statValue">
                  {stat.value}
                  <span className={`IndustriesHero-statAccent ${stat.accent === 'blue' ? 'IndustriesHero-statAccent--blue' : ''}`}>
                    {stat.unit}
                  </span>
                </div>
                <span className="IndustriesHero-statLabel">{stat.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
