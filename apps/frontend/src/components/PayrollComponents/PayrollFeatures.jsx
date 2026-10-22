import React from 'react';
import ScrollReveal from '../common/ScrollReveal';

const PayrollFeatures = ({ data }) => {
  if (!data) return null;
  const { eyebrow, heading, description, features = [] } = data;

  return (
    <section
      className="Payroll-sectionShell"
      id="compliance-suite"
      style={{
        backgroundColor: 'var(--color-surface-container-lowest, #ffffff)',
      }}
    >
      <div className="Payroll-sectionContainer">
        <ScrollReveal direction="up">
          <div
            style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}
          >
            <span className="Payroll-sectionEyebrow secondary">{eyebrow}</span>
            <h2 className="Payroll-sectionTitle">{heading}</h2>
            <p className="Payroll-sectionDesc">{description}</p>
          </div>
        </ScrollReveal>

        <div className="Payroll-featuresGrid">
          {features.map((feat, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
              <div className="Payroll-featureCard">
                <div className={`Payroll-featureIconBox ${feat.accent}`}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '28px' }}
                  >
                    {feat.icon}
                  </span>
                </div>

                <div className="Payroll-featureBody">
                  <h3 className="Payroll-featureTitle">{feat.title}</h3>
                  <p className="Payroll-featureDesc">{feat.description}</p>

                  <div className="Payroll-featureTags">
                    {(feat.tags || []).map((tag, i) => (
                      <span key={i} className="Payroll-featureTagPill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PayrollFeatures;
