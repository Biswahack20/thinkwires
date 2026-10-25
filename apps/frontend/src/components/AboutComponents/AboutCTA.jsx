import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  submitConsultation,
  resetConsultationStatus,
} from '../../store/slices/aboutSlice';
import ScrollReveal from '../common/ScrollReveal';

const AboutCTA = ({ data }) => {
  const dispatch = useDispatch();
  const {
    consultationStatus,
    consultationMessage,
    bookingRef,
    isConsultationMock,
  } = useSelector((state) => state.about || {});

  const {
    statusBadge = 'Immediate Advisory Availability',
    heading = 'Ready to Build Your High-Velocity Engineering Squad?',
    description = 'Book a 20-minute workforce strategy consultation with our staffing directors to audit your technical requirements and receive benchmark rates for India and North America.',
    address = {
      title: 'ThinkWires Global Headquarters',
      line: 'Plot No: 20, Block: H-1/A, Sector: 63, Noida, Uttar Pradesh 201301',
    },
    email = 'info@thinkwires.com',
  } = data || {};

  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phone: '',
    primaryNeed: 'Staff Augmentation',
    techRoles: '',
    honeypot: '',
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

    if (formData.honeypot) {
      return;
    }

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    dispatch(
      submitConsultation({
        fullName: formData.fullName,
        workEmail: formData.workEmail,
        phone: formData.phone,
        primaryNeed: formData.primaryNeed,
        techRoles: formData.techRoles,
      })
    );
  };

  const handleReset = () => {
    dispatch(resetConsultationStatus());
    setFormData({
      fullName: '',
      workEmail: '',
      phone: '',
      primaryNeed: 'Staff Augmentation',
      techRoles: '',
      honeypot: '',
    });
    setFieldErrors({});
  };

  return (
    <section
      id="contact"
      className="AboutCTA-section"
      aria-label="Strategy Consultation and Corporate Contact"
    >
      <div className="AboutCTA-container">
        {/* Unified Navy Card Shell with Ambient Glow matching Stitch */}
        <div className="AboutCTA-cardShell">
          <div className="AboutCTA-ambientGlow" aria-hidden="true" />

          <div className="AboutCTA-grid">
            {/* Left Information Column */}
            <ScrollReveal
              direction="left"
              distance={40}
              className="AboutCTA-infoCol"
            >
              <div className="AboutCTA-badge">
                <span className="AboutCTA-pulseDot" aria-hidden="true" />
                <span className="AboutCTA-badgeText">{statusBadge}</span>
              </div>

              <h2 className="AboutCTA-heading">{heading}</h2>
              <p className="AboutCTA-description">{description}</p>

              <div className="AboutCTA-detailsList">
                {/* Global HQ */}
                <div className="AboutCTA-detailItem">
                  <span className="AboutCTA-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div className="AboutCTA-itemText">
                    <strong className="AboutCTA-itemTitle">
                      {address.title}
                    </strong>
                    <address className="AboutCTA-itemSub">
                      {address.line}
                    </address>
                  </div>
                </div>

                {/* Enterprise Email */}
                <div className="AboutCTA-detailItem">
                  <span className="AboutCTA-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <div className="AboutCTA-itemText">
                    <a href={`mailto:${email}`} className="AboutCTA-link">
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Form Card */}
            <ScrollReveal
              direction="right"
              distance={40}
              className="AboutCTA-formCardWrapper"
            >
              <div className="AboutCTA-formCard">
                <div className="AboutCTA-formHeader">
                  <h3 className="AboutCTA-formTitle">
                    Request a 20-Min Strategy Call
                  </h3>
                  <p className="AboutCTA-formSubtitle">
                    Receive matched engineering profiles in under 5 hours.
                  </p>
                </div>

                {consultationStatus === 'succeeded' ? (
                  <div
                    className="AboutCTA-successBox"
                    role="status"
                    aria-live="polite"
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <h4 className="AboutCTA-successHeading">
                      Consultation Request Logged!
                    </h4>
                    <p className="AboutCTA-successMsg">
                      {consultationMessage ||
                        'Thank you! A ThinkWires workforce strategist will contact you within 5 working hours.'}
                    </p>

                    {bookingRef && (
                      <div className="AboutCTA-refBox">
                        <span>Reference ID:</span>
                        <strong>{bookingRef}</strong>
                      </div>
                    )}

                    {isConsultationMock && (
                      <div className="AboutCTA-mockBadge">
                        <span>SIMULATED SUBMISSION (MOCK MODE)</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleReset}
                      className="AboutCTA-submitBtn mt-4"
                    >
                      Schedule Another Consultation
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="AboutCTA-form"
                    noValidate
                  >
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
                        {consultationMessage ||
                          'Unable to submit your request. Please try again.'}
                      </div>
                    )}

                    <div className="AboutCTA-formRow2">
                      <div className="AboutCTA-fieldGroup">
                        <label className="AboutCTA-label" htmlFor="ctaFullName">
                          Full Name *
                        </label>
                        <input
                          id="ctaFullName"
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
                          <span className="AboutCTA-errorText">
                            {fieldErrors.fullName}
                          </span>
                        )}
                      </div>

                      <div className="AboutCTA-fieldGroup">
                        <label
                          className="AboutCTA-label"
                          htmlFor="ctaWorkEmail"
                        >
                          Work Email *
                        </label>
                        <input
                          id="ctaWorkEmail"
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
                          <span className="AboutCTA-errorText">
                            {fieldErrors.workEmail}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="AboutCTA-formRow2">
                      <div className="AboutCTA-fieldGroup">
                        <label className="AboutCTA-label" htmlFor="ctaPhone">
                          Phone Number
                        </label>
                        <input
                          id="ctaPhone"
                          name="phone"
                          type="tel"
                          placeholder="+1 (555) 019-2834"
                          value={formData.phone}
                          onChange={handleChange}
                          className="AboutCTA-input"
                        />
                      </div>

                      <div className="AboutCTA-fieldGroup">
                        <label
                          className="AboutCTA-label"
                          htmlFor="ctaPrimaryNeed"
                        >
                          Primary Need
                        </label>
                        <select
                          id="ctaPrimaryNeed"
                          name="primaryNeed"
                          value={formData.primaryNeed}
                          onChange={handleChange}
                          className="AboutCTA-select"
                        >
                          <option value="Staff Augmentation">
                            Staff Augmentation
                          </option>
                          <option value="Employer of Record (EOR)">
                            Employer of Record (EOR)
                          </option>
                          <option value="Permanent Tech Recruitment">
                            Permanent Tech Recruitment
                          </option>
                          <option value="Payroll Outsourcing">
                            Payroll Outsourcing
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="AboutCTA-fieldGroup">
                      <label className="AboutCTA-label" htmlFor="ctaTechRoles">
                        Tech Roles & Team Size
                      </label>
                      <textarea
                        id="ctaTechRoles"
                        name="techRoles"
                        rows="2"
                        placeholder="e.g. 3x Senior SAP ABAP developers, 2x Cloud DevOps engineers starting next month"
                        value={formData.techRoles}
                        onChange={handleChange}
                        className="AboutCTA-textarea"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={consultationStatus === 'submitting'}
                      className="AboutCTA-submitBtn"
                    >
                      {consultationStatus === 'submitting' ? (
                        <span>Submitting Strategy Brief...</span>
                      ) : (
                        <>
                          <span>Schedule Talent Consultation</span>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="AboutCTA-guaranteeText">
                      Zero commitments. Non-disclosure agreement guaranteed.
                    </p>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;
