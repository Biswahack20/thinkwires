import React from 'react';
import SectionBadge from '../common/SectionBadge';
import ScrollReveal from '../common/ScrollReveal';

const DEFAULT_CARDS = [
  {
    id: 'pillar-1',
    icon: 'timer',
    iconVariant: 'secondary',
    title: 'Rapid Profile Delivery (5 Hours)',
    description:
      'Proprietary matching algorithms search verified repositories to deliver pre-screened, job-fit candidate dossiers within 5 working hours of intake.',
    ctaLabel: 'SLA Guarantee',
    ctaHref: '#methodology',
  },
  {
    id: 'pillar-2',
    icon: 'developer_board',
    iconVariant: 'surface-high',
    title: 'Full-Stack Tech & Enterprise ERP',
    description:
      'Specialized domain depth spanning SAP ABAP/HANA, Adobe Experience Manager (AEM), Teamcenter PLM, Kubernetes/DevOps, and Generative AI frameworks.',
    ctaLabel: 'Deep Tech Benches',
    ctaHref: '#methodology',
  },
  {
    id: 'pillar-3',
    icon: 'gavel',
    iconVariant: 'tertiary-fixed',
    title: 'Zero Compliance Risk',
    description:
      'Complete Employer of Record (EOR) indemnification. We manage local statutory payroll, benefits, strict IP NDA assignments, and multi-jurisdiction tax withholding.',
    ctaLabel: 'Full Statutory Shield',
    ctaHref: '#contact',
  },
  {
    id: 'pillar-4',
    icon: 'share',
    iconVariant: 'primary-fixed',
    title: 'Agile Subcontractor Network',
    description:
      'A curated network of certified boutique recruitment partners providing instant surge capacity without inflating fixed operational overhead.',
    ctaLabel: 'Marketplace Scalability',
    ctaHref: '#contact',
  },
];

const AggregatorModel = ({ data }) => {
  const {
    eyebrow = 'STRATEGIC ADVANTAGE',
    heading = 'The ThinkWires Aggregator Model',
    description = 'Traditional recruitment agencies bottleneck on internal databases. ThinkWires functions as an enterprise staffing aggregator orchestrating a high-velocity ecosystem of verified agencies, independent specialists, and automated compliance pipelines.',
    statusBadge = {
      text: 'Aggregator Architecture 3.2 Active',
    },
    cards = [],
  } = data || {};

  const resolvedCards =
    cards && cards.length > 0
      ? cards.map((c, i) => ({
          ...DEFAULT_CARDS[i],
          ...c,
          title: c.title || DEFAULT_CARDS[i]?.title,
          description: c.description || DEFAULT_CARDS[i]?.description,
          ctaLabel: c.ctaLabel || DEFAULT_CARDS[i]?.ctaLabel,
        }))
      : DEFAULT_CARDS;

  const getPillarIcon = (iconName) => {
    switch (iconName) {
      case 'timer':
      case 'clock':
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      case 'developer_board':
      case 'grid':
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" />
            <line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" />
            <line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" />
            <line x1="20" y1="14" x2="23" y2="14" />
            <line x1="1" y1="9" x2="4" y2="9" />
            <line x1="1" y1="14" x2="4" y2="14" />
          </svg>
        );
      case 'gavel':
      case 'shield':
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 13l-7.5 7.5c-.8.8-2.2.8-3 0a2.1 2.1 0 0 1 0-3L11 10" />
            <path d="M16 16l6-6" />
            <path d="M8 8l6-6" />
            <path d="M9 7l8 8" />
            <path d="M21 11l-8-8" />
          </svg>
        );
      case 'share':
      default:
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        );
    }
  };

  const handleSmoothScroll = (e, href) => {
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="model"
      className="AggregatorModel-section"
      aria-label="The ThinkWires Aggregator Model"
    >
      {/* Hidden legacy anchor for backwards compatibility */}
      <span
        id="aggregator"
        style={{
          position: 'relative',
          top: '-100px',
          display: 'block',
          visibility: 'hidden',
        }}
      />

      <div className="AggregatorModel-container">
        {/* Header Section */}
        <div className="AggregatorModel-header">
          <div className="AggregatorModel-headerLeft">
            <SectionBadge
              text={eyebrow}
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
                  aria-hidden="true"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              }
            />
            <h2 className="AggregatorModel-title">{heading}</h2>
            <p className="AggregatorModel-subtitle">{description}</p>
          </div>

          <div className="AggregatorModel-headerRight">
            <div className="AggregatorModel-statusBadge">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-cobalt-bright"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>
                {statusBadge?.text || 'Aggregator Architecture 3.2 Active'}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="AggregatorModel-grid">
          {resolvedCards.map((card, idx) => (
            <ScrollReveal
              key={card.id || idx}
              direction={idx % 2 === 0 ? 'left' : 'right'}
              delay={idx * 0.08}
              distance={40}
              style={{ display: 'flex' }}
            >
              <div className="AggregatorModel-card" style={{ width: '100%' }}>
                <div
                  className={`AggregatorModel-iconBox AggregatorModel-icon--${card.iconVariant || 'secondary'}`}
                  aria-hidden="true"
                >
                  {getPillarIcon(card.icon)}
                </div>

                <h3 className="AggregatorModel-cardTitle">{card.title}</h3>
                <p className="AggregatorModel-cardDescription">
                  {card.description}
                </p>

                <div className="AggregatorModel-cardFooter">
                  <a
                    href={card.ctaHref || '#'}
                    onClick={(e) => handleSmoothScroll(e, card.ctaHref)}
                    className="AggregatorModel-cardLink"
                  >
                    <span>{card.ctaLabel}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AggregatorModel;
