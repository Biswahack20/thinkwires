import React from 'react';
import { Link } from 'react-router-dom';

const StaffAugHero = ({ data, valueProps = [] }) => {
  if (!data) return null;
  const {
    badge,
    heading,
    description,
    ctaConsultationText,
    ctaBenchText,
    trustLine,
    talentReadiness = {}
  } = data;

  return (
    <section className="StaffAug-heroSection">
      <div className="StaffAug-heroContainer">
        {/* Breadcrumb & Top Badge */}
        <div className="StaffAug-badgeRow">
          <nav className="StaffAug-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/services">Services</Link>
            <span className="material-symbols-outlined">chevron_right</span>
            <span className="current">Staff Augmentation</span>
          </nav>
          <span className="divider">|</span>
          <div className="StaffAug-liveBadge">
            <span className="pulse-dot"></span>
            <span>{badge}</span>
          </div>
        </div>

        {/* Main Headline & Readiness Split */}
        <div className="StaffAug-heroMainGrid">
          <div className="StaffAug-heroContent">
            <h1 className="StaffAug-heroHeadline">
              Scale High-Velocity Engineering Squads{' '}
              <span className="StaffAug-headlineGradient">Without Long-Term Overhead.</span>
            </h1>
            <p className="StaffAug-heroDesc">{description}</p>

            <div className="StaffAug-heroCtas">
              <a href="#consultation-form" className="StaffAug-btnPrimary">
                <span className="material-symbols-outlined">calendar_today</span>
                <span>{ctaConsultationText || 'Schedule Workforce Consultation'}</span>
              </a>
              <a href="#bench-pool" className="StaffAug-btnSecondary">
                <span>{ctaBenchText || 'Explore Available Bench (48h SLA)'}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>

            {trustLine && (
              <div className="StaffAug-trustLine">
                <span className="material-symbols-outlined">verified_user</span>
                <span>{trustLine}</span>
              </div>
            )}
          </div>

          {/* Metric Capsule Card */}
          <div className="StaffAug-readinessWrapper">
            <div className="StaffAug-readinessCard">
              <div className="StaffAug-cardTop">
                <span className="label">Talent Readiness</span>
                <span className="pill">
                  <span className="pulse-dot"></span> Live Bench
                </span>
              </div>

              <div className="StaffAug-statRow">
                <div className="stat-number">{talentReadiness.acceptanceRate || '3.4%'}</div>
                <p className="stat-desc">{talentReadiness.acceptanceDesc}</p>
              </div>

              <div className="StaffAug-sparkline">
                <div className="sparkline-header">
                  <span>Deployment Velocity</span>
                  <span className="bold">{talentReadiness.velocity || 'Avg 48 Hours'}</span>
                </div>
                <div className="sparkline-bar">
                  <div
                    className="sparkline-fill"
                    style={{ width: `${talentReadiness.velocityPct || 88}%` }}
                  ></div>
                </div>
              </div>

              <div className="StaffAug-guaranteeBox">
                <div className="icon-box">
                  <span className="material-symbols-outlined">speed</span>
                </div>
                <div className="text-col">
                  <div className="title">{talentReadiness.guaranteeTitle || 'Zero Idle Cost Guarantee'}</div>
                  <div className="sub">{talentReadiness.guaranteeSub || '15-Day Roll-off flexibility'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Value Props in a Row on Desktop */}
        {valueProps.length > 0 && (
          <div className="StaffAug-valuePropsGrid">
            {valueProps.map((prop, idx) => (
              <div key={idx} className="StaffAug-valuePropCard">
                <div className={`icon-box ${prop.accent || 'primary'}`}>
                  <span className="material-symbols-outlined">{prop.icon}</span>
                </div>
                <div className="content">
                  <h3 className="title">{prop.title}</h3>
                  <p className="desc">{prop.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StaffAugHero;
