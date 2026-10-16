import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../../store/slices/authSlice';
import { getSafeRedirectUrl } from '../../utils/redirectUtil';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import './auth.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Track field interactions so validation errors only show after blur or submit
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  // Preserve redirect query parameter throughout authentication flow
  const redirectParam = searchParams.get('redirect');
  const loginUrl = `/login${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) dispatch(clearAuthError());
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Password Strength Evaluation
  const evaluatePassword = (pwd) => {
    if (!pwd) return { score: 0, label: 'Not entered', colorClass: '' };
    let score = 0;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (pwd.length < 12) {
      return { score: 1, label: 'Requires 12+ chars', colorClass: 'active-weak' };
    }
    if (score <= 2) return { score: 2, label: 'Fair (add symbols/numbers)', colorClass: 'active-fair' };
    if (score <= 4) return { score: 3, label: 'Good (strong protection)', colorClass: 'active-good' };
    return { score: 4, label: 'Enterprise Strong', colorClass: 'active-strong' };
  };

  const pwdStrength = evaluatePassword(formData.password);

  // Field validation rules
  const getFieldErrors = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full legal name is required.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid work or personal email.';
    }
    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 12) {
      errors.password = 'Password must be at least 12 characters long.';
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    return errors;
  };

  const fieldErrors = getFieldErrors();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    dispatch(clearAuthError());

    // If any validation errors exist, stop submission
    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    const resultAction = await dispatch(
      registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
    );

    if (registerUser.fulfilled.match(resultAction)) {
      const destination = getSafeRedirectUrl(searchParams, '/candidate/dashboard');
      navigate(destination, { replace: true });
    }
  };

  // Helper to determine if an error message should render
  const showError = (field) => (touched[field] || submitted) && fieldErrors[field];

  return (
    <div className="tw-split-auth-page">
      <Navbar />

      <main className="tw-split-main">
        <div className="tw-split-card">
          {/* ================= LEFT BRANDING PANEL ================= */}
          <div className="tw-split-brand-col">
            <div className="tw-brand-circuit-accent" />

            <div className="tw-brand-top">
              <div className="tw-brand-logo-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                Thinkwires Talent Network
              </div>

              <h2 className="tw-brand-hero-title">
                Deploy with premier <span>global tech</span> leaders.
              </h2>
              <p className="tw-brand-hero-desc">
                Join our vetted engineering network. Access verified high-impact contracts and full-time mandates across North America, India, and GCC hubs.
              </p>
            </div>

            {/* Recruiter-focused highlights */}
            <div className="tw-brand-features">
              <div className="tw-feature-item">
                <div className="tw-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="tw-feature-text">
                  <h4>Pre-Vetted Expedited Intake</h4>
                  <p>Direct hiring manager interviews without redundant screening loops.</p>
                </div>
              </div>

              <div className="tw-feature-item">
                <div className="tw-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <div className="tw-feature-text">
                  <h4>Transparent Enterprise Retainers</h4>
                  <p>Guaranteed escrow disbursement, competitive CTCs, and dual-zone remote options.</p>
                </div>
              </div>

              <div className="tw-feature-item">
                <div className="tw-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div className="tw-feature-text">
                  <h4>IP &amp; Compliance Verification</h4>
                  <p>SOC 2 audited talent identity, seamless EOR contracts, and tax treaties.</p>
                </div>
              </div>
            </div>

            <div className="tw-brand-compliance">
              <span className="tw-compliance-pill">SOC 2 TYPE II</span>
              <span>ISO 27001 Certified • Strict Data Governance</span>
            </div>
          </div>

          {/* ================= RIGHT FORM PANEL ================= */}
          <div className="tw-split-form-col">
            <div className="tw-form-panel-header">
              <h1 className="tw-form-panel-title">Create Candidate Profile</h1>
              <p className="tw-form-panel-desc">
                Register once to apply for curated openings and track your interview stages.
              </p>
            </div>

            {error && (
              <div className="tw-alert-banner tw-alert-error" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="tw-enterprise-form" noValidate>
              <div className="tw-field-group">
                <label className="tw-field-label" htmlFor="register-name">
                  Full Legal Name *
                </label>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  className={`tw-field-input ${showError('name') ? 'tw-field-input-error' : ''}`}
                  placeholder="e.g. Arvind S. Nair"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  autoComplete="name"
                />
                {showError('name') && (
                  <span className="tw-field-err-msg">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12" y2="16"></line>
                    </svg>
                    {fieldErrors.name}
                  </span>
                )}
              </div>

              <div className="tw-form-row">
                <div className="tw-field-group">
                  <label className="tw-field-label" htmlFor="register-email">
                    Email Address *
                  </label>
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    className={`tw-field-input ${showError('email') ? 'tw-field-input-error' : ''}`}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    autoComplete="email"
                  />
                  {showError('email') && (
                    <span className="tw-field-err-msg">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12" y2="16"></line>
                      </svg>
                      {fieldErrors.email}
                    </span>
                  )}
                </div>

                <div className="tw-field-group">
                  <label className="tw-field-label" htmlFor="register-phone">
                    Phone (Optional)
                  </label>
                  <input
                    id="register-phone"
                    name="phone"
                    type="tel"
                    className="tw-field-input"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="tw-field-group">
                <label className="tw-field-label" htmlFor="register-password">
                  <span>Password *</span>
                  <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 500 }}>
                    Minimum 12 characters
                  </span>
                </label>
                <div className="tw-input-container">
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`tw-field-input ${showError('password') ? 'tw-field-input-error' : ''}`}
                    placeholder="Create a strong password (12+ characters)"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="tw-pwd-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="tw-pwd-strength-container">
                    <div className="tw-pwd-strength-bars">
                      <div className={`tw-pwd-strength-segment ${pwdStrength.score >= 1 ? pwdStrength.colorClass : ''}`} />
                      <div className={`tw-pwd-strength-segment ${pwdStrength.score >= 2 ? pwdStrength.colorClass : ''}`} />
                      <div className={`tw-pwd-strength-segment ${pwdStrength.score >= 3 ? pwdStrength.colorClass : ''}`} />
                      <div className={`tw-pwd-strength-segment ${pwdStrength.score >= 4 ? pwdStrength.colorClass : ''}`} />
                    </div>
                    <div className="tw-pwd-strength-label">
                      <span style={{ color: '#64748B' }}>Password Strength:</span>
                      <span style={{ color: pwdStrength.score >= 3 ? '#008F68' : pwdStrength.score === 2 ? '#D97706' : '#DC2626' }}>
                        {pwdStrength.label}
                      </span>
                    </div>
                  </div>
                )}

                {showError('password') && (
                  <span className="tw-field-err-msg">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12" y2="16"></line>
                    </svg>
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              <div className="tw-field-group">
                <label className="tw-field-label" htmlFor="register-confirm">
                  Confirm Password *
                </label>
                <div className="tw-input-container">
                  <input
                    id="register-confirm"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`tw-field-input ${showError('confirmPassword') ? 'tw-field-input-error' : ''}`}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur('confirmPassword')}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="tw-pwd-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {showError('confirmPassword') && (
                  <span className="tw-field-err-msg">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12" y2="16"></line>
                    </svg>
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>

              <button type="submit" className="tw-enterprise-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="tw-inline-spinner" />
                    <span>Creating Candidate Account...</span>
                  </>
                ) : (
                  'Create Candidate Account'
                )}
              </button>

              {/* Data Privacy Statement */}
              <p className="tw-privacy-statement">
                By creating an account, you agree to Thinkwires'{' '}
                <Link to="/terms-of-service">Terms of Service</Link> and acknowledge our{' '}
                <Link to="/privacy-policy">Candidate Data Privacy Policy</Link>. Your information is never sold.
              </p>
            </form>

            <div className="tw-switch-prompt">
              Already registered with Thinkwires?{' '}
              <Link to={loginUrl} className="tw-switch-link">
                Sign in to Candidate Portal →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
