import React from 'react';
import { useDispatch } from 'react-redux';
import { openDrawer } from '../../store/slices/benchSlice';

const BenchCandidateCard = ({ talent }) => {
  const dispatch = useDispatch();

  if (!talent) return null;

  const {
    id,
    code,
    role,
    specialty,
    experienceLevel,
    yearsExp,
    location,
    score,
    assessmentScore,
    fitScore,
    urgency,
    hourlyRate,
    proofQuote,
    skills = [],
    initials = 'TW'
  } = talent;

  const isImmediate = urgency && urgency.includes('Immediate');

  return (
    <div className="BenchCard-card">
      {/* Top Meta Bar */}
      <div className="BenchCard-header">
        <div className="BenchCard-codeBadge">
          <span className="material-symbols-outlined BenchCard-codeIcon">badge</span>
          <span className="BenchCard-codeText">{code}</span>
        </div>
        <div className={`BenchCard-urgencyBadge ${isImmediate ? 'is-immediate' : ''}`}>
          <span className="BenchCard-urgencyDot"></span>
          <span>{urgency}</span>
        </div>
      </div>

      {/* Profile Summary Row */}
      <div className="BenchCard-profileRow">
        <div className="BenchCard-avatar">
          <span className="BenchCard-avatarText">{initials}</span>
        </div>
        <div className="BenchCard-titleWrap">
          <h3 className="BenchCard-roleTitle">{role}</h3>
          <div className="BenchCard-metaLine">
            <span className="BenchCard-metaItem">
              <span className="material-symbols-outlined">work</span> {yearsExp || experienceLevel}
            </span>
            <span className="BenchCard-metaDot">•</span>
            <span className="BenchCard-metaItem">
              <span className="material-symbols-outlined">location_on</span> {location}
            </span>
          </div>
        </div>
        <div className="BenchCard-rateBox">
          <span className="BenchCard-rateNum">{hourlyRate}</span>
          <span className="BenchCard-ratePeriod">/ hr</span>
        </div>
      </div>

      {/* Vetting Score Bar */}
      <div className="BenchCard-scoreSection">
        <div className="BenchCard-scoreInfo">
          <span className="BenchCard-scoreLabel">
            <span className="material-symbols-outlined">verified</span> Vetting Score
          </span>
          <span className="BenchCard-scorePercent">{score}%</span>
        </div>
        <div className="BenchCard-scoreTrack">
          <div
            className="BenchCard-scoreFill"
            style={{ width: `${Math.min(score, 100)}%` }}
          ></div>
        </div>
        {(assessmentScore != null || fitScore != null) && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.45rem', fontSize: '0.74rem' }}>
            {assessmentScore != null && (
              <span style={{ color: '#15803D', fontWeight: 600, background: '#DCFCE7', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                AI Assessment: {assessmentScore}%
              </span>
            )}
            {fitScore != null && (
              <span style={{ color: '#1D4ED8', fontWeight: 600, background: '#DBEAFE', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                ATS Match: {fitScore}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* Verified Engineering Proof Quote */}
      <div className="BenchCard-quoteBox">
        <span className="material-symbols-outlined BenchCard-quoteIcon">format_quote</span>
        <p className="BenchCard-quoteText">"{proofQuote}"</p>
      </div>

      {/* Tech Skills Pills */}
      <div className="BenchCard-skillsList">
        {skills.map((skill, idx) => (
          <span key={idx} className="BenchCard-skillPill">
            {skill}
          </span>
        ))}
      </div>

      {/* Card Actions Footer */}
      <div className="BenchCard-footer">
        <button
          type="button"
          className="BenchCard-btnSecondary"
          onClick={() => dispatch(openDrawer(talent))}
        >
          <span className="material-symbols-outlined">description</span>
          <span>View Full Dossier</span>
        </button>
        <button
          type="button"
          className="BenchCard-btnPrimary"
          onClick={() => dispatch(openDrawer(talent))}
        >
          <span className="material-symbols-outlined">calendar_today</span>
          <span>Book 30-Min Screen</span>
        </button>
      </div>
    </div>
  );
};

export default BenchCandidateCard;
