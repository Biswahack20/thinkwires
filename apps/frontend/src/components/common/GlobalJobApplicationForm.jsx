import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

/**
 * GlobalJobApplicationForm
 *
 * Reusable, production-grade Job Application Form matching the exact specification:
 *
 * 1. Automatically populated job context:
 *    - Job ID, Job Title, Location, Employment Type, Posting Date
 *
 * 2. Form Fields:
 *    Resume:
 *      - Resume upload (PDF/DOC/DOCX up to 10MB)
 *    Basic Information:
 *      - Last Name *
 *      - First Name *
 *      - Mobile Number *
 *      - Email Address *
 *      - Application Type (Permanent / Contract / Freelancer)
 *      - Notice Period (Immediate / 15 Days / Serving NP / 30 Days / 60 Days / 90 Days)
 *      - City
 *      - State
 *    Professional Details:
 *      - Total Experience in Years
 *      - Relevant Experience in Years
 *      - Current Employer
 *      - Current CTC
 *      - Expected CTC
 *      - Skill Set
 *      - LinkedIn Link
 *      - Facebook Link (optional)
 *      - Candidate Note
 *
 * Note: Profile values are offered strictly as editable prefilled defaults,
 * requiring explicit candidate review and submission.
 */
const GlobalJobApplicationForm = ({ isOpen, onClose, jobData = {} }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Normalize incoming dynamic job context
  const normalizedJob = React.useMemo(() => {
    if (typeof jobData === 'string') {
      return {
        jobId: 'general-pool',
        title: jobData,
        department: 'Engineering',
        location: 'Remote',
        employmentType: 'Permanent',
        postingDate: 'Active Mandate',
      };
    }
    const empType = jobData?.employmentType || jobData?.jobMode || jobData?.type || 'Permanent';
    const postDate = jobData?.postingDate || (jobData?.postedDate ? new Date(jobData.postedDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) : 'Active Mandate');

    return {
      jobId: jobData?.jobId || jobData?.id || jobData?._id || 'general-pool',
      title: jobData?.title || jobData?.jobTitle || jobData?.roleTitle || 'General Engineering Candidate Pool',
      department: jobData?.department || jobData?.category || 'Engineering',
      location: jobData?.location || 'Remote',
      employmentType: empType,
      postingDate: postDate,
    };
  }, [jobData]);

  // Split name for prefilling into First & Last name if candidate is logged in
  const splitCandidateName = (fullName = '') => {
    const parts = (fullName || '').trim().split(' ');
    if (parts.length === 1) return { first: parts[0], last: '' };
    const last = parts.pop();
    const first = parts.join(' ');
    return { first, last };
  };

  const nameParts = splitCandidateName(user?.name);

  // Form State: strictly editable
  const [formData, setFormData] = useState(() => ({
    // Basic Info
    lastName: nameParts.last || '',
    firstName: nameParts.first || '',
    mobileNumber: user?.phone || '',
    email: user?.email || '',
    applicationType: 'Permanent',
    noticePeriod: 'Immediate',
    city: user?.location ? user.location.split(',')[0].trim() : '',
    state: user?.location && user.location.includes(',') ? user.location.split(',')[1].trim() : '',

    // Professional Details
    totalExperienceYears: user?.experience ? String(user.experience) : '',
    relevantExperienceYears: '',
    currentEmployer: '',
    currentCTC: '',
    expectedCTC: user?.expectedSalary || '',
    skillSet: Array.isArray(user?.technicalSkills)
      ? user.technicalSkills.join(', ')
      : user?.skills || '',
    linkedInLink: user?.linkedinUrl || '',
    facebookLink: '',
    candidateNote: '',
  }));

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [duplicateApp, setDuplicateApp] = useState(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setResumeError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validExtensions = ['.pdf', '.doc', '.docx'];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (!validExtensions.includes(ext)) {
        setResumeError('Please upload a valid document (.pdf, .doc, .docx).');
        setResumeFile(null);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setResumeError('File size exceeds 10MB limit.');
        setResumeFile(null);
        return;
      }

      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDuplicateApp(null);

    // If candidate is not authenticated, redirect smoothly to login with return redirect
    if (!isAuthenticated) {
      const redirectUrl = `/jobs/${encodeURIComponent(normalizedJob.jobId)}/apply?title=${encodeURIComponent(
        normalizedJob.title
      )}&department=${encodeURIComponent(normalizedJob.department)}&location=${encodeURIComponent(
        normalizedJob.location
      )}&employmentType=${encodeURIComponent(normalizedJob.employmentType)}&postingDate=${encodeURIComponent(
        normalizedJob.postingDate
      )}`;
      onClose();
      navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    // Required field validation
    if (!formData.lastName.trim()) {
      setError('Last Name is required.');
      return;
    }
    if (!formData.firstName.trim()) {
      setError('First Name is required.');
      return;
    }
    if (!formData.mobileNumber.trim()) {
      setError('Mobile Number is required.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email Address is required.');
      return;
    }
    if (!resumeFile && !user?.resumeUrl) {
      setError('Please upload your resume file (PDF, DOC, or DOCX).');
      return;
    }

    setSubmitting(true);
    try {
      // Use FormData to support multipart resume file upload
      const dataPayload = new FormData();
      dataPayload.append('jobId', String(normalizedJob.jobId));
      dataPayload.append('jobTitle', normalizedJob.title);
      dataPayload.append('department', normalizedJob.department);
      dataPayload.append('location', normalizedJob.location);
      dataPayload.append('employmentType', normalizedJob.employmentType);
      dataPayload.append('postingDate', normalizedJob.postingDate);

      // Basic Info
      dataPayload.append('lastName', formData.lastName.trim());
      dataPayload.append('firstName', formData.firstName.trim());
      dataPayload.append('mobileNumber', formData.mobileNumber.trim());
      dataPayload.append('email', formData.email.trim().toLowerCase());
      dataPayload.append('applicationType', formData.applicationType);
      dataPayload.append('noticePeriod', formData.noticePeriod);
      dataPayload.append('city', formData.city.trim());
      dataPayload.append('state', formData.state.trim());

      // Professional Details
      dataPayload.append('totalExperienceYears', formData.totalExperienceYears.trim());
      dataPayload.append('relevantExperienceYears', formData.relevantExperienceYears.trim());
      dataPayload.append('currentEmployer', formData.currentEmployer.trim());
      dataPayload.append('currentCTC', formData.currentCTC.trim());
      dataPayload.append('expectedCTC', formData.expectedCTC.trim());
      dataPayload.append('skillSet', formData.skillSet.trim());
      dataPayload.append('linkedInLink', formData.linkedInLink.trim());
      dataPayload.append('facebookLink', formData.facebookLink.trim());
      dataPayload.append('candidateNote', formData.candidateNote.trim());

      // Attach file if uploaded
      if (resumeFile) {
        dataPayload.append('resume', resumeFile);
        dataPayload.append('resumeOriginalName', resumeFile.name);
      } else if (user?.resumeUrl) {
        dataPayload.append('resumeUrl', user.resumeUrl);
      }

      const response = await fetch('/api/candidate/apply', {
        method: 'POST',
        credentials: 'include',
        body: dataPayload,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Application submitted successfully for "${normalizedJob.title}"! Recruitment notification dispatched.`);
        setTimeout(() => {
          onClose();
          navigate('/candidate/applications');
        }, 1800);
      } else if (response.status === 409) {
        setDuplicateApp(data.existingApplication || true);
        setError(data.error || `You have already applied for "${normalizedJob.title}".`);
      } else if (response.status === 401) {
        setError('Your candidate session has expired. Please log in again to submit your application.');
      } else {
        setError(data.error || 'Failed to submit application. Please verify all fields.');
      }
    } catch {
      setError('Network error connecting to ThinkWires application service. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="ApplyModal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-apply-modal-title"
      style={{ zIndex: 9999 }}
    >
      <div
        className="ApplyModal-content"
        style={{
          maxWidth: '680px',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          overflowY: 'auto',
          maxHeight: '92vh',
        }}
      >
        {/* Dismiss Button */}
        <button
          type="button"
          className="ApplyModal-closeBtn"
          onClick={onClose}
          disabled={submitting}
          aria-label="Close Job Application Modal"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Modal Header */}
        <div className="ApplyModal-header" style={{ padding: '1.5rem 1.75rem', background: '#0F172A', color: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#38BDF8',
              }}
            >
              CANDIDATE DISPATCH INTAKE
            </span>
            {normalizedJob.jobId && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#93C5FD',
                  background: 'rgba(30, 58, 138, 0.5)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  border: '1px solid #1E40AF',
                }}
              >
                ID: {normalizedJob.jobId}
              </span>
            )}
          </div>

          <h2
            id="global-apply-modal-title"
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: '0.4rem 0 0.35rem 0',
              lineHeight: 1.35,
            }}
          >
            Submit Candidate for - {normalizedJob.title}
          </h2>

          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              fontSize: '0.8125rem',
              color: '#CBD5E1',
            }}
          >
            <span>📍 {normalizedJob.location}</span>
            <span>•</span>
            <span>💼 {normalizedJob.employmentType}</span>
            <span>•</span>
            <span>📅 Posted: {normalizedJob.postingDate}</span>
          </div>
        </div>

        {/* Authentication Notice if Guest */}
        {!isAuthenticated && (
          <div
            style={{
              background: '#FEF3C7',
              borderBottom: '1px solid #FDE68A',
              padding: '0.75rem 1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              fontSize: '0.84rem',
              color: '#92400E',
            }}
          >
            <span>
              <strong>Note:</strong> Candidate authentication is required to record applications.
            </span>
            <Link
              to={`/login?redirect=${encodeURIComponent(
                `/jobs/${encodeURIComponent(normalizedJob.jobId)}/apply?title=${encodeURIComponent(
                  normalizedJob.title
                )}&department=${encodeURIComponent(normalizedJob.department)}&location=${encodeURIComponent(
                  normalizedJob.location
                )}&employmentType=${encodeURIComponent(normalizedJob.employmentType)}&postingDate=${encodeURIComponent(
                  normalizedJob.postingDate
                )}`
              )}`}
              onClick={onClose}
              style={{
                color: '#B45309',
                fontWeight: 700,
                textDecoration: 'underline',
                whiteSpace: 'nowrap',
              }}
            >
              Log In Now
            </Link>
          </div>
        )}

        {/* Status Alerts */}
        <div style={{ padding: '0 1.75rem', marginTop: error || success ? '1.25rem' : 0 }}>
          {error && (
            <div
              className="tw-auth-alert tw-auth-alert-error"
              role="alert"
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: '#FEF2F2',
                border: '1px solid #F87171',
                color: '#991B1B',
                fontSize: '0.875rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              <span>{error}</span>
              {duplicateApp && (
                <Link
                  to="/candidate/applications"
                  onClick={onClose}
                  style={{ color: '#B91C1C', fontWeight: 700, textDecoration: 'underline', fontSize: '0.84rem' }}
                >
                  View My Existing Application →
                </Link>
              )}
            </div>
          )}

          {success && (
            <div
              className="tw-auth-alert tw-auth-alert-success"
              role="alert"
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: '#F0FDF4',
                border: '1px solid #4ADE80',
                color: '#166534',
                fontSize: '0.875rem',
              }}
            >
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="ApplyModal-form" style={{ padding: '1.5rem 1.75rem', gap: '1.25rem' }}>
          
          {/* SECTION 1: RESUME */}
          <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#003399', margin: '0 0 0.75rem 0' }}>
              RESUME
            </h3>
            <div className="ApplyModal-uploadBox">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="ApplyModal-fileInput"
                onChange={handleFileChange}
                aria-label="Upload Resume"
              />
              <div className="ApplyModal-uploadContent" style={{ padding: '1.25rem 1rem' }}>
                <svg
                  className="ApplyModal-uploadIcon"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p className="ApplyModal-uploadText" style={{ margin: 0, fontSize: '0.9rem' }}>
                  {resumeFile ? resumeFile.name : (user?.resumeUrl ? 'Using existing verified resume (click to replace)' : 'Click to browse or drop resume file')}
                </p>
                <p className="ApplyModal-uploadSubText" style={{ margin: '0.2rem 0 0 0' }}>
                  PDF, DOC, DOCX up to 10MB
                </p>
              </div>
            </div>
            {resumeError && (
              <span style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>
                {resumeError}
              </span>
            )}
          </div>

          {/* SECTION 2: BASIC INFO */}
          <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#003399', margin: '0 0 0.85rem 0' }}>
              BASIC INFO
            </h3>

            <div className="ApplyModal-row">
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="apply-lastName">Last Name *</label>
                <input
                  id="apply-lastName"
                  type="text"
                  name="lastName"
                  placeholder="e.g. Sharma"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="apply-firstName">First Name *</label>
                <input
                  id="apply-firstName"
                  type="text"
                  name="firstName"
                  placeholder="e.g. Anand"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="ApplyModal-row" style={{ marginTop: '0.75rem' }}>
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="apply-mobile">Mobile Number *</label>
                <input
                  id="apply-mobile"
                  type="tel"
                  name="mobileNumber"
                  placeholder="e.g. +91 98765 43210"
                  required
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="apply-email">Email Address *</label>
                <input
                  id="apply-email"
                  type="email"
                  name="email"
                  placeholder="anand@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="ApplyModal-row" style={{ marginTop: '0.75rem' }}>
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="apply-appType">Application Type</label>
                <select
                  id="apply-appType"
                  name="applicationType"
                  value={formData.applicationType}
                  onChange={handleChange}
                >
                  <option value="Permanent">Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelancer">Freelancer</option>
                </select>
              </div>

              <div className="ApplyModal-fieldGroup">
                <label htmlFor="apply-notice">Notice Period</label>
                <select
                  id="apply-notice"
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleChange}
                >
                  <option value="Immediate">Immediate</option>
                  <option value="15 Days">15 Days</option>
                  <option value="Serving NP">Serving NP</option>
                  <option value="30 Days">30 Days</option>
                  <option value="60 Days">60 Days</option>
                  <option value="90 Days">90 Days</option>
                </select>
              </div>
            </div>

            <div className="ApplyModal-row" style={{ marginTop: '0.75rem' }}>
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="apply-city">City</label>
                <input
                  id="apply-city"
                  type="text"
                  name="city"
                  placeholder="e.g. Bangalore"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="apply-state">State</label>
                <input
                  id="apply-state"
                  type="text"
                  name="state"
                  placeholder="e.g. Karnataka"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PROFESSIONAL DETAILS */}
          <div>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#003399', margin: '0 0 0.85rem 0' }}>
              PROFESSIONAL DETAILS
            </h3>

            <div className="ApplyModal-row">
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="apply-totalExp">Total Experience in Years</label>
                <input
                  id="apply-totalExp"
                  type="text"
                  name="totalExperienceYears"
                  placeholder="e.g. 6.5"
                  value={formData.totalExperienceYears}
                  onChange={handleChange}
                />
              </div>
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="apply-relExp">Relevant Experience in Years</label>
                <input
                  id="apply-relExp"
                  type="text"
                  name="relevantExperienceYears"
                  placeholder="e.g. 5"
                  value={formData.relevantExperienceYears}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="ApplyModal-fieldGroup" style={{ marginTop: '0.75rem' }}>
              <label htmlFor="apply-currentEmp">Current Employer</label>
              <input
                id="apply-currentEmp"
                type="text"
                name="currentEmployer"
                placeholder="e.g. Acme Tech Solutions / Confidential"
                value={formData.currentEmployer}
                onChange={handleChange}
              />
            </div>

            <div className="ApplyModal-row" style={{ marginTop: '0.75rem' }}>
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="apply-currentCTC">Current CTC</label>
                <input
                  id="apply-currentCTC"
                  type="text"
                  name="currentCTC"
                  placeholder="e.g. ₹28 LPA or $95,000"
                  value={formData.currentCTC}
                  onChange={handleChange}
                />
              </div>
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="apply-expectedCTC">Expected CTC</label>
                <input
                  id="apply-expectedCTC"
                  type="text"
                  name="expectedCTC"
                  placeholder="e.g. ₹36 LPA or $120,000"
                  value={formData.expectedCTC}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="ApplyModal-fieldGroup" style={{ marginTop: '0.75rem' }}>
              <label htmlFor="apply-skillSet">Skill Set</label>
              <input
                id="apply-skillSet"
                type="text"
                name="skillSet"
                placeholder="e.g. SAP ABAP, S/4HANA, Node.js, AWS, Kubernetes"
                value={formData.skillSet}
                onChange={handleChange}
              />
            </div>

            <div className="ApplyModal-row" style={{ marginTop: '0.75rem' }}>
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="apply-linkedin">LinkedIn Link</label>
                <input
                  id="apply-linkedin"
                  type="url"
                  name="linkedInLink"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedInLink}
                  onChange={handleChange}
                />
              </div>
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="apply-facebook">Facebook Link (Optional)</label>
                <input
                  id="apply-facebook"
                  type="url"
                  name="facebookLink"
                  placeholder="https://facebook.com/username"
                  value={formData.facebookLink}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="ApplyModal-fieldGroup" style={{ marginTop: '0.75rem' }}>
              <label htmlFor="apply-candidateNote">Candidate Note</label>
              <textarea
                id="apply-candidateNote"
                name="candidateNote"
                rows="3"
                placeholder="Highlight your domain strengths, notice period flexibility, or preferred shift timings..."
                value={formData.candidateNote}
                onChange={handleChange}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--color-card-stroke)',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: 'var(--color-navy-dark)',
                  backgroundColor: 'var(--color-slate-surface)',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="ApplyModal-actions" style={{ marginTop: '0.5rem' }}>
            <button
              type="button"
              className="ApplyModal-btnCancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ApplyModal-btnSubmit"
              disabled={submitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                minWidth: '200px',
              }}
            >
              {submitting ? (
                <>
                  <svg
                    style={{ animation: 'spin 1s linear infinite' }}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10"></path>
                  </svg>
                  <span>Submitting Application...</span>
                </>
              ) : isAuthenticated ? (
                'Submit Application'
              ) : (
                'Log In & Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GlobalJobApplicationForm;
