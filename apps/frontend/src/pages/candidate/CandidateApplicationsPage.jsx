import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ScreeningAssessmentModal from '../../components/common/ScreeningAssessmentModal';
import '../auth/auth.css';

const CandidateApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assessmentModalApp, setAssessmentModalApp] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'My Job Applications | Thinkwires';

    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/candidate/applications', {
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setApplications(data.applications || []);
        } else {
          setError(data.error || 'Failed to fetch job applications');
        }
      } catch (err) {
        setError('Network error while retrieving applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="tw-candidate-shell">
      <Navbar />

      <main className="tw-portal-container">
        {/* Navigation Tabs */}
        <div className="tw-portal-navtabs">
          <Link to="/candidate/dashboard" className="tw-portal-tab">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard
          </Link>
          <Link to="/candidate/profile" className="tw-portal-tab">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Candidate Profile
          </Link>
          <Link to="/candidate/applications" className="tw-portal-tab active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            My Applications
          </Link>
          <Link to="/jobs" className="tw-portal-tab">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            Available Jobs
          </Link>
        </div>

        <div className="tw-portal-card">
          <div className="tw-portal-card-header">
            <div>
              <h1 className="tw-portal-card-title">My Tracked Job Applications</h1>
              <p style={{ color: '#64748B', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                View your submission status, client interview rounds, and offer updates.
              </p>
            </div>

            <Link
              to="/jobs"
              className="Navbar-btnPrimary"
              style={{ textDecoration: 'none', padding: '0.55rem 1rem', fontSize: '0.88rem' }}
            >
              + Apply for More Roles
            </Link>
          </div>

          {error && (
            <div className="tw-auth-alert tw-auth-alert-error">
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
              Retrieving your applications...
            </div>
          ) : applications.length === 0 ? (
            <div
              style={{
                padding: '3rem 1.5rem',
                textAlign: 'center',
                background: '#F8FAFC',
                borderRadius: '8px',
                border: '1px dashed #CBD5E1',
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontSize: '1.1rem' }}>
                No active applications found
              </h3>
              <p style={{ color: '#64748B', margin: '0 0 1.25rem 0', maxWidth: '450px', marginLeft: 'auto', marginRight: 'auto' }}>
                You have not applied to any Thinkwires partner positions yet. Explore our open positions to submit an expedited application.
              </p>
              <Link
                to="/jobs"
                className="Navbar-btnPrimary"
                style={{ textDecoration: 'none', display: 'inline-block' }}
              >
                Browse Curated Job Openings
              </Link>
            </div>
          ) : (
            <div className="tw-table-responsive">
              <table className="tw-portal-table">
                <thead>
                  <tr>
                    <th>Job Role</th>
                    <th>Department</th>
                    <th>Location</th>
                    <th>Experience</th>
                    <th>ATS Fit Score</th>
                    <th>AI Screening Test</th>
                    <th>Stage</th>
                    <th>Status</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id || app.id}>
                      <td style={{ fontWeight: 600, color: '#0F172A' }}>{app.jobTitle}</td>
                      <td>{app.department || 'Engineering'}</td>
                      <td>{app.location || 'Remote'}</td>
                      <td>{app.experience || 'Not specified'}</td>
                      <td>
                        {app.fitScore != null ? (
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              background: app.fitScore >= 75 ? '#DCFCE7' : app.fitScore >= 50 ? '#FEF9C3' : '#FEE2E2',
                              color: app.fitScore >= 75 ? '#166534' : app.fitScore >= 50 ? '#854D0E' : '#991B1B',
                            }}
                          >
                            {app.fitScore}% {app.fitBadge ? `• ${app.fitBadge}` : ''}
                          </span>
                        ) : (
                          <span style={{ color: '#94A3B8', fontSize: '0.82rem' }}>Calculated</span>
                        )}
                      </td>
                      <td>
                        {app.assessmentStatus === 'Completed' || app.assessmentStatus === 'Passed' || app.assessmentStatus === 'Failed' ? (
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              background: (app.screeningPassed || app.assessmentScore >= 70) ? '#DCFCE7' : '#FEE2E2',
                              color: (app.screeningPassed || app.assessmentScore >= 70) ? '#166534' : '#991B1B',
                            }}
                          >
                            {(app.screeningPassed || app.assessmentScore >= 70) ? 'Passed' : 'Completed'} ({app.assessmentScore || 0}%)
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAssessmentModalApp(app)}
                            style={{
                              background: '#2563EB',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.3rem 0.7rem',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              boxShadow: '0 1px 2px rgba(37,99,235,0.2)',
                            }}
                          >
                            <span>📝 Take Test</span>
                          </button>
                        )}
                      </td>
                      <td style={{ color: '#2563EB', fontWeight: 500 }}>
                        {app.stage || 'Screening'}
                      </td>
                      <td>
                        <span
                          className={`tw-badge-status ${
                            app.status === 'Offered'
                              ? 'tw-badge-offered'
                              : app.status === 'Interview'
                              ? 'tw-badge-interview'
                              : app.status === 'Screening'
                              ? 'tw-badge-screening'
                              : app.status === 'Rejected'
                              ? 'tw-badge-rejected'
                              : 'tw-badge-applied'
                          }`}
                        >
                          {app.status || 'Applied'}
                        </span>
                      </td>
                      <td>{new Date(app.createdAt || app.appliedAt || Date.now()).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Proctored Screening Assessment Modal */}
        {assessmentModalApp && (
          <ScreeningAssessmentModal
            applicationId={assessmentModalApp._id || assessmentModalApp.id}
            jobTitle={assessmentModalApp.jobTitle}
            onClose={() => setAssessmentModalApp(null)}
            onCompleted={(result) => {
              setApplications((prev) =>
                prev.map((a) =>
                  (a._id || a.id) === (assessmentModalApp._id || assessmentModalApp.id)
                    ? {
                        ...a,
                        assessmentScore: result.percentageScore,
                        assessmentStatus: 'Completed',
                        screeningPassed: result.passed,
                        stage: result.gatekeeperStatus || a.stage,
                      }
                    : a
                )
              );
              setAssessmentModalApp(null);
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CandidateApplicationsPage;

