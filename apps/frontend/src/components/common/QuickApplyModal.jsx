import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../store/slices/authSlice';

/**
 * QuickApplyModal
 *
 * A streamlined, high-conversion candidate job application modal.
 * Supports both authenticated candidates and guest applicants with frictionless
 * one-step account creation, AI resume auto-parsing, and instant portal routing.
 */
const QuickApplyModal = ({ isOpen, onClose, jobData = {}, roleTitle = '' }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Normalize target job context
  const normalizedJob = useMemo(() => {
    if (typeof jobData === 'string') {
      return {
        jobId: 'general-pool',
        title: jobData || roleTitle || 'General Engineering Candidate Pool',
        department: 'Global Talent Cloud',
        location: 'Remote / Hybrid',
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
        roleTitle ||
        'General Engineering Candidate Pool',
      department:
        jobData?.department || jobData?.category || 'Global Talent Cloud',
      location: jobData?.location || 'Remote / Hybrid',
      employmentType: empType,
      postingDate: postDate,
    };
  }, [jobData, roleTitle]);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [skills, setSkills] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('Immediate');
  const [candidateNote, setCandidateNote] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Guest Account State (when unauthenticated)
  const [guestMode, setGuestMode] = useState('register'); // 'register' | 'login'
  const [password, setPassword] = useState('');

  // File Upload State
  const [resumeFile, setResumeFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [parsingResume, setParsingResume] = useState(false);
  const [autoFillNotice, setAutoFillNotice] = useState('');
  const fileInputRef = useRef(null);

  // Submission Status
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState('');

  // Prefill authenticated candidate details
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.experience) setExperienceYears(String(user.experience));
      if (Array.isArray(user.technicalSkills)) {
        setSkills(user.technicalSkills.join(', '));
      } else if (user.skills) {
        setSkills(user.skills);
      }
    }
  }, [isAuthenticated, user]);

  // Reset form when modal opens with new job
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess(false);
      setSubmittedAppId('');
      setAutoFillNotice('');
      if (!isAuthenticated) {
        setPassword('');
      }
    }
  }, [isOpen, normalizedJob.jobId, isAuthenticated]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, submitting]);

  if (!isOpen) return null;

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const isDoc =
      allowed.includes(file.type) ||
      file.name.endsWith('.pdf') ||
      file.name.endsWith('.doc') ||
      file.name.endsWith('.docx');

    if (!isDoc) {
      setError('Please upload a PDF, DOC, or DOCX resume file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Resume file exceeds the 10MB limit.');
      return;
    }

    setError('');
    setResumeFile(file);

    // Trigger AI Resume Parsing to auto-populate form fields
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
        const parsedName = [p.firstName, p.lastName].filter(Boolean).join(' ');
        if (parsedName && !fullName) setFullName(parsedName);
        if (p.email && !email) setEmail(p.email);
        if (p.mobileNumber && !phone) setPhone(p.mobileNumber);
        if (p.totalExperienceYears && !experienceYears) {
          setExperienceYears(String(p.totalExperienceYears));
        }
        if (p.skillSet && !skills) setSkills(p.skillSet);
        setAutoFillNotice('Resume analyzed. Form auto-filled with your details.');
      }
    } catch {
      // Non-blocking fallback
    } finally {
      setParsingResume(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field validation
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide a contact phone number.');
      return;
    }
    if (!resumeFile && !user?.resumeUrl) {
      setError('Please upload your resume (PDF, DOC, or DOCX).');
      return;
    }
    if (!agreedToTerms) {
      setError('Please accept the Terms & Conditions to proceed.');
      return;
    }

    // Split name into first and last name for API compatibility
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || 'Candidate';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Applicant';

    setSubmitting(true);

    try {
      // Step 1: Ensure active candidate session
      let candidateSessionActive = isAuthenticated;

      if (!candidateSessionActive) {
        if (!password || password.length < 12) {
          setError(
            'To track your interview status, please enter a password of at least 12 characters.'
          );
          setSubmitting(false);
          return;
        }

        if (guestMode === 'register') {
          const regResult = await dispatch(
            registerUser({
              name: fullName.trim(),
              email: email.trim().toLowerCase(),
              password: password,
              confirmPassword: password,
              phone: phone.trim(),
            })
          );

          if (registerUser.rejected.match(regResult)) {
            // If account already exists, prompt user to log in
            const errMsg = regResult.payload || '';
            if (errMsg.toLowerCase().includes('already exists')) {
              setGuestMode('login');
              setError(
                'An account with this email already exists. Please enter your existing password to submit.'
              );
              setSubmitting(false);
              return;
            }
            throw new Error(errMsg || 'Candidate account registration failed.');
          }
          candidateSessionActive = true;
        } else {
          // Log in existing candidate
          const loginResult = await dispatch(
            loginUser({
              email: email.trim().toLowerCase(),
              password: password,
            })
          );

          if (loginUser.rejected.match(loginResult)) {
            throw new Error(
              loginResult.payload || 'Invalid credentials. Please verify your password.'
            );
          }
          candidateSessionActive = true;
        }
      }

      // Step 2: Build Application Payload
      const payload = new FormData();
      payload.append('jobId', String(normalizedJob.jobId));
      payload.append('jobTitle', normalizedJob.title);
      payload.append('department', normalizedJob.department);
      payload.append('location', normalizedJob.location);
      payload.append('employmentType', normalizedJob.employmentType);
      payload.append('postingDate', normalizedJob.postingDate);

      payload.append('firstName', firstName);
      payload.append('lastName', lastName);
      payload.append('email', email.trim().toLowerCase());
      payload.append('mobileNumber', phone.trim());
      payload.append('totalExperienceYears', experienceYears.trim() || '3');
      payload.append('skillSet', skills.trim());
      payload.append('noticePeriod', noticePeriod);
      payload.append('candidateNote', candidateNote.trim());
      payload.append('agreedToTerms', 'true');

      if (resumeFile) {
        payload.append('resume', resumeFile);
        payload.append('resumeOriginalName', resumeFile.name);
      } else if (user?.resumeUrl) {
        payload.append('resumeUrl', user.resumeUrl);
      }

      // Step 3: Transmit Application
      const res = await fetch('/api/candidate/apply', {
        method: 'POST',
        credentials: 'include',
        body: payload,
      });

      const resData = await res.json();

      if (res.ok) {
        setSubmittedAppId(resData.application?._id || resData.application?.id || 'TW-APP-CONFIRMED');
        setSuccess(true);
      } else if (res.status === 409) {
        setError(
          resData.error || `You have already submitted an active application for ${normalizedJob.title}.`
        );
      } else {
        throw new Error(resData.error || 'Failed to submit application. Please verify all details.');
      }
    } catch (err) {
      setError(err.message || 'Network error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="ApplyModal-overlay QuickApplyModal-overlay"
      data-lenis-prevent="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-apply-title"
    >
      <div className="ApplyModal-content QuickApplyModal-card" role="document">
        <button
          type="button"
          className="ApplyModal-closeBtn QuickApplyModal-close"
          onClick={onClose}
          disabled={submitting}
          aria-label="Close Quick Apply Form"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            close
          </span>
        </button>

        {/* Modal Header */}
        <div className="ApplyModal-header QuickApplyModal-header">
          <div className="QuickApplyModal-badgeRow">
            <span className="QuickApplyModal-lightningBadge">
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                bolt
              </span>
              <span>Fast-Track Direct Intake</span>
            </span>
            <span className="QuickApplyModal-slaBadge">5-Hour Review SLA</span>
          </div>

          <h2 id="quick-apply-title" className="ApplyModal-title QuickApplyModal-title">
            Quick Apply: {normalizedJob.title}
          </h2>

          <div className="QuickApplyModal-metaPills">
            <span className="QuickApplyModal-pill">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                apartment
              </span>
              {normalizedJob.department}
            </span>
            <span className="QuickApplyModal-pill">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                location_on
              </span>
              {normalizedJob.location}
            </span>
            <span className="QuickApplyModal-pill">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                work
              </span>
              {normalizedJob.employmentType}
            </span>
          </div>
        </div>

        {/* Content Body */}
        {success ? (
          <div className="QuickApplyModal-successState">
            <div className="QuickApplyModal-successIcon">
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#10B981' }}>
                check_circle
              </span>
            </div>
            <h3 className="QuickApplyModal-successTitle">Application Submitted Successfully!</h3>
            <p className="QuickApplyModal-successText">
              Your candidate profile and resume have been assigned to our Technical Staffing Director for{' '}
              <strong>{normalizedJob.title}</strong>.
            </p>

            {submittedAppId && (
              <div className="QuickApplyModal-appRefBox">
                <span>Application Reference ID</span>
                <strong>{submittedAppId}</strong>
              </div>
            )}

            <div className="QuickApplyModal-successActions">
              <button
                type="button"
                className="ApplyModal-btnSubmit"
                style={{ width: '100%', padding: '0.85rem' }}
                onClick={() => {
                  onClose();
                  navigate('/candidate/applications?applied=true');
                }}
              >
                Track in Candidate Portal &rarr;
              </button>
              <button
                type="button"
                className="ApplyModal-btnCancel"
                style={{ width: '100%' }}
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form className="ApplyModal-form QuickApplyModal-form" onSubmit={handleSubmit} noValidate>
            {/* Error Banner */}
            {error && (
              <div className="QuickApplyModal-errorBanner" role="alert">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  error
                </span>
                <span>{error}</span>
              </div>
            )}

            {/* Auto-fill notification */}
            {autoFillNotice && (
              <div className="QuickApplyModal-autoFillNotice">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  auto_awesome
                </span>
                <span>{autoFillNotice}</span>
              </div>
            )}

            {/* Authenticated User Status */}
            {isAuthenticated && user && (
              <div className="QuickApplyModal-authStatus">
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#10B981' }}>
                  verified_user
                </span>
                <span>
                  Applying as <strong>{user.name || user.email}</strong>
                </span>
              </div>
            )}

            {/* Resume Upload Dropzone */}
            <div className="ApplyModal-fieldGroup">
              <label htmlFor="quick-apply-resume">
                Resume / CV (PDF, DOC, DOCX up to 10MB) <span style={{ color: '#EF4444' }}>*</span>
              </label>

              <div
                className={`ApplyModal-uploadBox QuickApplyModal-uploadBox ${
                  dragActive ? 'QuickApplyModal-dragOver' : ''
                } ${resumeFile ? 'QuickApplyModal-hasFile' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  id="quick-apply-resume"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="ApplyModal-fileInput"
                  onChange={handleFileChange}
                />

                <div className="ApplyModal-uploadContent">
                  {parsingResume ? (
                    <div className="QuickApplyModal-parsingState">
                      <div className="QuickApplyModal-spinner"></div>
                      <p className="ApplyModal-uploadText">AI Analyzing Resume &amp; Skills...</p>
                      <p className="ApplyModal-uploadSubText">Auto-filling form details</p>
                    </div>
                  ) : resumeFile ? (
                    <div className="QuickApplyModal-fileSelected">
                      <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#10B981' }}>
                        task
                      </span>
                      <p className="ApplyModal-uploadText">{resumeFile.name}</p>
                      <p className="ApplyModal-uploadSubText">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Click or drag to replace
                      </p>
                    </div>
                  ) : user?.resumeUrl ? (
                    <div className="QuickApplyModal-fileSelected">
                      <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#003399' }}>
                        description
                      </span>
                      <p className="ApplyModal-uploadText">Using your profile resume</p>
                      <p className="ApplyModal-uploadSubText">Click to upload a different resume file</p>
                    </div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined ApplyModal-uploadIcon" style={{ fontSize: '36px' }}>
                        upload_file
                      </span>
                      <p className="ApplyModal-uploadText">Click or Drag &amp; Drop Resume</p>
                      <p className="ApplyModal-uploadSubText">PDF, DOC, or DOCX (max 10MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Candidate Name & Email */}
            <div className="ApplyModal-row">
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="quick-apply-fullname">
                  Full Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  id="quick-apply-fullname"
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="ApplyModal-fieldGroup">
                <label htmlFor="quick-apply-email">
                  Email Address <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  id="quick-apply-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Mobile & Experience */}
            <div className="ApplyModal-row">
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="quick-apply-phone">
                  Mobile / Phone <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  id="quick-apply-phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="ApplyModal-fieldGroup">
                <label htmlFor="quick-apply-experience">
                  Total Experience (Years) <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  id="quick-apply-experience"
                  type="number"
                  min="0"
                  max="45"
                  step="0.5"
                  required
                  placeholder="e.g. 6"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                />
              </div>
            </div>

            {/* Skills & Notice Period */}
            <div className="ApplyModal-row">
              <div className="ApplyModal-fieldGroup">
                <label htmlFor="quick-apply-skills">Key Technical Skills</label>
                <input
                  id="quick-apply-skills"
                  type="text"
                  placeholder="e.g. React, Node.js, AWS, Kubernetes"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div className="ApplyModal-fieldGroup">
                <label htmlFor="quick-apply-notice">Notice Period</label>
                <select
                  id="quick-apply-notice"
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                >
                  <option value="Immediate">Immediate Availability</option>
                  <option value="15 Days">15 Days</option>
                  <option value="Serving NP">Serving Notice Period</option>
                  <option value="30 Days">30 Days</option>
                  <option value="60 Days">60 Days</option>
                  <option value="90 Days">90 Days</option>
                </select>
              </div>
            </div>

            {/* Guest One-Step Account Setup (when unauthenticated) */}
            {!isAuthenticated && (
              <div className="QuickApplyModal-guestAccountBox">
                <div className="QuickApplyModal-guestHeader">
                  <div>
                    <span className="QuickApplyModal-guestTitle">
                      {guestMode === 'register'
                        ? 'Candidate Account Passkey'
                        : 'Sign In to Your Account'}
                    </span>
                    <p className="QuickApplyModal-guestSubtext">
                      {guestMode === 'register'
                        ? 'Create a secure password (min 12 chars) to track this submission in your portal.'
                        : 'Enter your account password to verify and submit your application.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="QuickApplyModal-guestToggle"
                    onClick={() => {
                      setGuestMode((m) => (m === 'register' ? 'login' : 'register'));
                      setError('');
                    }}
                  >
                    {guestMode === 'register' ? 'Already registered? Sign In' : 'New applicant? Register'}
                  </button>
                </div>

                <div className="ApplyModal-fieldGroup" style={{ marginTop: '0.5rem' }}>
                  <input
                    id="quick-apply-password"
                    type="password"
                    required
                    placeholder="Enter account password (min. 12 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={guestMode === 'register' ? 'new-password' : 'current-password'}
                  />
                </div>
              </div>
            )}

            {/* Brief Pitch / Note */}
            <div className="ApplyModal-fieldGroup">
              <label htmlFor="quick-apply-note">Brief Candidate Note (Optional)</label>
              <textarea
                id="quick-apply-note"
                rows="2"
                placeholder="Highlight your current role, salary expectations, or portfolio links..."
                value={candidateNote}
                onChange={(e) => setCandidateNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Consent Box */}
            <div className="ApplyModal-termsBox">
              <input
                id="quick-apply-terms"
                type="checkbox"
                className="ApplyModal-termsCheckbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <label htmlFor="quick-apply-terms" className="ApplyModal-termsLabel">
                I agree to the{' '}
                <Link to="/terms" target="_blank" className="ApplyModal-termsLink">
                  Terms of Service
                </Link>{' '}
                and authorize Thinkwires to route my profile to enterprise hiring teams.
              </label>
            </div>

            {/* Modal Actions */}
            <div className="ApplyModal-actions QuickApplyModal-actions">
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
                className="ApplyModal-btnSubmit QuickApplyModal-submitBtn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="QuickApplyModal-btnSpinner"></span>
                    <span>Transmitting Application...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      send
                    </span>
                    <span>Submit Quick Application</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuickApplyModal;
