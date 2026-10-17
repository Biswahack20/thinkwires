import React from 'react';
import ScrollReveal from '../common/ScrollReveal';

const PayrollPillars = ({ data }) => {
  if (!data) return null;
  const { eyebrow, heading, description, pillars = [] } = data;

  return (
    <section className="Payroll-sectionShell" style={{ backgroundColor: 'var(--color-surface-container-low, #f3f2fe)' }}>
      <div className="Payroll-sectionContainer">
        <ScrollReveal direction="up">
          <div style={{ maxWidth: '780px' }}>
            <span className="Payroll-sectionEyebrow primary">{eyebrow}</span>
            <h2 className="Payroll-sectionTitle">{heading}</h2>
            <p className="Payroll-sectionDesc">{description}</p>
          </div>
        </ScrollReveal>

        <div className="Payroll-pillarsGrid">
          {pillars.map((pillar, idx) => (
            <ScrollReveal key={idx} direction={idx % 2 === 0 ? 'left' : 'right'} delay={idx * 0.1}>
              <div className="Payroll-pillarCard">
                <div>
                  <div className="Payroll-pillarIconBox">
                    <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                      {pillar.icon}
                    </span>
                  </div>
                  <div className="Payroll-pillarStep">{pillar.step}</div>
                  <h3 className="Payroll-pillarTitle">{pillar.title}</h3>
                  <p className="Payroll-pillarDesc">{pillar.description}</p>
                </div>

                <div className="Payroll-pillarHighlight">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    check
                  </span>
                  <span>{pillar.highlight}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PayrollPillars;
