import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ScreeningAssessmentModal from './ScreeningAssessmentModal';

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
    const empType =
      jobData?.employmentType ||
      jobData?.jobMode ||
      jobData?.type ||
      'Permanent';
    const postDate =
      jobData?.postingDate ||
      (jobData?.postedDate
        ? new Date(jobData.postedDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Active Mandate');

    return {
      jobId: jobData?.jobId || jobData?.id || jobData?._id || 'general-pool',
      title:
        jobData?.title ||
        jobData?.jobTitle ||
        jobData?.roleTitle ||
        'General Engineering Candidate Pool',
      department: jobData?.department || jobData?.category || 'Engineering',
      location: jobData?.location || 'Remote',
      employmentType: empType,
      postingDate: postDate,
    };
  }, [jobData]);

  // Helper to generate redirect URL with complete job context
  const getApplyUrl = () => {
    return `/jobs/${encodeURIComponent(normalizedJob.jobId)}/apply?title=${encodeURIComponent(
      normalizedJob.title
    )}&department=${encodeURIComponent(normalizedJob.department)}&location=${encodeURIComponent(
      normalizedJob.location
    )}&employmentType=${encodeURIComponent(normalizedJob.employmentType)}&postingDate=${encodeURIComponent(
      normalizedJob.postingDate
    )}`;
  };

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
    state:
      user?.location && user.location.includes(',')
        ? user.location.split(',')[1].trim()
        : '',

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
    agreedToTerms: false,
  }));

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [parsingResume, setParsingResume] = useState(false);
  const [autoFillNotice, setAutoFillNotice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [duplicateApp, setDuplicateApp] = useState(null);

  // Assessment Gatekeeper state
  const [createdApp, setCreatedApp] = useState(null);
  const [createdAssessment, setCreatedAssessment] = useState(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === 'Escape' &&
        isOpen &&
        !submitting &&
        !isAssessmentModalOpen
      ) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, submitting, isAssessmentModalOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * Pre-fill form from Candidate Portal Profile
   */
  const handleFillFromProfile = () => {
    const parts = splitCandidateName(user?.name);
    setFormData({
      lastName: parts.last || '',
      firstName: parts.first || '',
      mobileNumber: user?.phone || '',
      email: user?.email || '',
      applicationType: 'Permanent',
      noticePeriod: 'Immediate',
      city: user?.location ? user.location.split(',')[0].trim() : '',
      state:
        user?.location && user.location.includes(',')
          ? user.location.split(',')[1].trim()
          : '',
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
      candidateNote: user?.bio || '',
    });
    setAutoFillNotice('Form pre-filled from profile.');
  };

  /**
   * Reset all form fields to fill from scratch
   */
  const handleClearForm = () => {
    setFormData({
      lastName: '',
      firstName: '',
      mobileNumber: '',
      email: '',
      applicationType: 'Permanent',
      noticePeriod: 'Immediate',
      city: '',
      state: '',
      totalExperienceYears: '',
      relevantExperienceYears: '',
      currentEmployer: '',
      currentCTC: '',
      expectedCTC: '',
      skillSet: '',
      linkedInLink: '',
      facebookLink: '',
      candidateNote: '',
      agreedToTerms: false,
    });
    setResumeFile(null);
    setAutoFillNotice('Form cleared.');
  };

  /**
   * Upload resume and trigger AI extraction for auto-fill
   */
  const handleFileChange = async (e) => {
    setResumeError('');
    setAutoFillNotice('');
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

      // Trigger automatic AI resume parsing & form auto-fill
      setParsingResume(true);
      try {
        const parseData = new FormData();
        parseData.append('resume', file);
        const res = await fetch('/api/candidate/parse-resume', {
          method: 'POST',
          credentials: 'include',
          body: parseData,
        });

        const data = await res.json();
        if (res.ok && data.parsed) {
          const p = data.parsed;
          setFormData((prev) => ({
            ...prev,
            firstName: p.firstName || prev.firstName,
            lastName: p.lastName || prev.lastName,
            email: p.email || prev.email,
            mobileNumber: p.mobileNumber || prev.mobileNumber,
            city: p.city || prev.city,
            state: p.state || prev.state,
            totalExperienceYears:
              p.totalExperienceYears || prev.totalExperienceYears,
            skillSet: p.skillSet || prev.skillSet,
            linkedInLink: p.linkedInLink || prev.linkedInLink,
            candidateNote: p.candidateNote || prev.candidateNote,
          }));
          setAutoFillNotice('Resume parsed. Details auto-filled.');
        }
      } catch (parseErr) {
        console.warn(
          'AI resume auto-fill non-blocking warning:',
          parseErr.message
        );
      } finally {
        setParsingResume(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDuplicateApp(null);

    // Strictly enforce candidate authentication (No guest applications)
    if (!isAuthenticated) {
      setError('Sign in required. Only logged-in users can apply.');
      setTimeout(() => {
        onClose();
        navigate(`/login?redirect=${encodeURIComponent(getApplyUrl())}`);
      }, 1000);
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
    if (!formData.agreedToTerms) {
      setError(
        'Please agree to the Terms & Conditions and Privacy Policy before submitting your application.'
      );
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
      dataPayload.append(
        'totalExperienceYears',
        formData.totalExperienceYears.trim()
      );
      dataPayload.append(
        'relevantExperienceYears',
        formData.relevantExperienceYears.trim()
      );
      dataPayload.append('currentEmployer', formData.currentEmployer.trim());
      dataPayload.append('currentCTC', formData.currentCTC.trim());
      dataPayload.append('expectedCTC', formData.expectedCTC.trim());
      dataPayload.append('skillSet', formData.skillSet.trim());
      dataPayload.append('linkedInLink', formData.linkedInLink.trim());
      dataPayload.append('facebookLink', formData.facebookLink.trim());
      dataPayload.append('candidateNote', formData.candidateNote.trim());
      dataPayload.append('agreedToTerms', 'true');

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
        setSuccess('Application submitted. Redirecting to My Applications...');
        setCreatedApp(data.application || { _id: 'app_new' });
        setCreatedAssessment(data.assessment);
        setTimeout(() => {
          navigate('/candidate/applications?applied=true', { replace: true });
        }, 1000);
      } else if (response.status === 409) {
        setDuplicateApp(data.existingApplication || true);
        setError(
          data.error || `You have already applied for "${normalizedJob.title}".`
        );
      } else if (response.status === 401) {
        setError(
          'Your candidate session has expired. Please log in again to submit your application.'
        );
      } else {
        setError(
          data.error ||
            'Failed to submit application. Please verify all fields.'
        );
      }
    } catch {
      setError(
        'Network error connecting to Thinkwires application service. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="ApplyModal-overlay"
      data-lenis-prevent="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-apply-modal-title"
      style={{ zIndex: 9999, overscrollBehavior: 'contain' }}
    >
      <div
        className="ApplyModal-content"
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          overflowY: 'auto',
          maxHeight: '92vh',
          overscrollBehavior: 'contain',
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
        <div
          className="ApplyModal-header"
          style={{
            padding: '1.5rem 1.75rem',
            background: '#0F172A',
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
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
            <span>{normalizedJob.location}</span>
            <span>•</span>
            <span>{normalizedJob.employmentType}</span>
            <span>•</span>
            <span>Posted: {normalizedJob.postingDate}</span>
          </div>
        </div>

        {/* Authentication Notice for Unauthenticated Users */}
        {!isAuthenticated && (
          <div
            style={{
              background: '#FEF2F2',
              borderBottom: '1px solid #FECACA',
              padding: '0.75rem 1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              fontSize: '0.84rem',
              color: '#991B1B',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '18px', color: '#DC2626' }}
              >
                lock
              </span>
              <span>
                <strong>Sign in required.</strong> Only logged-in users can
                apply.
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flexShrink: 0,
              }}
            >
              <Link
                to={`/login?redirect=${encodeURIComponent(getApplyUrl())}`}
                onClick={onClose}
                style={{
                  background: '#003399',
                  color: '#FFFFFF',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>Log In to Apply</span>
              </Link>
              <Link
                to={`/register?redirect=${encodeURIComponent(getApplyUrl())}`}
                onClick={onClose}
                style={{
                  color: '#003399',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  textDecoration: 'underline',
                }}
              >
                Register
              </Link>
            </div>
          </div>
        )}

        {/* Status Alerts */}
        <div
          style={{
            padding: '0 1.75rem',
            marginTop: error || success ? '1.25rem' : 0,
          }}
        >
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
                  style={{
                    color: '#B91C1C',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    fontSize: '0.84rem',
                  }}
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

        {/* Auto-fill Options Toolbar */}
        <div
          style={{
            display: 'flex',
            gap: '0.6rem',
            padding: '0.75rem 1.75rem 0 1.75rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '0.78rem',
              color: '#64748B',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            Form Fill Assistance:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleFillFromProfile}
              style={{
                background: '#E6F4F0',
                color: '#008F68',
                border: '1px solid #A7F3D0',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Pre-fill from Profile
            </button>
            <button
              type="button"
              onClick={handleClearForm}
              style={{
                background: '#F1F5F9',
                color: '#475569',
                border: '1px solid #CBD5E1',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clear Form
            </button>
          </div>
        </div>

        {/* Application Form */}
        <form
          onSubmit={handleSubmit}
          className="ApplyModal-form"
          style={{ padding: '1.25rem 1.75rem', gap: '1.25rem' }}
        >
          {/* SECTION 1: RESUME */}
          <div
            style={{
              borderBottom: '1px solid #E2E8F0',
              paddingBottom: '1.25rem',
            }}
          >
            <h3
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#003399',
                margin: '0 0 0.75rem 0',
              }}
            >
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
              <div
                className="ApplyModal-uploadContent"
                style={{ padding: '1.25rem 1rem' }}
              >
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
                <p
                  className="ApplyModal-uploadText"
                  style={{ margin: 0, fontSize: '0.9rem' }}
                >
                  {resumeFile
                    ? resumeFile.name
                    : user?.resumeUrl
                      ? 'Using existing verified resume (click to replace)'
                      : 'Click to browse or drop resume file'}
                </p>
                <p
                  className="ApplyModal-uploadSubText"
                  style={{ margin: '0.2rem 0 0 0' }}
                >
                  PDF, DOC, DOCX up to 10MB (Automatically auto-fills form upon
                  upload)
                </p>
              </div>
            </div>
            {parsingResume && (
              <div
                style={{
                  marginTop: '0.6rem',
                  padding: '0.5rem 0.85rem',
                  background: '#EFF6FF',
                  borderRadius: '6px',
                  color: '#1D4ED8',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: '1px solid #BFDBFE',
                }}
              >
                <span>Parsing resume and prefilling fields...</span>
              </div>
            )}
            {autoFillNotice && !parsingResume && (
              <div
                style={{
                  marginTop: '0.6rem',
                  padding: '0.5rem 0.85rem',
                  background: '#ECFDF5',
                  borderRadius: '6px',
                  color: '#065F46',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: '1px solid #A7F3D0',
                }}
              >
                <span>{autoFillNotice}</span>
              </div>
            )}
            {resumeError && (
              <span
                style={{
                  color: '#DC2626',
                  fontSize: '0.8rem',
                  marginTop: '0.4rem',
                  display: 'block',
                }}
              >
                {resumeError}
              </span>
            )}
          </div>

          {/* SECTION 2: BASIC INFO */}
          <div
            style={{
              borderBottom: '1px solid #E2E8F0',
              paddingBottom: '1.25rem',
            }}
          >
            <h3
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#003399',
                margin: '0 0 0.85rem 0',
              }}
            >
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
            <h3
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#003399',
                margin: '0 0 0.85rem 0',
              }}
            >
              PROFESSIONAL DETAILS
            </h3>

            <div className="ApplyModal-row">
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="apply-totalExp">
                  Total Experience in Years
                </label>
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
                <label htmlFor="apply-relExp">
                  Relevant Experience in Years
                </label>
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

            <div
              className="ApplyModal-fieldGroup"
              style={{ marginTop: '0.75rem' }}
            >
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

            <div
              className="ApplyModal-fieldGroup"
              style={{ marginTop: '0.75rem' }}
            >
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

            <div
              className="ApplyModal-fieldGroup"
              style={{ marginTop: '0.75rem' }}
            >
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

          {/* Terms & Conditions & Privacy Policy Consent */}
          <div
            className={`ApplyModal-termsBox ${error && !formData.agreedToTerms ? 'has-error' : ''}`}
          >
            <input
              type="checkbox"
              id="apply-agreedToTerms"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              className="ApplyModal-termsCheckbox"
            />
            <label
              htmlFor="apply-agreedToTerms"
              className="ApplyModal-termsLabel"
            >
              I agree to the{' '}
              <Link
                to="/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="ApplyModal-termsLink"
              >
                Terms &amp; Conditions
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="ApplyModal-termsLink"
              >
                Privacy Policy
              </Link>
              . I consent to Thinkwires storing and processing my application
              details and resume for recruitment and placement purposes.
            </label>
          </div>

          {/* Bottom Status Notification visible directly at submit button */}
          {(error || success) && (
            <div
              role="alert"
              style={{
                marginTop: '1.25rem',
                padding: '0.85rem 1.15rem',
                borderRadius: '8px',
                background: error ? '#FEF2F2' : '#F0FDF4',
                border: error ? '1px solid #F87171' : '1px solid #4ADE80',
                color: error ? '#991B1B' : '#166534',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              <span>{error || success}</span>
              {duplicateApp && (
                <Link
                  to="/candidate/applications"
                  onClick={onClose}
                  style={{
                    color: '#B91C1C',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    fontSize: '0.84rem',
                  }}
                >
                  View My Existing Application
                </Link>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="ApplyModal-actions" style={{ marginTop: '0.75rem' }}>
            <button
              type="button"
              className="ApplyModal-btnCancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            {!isAuthenticated ? (
              <button
                type="button"
                className="ApplyModal-btnSubmit"
                onClick={() => {
                  onClose();
                  navigate(
                    `/login?redirect=${encodeURIComponent(getApplyUrl())}`
                  );
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  minWidth: '200px',
                  backgroundColor: '#003399',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '18px' }}
                >
                  lock
                </span>
                <span>Log In to Apply</span>
              </button>
            ) : (
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
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        strokeOpacity="0.25"
                      ></circle>
                      <path d="M12 2a10 10 0 0 1 10 10"></path>
                    </svg>
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* AI Screening Assessment Proctored Modal */}
      {isAssessmentModalOpen && createdApp && (
        <ScreeningAssessmentModal
          isOpen={isAssessmentModalOpen}
          onClose={() => {
            setIsAssessmentModalOpen(false);
            onClose();
            navigate('/candidate/dashboard');
          }}
          applicationId={createdApp._id || createdApp.id}
          initialAssessment={createdAssessment}
          onComplete={() => {
            setTimeout(() => {
              setIsAssessmentModalOpen(false);
              onClose();
              navigate('/candidate/dashboard');
            }, 2500);
          }}
        />
      )}
    </div>
  );
};

export default GlobalJobApplicationForm;
