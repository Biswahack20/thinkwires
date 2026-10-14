import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  submitPermanentStaffingConsultation,
  resetPermConsultationState
} from '../../store/slices/permanentStaffingSlice';

const PermStaffConsultation = ({ data }) => {
  const dispatch = useDispatch();
  const { consultationStatus, consultationMessage, consultationError } = useSelector(
    (state) => state.permanentStaffing || {}
  );

  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    directPhone: '',
    mandateHierarchy: 'C-Suite (CTO / CIO / CDO)',
    targetTimeline: 'Immediate (Under 30 Days)',
    mandateScope: '',
    isConfidential: true
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitPermanentStaffingConsultation(formData));
  };

  if (!data) return null;
  const {
    eyebrow,
    heading,
    description,
    hotline,
    hotlineAvailability,
    hubs = [],
    confidentialityNote
  } = data;

  return (
    <section className="PermStaff-consultationSection" id="consultation-booking">
      <div className="PermStaff-container">
        <div className="PermStaff-consultationCard">
          <div className="glow-effect"></div>
          <div className="consultation-grid">
            {/* Left: Hotline & Corporate Hubs */}
            <div className="consultation-left">
              <div>
                <div className="confidential-pill">
                  <span className="material-symbols-outlined">lock</span>
                  <span>{eyebrow || 'Confidential Mandate Desk'}</span>
                </div>
                <h2 className="consultation-title">{heading || 'Initiate Executive Search Mandate'}</h2>
                <p className="consultation-desc">{description}</p>

                {/* Direct Partner Line Card */}
                <div className="hotline-card">
                  <div className="hl-top">
                    <span className="material-symbols-outlined">phone_in_talk</span>
                    <span>Direct Executive Partner Line</span>
                  </div>
                  <a href={`tel:${(hotline || '').replace(/[^0-9+]/g, '')}`} className="hl-phone">
                    {hotline || '+91 89205 55626'}
                  </a>
                  <p className="hl-note">{hotlineAvailability || 'Available 09:00 AM – 19:00 PM IST • Mon – Fri'}</p>
                </div>

                {/* Hubs */}
                <div className="hubs-list">
                  {hubs.map((hub, idx) => (
                    <div key={idx} className="hub-item">
                      <span className="material-symbols-outlined">
                        {idx === 0 ? 'apartment' : 'public'}
                      </span>
                      <div>
                        <h4>{hub.title}</h4>
                        <p>{hub.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {confidentialityNote && (
                <div className="confidentiality-notice">
                  <span className="notice-label">Confidentiality Guarantee</span>
                  <p>{confidentialityNote}</p>
                </div>
              )}
            </div>

            {/* Right: Booking Form */}
            <div className="consultation-right">
              <h3 className="form-head">Book an Executive Consultation</h3>
              <p className="form-sub">Complete the brief below to receive a curated market comp analysis.</p>

              {consultationStatus === 'succeeded' ? (
                <div className="PermStaff-successCard">
                  <span className="material-symbols-outlined">verified</span>
                  <div>
                    <h4>Search Mandate Logged Confidentially</h4>
                    <p>{consultationMessage || 'A Managing Partner will reach out via secure channel within 2 business hours.'}</p>
                    <button
                      type="button"
                      className="reset-btn"
                      onClick={() => {
                        dispatch(resetPermConsultationState());
                        setFormData({
                          fullName: '',
                          workEmail: '',
                          companyName: '',
                          directPhone: '',
                          mandateHierarchy: 'C-Suite (CTO / CIO / CDO)',
                          targetTimeline: 'Immediate (Under 30 Days)',
                          mandateScope: '',
                          isConfidential: true
                        });
                      }}
                    >
                      Register Another Mandate
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="PermStaff-form">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        required
                        placeholder="e.g. Vikramaditya Sharma"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="workEmail">Work Email *</label>
                      <input
                        type="email"
                        id="workEmail"
                        required
                        placeholder="v.sharma@enterprise.com"
                        value={formData.workEmail}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="companyName">Company / Enterprise *</label>
                      <input
                        type="text"
                        id="companyName"
                        required
                        placeholder="Enterprise Technologies Inc."
                        value={formData.companyName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="directPhone">Direct Phone *</label>
                      <input
                        type="tel"
                        id="directPhone"
                        required
                        placeholder="+1 (415) 555-0192"
                        value={formData.directPhone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="mandateHierarchy">Mandate Hierarchy *</label>
                      <select
                        id="mandateHierarchy"
                        value={formData.mandateHierarchy}
                        onChange={handleChange}
                      >
                        <option>C-Suite (CTO / CIO / CDO)</option>
                        <option>Vice President / Head of Engineering</option>
                        <option>Principal Architect / Director</option>
                        <option>Enterprise ERP (SAP S/4HANA Practice)</option>
                        <option>Permanent Core Engineering Team (5+)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="targetTimeline">Target Timeline *</label>
                      <select
                        id="targetTimeline"
                        value={formData.targetTimeline}
                        onChange={handleChange}
                      >
                        <option>Immediate (Under 30 Days)</option>
                        <option>Q1 Executive Strategic Plan</option>
                        <option>Confidential Succession Replacement</option>
                        <option>GCC Buildout (Quarterly Intake)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="mandateScope">Mandate Scope &amp; Tech Stack Objectives</label>
                    <textarea
                      id="mandateScope"
                      rows="3"
                      placeholder="Outline specific leadership mandates, target headcount, tech requirements, or existing team roadblocks..."
                      value={formData.mandateScope}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="nda-checkbox-box">
                    <input
                      type="checkbox"
                      id="isConfidential"
                      checked={formData.isConfidential}
                      onChange={handleChange}
                    />
                    <label htmlFor="isConfidential">
                      <strong>Strict NDA Confidential Mandate:</strong> Do not publish this search requirement publicly. Require candidate pre-screening NDA before identity disclosure.
                    </label>
                  </div>

                  {consultationError && (
                    <div className="PermStaff-errorMsg">{consultationError}</div>
                  )}

                  <button
                    type="submit"
                    className="submit-mandate-btn"
                    disabled={consultationStatus === 'loading'}
                  >
                    <span className="material-symbols-outlined">send</span>
                    <span>
                      {consultationStatus === 'loading'
                        ? 'Registering Mandate...'
                        : 'Submit Confidential Mandate & Request Partner Call'}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PermStaffConsultation;
