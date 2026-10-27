import React from 'react';

const EorHero = ({ data }) => {
  if (!data) return null;
  const {
    badge,
    heading,
    description,
    badges = [],
    ctaScheduleText,
    ctaExploreText,
    complianceDeck = {},
  } = data;

  return (
    <section className="Payroll-heroSection">
      <div className="Payroll-ambientGlowCobalt"></div>
      <div className="Payroll-ambientGlowEmerald"></div>

      <div className="Payroll-heroContainer">
        <div className="Payroll-heroGrid">
          {/* Left Column */}
          <div className="Payroll-heroContent">
            <div className="Payroll-badge">
              <span className="Payroll-badgeDot"></span>
              <span className="Payroll-badgeText">{badge}</span>
            </div>

            <h1 className="Payroll-heroHeadline">{heading}</h1>

            <p className="Payroll-heroDesc">{description}</p>

            {/* Badges strip */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                paddingTop: '0.25rem',
              }}
            >
              {badges.map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: '16px',
                      color: 'var(--color-emerald-accent, #22c55e)',
                    }}
                  >
                    {b.icon}
                  </span>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>

            <div className="Payroll-heroActions">
              <a href="#consultation-form" className="Payroll-btnPrimary">
                <span>{ctaScheduleText}</span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '18px' }}
                >
                  arrow_forward
                </span>
              </a>

              <a href="#comparison" className="Payroll-btnSecondary">
                <span>{ctaExploreText}</span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '18px' }}
                >
                  public
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Live Compliance Deck */}
          <div className="Payroll-telemetryCard">
            <div className="Payroll-telemetryHeader">
              <div className="Payroll-telemetryTitleWrap">
                <span className="Payroll-telemetryLiveDot"></span>
                <span className="Payroll-telemetryTitle">
                  {complianceDeck.title}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                {complianceDeck.subtitle}
              </span>
            </div>

            {/* Mini ribbon */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.6875rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    display: 'block',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  Target Coverage
                </span>
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#ffffff',
                  }}
                >
                  {complianceDeck.targetCoverage}
                </span>
              </div>

              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.6875rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    display: 'block',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  Avg. Provisioning
                </span>
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: 'var(--color-emerald-accent, #22c55e)',
                  }}
                >
                  {complianceDeck.avgProvisioning}
                </span>
              </div>
            </div>

            {/* Status rows */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              {(complianceDeck.statusRows || []).map((row, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(15, 23, 42, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '20px',
                        color:
                          row.statusType === 'emerald'
                            ? 'var(--color-emerald-accent, #22c55e)'
                            : '#60a5fa',
                      }}
                    >
                      {row.icon}
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          color: '#ffffff',
                        }}
                      >
                        {row.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        {row.desc}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.25rem',
                      backgroundColor:
                        row.statusType === 'emerald'
                          ? 'rgba(34, 197, 94, 0.2)'
                          : 'rgba(59, 130, 246, 0.2)',
                      color:
                        row.statusType === 'emerald'
                          ? 'var(--color-emerald-accent, #22c55e)'
                          : '#60a5fa',
                    }}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8125rem',
                color: 'rgba(255, 255, 255, 0.7)',
                paddingTop: '0.25rem',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '16px',
                    color: 'var(--color-emerald-accent, #22c55e)',
                  }}
                >
                  mail
                </span>
                HR Advisory Desk: hr@thinkwires.com
              </span>
              <span
                style={{
                  color: 'var(--color-emerald-accent, #22c55e)',
                  fontWeight: 700,
                }}
              >
                {complianceDeck.slaText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EorHero;
