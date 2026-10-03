import React from 'react';

const Capabilities = () => {
  return (
    <section className={'Capabilities-capabilitiesSection'}>
      <div className={'Capabilities-container'}>
        <div className={'Capabilities-header'}>
          <div className={'Capabilities-headerLeft'}>
            <span className={'Capabilities-sectionLabel'}>CAPABILITIES</span>
            <h2 className={'Capabilities-title'}>
              Fully Integrated HR &amp; Staffing Services
            </h2>
            <p className={'Capabilities-subtitle'}>
              From flexible staff augmentation to comprehensive Employer of
              Record infrastructure, ThinkWires powers your end-to-end talent
              lifecycle.
            </p>
          </div>
          <div className={'Capabilities-headerRight'}>
            <span className={'Capabilities-enterpriseText'}>
              Enterprise Custom Solutions
            </span>
            <button className={'Capabilities-scopeCallBtn'}>
              Schedule Scope Call
            </button>
          </div>
        </div>

        <div className={'Capabilities-cardsGrid'}>
          {/* Card 1 */}
          <div className={'Capabilities-card'}>
            <div
              className={'Capabilities-iconWrapper'}
              style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <div className={'Capabilities-cardHeader'}>
              <span
                className={'Capabilities-cardEyebrow'}
                style={{ color: '#4f46e5' }}
              >
                48-72 HR TURNAROUND
              </span>
              <h3 className={'Capabilities-cardTitle'}>Staff Augmentation</h3>
              <p className={'Capabilities-cardDesc'}>
                Scale your engineering and enterprise squads on-demand with
                senior pre-screened individual contributors or cohesive
                development pods.
              </p>
            </div>
            <ul className={'Capabilities-featureList'}>
              <li>
                <svg
                  className={'Capabilities-checkIcon'}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Flexible month-to-month contracts
              </li>
              <li>
                <svg
                  className={'Capabilities-checkIcon'}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Zero internal sourcing overhead
              </li>
              <li>
                <svg
                  className={'Capabilities-checkIcon'}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Instant replacement guarantee
              </li>
            </ul>
            <a
              href="#"
              className={'Capabilities-exploreLink'}
              style={{ color: '#4f46e5' }}
            >
              Explore Staffing
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>

          {/* Card 2 */}
          <div className={'Capabilities-card'}>
            <div
              className={'Capabilities-iconWrapper'}
              style={{ backgroundColor: '#e0f2fe', color: '#0ea5e9' }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                <line x1="9" y1="22" x2="15" y2="22"></line>
                <line x1="8" y1="6" x2="16" y2="6"></line>
                <line x1="8" y1="10" x2="16" y2="10"></line>
                <line x1="8" y1="14" x2="16" y2="14"></line>
                <line x1="8" y1="18" x2="16" y2="18"></line>
              </svg>
            </div>
            <div className={'Capabilities-cardHeader'}>
              <span
                className={'Capabilities-cardEyebrow'}
                style={{ color: '#64748b' }}
              >
                GLOBAL COMPLIANCE
              </span>
              <h3 className={'Capabilities-cardTitle'}>
                Employer of Record (EOR)
              </h3>
              <p className={'Capabilities-cardDesc'}>
                Hire anywhere in India, the US, and Canada without establishing
                foreign legal entities. We manage compliance, taxes, and local
                benefits seamlessly.
              </p>
            </div>
            <ul className={'Capabilities-featureList'}>
              <li>
                <svg
                  className={'Capabilities-checkIcon'}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Full statutory Indian &amp; US compliance
              </li>
              <li>
                <svg
                  className={'Capabilities-checkIcon'}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Cross-currency automated payroll
              </li>
              <li>
                <svg
                  className={'Capabilities-checkIcon'}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                IP &amp; NDA contract protection
              </li>
            </ul>
            <a
              href="#"
              className={'Capabilities-exploreLink'}
              style={{ color: '#64748b' }}
            >
              Explore EOR Solutions
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>

          {/* Card 3 */}
          <div className={'Capabilities-card'}>
            <div
              className={'Capabilities-iconWrapper'}
              style={{ backgroundColor: '#dcfce7', color: '#10b981' }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div className={'Capabilities-cardHeader'}>
              <span
                className={'Capabilities-cardEyebrow'}
                style={{ color: '#10b981' }}
              >
                EXECUTIVE PLACEMENT
              </span>
              <h3 className={'Capabilities-cardTitle'}>
                Permanent &amp; Search
              </h3>
              <p className={'Capabilities-cardDesc'}>
                Precision headhunting for pivotal VP Engineering, Lead
                Architects, Product Directors, and niche domain specialists who
                drive longevity.
              </p>
            </div>
            <ul className={'Capabilities-featureList'}>
              <li>
                <svg
                  className={'Capabilities-checkIcon'}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Confidential executive sourcing
              </li>
              <li>
                <svg
                  className={'Capabilities-checkIcon'}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                90-day retention warranty
              </li>
              <li>
                <svg
                  className={'Capabilities-checkIcon'}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Behavioral &amp; leadership appraisal
              </li>
            </ul>
            <a
              href="#"
              className={'Capabilities-exploreLink'}
              style={{ color: '#10b981' }}
            >
              Explore Executive Search
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>

          {/* Card 4 */}
          <div className={'Capabilities-card'}>
            <div
              className={'Capabilities-iconWrapper'}
              style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className={'Capabilities-cardHeader'}>
              <span
                className={'Capabilities-cardEyebrow'}
                style={{ color: '#3b82f6' }}
              >
                AUTOMATED OPERATIONS
              </span>
              <h3 className={'Capabilities-cardTitle'}>Payroll Outsourcing</h3>
              <p className={'Capabilities-cardDesc'}>
                End-to-end automated payroll execution, provident fund (PF)
                administration, ESIC compliance, tax withholdings, and employee
                self-service.
              </p>
            </div>
            <ul className={'Capabilities-featureList'}>
              <li>
                <svg
                  className={'Capabilities-checkIcon'}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                100% statutory error-free record
              </li>
              <li>
                <svg
                  className={'Capabilities-checkIcon'}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Digital payslip dispatch portal
              </li>
              <li>
                <svg
                  className={'Capabilities-checkIcon'}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Direct tax authority remittances
              </li>
            </ul>
            <a
              href="#"
              className={'Capabilities-exploreLink'}
              style={{ color: '#3b82f6' }}
            >
              Explore Payroll Systems
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
