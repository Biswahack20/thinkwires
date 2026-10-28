import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../../store/slices/authSlice';
import { getSafeRedirectUrl } from '../../utils/redirectUtil';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import './auth.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  // Preserve redirect query parameter throughout authentication flow
  const redirectParam = searchParams.get('redirect');
  const registerUrl = `/register${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) dispatch(clearAuthError());
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getFieldErrors = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.password) {
      errors.password = 'Password is required.';
    }
    return errors;
  };

  const fieldErrors = getFieldErrors();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    dispatch(clearAuthError());

    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    const resultAction = await dispatch(
      loginUser({
        email: formData.email.trim(),
        password: formData.password,
      })
    );

    if (loginUser.fulfilled.match(resultAction)) {
      const destination = getSafeRedirectUrl(
        searchParams,
        '/candidate/dashboard'
      );
      navigate(destination, { replace: true });
    }
  };

  const showError = (field) =>
    (touched[field] || submitted) && fieldErrors[field];

  return (
    <div className="tw-split-auth-page">
      <Helmet>
        <title>Sign In | Thinkwires Candidate & Client Portal</title>
        <meta
          name="description"
          content="Log in to your Thinkwires account to access candidate job applications, ATS assessments, and hiring pipelines."
        />
        <meta property="og:title" content="Sign In to Thinkwires" />
        <meta
          property="og:description"
          content="Log in to your Thinkwires account to access candidate job applications, ATS assessments, and hiring pipelines."
        />
        <meta property="og:image" content="https://thinkwires.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sign In to Thinkwires" />
        <meta
          name="twitter:description"
          content="Log in to your Thinkwires account to access candidate job applications and ATS assessments."
        />
        <meta name="twitter:image" content="https://thinkwires.com/og-image.jpg" />
      </Helmet>
      <Navbar />

      <main className="tw-split-main">
        <div className="tw-split-card">
          {/* ================= LEFT BRANDING PANEL ================= */}
          <div className="tw-split-brand-col">
            <div className="tw-brand-circuit-accent" />

            <div className="tw-brand-top">
              <div className="tw-brand-logo-badge">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Thinkwires Portal Access
              </div>

              <h2 className="tw-brand-hero-title">
                Direct access to your <span>candidate pipeline</span>.
              </h2>
              <p className="tw-brand-hero-desc">
                Log in to review live technical assessments, communicate with
                recruitment advocates, and accept vetted enterprise offers.
              </p>
            </div>

            <div className="tw-brand-features">
              <div className="tw-feature-item">
                <div className="tw-feature-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <div className="tw-feature-text">
                  <h4>Real-Time Application Status</h4>
                  <p>
                    Track your submission lifecycle across screening, technical
                    loops, and offer stages.
                  </p>
                </div>
              </div>

              <div className="tw-feature-item">
                <div className="tw-feature-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="tw-feature-text">
                  <h4>Fast Turnaround Interviews</h4>
                  <p>
                    Guaranteed 48-hour feedback SLAs with US and India tech
                    directorships.
                  </p>
                </div>
              </div>
            </div>

            <div className="tw-brand-compliance">
              <span className="tw-compliance-pill">SECURE SESSION</span>
              <span>Encrypted via HttpOnly SameSite tokens</span>
            </div>
          </div>

          {/* ================= RIGHT FORM PANEL ================= */}
          <div className="tw-split-form-col">
            <div className="tw-form-panel-header">
              <h1 className="tw-form-panel-title">Sign In to Thinkwires</h1>
              <p className="tw-form-panel-desc">
                Welcome back. Access your candidate profile and active
                applications.
              </p>
            </div>

            {error && (
              <div className="tw-alert-banner tw-alert-error" role="alert">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="tw-enterprise-form"
              noValidate
            >
              <div className="tw-field-group">
                <label className="tw-field-label" htmlFor="login-email">
                  Email Address
                </label>
                <input
                  id="login-email"
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
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12" y2="16"></line>
                    </svg>
                    {fieldErrors.email}
                  </span>
                )}
              </div>

              <div className="tw-field-group">
                <div className="tw-field-label">
                  <label htmlFor="login-password">Password</label>
                  <Link to="/forgot-password" className="tw-forgot-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="tw-input-container">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`tw-field-input ${showError('password') ? 'tw-field-input-error' : ''}`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="tw-pwd-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {showError('password') && (
                  <span className="tw-field-err-msg">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12" y2="16"></line>
                    </svg>
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="tw-enterprise-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="tw-inline-spinner" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  'Sign In to Candidate Dashboard'
                )}
              </button>
            </form>

            <div className="tw-switch-prompt">
              Don't have a candidate account?{' '}
              <Link to={registerUrl} className="tw-switch-link">
                Register here →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
