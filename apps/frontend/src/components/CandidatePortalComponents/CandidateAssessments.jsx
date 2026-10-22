import React, { useState } from 'react';

const CandidateAssessments = ({ assessment = {} }) => {
  const {
    scores = [],
    repository = {},
    sponsoredTrack = {},
    auditDate = 'Dec 2024 Audit',
  } = assessment;
  const [claimed, setClaimed] = useState(false);

  return (
    <div className="CandidatePortal-assessmentsGrid">
      {/* Left 2 Cols: Scores Breakdown */}
      <div className="assessment-main-card">
        <div className="card-heading-row">
          <div>
            <div className="tag-date-row">
              <span className="eyebrow-accent">Verified Code Proofs</span>
              <span className="date-chip">{auditDate}</span>
            </div>
            <h2 className="section-main-title">
              Technical Assessment Score Breakdown
            </h2>
            <p className="section-subtext">
              Validated through automated benchmarking and peer architectural
              cross-examination.
            </p>
          </div>
        </div>

        {/* 4 Score Bars */}
        <div className="scores-grid">
          {scores.map((sc, idx) => (
            <div key={idx} className="score-box">
              <span className="score-name">{sc.name}</span>
              <span className="score-val">{sc.val}%</span>
              <div className="progress-track">
                <div
                  className={`progress-bar bar-${idx}`}
                  style={{ width: `${sc.val}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Connected Github & RFC Proof */}
        <div className="github-proof-card">
          <div className="github-left">
            <div className="git-icon-box">
              <span className="material-symbols-outlined">code</span>
            </div>
            <div className="git-meta">
              <div className="repo-title-row">
                <span className="repo-url">{repository.url}</span>
                <span className="star-badge">
                  <span className="material-symbols-outlined star-icon">
                    star
                  </span>
                  <span>{repository.stars}</span>
                </span>
              </div>
              <span className="repo-subtext">
                Includes published Whitepaper: "{repository.whitepaper}"
              </span>
            </div>
          </div>

          <a
            href={`https://${repository.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-view-rfc"
          >
            <span>View RFC</span>
            <span className="material-symbols-outlined">open_in_new</span>
          </a>
        </div>
      </div>

      {/* Right 1 Col: Sponsored Upskill Track */}
      <div className="sponsored-upskill-card">
        <div className="card-top">
          <div className="badge-row">
            <span className="sponsored-chip">Sponsored Track</span>
            <span className="material-symbols-outlined icon">
              card_membership
            </span>
          </div>
          <h3 className="track-title">{sponsoredTrack.title}</h3>
          <p className="track-desc">{sponsoredTrack.desc}</p>

          <div className="target-spec-box">
            <span className="spec-label">Recommended Target</span>
            <span className="spec-name">{sponsoredTrack.target}</span>
            <span className="spec-prep">{sponsoredTrack.prepTime}</span>
          </div>
        </div>

        <div className="card-bottom">
          <button
            type="button"
            disabled={claimed}
            onClick={() => setClaimed(true)}
            className={`btn-claim-voucher ${claimed ? 'claimed' : ''}`}
          >
            <span className="material-symbols-outlined">verified_user</span>
            <span>
              {claimed
                ? 'Voucher Code Issued to Email'
                : 'Claim Sponsored Voucher'}
            </span>
          </button>
          <span className="footnote">
            No impact on active client bench availability
          </span>
        </div>
      </div>
    </div>
  );
};

export default CandidateAssessments;
