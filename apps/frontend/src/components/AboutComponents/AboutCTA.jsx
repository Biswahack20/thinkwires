import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitConsultation, resetConsultationStatus } from '../../store/slices/aboutSlice';

const AboutCTA = ({ data }) => {
  const dispatch = useDispatch();
  const { consultationStatus, consultationMessage, bookingRef, isConsultationMock } = useSelector((state) => state.about || {});

  const {
    statusBadge = 'IMMEDIATE ADVISORY AVAILABILITY',
    heading = 'Ready to Build Your High-Velocity Engineering Squad?',
    description = 'Book a 20-minute workforce strategy consultation with our staffing directors to audit your technical requirements and receive benchmark rates for India and North America.',
    address = {
      title: 'ThinkWires Global Headquarters',
      line: 'Plot No. 20, Block H-1/A, Sector 63, Noida, Uttar Pradesh 201301'
    },
    phones = ['+91 (120) 450-8800', '+91 89205 55626'],
    email = 'connect@thinkwires.com',
    hours = 'Monday - Friday: 9:00 AM - 7:00 PM IST (EST/PST Overlap Supported)',
    form = {}
  } = data || {};

  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phone: '',
    primaryNeed: 'Staff Augmentation',
    techRoles: '',
    honeypot: '' // Spam prevention bot trap
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    }
    if (!formData.workEmail.trim()) {
      errors.workEmail = 'Work Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.workEmail.trim())) {
        errors.workEmail = 'Please provide a valid work email address.';
      }
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Bot detection check
    if (formData.honeypot) {
      console.warn('Bot submission blocked.');
      return;
    }

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    dispatch(submitConsultation({
      fullName: formData.fullName,
      workEmail: formData.workEmail,
      phone: formData.phone,
      primaryNeed: formData.primaryNeed,
      techRoles: formData.techRoles
    }));
  };

  const handleReset = () => {
    dispatch(resetConsultationStatus());
    setFormData({
      fullName: '',
      workEmail: '',
      phone: '',
      primaryNeed: 'Staff Augmentation',
      techRoles: '',
      honeypot: ''
    });
    setFieldErrors({});
  };

  return (
    <section id="contact" className="AboutCTA-section" aria-label="Strategy Consultation and Corporate Contact">
      <div className="AboutCTA-container">
        {/* Left Information Column */}
        <div className="AboutCTA-info">
          <div className="AboutCTA-statusBadge">
            <span className="AboutCTA-statusDot" aria-hidden="true"></span>
            <span>{statusBadge}</span>
          </div>

          <h2 className="AboutCTA-heading">{heading}</h2>
          <p className="AboutCTA-description">{description}</p>

          <div className="AboutCTA-contactDetails">
            {/* Headquarters Card */}
            <div className="AboutCTA-detailItem">
              <div className="AboutCTA-iconBox" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <span className="AboutCTA-detailTitle">{address.title}</span>
                <address className="AboutCTA-detailText" style={{ fontStyle: 'normal' }}>{address.line}</address>
              </div>
            </div>

            {/* Direct Lines */}
            <div className="AboutCTA-detailItem">
              <div className="AboutCTA-iconBox" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div>
                <span className="AboutCTA-detailTitle">Direct Operations Corridors</span>
                <p className="AboutCTA-detailText">
                  {phones.map((phone, idx) => (
                    <span key={idx}>
                      <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="AboutCTA-link">{phone}</a>
                      {idx < phones.length - 1 && ' • '}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            {/* Enterprise Email */}
            <div className="AboutCTA-detailItem">
              <div className="AboutCTA-iconBox" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div>
                <span className="AboutCTA-detailTitle">Enterprise Inquiries</span>
                <p className="AboutCTA-detailText">
                  <a href={`mailto:${email}`} className="AboutCTA-link">{email}</a>
                </p>
              </div>
            </div>

            {/* Operating Hours */}
            {hours && (
              <div className="AboutCTA-detailItem">
                <div className="AboutCTA-iconBox" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <span className="AboutCTA-detailTitle">Operating Timezone</span>
                  <p className="AboutCTA-detailText">{hours}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Form Card */}
        <div className="AboutCTA-formCard">
          <h3 className="AboutCTA-formTitle">{form.title || 'Request a 20-Min Strategy Consultation'}</h3>
          <p className="AboutCTA-formSubtitle">
            {form.subtitle || 'Receive matched engineering dossiers & rate benchmarks in under 5 hours.'}
          </p>

          {consultationStatus === 'succeeded' ? (
            <div className="AboutCTA-successBox" role="status" aria-live="polite">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h4 className="AboutCTA-successHeading">Consultation Request Logged!</h4>
              <p className="AboutCTA-successMsg">
                {consultationMessage || 'Thank you! A senior staffing director will review your requirements and reach out within 5 hours.'}
              </p>

              {bookingRef && (
                <div className="AboutCTA-refBox" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.65rem 1rem', borderRadius: '6px', margin: '0.75rem 0', fontSize: '0.8125rem' }}>
                  <span style={{ color: '#64748B', marginRight: '0.5rem' }}>Reference ID:</span>
                  <strong style={{ color: '#0037B0', fontFamily: 'monospace' }}>{bookingRef}</strong>
                </div>
              )}

              {isConsultationMock && (
                <div className="AboutCTA-mockNotice" style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.5rem 0 1rem 0' }}>
                  <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>SIMULATED SUBMISSION (MOCK MODE)</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="AboutCTA-submitBtn"
                style={{ marginTop: '0.5rem' }}
              >
                Schedule Another Consultation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="AboutCTA-form" noValidate>
              {/* Spam Honeypot */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                tabIndex="-1"
                autoComplete="off"
                style={{ display: 'none' }}
                aria-hidden="true"
              />

              {consultationStatus === 'failed' && (
                <div className="AboutCTA-errorAlert" role="alert">
                  {consultationMessage || 'Unable to submit your request. Please try again.'}
                </div>
              )}

              <div className="AboutCTA-fieldGroup">
                <label className="AboutCTA-label" htmlFor="fullName">
                  Full Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`AboutCTA-input ${fieldErrors.fullName ? 'AboutCTA-input--error' : ''}`}
                  aria-invalid={Boolean(fieldErrors.fullName)}
                />
                {fieldErrors.fullName && (
                  <span className="AboutCTA-fieldErrorText" style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                    {fieldErrors.fullName}
                  </span>
                )}
              </div>

              <div className="AboutCTA-fieldGroup">
                <label className="AboutCTA-label" htmlFor="workEmail">
                  Work Email <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  id="workEmail"
                  name="workEmail"
                  type="email"
                  required
                  placeholder="sarah@enterprise.com"
                  value={formData.workEmail}
                  onChange={handleChange}
                  className={`AboutCTA-input ${fieldErrors.workEmail ? 'AboutCTA-input--error' : ''}`}
                  aria-invalid={Boolean(fieldErrors.workEmail)}
                />
                {fieldErrors.workEmail && (
                  <span className="AboutCTA-fieldErrorText" style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                    {fieldErrors.workEmail}
                  </span>
                )}
              </div>

              <div className="AboutCTA-fieldGroup">
                <label className="AboutCTA-label" htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 019-2834"
                  value={formData.phone}
                  onChange={handleChange}
                  className="AboutCTA-input"
                />
              </div>

              <div className="AboutCTA-fieldGroup">
                <label className="AboutCTA-label" htmlFor="primaryNeed">Primary Need</label>
                <select
                  id="primaryNeed"
                  name="primaryNeed"
                  value={formData.primaryNeed}
                  onChange={handleChange}
                  className="AboutCTA-select"
                >
                  <option value="Staff Augmentation">Staff Augmentation</option>
                  <option value="Permanent Hiring">Permanent Hiring</option>
                  <option value="EOR/Payroll">EOR &amp; Global Payroll</option>
                  <option value="Executive Search">Executive Search</option>
                </select>
              </div>

              <div className="AboutCTA-fieldGroup">
                <label className="AboutCTA-label" htmlFor="techRoles">Tech Roles & Team Size</label>
                <textarea
                  id="techRoles"
                  name="techRoles"
                  rows="3"
                  placeholder="e.g. 3x Senior SAP ABAP developers, 2x Cloud DevOps engineers starting next month"
                  value={formData.techRoles}
                  onChange={handleChange}
                  className="AboutCTA-textarea"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={consultationStatus === 'submitting'}
                className="AboutCTA-submitBtn"
              >
                {consultationStatus === 'submitting' ? (
                  <span className="AboutCTA-btnLoading">Submitting Strategy Request...</span>
                ) : (
                  <>
                    <span>{form.submitLabel || 'Schedule Talent Consultation'}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </>
                )}
              </button>

              <div className="AboutCTA-guarantee">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>{form.footerNote || 'Zero commitments. Non-disclosure agreement guaranteed.'}</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;
