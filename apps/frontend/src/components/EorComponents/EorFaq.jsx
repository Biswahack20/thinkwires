import React, { useState } from 'react';

const EorFaq = ({ data }) => {
  const [openIdx, setOpenIdx] = useState(0);

  if (!data) return null;
  const { eyebrow, heading, description, sidebar = {}, items = [] } = data;

  const toggle = (idx) => {
    setOpenIdx((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section
      className="Payroll-sectionShell"
      style={{ backgroundColor: 'var(--color-surface-container-low, #f3f2fe)' }}
    >
      <div className="Payroll-sectionContainer">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Heading & Need Tailored Clauses Card */}
          <div>
            <span className="Payroll-sectionEyebrow primary">{eyebrow}</span>
            <h2 className="Payroll-sectionTitle">{heading}</h2>
            <p
              className="Payroll-sectionDesc"
              style={{ marginBottom: '1.75rem' }}
            >
              {description}
            </p>

            <div
              style={{
                backgroundColor:
                  'var(--color-surface-container-lowest, #ffffff)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--color-card-stroke, #e2e8f0)',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  color: 'var(--color-navy-dark, #0f172a)',
                  marginBottom: '0.5rem',
                }}
              >
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontSize: '20px' }}
                >
                  help_center
                </span>
                {sidebar.title}
              </div>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-secondary, #49607e)',
                  lineHeight: 1.55,
                  margin: '0 0 1rem 0',
                }}
              >
                {sidebar.desc}
              </p>
              <a
                href={sidebar.email ? `mailto:${sidebar.email}` : 'mailto:hr@thinkwires.com'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-primary, #0037b0)',
                  textDecoration: 'none',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '16px' }}
                >
                  mail
                </span>
                {sidebar.actionText || 'Email HR & Legal Operations'}
              </a>
            </div>
          </div>

          {/* Right Column: Accordions */}
          <div className="Eor-faqList">
            {items.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="Eor-faqItem">
                  <button
                    type="button"
                    className="Eor-faqBtn"
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <span
                      className={`material-symbols-outlined Eor-faqIcon ${isOpen ? 'rotated' : ''}`}
                    >
                      expand_more
                    </span>
                  </button>

                  {isOpen && (
                    <div className="Eor-faqContent">{item.answer}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EorFaq;
