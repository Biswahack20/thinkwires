import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleIncognito } from '../../store/slices/candidatePortalSlice';

const CandidateHero = ({ profile = {} }) => {
  const dispatch = useDispatch();
  const { incognitoActive } = useSelector((state) => state.candidatePortal || {});
  const [downloadAlert, setDownloadAlert] = useState(false);

  const handleDownload = () => {
    setDownloadAlert(true);
    setTimeout(() => setDownloadAlert(false), 3000);
  };

  return (
    <div className="CandidatePortal-heroCard">
      <div className="glow-circle top-right"></div>
      <div className="glow-circle bottom-left"></div>

      <div className="CandidatePortal-heroInner">
        {/* Candidate Identity */}
        <div className="CandidatePortal-identity">
          <div className="avatar-container">
            <div className="avatar-frame">
              <img
                src={profile.avatar}
                alt={incognitoActive ? 'Protected Profile' : profile.name}
                className={`avatar-img ${incognitoActive ? 'incognito-blur' : ''}`}
              />
            </div>
            <div className="live-status-badge">
              <span className="live-dot"></span>
              <span className="live-text">LIVE</span>
            </div>
          </div>

          <div className="identity-text">
            <div className="pill-tags">
              <span className="vetting-pill">
                <span className="material-symbols-outlined icon">verified</span>
                <span>{profile.vettingTag || 'Top 3.4% Pre-Vetted Talent • Active on Live Bench'}</span>
              </span>
              <span className="dispatch-pill">
                <span className="material-symbols-outlined icon">bolt</span>
                <span>{profile.dispatchTag || 'Immediate 48-Hour Client Dispatch'}</span>
              </span>
            </div>

            <h1 className="candidate-name">
              {incognitoActive ? 'Candidate TW-ARCH-902 (Incognito)' : profile.name}
            </h1>
            <p className="candidate-role">{profile.headline}</p>

            <div className="identity-meta">
              <span className="meta-item">
                <span className="material-symbols-outlined icon">location_on</span>
                <span>{profile.location}</span>
              </span>
              <span className="meta-sep">•</span>
              <span className="meta-item">
                <span className="material-symbols-outlined icon">shield</span>
                <span>{profile.compliance}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Profile Health Meter & Actions */}
        <div className="CandidatePortal-actionsColumn">
          <div className="health-meter-box">
            <div className="radial-chart">
              <svg className="radial-svg" viewBox="0 0 36 36">
                <path
                  className="bg-circle"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3.5"
                ></path>
                <path
                  className="progress-circle"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeDasharray="96, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                ></path>
              </svg>
              <span className="score-text">{profile.healthScore || '96%'}</span>
            </div>
            <div className="health-text">
              <span className="health-title">Profile Health Dossier</span>
              <span className="health-sub">{profile.healthStatus || 'All Background Checks Sealed'}</span>
            </div>
          </div>

          <div className="action-buttons-row">
            <button type="button" onClick={handleDownload} className="btn-dossier">
              <span className="material-symbols-outlined">download</span>
              <span>Dossier PDF</span>
            </button>
            <button type="button" className="btn-sla">
              <span className="material-symbols-outlined">tune</span>
              <span>Notice SLA</span>
            </button>
            <button
              type="button"
              onClick={() => dispatch(toggleIncognito())}
              className={`btn-incognito ${incognitoActive ? 'active' : ''}`}
              title="Toggle Incognito Mode for Employer Privacy"
            >
              <span className="material-symbols-outlined">
                {incognitoActive ? 'visibility' : 'visibility_off'}
              </span>
              <span className="btn-incognito-text">{incognitoActive ? 'Incognito ON' : 'Incognito'}</span>
            </button>
          </div>

          {downloadAlert && (
            <div className="dossier-download-alert">
              ✓ Candidate technical dossier generated and encrypted. Downloading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateHero;
