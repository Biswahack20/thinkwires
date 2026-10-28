import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import './auth.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token || !email) {
      setError(
        'Invalid or expired password reset link. Please request a new one.'
      );
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(
          'Password reset successful! Redirecting to login in 2 seconds...'
        );
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Network error while resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tw-auth-page">
      <Helmet>
        <title>Reset Password | Thinkwires</title>
        <meta
          name="description"
          content="Enter your new secure password to restore access to your Thinkwires account."
        />
        <meta property="og:title" content="Reset Password | Thinkwires" />
        <meta
          property="og:description"
          content="Enter your new secure password to restore access to your Thinkwires account."
        />
        <meta property="og:image" content="https://thinkwires.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Reset Password | Thinkwires" />
        <meta
          name="twitter:description"
          content="Enter your new secure password to restore access to your Thinkwires account."
        />
        <meta name="twitter:image" content="https://thinkwires.com/og-image.jpg" />
      </Helmet>
      <Navbar />

      <main className="tw-auth-container">
        <div className="tw-auth-card">
          <div className="tw-auth-header">
            <span className="tw-auth-badge">Security Update</span>
            <h1 className="tw-auth-title">Set New Password</h1>
            <p className="tw-auth-subtitle">
              Choose a strong password to protect your Thinkwires candidate
              profile.
            </p>
          </div>

          {error && (
            <div className="tw-auth-alert tw-auth-alert-error" role="alert">
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="tw-auth-alert tw-auth-alert-success" role="alert">
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="tw-auth-form">
            <div className="tw-form-group">
              <label className="tw-form-label" htmlFor="reset-new-password">
                New Password (min 6 characters)
              </label>
              <div className="tw-input-wrapper">
                <input
                  id="reset-new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="tw-form-input"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="tw-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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
            </div>

            <div className="tw-form-group">
              <label className="tw-form-label" htmlFor="reset-confirm-password">
                Confirm New Password
              </label>
              <input
                id="reset-confirm-password"
                type={showPassword ? 'text' : 'password'}
                required
                className="tw-form-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="tw-btn-submit" disabled={loading}>
              {loading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>

          <div className="tw-auth-footer">
            <Link to="/login" className="tw-auth-link">
              Back to Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
