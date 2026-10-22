import React from 'react';
import { useSelector } from 'react-redux';

const BenchHero = () => {
  const { hero, statsBadges } = useSelector((state) => state.bench);

  const fallbackHero = {
    liveRepoBadge: '142 PRE-VETTED TALENTS ON ACTIVE BENCH',
    title: 'Engineers on the Bench. Available to Deploy in 48 Hours.',
    subtitle:
      'Bypass the 60-day hiring cycle. Access active ThinkWires senior contractors, fully vetted with verified code commits, system design scores, and instant contract execution.',
    slaCard: {
      tag: '48-HOUR SLA ASSURANCE',
      title: 'Instant Pod Matching & Zero-Friction EOR Onboarding',
      description:
        'Every engineer has cleared multi-stage system architecture audits and is cleared for immediate client sprints.',
    },
  };

  const currentHero = hero || fallbackHero;

  const defaultBadges = [
    {
      icon: 'bolt',
      title: '48h Deployment SLA',
      desc: 'Contract to sprint kickoff in 2 business days',
    },
    {
      icon: 'verified_user',
      title: 'Top 1.5% Vetted',
      desc: 'Rigorous system design & live code defense',
    },
    {
      icon: 'shield',
      title: 'Zero Placement Risk',
      desc: '2-week satisfaction guarantee on every match',
    },
    {
      icon: 'lock',
      title: '100% IP & NDA Protected',
      desc: 'Enterprise-grade IP assignment & compliance',
    },
    {
      icon: 'trending_up',
      title: 'Flexible Pod Scaling',
      desc: 'Weekly, monthly, or contract-to-hire terms',
    },
  ];

  const badges =
    statsBadges && statsBadges.length > 0 ? statsBadges : defaultBadges;

  return (
    <section className="BenchHero-section">
      <div className="BenchHero-container">
        {/* Live Status Pill */}
        <div className="BenchHero-badgeWrapper">
          <span className="BenchHero-livePill">
            <span className="BenchHero-liveDot"></span>
            {currentHero.liveRepoBadge}
          </span>
          <span className="BenchHero-readyTag">
            <span className="material-symbols-outlined BenchHero-readyIcon">
              check_circle
            </span>
            Immediate Sprint Kickoff
          </span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="BenchHero-content">
          <h1 className="BenchHero-title">
            Engineers on the Bench. <br />
            <span className="BenchHero-highlight">
              Available to Deploy in 48 Hours.
            </span>
          </h1>
          <p className="BenchHero-subtitle">{currentHero.subtitle}</p>
        </div>

        {/* SLA Callout Banner */}
        {currentHero.slaCard && (
          <div className="BenchHero-slaCard">
            <div className="BenchHero-slaHeader">
              <span className="material-symbols-outlined BenchHero-slaIcon">
                speed
              </span>
              <span className="BenchHero-slaTag">
                {currentHero.slaCard.tag}
              </span>
            </div>
            <div className="BenchHero-slaBody">
              <h3 className="BenchHero-slaTitle">
                {currentHero.slaCard.title}
              </h3>
              <p className="BenchHero-slaDesc">
                {currentHero.slaCard.description}
              </p>
            </div>
          </div>
        )}

        {/* 5 SLA Trust Badges */}
        <div className="BenchHero-badgesGrid">
          {badges.map((b, idx) => (
            <div key={idx} className="BenchHero-badgeCard">
              <div className="BenchHero-badgeIconWrap">
                <span className="material-symbols-outlined">{b.icon}</span>
              </div>
              <div className="BenchHero-badgeInfo">
                <h4 className="BenchHero-badgeTitle">{b.title}</h4>
                <p className="BenchHero-badgeDesc">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenchHero;
