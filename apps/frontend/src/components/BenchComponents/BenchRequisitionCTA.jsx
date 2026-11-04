import React, { useState } from 'react';
import API_BASE from '../../utils/apiConfig';

const DOMAIN_OPTIONS = [
  'BFSI',
  'Healthcare',
  'SAP',
  'Cloud',
  'E-Commerce',
  'IT & Software',
  'Engineering',
  'Other',
];

const EXPERIENCE_OPTIONS = [
  '0–2 years',
  '2–5 years',
  '5–8 years',
  '8–12 years',
  '12+ years',
];

const NOTICE_PERIOD_OPTIONS = [
  'Immediate',
  'Less than 15 days',
  '15–30 days',
  '30 days',
  'Flexible',
];

const BenchRequisitionCTA = () => {
  const [formData, setFormData] = useState({
    requiredSkills: '',
    experienceRange: '2–5 years',
    domain: 'IT & Software',
    customDomain: '',
    noticePeriod: 'Immediate',
    workEmail: '',
    contactName: '',
    contactDetails: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Client-side validations
    const skills = formData.requiredSkills.trim();
    if (!skills) {
      setErrorMessage('Please specify your required skills or tech stack.');
      return;
    }

    const email = formData.workEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    const name = formData.contactName.trim();
    if (!name) {
      setErrorMessage('Please provide your contact name.');
      return;
    }

    const finalDomain =
      formData.domain === 'Other'
        ? formData.customDomain.trim() || 'Other'
        : formData.domain;

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      targetRole: skills,
      techStack: skills,
      seniority: formData.experienceRange,
      domain: finalDomain,
      engagementModel: `Bench Requisition: ${finalDomain}`,
      deploymentUrgency: formData.noticePeriod,
      corporateEmail: email,
      fullName: name,
      company: 'Bench Requisition Inquiry',
      phone: formData.contactDetails.trim() || '',
      contactDetails: formData.contactDetails.trim() || '',
      jobDescription: `Demand requisition submitted from Bench Pool. Domain: ${finalDomain}, Experience: ${formData.experienceRange}, Notice: ${formData.noticePeriod}`,
    };

    try {
      const response = await fetch(`${API_BASE}/find-talent/requisition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit requisition.');
      }

      setSuccessMessage(
        'Your technical hiring requisition has been dispatched to our Technical Staffing Director. We will contact you within 5 business hours.'
      );
      setFormData({
        requiredSkills: '',
        experienceRange: '2–5 years',
        domain: 'IT & Software',
        customDomain: '',
        noticePeriod: 'Immediate',
        workEmail: '',
        contactName: '',
        contactDetails: '',
      });
    } catch (err) {
      setErrorMessage(
        err.message || 'Unable to submit your requisition at this time. Please try again or reach out directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="BenchCta-section" aria-label="Highlight Your Demand">
      <div className="BenchCta-container">
        <div className="BenchCta-card BenchRequisition-card">
          <div className="BenchCta-content BenchRequisition-content">
            <span className="BenchCta-tag">DIRECT HIRING REQUISITION</span>
            <h2 className="BenchCta-title">Highlight Your Demand</h2>
            <p className="BenchCta-desc">
              Can’t find your exact stack on today’s active bench? Highlight your specific technical hiring requirements, and our talent directors will compile and vet tailored profiles within 5 business days.
            </p>

            {/* Submission Alerts */}
            {successMessage && (
              <div
                className="BenchRequisition-alert BenchRequisition-alertSuccess"
                role="status"
              >
                <span className="material-symbols-outlined">check_circle</span>
                <div>
                  <strong>Demand Requisition Received!</strong>
                  <p>{successMessage}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div
                className="BenchRequisition-alert BenchRequisition-alertError"
                role="alert"
              >
                <span className="material-symbols-outlined">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Requisition Form */}
            <form onSubmit={handleSubmit} className="BenchRequisition-form">
              <div className="BenchRequisition-grid">
                {/* A. Required Skills / Stack */}
                <div className="BenchRequisition-field full-width">
                  <label htmlFor="req-skills" className="BenchRequisition-label">
                    Required Skills / Stack <span className="req-star">*</span>
                  </label>
                  <input
                    id="req-skills"
                    name="requiredSkills"
                    type="text"
                    className="BenchRequisition-input"
                    placeholder="e.g. React, Node.js, Python, Java, AWS, SAP"
                    value={formData.requiredSkills}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* B. Experience Range */}
                <div className="BenchRequisition-field">
                  <label htmlFor="req-experience" className="BenchRequisition-label">
                    Experience Range
                  </label>
                  <select
                    id="req-experience"
                    name="experienceRange"
                    className="BenchRequisition-select"
                    value={formData.experienceRange}
                    onChange={handleInputChange}
                  >
                    {EXPERIENCE_OPTIONS.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>

                {/* C. Domain */}
                <div className="BenchRequisition-field">
                  <label htmlFor="req-domain" className="BenchRequisition-label">
                    Domain
                  </label>
                  <select
                    id="req-domain"
                    name="domain"
                    className="BenchRequisition-select"
                    value={formData.domain}
                    onChange={handleInputChange}
                  >
                    {DOMAIN_OPTIONS.map((dm) => (
                      <option key={dm} value={dm}>
                        {dm}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Domain if Other selected */}
                {formData.domain === 'Other' && (
                  <div className="BenchRequisition-field full-width">
                    <label htmlFor="req-custom-domain" className="BenchRequisition-label">
                      Specify Other Domain <span className="req-star">*</span>
                    </label>
                    <input
                      id="req-custom-domain"
                      name="customDomain"
                      type="text"
                      className="BenchRequisition-input"
                      placeholder="e.g. EdTech, Telecommunications, Agritech"
                      value={formData.customDomain}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                {/* D. Target Notice Period */}
                <div className="BenchRequisition-field">
                  <label htmlFor="req-notice" className="BenchRequisition-label">
                    Target Notice Period
                  </label>
                  <select
                    id="req-notice"
                    name="noticePeriod"
                    className="BenchRequisition-select"
                    value={formData.noticePeriod}
                    onChange={handleInputChange}
                  >
                    {NOTICE_PERIOD_OPTIONS.map((np) => (
                      <option key={np} value={np}>
                        {np}
                      </option>
                    ))}
                  </select>
                </div>

                {/* E. Work Email */}
                <div className="BenchRequisition-field">
                  <label htmlFor="req-email" className="BenchRequisition-label">
                    Work Email <span className="req-star">*</span>
                  </label>
                  <input
                    id="req-email"
                    name="workEmail"
                    type="email"
                    className="BenchRequisition-input"
                    placeholder="name@company.com"
                    value={formData.workEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* F. Contact Details */}
                <div className="BenchRequisition-field">
                  <label htmlFor="req-name" className="BenchRequisition-label">
                    Contact Name <span className="req-star">*</span>
                  </label>
                  <input
                    id="req-name"
                    name="contactName"
                    type="text"
                    className="BenchRequisition-input"
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="BenchRequisition-field">
                  <label htmlFor="req-details" className="BenchRequisition-label">
                    Contact Details / Preferred Channel
                  </label>
                  <input
                    id="req-details"
                    name="contactDetails"
                    type="text"
                    className="BenchRequisition-input"
                    placeholder="e.g. LinkedIn profile, Slack, or direct email"
                    value={formData.contactDetails}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="BenchRequisition-actionRow">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="BenchCta-btnPrimary BenchRequisition-submitBtn"
                >
                  <span className="material-symbols-outlined">
                    {isSubmitting ? 'hourglass_top' : 'bolt'}
                  </span>
                  <span>
                    {isSubmitting
                      ? 'Dispatching Requisition...'
                      : 'Dispatch Custom Pod Requisition'}
                  </span>
                </button>
              </div>
            </form>

            {/* Note with mailto link */}
            <div className="BenchRequisition-hrNote">
              Can't find your exact stack? Speak with our Technical Director at{' '}
              <a
                href="mailto:hr@thinkwires.com"
                className="BenchRequisition-hrLink"
              >
                hr@thinkwires.com
              </a>
            </div>
          </div>

          {/* Right Visual Stats Column */}
          <div className="BenchCta-graphic">
            <div className="BenchCta-statBox">
              <span className="BenchCta-statNumber">5 Days</span>
              <span className="BenchCta-statLabel">
                Custom Pod Delivery SLA
              </span>
            </div>
            <div className="BenchCta-statBox">
              <span className="BenchCta-statNumber">100%</span>
              <span className="BenchCta-statLabel">
                IP Ownership from Day 1
              </span>
            </div>
            <div className="BenchCta-statBox">
              <span className="BenchCta-statNumber">&lt; 5h</span>
              <span className="BenchCta-statLabel">
                Director Intake Calibration
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenchRequisitionCTA;
