import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
 
const LegalPage = () => {
  const location = useLocation();

  const getInitialTab = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('terms')) return 'terms';
    if (path.includes('security') || path.includes('compliance')) return 'security';
    if (path.includes('cookie')) return 'cookies';
    return 'privacy';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    setActiveTab(getInitialTab());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="LegalPage-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface, #f8fafc)' }}>
      <Navbar />

      <main className="LegalPage-main">
        {/* Header Breadcrumb & Title */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '9999px', background: 'rgba(37, 99, 235, 0.08)', color: 'var(--color-primary, #2563eb)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified_user</span>
            <span>LEGAL &amp; COMPLIANCE FRAMEWORK</span>
          </div>
          <h1 className="LegalPage-heroTitle">
            Trust, Security &amp; Legal Governance
          </h1>
          <p className="LegalPage-heroDesc">
            ThinkWires complies with bilateral enterprise standards, GDPR candidate privacy, and cross-border employment regulations across North America and India.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="LegalPage-tabsContainer">
          {[
            { id: 'privacy', label: 'Privacy Policy', icon: 'shield' },
            { id: 'terms', label: 'Terms of Service', icon: 'gavel' },
            { id: 'security', label: 'Security & Compliance', icon: 'lock' },
            { id: 'cookies', label: 'Cookie Settings', icon: 'cookie' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className="LegalPage-tabBtn"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                backgroundColor: activeTab === tab.id ? 'var(--color-primary-container, #1d4ed8)' : '#ffffff',
                color: activeTab === tab.id ? '#ffffff' : '#475569',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(29, 78, 216, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="LegalPage-contentCard">
          {activeTab === 'privacy' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>1. Candidate &amp; Client Privacy Policy</h2>
              <p style={{ marginBottom: '1rem' }}>
                ThinkWires Global Corp (&ldquo;ThinkWires&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) is committed to protecting the privacy of job seekers, enterprise engineering clients, and website visitors. This policy outlines how candidate resumes, background evaluations, and contact information are gathered, stored, and utilized.
              </p>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Data We Collect</h3>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
                <li><strong>Candidate Dossiers:</strong> Resume credentials, employment history, compensation expectations, notice periods, and verified technical code evaluations.</li>
                <li><strong>Enterprise Client Inquiries:</strong> Organization names, technical job descriptions, project budgets, and contact coordinates.</li>
                <li><strong>Digital Usage Data:</strong> Anonymized interaction logs and IP telemetry strictly for security and user experience optimization.</li>
              </ul>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Consent &amp; Data Rights</h3>
              <p style={{ marginBottom: '1rem' }}>
                Candidate profiles are shared exclusively with prospective enterprise employers with prior explicit consent. We never sell candidate or client data to third-party marketing entities. You may request data inspection or erasure by contacting <a href="mailto:privacy@thinkwires.com" style={{ color: '#2563eb', textDecoration: 'underline' }}>privacy@thinkwires.com</a>.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>2. Terms of Service &amp; Engagement</h2>
              <p style={{ marginBottom: '1rem' }}>
                By accessing ThinkWires portals, submitting talent inquiries, or participating in candidate interviews, you agree to these Terms of Service.
              </p>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Direct Client Relationships</h3>
              <p style={{ marginBottom: '1rem' }}>
                ThinkWires operates on zero-recruiter commission cuts for candidates. Candidates placed in full-time or contingent roles receive agreed compensation with direct contractual transparency.
              </p>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Intellectual Property &amp; Non-Disclosure</h3>
              <p style={{ marginBottom: '1rem' }}>
                All technical screening challenges, proprietary client architecture blueprints, and non-public job requisitions are strictly protected under Mutual Non-Disclosure Agreements (NDAs).
              </p>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>3. Enterprise Security &amp; Compliance Standards</h2>
              <p style={{ marginBottom: '1rem' }}>
                Security is central to our bilateral corridor operations. We employ rigorous standards across all talent routing gates and payroll administration services:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
                <li><strong>Statutory Cross-Border Compliance:</strong> Complete compliance with local labor statutory guidelines, provident funds, insurance, and tax governance across India, the United States, and Canada.</li>
                <li><strong>Encryption at Rest &amp; Transit:</strong> All candidate identification credentials and enterprise service contracts are encrypted using AES-256 and TLS 1.3.</li>
                <li><strong>Background &amp; Identity Verification:</strong> Rigorous 3-way identity checks, criminal history vetting, and past employment verification before talent dispatch.</li>
              </ul>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>4. Cookie Policy &amp; Tracking Preferences</h2>
              <p style={{ marginBottom: '1rem' }}>
                ThinkWires utilizes essential cookies and minimal analytics tokens to facilitate seamless site navigation, theme preferences (light/dark mode), and secure session authentication.
              </p>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Managing Preferences</h3>
              <p style={{ marginBottom: '1rem' }}>
                You may disable non-essential cookies at any time via your browser settings. Essential session cookies are required for application modal submissions and secure candidate portal logins.
              </p>
            </div>
          )}

          <div className="LegalPage-footerRow" style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
            <span>Last Updated: October 2026 • Effective Worldwide</span>
            <Link to="/contact" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              Have questions? Contact Legal Advisory &rarr;
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
