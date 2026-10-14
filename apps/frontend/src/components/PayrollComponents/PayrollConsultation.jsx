import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitPayrollConsultation, resetSubmitStatus } from '../../store/slices/payrollSlice';

const PayrollConsultation = ({ data }) => {
  const dispatch = useDispatch();
  const { submitStatus, submitMessage } = useSelector((state) => state.payroll || {});

  const [form, setForm] = useState({
    companyName: '',
    fullName: '',
    employeeSize: '',
    serviceReq: 'Payroll Outsourcing',
    phoneNumber: '',
    emailAddress: '',
  });

  if (!data) return null;
  const { eyebrow, heading, description, hqDetails = {} } = data;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitPayrollConsultation(form));
  };

  return (
    <section className="Payroll-sectionShell" id="consultation-form" style={{ backgroundColor: 'var(--color-surface-container-low, #f3f2fe)' }}>
      <div className="Payroll-sectionContainer">
        <div className="Payroll-consultationGrid">
          {/* Left: HQ Details */}
          <div>
            <span className="Payroll-sectionEyebrow emerald">{eyebrow}</span>
            <h2 className="Payroll-sectionTitle">{heading}</h2>
            <p className="Payroll-sectionDesc">{description}</p>

            <div className="Payroll-hqCard">
              <h3 className="Payroll-hqTitle">{hqDetails.title}</h3>

              <div className="Payroll-hqItem">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
                  location_on
                </span>
                <div>
                  <strong>Noida Corporate Campus</strong>
                  <span>{hqDetails.address}</span>
                </div>
              </div>

              <div className="Payroll-hqItem">
                <span className="material-symbols-outlined text-emerald-accent" style={{ fontSize: '20px' }}>
                  call
                </span>
                <div>
                  <strong>Direct Operations Hotline</strong>
                  <a href={`tel:${hqDetails.hotline}`} style={{ color: 'var(--color-primary, #0037b0)', fontWeight: 700 }}>
                    {hqDetails.hotline}
                  </a>
                </div>
              </div>

              <div className="Payroll-hqItem">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
                  mail
                </span>
                <div>
                  <strong>Enterprise Inquiries</strong>
                  <a href={`mailto:${hqDetails.email}`} style={{ color: 'var(--color-primary, #0037b0)' }}>
                    {hqDetails.email}
                  </a>
                </div>
              </div>

              <div className="Payroll-hqItem">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
                  schedule
                </span>
                <div>
                  <strong>Operations Window</strong>
                  <span>{hqDetails.hours}</span>
                </div>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-card-stroke, #e2e8f0)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-outline, #747686)', marginBottom: '0.5rem' }}>
                  Cross-Border Operations
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', fontWeight: 600 }}>
                  {(hqDetails.regions || []).map((reg, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span className="Payroll-bulletDot" style={{ backgroundColor: 'var(--color-emerald-accent, #22c55e)' }}></span>
                      {reg}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Consultation Form */}
          <div className="Payroll-formCard">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy-dark, #0f172a)', margin: '0 0 0.5rem 0' }}>
              Request Free Consultation
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant, #434655)', margin: '0 0 1.75rem 0' }}>
              Fill out the parameters below and a Senior Payroll Solutions Architect will prepare a customized compliance evaluation within 2 hours.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="Payroll-formRowGrid">
                <div className="Payroll-formField">
                  <label className="Payroll-formLabel" htmlFor="companyName">
                    Company Name *
                  </label>
                  <div className="Payroll-inputWrapper">
                    <span className="material-symbols-outlined Payroll-inputIcon">business</span>
                    <input
                      className="Payroll-input"
                      id="companyName"
                      name="companyName"
                      placeholder="e.g. Acme Technologies Corp"
                      required
                      value={form.companyName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="Payroll-formField">
                  <label className="Payroll-formLabel" htmlFor="fullName">
                    Full Name *
                  </label>
                  <div className="Payroll-inputWrapper">
                    <span className="material-symbols-outlined Payroll-inputIcon">person</span>
                    <input
                      className="Payroll-input"
                      id="fullName"
                      name="fullName"
                      placeholder="e.g. Alex Morgan"
                      required
                      value={form.fullName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="Payroll-formRowGrid">
                <div className="Payroll-formField">
                  <label className="Payroll-formLabel" htmlFor="employeeSize">
                    Employee Size *
                  </label>
                  <div className="Payroll-inputWrapper">
                    <span className="material-symbols-outlined Payroll-inputIcon">groups</span>
                    <select
                      className="Payroll-select"
                      id="employeeSize"
                      name="employeeSize"
                      required
                      value={form.employeeSize}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Select employee size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                    <span className="material-symbols-outlined Payroll-selectArrow">expand_more</span>
                  </div>
                </div>

                <div className="Payroll-formField">
                  <label className="Payroll-formLabel" htmlFor="serviceReq">
                    Service Required *
                  </label>
                  <div className="Payroll-inputWrapper">
                    <span className="material-symbols-outlined Payroll-inputIcon">mobile_arrow_right</span>
                    <select
                      className="Payroll-select"
                      id="serviceReq"
                      name="serviceReq"
                      required
                      value={form.serviceReq}
                      onChange={handleChange}
                    >
                      <option value="Payroll Outsourcing">Payroll Outsourcing</option>
                      <option value="Staff Augmentation">Staff Augmentation</option>
                      <option value="Employer of Record">Employer of Record (EOR)</option>
                      <option value="Permanent Staffing">Permanent Staffing & Executive Search</option>
                      <option value="Other">Other Advisory Services</option>
                    </select>
                    <span className="material-symbols-outlined Payroll-selectArrow">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="Payroll-formRowGrid">
                <div className="Payroll-formField">
                  <label className="Payroll-formLabel" htmlFor="phoneNumber">
                    Phone Number *
                  </label>
                  <div className="Payroll-inputWrapper">
                    <span className="material-symbols-outlined Payroll-inputIcon">call</span>
                    <input
                      className="Payroll-input"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="+91 98765 43210"
                      required
                      type="tel"
                      value={form.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="Payroll-formField">
                  <label className="Payroll-formLabel" htmlFor="emailAddress">
                    Work Email ID *
                  </label>
                  <div className="Payroll-inputWrapper">
                    <span className="material-symbols-outlined Payroll-inputIcon">mail</span>
                    <input
                      className="Payroll-input"
                      id="emailAddress"
                      name="emailAddress"
                      placeholder="alex@company.com"
                      required
                      type="email"
                      value={form.emailAddress}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="Payroll-formSubmitBtn"
                disabled={submitStatus === 'loading'}
              >
                <span>{submitStatus === 'loading' ? 'Submitting...' : 'Get Free Consultation'}</span>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  arrow_forward
                </span>
              </button>

              {submitStatus === 'succeeded' && (
                <div className="Payroll-successBanner">
                  <span className="material-symbols-outlined text-emerald-accent" style={{ fontSize: '24px' }}>
                    verified
                  </span>
                  <span>{submitMessage || 'Thank you! Your request is queued. Our compliance lead will call within 120 minutes.'}</span>
                </div>
              )}

              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-outline, #747686)', marginTop: '0.5rem' }}>
                Protected by Enterprise SLA NDA • Zero obligation • ISO 27001 Data Privacy Guaranteed
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PayrollConsultation;
