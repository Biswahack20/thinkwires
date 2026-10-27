import React from 'react';
import SectionBadge from '../common/SectionBadge';
import ScrollReveal from '../common/ScrollReveal';

const CompanyOverview = ({ company }) => {
  if (!company) return null;
  const { founded = 2022, overview = {} } = company;

  const eyebrow = overview.eyebrow || 'ABOUT THINKWIRES';
  const title =
    overview.title ||
    'Architecting High-Velocity Engineering Squads for Global Scale';
  const summary =
    overview.summary ||
    company.subheading ||
    'Thinkwires was established in 2022 to dismantle the structural bottlenecks of traditional IT staffing. Operating across high-demand tech corridors in India, the United States, and Canada, we combine the domain depth of an executive search firm with the rapid scalability of an aggregator ecosystem.';
  const mission =
    overview.mission ||
    'To engineer frictionless, compliant, and hyper-targeted talent pipelines that enable technology leaders to build and scale world-class software teams without borders.';

  return (
    <section
      className="CompanyOverview-section"
      aria-label="Company Overview and Strategic Mission"
    >
      <div className="CompanyOverview-container">
        {/* Left Column: Corporate Positioning & Overview */}
        <ScrollReveal
          direction="left"
          distance={60}
          className="CompanyOverview-left"
        >
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            }
          />
          <h2 className="CompanyOverview-title">{title}</h2>
          <p className="CompanyOverview-description">{summary}</p>
        </ScrollReveal>

        {/* Right Column: Mission Card Panel */}
        <ScrollReveal
          direction="right"
          distance={60}
          className="CompanyOverview-right"
        >
          <div className="CompanyOverview-missionCard">
            <div className="CompanyOverview-missionHeader">
              <div className="CompanyOverview-missionIcon" aria-hidden="true">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <div className="CompanyOverview-missionMeta">
                <span className="CompanyOverview-foundedBadge">
                  FOUNDED {founded}
                </span>
                <h3 className="CompanyOverview-missionTitle">
                  Our Core Mission
                </h3>
              </div>
            </div>

            <blockquote className="CompanyOverview-missionQuote">
              "{mission}"
            </blockquote>

            <div className="CompanyOverview-missionFooter">
              <span
                className="CompanyOverview-statusDot"
                aria-hidden="true"
              ></span>
              <span>Borderless Talent Delivery • India, US, Canada</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CompanyOverview;
