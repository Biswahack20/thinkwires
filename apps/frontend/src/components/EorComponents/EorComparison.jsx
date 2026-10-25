import React from 'react';
import ScrollReveal from '../common/ScrollReveal';

const EorComparison = ({ data }) => {
  if (!data) return null;
  const { eyebrow, heading, description, rows = [], strip = {} } = data;

  return (
    <section
      className="Payroll-sectionShell"
      id="comparison"
      style={{ backgroundColor: 'var(--color-surface, #faf8ff)' }}
    >
      <div className="Payroll-sectionContainer">
        <ScrollReveal direction="up">
          <div style={{ maxWidth: '780px', marginBottom: '3rem' }}>
            <span className="Payroll-sectionEyebrow primary">{eyebrow}</span>
            <h2 className="Payroll-sectionTitle">{heading}</h2>
            <p className="Payroll-sectionDesc">{description}</p>
          </div>
        </ScrollReveal>

        {/* Comparative Table */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="Eor-tableWrapper">
            <div className="Eor-tableHeader">
              <div>Operational Factor</div>
              <div>Traditional Entity Setup</div>
              <div style={{ color: 'var(--color-emerald-accent, #22c55e)' }}>
                Thinkwires EOR Solution
              </div>
            </div>

            <div>
              {rows.map((row, idx) => (
                <div key={idx} className="Eor-tableRow">
                  <div className="Eor-tableFactor">{row.factor}</div>
                  <div className="Eor-tableTraditional">{row.traditional}</div>
                  <div className={`Eor-tableTwCell ${row.eorColor}`}>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '18px' }}
                    >
                      {row.eorIcon}
                    </span>
                    <span>{row.eor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom CTA Strip */}
        {strip.title && (
          <ScrollReveal direction="up" delay={0.2}>
            <div className="Eor-ctaStripCard">
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: 'var(--color-tertiary-container, #006a48)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '24px' }}
                  >
                    public
                  </span>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      margin: '0 0 0.25rem 0',
                      color: 'var(--color-navy-dark, #0f172a)',
                    }}
                  >
                    {strip.title}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-on-surface-variant, #434655)',
                      margin: 0,
                    }}
                  >
                    {strip.subtitle}
                  </p>
                </div>
              </div>

              <a
                href="#consultation-form"
                className="Payroll-btnPrimary"
                style={{ whiteSpace: 'nowrap' }}
              >
                {strip.ctaText}
              </a>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default EorComparison;
