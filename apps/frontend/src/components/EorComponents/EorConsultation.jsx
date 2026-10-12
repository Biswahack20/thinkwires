import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitEorConsultation, resetSubmitStatus } from '../../store/slices/eorSlice';

const EorConsultation = ({ data }) => {
  const dispatch = useDispatch();
  const { submitStatus, submitMessage } = useSelector((state) => state.eor || {});

  const [form, setForm] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    targetGeo: 'india',
    headcount: '1-5',
    projectDetails: '',
  });

  if (!data) return null;
  const { eyebrow, heading, description, benefits = [], hq } = data;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitEorConsultation(form));
  };

  return (
    <section className="Payroll-sectionShell" id="consultation-form" style={{ backgroundColor: 'var(--color-navy-dark, #0f172a)', color: '#ffffff' }}>
      <div className="Payroll-sectionContainer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          {/* Left Column */}
          <div>
            <div className="Payroll-badge" style={{ marginBottom: '1.25rem' }}>
              <span className="Payroll-badgeDot"></span>
              <span className="Payroll-badgeText">{eyebrow}</span>
            </div>

            <h2 className="Payroll-heroHeadline" style={{ fontSize: 'clamp(2rem, 3.2vw, 2.75rem)', marginBottom: '1rem' }}>
              {heading}
            </h2>

            <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.65, marginBottom: '1.75rem' }}>
              {description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
              {benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#ffffff' }}>
                  <span className="material-symbols-outlined text-emerald-accent" style={{ fontSize: '20px' }}>
                    verified
                  </span>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              {hq}
            </div>
          </div>

          {/* Right Column: Form */}
          <div style={{ backgroundColor: 'var(--color-surface-container-lowest, #ffffff)', padding: '2rem', borderRadius: '1rem', color: 'var(--color-on-surface, #1a1b23)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="Payroll-formRowGrid">
                <div className="Payroll-formField">
                  <label className="Payroll-formLabel" htmlFor="fullName">Full Name *</label>
                  <input
                    className="Payroll-input"
                    style={{ paddingLeft: '1rem' }}
                    id="fullName"
                    name="fullName"
                    placeholder="e.g. Sarah Jenkins"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="Payroll-formField">
                  <label className="Payroll-formLabel" htmlFor="workEmail">Work Email *</label>
                  <input
                    className="Payroll-input"
                    style={{ paddingLeft: '1rem' }}
                    id="workEmail"
                    name="workEmail"
                    placeholder="sarah@enterprise.com"
                    required
                    type="email"
                    value={form.workEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="Payroll-formRowGrid">
                <div className="Payroll-formField">
                  <label className="Payroll-formLabel" htmlFor="companyName">Company Name *</label>
                  <input
                    className="Payroll-input"
                    style={{ paddingLeft: '1rem' }}
                    id="companyName"
                    name="companyName"
                    placeholder="Acme Software Labs"
                    required
                    value={form.companyName}
                    onChange={handleChange}
                  />
                </div>

                <div className="Payroll-formField">
                  <label className="Payroll-formLabel" htmlFor="targetGeo">Target Geographies *</label>
                  <div className="Payroll-inputWrapper">
                    <select
                      className="Payroll-select"
                      style={{ paddingLeft: '1rem' }}
                      id="targetGeo"
                      name="targetGeo"
                      required
                      value={form.targetGeo}
                      onChange={handleChange}
                    >
                      <option value="india">India (Local & Offshore Tech Squads)</option>
                      <option value="usa">United States (Multi-State Compliance)</option>
                      <option value="canada">Canada (Provincial EOR)</option>
                      <option value="gcc">GCC / Middle East Expansion</option>
                      <option value="multi">Multi-Country Cross Border</option>
                    </select>
                    <span className="material-symbols-outlined Payroll-selectArrow">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Headcount selector */}
              <div className="Payroll-formField">
                <label className="Payroll-formLabel">Estimated Contractor Headcount</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {['1-5', '6-20', '21-50', '50+'].map((hc) => (
                    <button
                      type="button"
                      key={hc}
                      onClick={() => setForm((prev) => ({ ...prev, headcount: hc }))}
                      style={{
                        padding: '0.625rem 0.5rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        border: '1px solid var(--color-card-stroke, #e2e8f0)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: form.headcount === hc ? 'var(--color-primary-container, #1d4ed8)' : 'var(--color-surface-container-low, #f3f2fe)',
                        color: form.headcount === hc ? '#ffffff' : 'var(--color-navy-dark, #0f172a)'
                      }}
                    >
                      {hc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="Payroll-formField">
                <label className="Payroll-formLabel" htmlFor="projectDetails">Hiring Project Details or Timelines</label>
                <textarea
                  id="projectDetails"
                  name="projectDetails"
                  className="Payroll-input"
                  style={{ height: 'auto', padding: '0.75rem 1rem', resize: 'vertical' }}
                  rows="3"
                  placeholder="Briefly describe roles, tech stack (e.g. AWS, Fullstack, DevOps), target start dates..."
                  value={form.projectDetails}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button
                type="submit"
                className="Payroll-formSubmitBtn"
                disabled={submitStatus === 'loading'}
              >
                <span>{submitStatus === 'loading' ? 'Submitting...' : 'Submit EOR Request • 5-Hour SLA'}</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  send
                </span>
              </button>

              {submitStatus === 'succeeded' && (
                <div className="Payroll-successBanner">
                  <span className="material-symbols-outlined text-emerald-accent" style={{ fontSize: '24px' }}>
                    verified
                  </span>
                  <span>{submitMessage || 'Thank you! Your EOR inquiry has been prioritized. An enterprise talent director will reach out within 5 hours.'}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EorConsultation;
