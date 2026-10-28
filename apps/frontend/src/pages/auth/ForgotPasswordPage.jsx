import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import './auth.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setDevResetUrl('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(
          data.message ||
            'Password reset link has been dispatched to your email.'
        );
        if (data.devResetUrl) {
          setDevResetUrl(data.devResetUrl);
        }
      } else {
        setError(data.error || 'Failed to request password reset.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tw-auth-page">
      <Helmet>
        <title>Forgot Password | Thinkwires</title>
        <meta
          name="description"
          content="Reset your Thinkwires account password securely via email recovery link."
        />
        <meta property="og:title" content="Forgot Password | Thinkwires" />
        <meta
          property="og:description"
          content="Reset your Thinkwires account password securely via email recovery link."
        />
        <meta property="og:image" content="https://thinkwires.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Forgot Password | Thinkwires" />
        <meta
          name="twitter:description"
          content="Reset your Thinkwires account password securely via email recovery link."
        />
        <meta name="twitter:image" content="https://thinkwires.com/og-image.jpg" />
      </Helmet>
      <Navbar />

      <main className="tw-auth-container">
        <div className="tw-auth-card">
          <div className="tw-auth-header">
            <span className="tw-auth-badge">Account Recovery</span>
            <h1 className="tw-auth-title">Forgot Password</h1>
            <p className="tw-auth-subtitle">
              Enter your registered email address and we'll send you
              instructions to reset your password.
            </p>
          </div>

          {error && (
            <div className="tw-auth-alert tw-auth-alert-error" role="alert">
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="tw-auth-alert tw-auth-alert-success" role="alert">
              <div>
                <p style={{ margin: 0 }}>{message}</p>
                {devResetUrl && (
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.82rem' }}>
                    <strong>Developer Shortcut:</strong>{' '}
                    <Link
                      to={devResetUrl}
                      style={{ color: '#15803D', textDecoration: 'underline' }}
                    >
                      Click here to reset immediately (Dev Mode)
                    </Link>
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="tw-auth-form">
            <div className="tw-form-group">
              <label className="tw-form-label" htmlFor="forgot-email">
                Registered Email
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                className="tw-form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="tw-btn-submit" disabled={loading}>
              {loading ? 'Sending Instructions...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="tw-auth-footer">
            Remembered your credentials?{' '}
            <Link to="/login" className="tw-auth-link">
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
