import React from 'react';

const EorExplanation = ({ data }) => {
  if (!data) return null;
  const {
    eyebrow,
    heading,
    description1,
    description2,
    highlights = [],
    separationModel = {},
  } = data;

  const { clientDirects = {}, thinkWiresManages = {}, bannerImage, bannerCaption } = separationModel;

  return (
    <section className="Payroll-sectionShell" style={{ backgroundColor: 'var(--color-surface, #faf8ff)' }}>
      <div className="Payroll-sectionContainer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          {/* Left Column: Context & Highlights */}
          <div>
            <span className="Payroll-sectionEyebrow secondary">{eyebrow}</span>
            <h2 className="Payroll-sectionTitle">{heading}</h2>
            <p className="Payroll-sectionDesc" style={{ fontSize: '1.05rem', color: 'var(--color-navy-dark, #0f172a)', fontWeight: 500 }}>
              {description1}
            </p>
            <p className="Payroll-sectionDesc" style={{ color: 'var(--color-secondary, #49607e)' }}>
              {description2}
            </p>

            {/* Highlights Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1.75rem' }}>
              {highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--color-surface-container, #ededf9)', border: '1px solid var(--color-card-stroke, #e2e8f0)' }}>
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px', flexShrink: 0 }}>
                    {h.icon}
                  </span>
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--color-navy-dark, #0f172a)' }}>
                      {h.title}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant, #434655)', margin: 0, lineHeight: 1.5 }}>
                      {h.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Architectural Separation Model */}
          <div style={{ backgroundColor: 'var(--color-surface-container-lowest, #ffffff)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--color-card-stroke, #e2e8f0)', boxShadow: '0 16px 36px -10px rgba(15, 23, 42, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-secondary, #49607e)' }}>
                {separationModel.title}
              </div>
              <span className="material-symbols-outlined text-emerald-accent">sync_alt</span>
            </div>

            <div className="Eor-separationGrid">
              <div className="Eor-separationCol client">
                <div className="Eor-separationIcon primary">
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>terminal</span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--color-navy-dark, #0f172a)' }}>
                  {clientDirects.title}
                </h4>
                <ul className="Eor-separationList">
                  {(clientDirects.points || []).map((pt, i) => (
                    <li key={i}>
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>check_circle</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="Eor-separationCol tw">
                <div className="Eor-separationIcon navy">
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>account_balance</span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--color-navy-dark, #0f172a)' }}>
                  {thinkWiresManages.title}
                </h4>
                <ul className="Eor-separationList">
                  {(thinkWiresManages.points || []).map((pt, i) => (
                    <li key={i}>
                      <span className="material-symbols-outlined text-emerald-accent" style={{ fontSize: '16px' }}>check_circle</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {bannerImage && (
              <div className="Eor-separationBanner">
                <img src={bannerImage} alt={bannerCaption} className="Eor-separationBannerImg" />
                <div className="Eor-separationOverlay">{bannerCaption}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EorExplanation;
