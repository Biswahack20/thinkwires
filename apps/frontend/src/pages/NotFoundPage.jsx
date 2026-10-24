import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6rem 1.5rem 4rem 1.5rem',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(0, 143, 104, 0.08) 0%, rgba(10, 15, 29, 0.98) 75%)',
          color: '#f8fafc',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '640px', width: '100%' }}>
          {/* Status Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.28)',
              color: '#fca5a5',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            HTTP 404 • Resource Not Located
          </div>

          <h1
            style={{
              fontSize: 'clamp(4rem, 10vw, 7.5rem)',
              fontWeight: 900,
              lineHeight: 1,
              margin: '0 0 1rem 0',
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, #ffffff 40%, #008F68 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            404
          </h1>

          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 1rem 0',
            }}
          >
            Page Does Not Exist
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: '#94a3b8',
              lineHeight: 1.6,
              margin: '0 auto 2.5rem auto',
              maxWidth: '480px',
            }}
          >
            The link you accessed may be outdated, decommissioned, or the address might have been typed incorrectly.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center',
              marginBottom: '3rem',
            }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.4rem',
                borderRadius: '0.65rem',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              ← Go Back
            </button>

            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.6rem',
                borderRadius: '0.65rem',
                background: 'linear-gradient(135deg, #008F68 0%, #00b080 100%)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0, 143, 104, 0.35)',
              }}
            >
              Return to Homepage
            </Link>

            <Link
              to="/jobs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.4rem',
                borderRadius: '0.65rem',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              View Open Roles
            </Link>
          </div>

          {/* Quick links directory */}
          <div
            style={{
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
              fontSize: '0.85rem',
            }}
          >
            <Link to="/about" style={{ color: '#008F68', textDecoration: 'none' }}>About Us</Link>
            <Link to="/bench" style={{ color: '#008F68', textDecoration: 'none' }}>Talent Cloud</Link>
            <Link to="/candidate-portal/dashboard" style={{ color: '#008F68', textDecoration: 'none' }}>Candidate Portal</Link>
            <Link to="/contact" style={{ color: '#008F68', textDecoration: 'none' }}>Contact Support</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
