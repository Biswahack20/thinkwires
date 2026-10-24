import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeDrawer,
  bookTalentInterview,
  resetBookingStatus,
} from '../../store/slices/benchSlice';

const BenchDossierDrawer = () => {
  const dispatch = useDispatch();
  const { drawerOpen, selectedTalent, bookingStatus, bookingMessage } =
    useSelector((state) => state.bench);

  const [formData, setFormData] = useState({
    workEmail: '',
    companyName: '',
    hiringManager: '',
    timeSlot: 'Tomorrow at 10:00 AM EST',
    notes: '',
  });

  if (!drawerOpen || !selectedTalent) return null;

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!formData.workEmail) return;

    dispatch(
      bookTalentInterview({
        talentId: selectedTalent.id,
        talentCode: selectedTalent.code,
        ...formData,
      })
    );
  };

  const rubric = selectedTalent.rubric || {
    systemDesign: 98,
    codeQuality: 97,
    liveDebugging: 99,
    communication: 96,
  };

  return (
    <div
      className="BenchDrawer-overlay"
      data-lenis-prevent="true"
      onClick={() => dispatch(closeDrawer())}
    >
      <div
        className="BenchDrawer-content"
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        style={{ overscrollBehavior: 'contain' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar with Close Button */}
        <div className="BenchDrawer-header">
          <div className="BenchDrawer-headerCode">
            <span className="material-symbols-outlined BenchDrawer-badgeIcon">
              verified
            </span>
            <span>TECHNICAL DOSSIER & VERIFICATION AUDIT</span>
          </div>
          <button
            type="button"
            className="BenchDrawer-closeBtn"
            onClick={() => dispatch(closeDrawer())}
            title="Close Drawer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="BenchDrawer-body">
          {/* Candidate Profile Summary Banner */}
          <div className="BenchDrawer-profileBanner">
            <div className="BenchDrawer-avatar">
              {selectedTalent.initials || 'TW'}
            </div>
            <div className="BenchDrawer-profileDetails">
              <div className="BenchDrawer-metaRow">
                <span className="BenchDrawer-codeBadge">
                  {selectedTalent.code}
                </span>
                <span className="BenchDrawer-statusBadge">
                  <span className="BenchDrawer-statusDot"></span>
                  {selectedTalent.urgency || 'Immediate Deployment'}
                </span>
              </div>
              <h2 className="BenchDrawer-roleName">{selectedTalent.role}</h2>
              <div className="BenchDrawer-specRow">
                <span>
                  <span className="material-symbols-outlined">work</span>{' '}
                  {selectedTalent.yearsExp || selectedTalent.experienceLevel}
                </span>
                <span>•</span>
                <span>
                  <span className="material-symbols-outlined">location_on</span>{' '}
                  {selectedTalent.location}
                </span>
                <span>•</span>
                <span>
                  <span className="material-symbols-outlined">hourglass_top</span>{' '}
                  Notice: {selectedTalent.noticePeriod || selectedTalent.urgency || '30 Days'}
                </span>
                <span>•</span>
                <span className="BenchDrawer-rateHighlight">
                  {selectedTalent.hourlyRate}/hr
                </span>
              </div>
            </div>
          </div>

          {/* AI Assessment & ATS Scoring Banner if present */}
          {(selectedTalent.assessmentScore != null ||
            selectedTalent.fitScore != null) && (
            <div
              className="BenchDrawer-cardSection"
              style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: '0.95rem',
                      color: '#166534',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '1.2rem' }}
                    >
                      psychology
                    </span>{' '}
                    ThinkWires Proctored AI Assessment
                  </h4>
                  <p
                    style={{
                      margin: '0.25rem 0 0 0',
                      fontSize: '0.82rem',
                      color: '#15803D',
                    }}
                  >
                    Automated technical screening across MCQs, architecture
                    scenarios, and practical tasks.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {selectedTalent.assessmentScore != null && (
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: '#166534',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}
                      >
                        Assessment
                      </div>
                      <div
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: '#15803D',
                        }}
                      >
                        {selectedTalent.assessmentScore}%
                      </div>
                    </div>
                  )}
                  {selectedTalent.fitScore != null && (
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: '#1D4ED8',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}
                      >
                        ATS Match
                      </div>
                      <div
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: '#2563EB',
                        }}
                      >
                        {selectedTalent.fitScore}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Evaluation Rubric Breakdown */}
          <div className="BenchDrawer-cardSection">
            <h4 className="BenchDrawer-sectionTitle">
              <span className="material-symbols-outlined">analytics</span>{' '}
              Standardized Evaluation Rubric
            </h4>
            <div className="BenchDrawer-rubricGrid">
              <div className="BenchDrawer-rubricItem">
                <div className="BenchDrawer-rubricHead">
                  <span>System Architecture & Scale</span>
                  <span className="BenchDrawer-scoreHighlight">
                    {rubric.systemDesign || 98}%
                  </span>
                </div>
                <div className="BenchDrawer-meter">
                  <div
                    className="BenchDrawer-meterFill"
                    style={{ width: `${rubric.systemDesign || 98}%` }}
                  ></div>
                </div>
              </div>
              <div className="BenchDrawer-rubricItem">
                <div className="BenchDrawer-rubricHead">
                  <span>Production Code Quality & Tests</span>
                  <span className="BenchDrawer-scoreHighlight">
                    {rubric.codeQuality || 97}%
                  </span>
                </div>
                <div className="BenchDrawer-meter">
                  <div
                    className="BenchDrawer-meterFill"
                    style={{ width: `${rubric.codeQuality || 97}%` }}
                  ></div>
                </div>
              </div>
              <div className="BenchDrawer-rubricItem">
                <div className="BenchDrawer-rubricHead">
                  <span>Live Debugging & Problem Solving</span>
                  <span className="BenchDrawer-scoreHighlight">
                    {rubric.liveDebugging || 99}%
                  </span>
                </div>
                <div className="BenchDrawer-meter">
                  <div
                    className="BenchDrawer-meterFill"
                    style={{ width: `${rubric.liveDebugging || 99}%` }}
                  ></div>
                </div>
              </div>
              <div className="BenchDrawer-rubricItem">
                <div className="BenchDrawer-rubricHead">
                  <span>Engineering Communication</span>
                  <span className="BenchDrawer-scoreHighlight">
                    {rubric.communication || 96}%
                  </span>
                </div>
                <div className="BenchDrawer-meter">
                  <div
                    className="BenchDrawer-meterFill"
                    style={{ width: `${rubric.communication || 96}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Engineering Proof */}
          <div className="BenchDrawer-cardSection">
            <h4 className="BenchDrawer-sectionTitle">
              <span className="material-symbols-outlined">psychology</span>{' '}
              Technical Evaluation Summary
            </h4>
            <div className="BenchDrawer-quoteHighlight">
              <span className="material-symbols-outlined">format_quote</span>
              <p>"{selectedTalent.proofQuote}"</p>
            </div>
            <p className="BenchDrawer-evalDetail">
              {selectedTalent.bio ||
                `Demonstrated outstanding capability in scalable backend architectures and distributed system design. Cleared deep technical audits with unredacted git commits verified by ThinkWires Senior Technical Directors.`}
            </p>
          </div>

          {/* Skills Breakdown */}
          <div className="BenchDrawer-cardSection">
            <h4 className="BenchDrawer-sectionTitle">
              <span className="material-symbols-outlined">code</span> Verified
              Technology Stack
            </h4>
            <div className="BenchDrawer-skillsWrap">
              {(selectedTalent.skills || []).map((skill, idx) => (
                <span key={idx} className="BenchDrawer-skillBadge">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Compliance & Background Checks */}
          <div className="BenchDrawer-cardSection">
            <h4 className="BenchDrawer-sectionTitle">
              <span className="material-symbols-outlined">verified_user</span>{' '}
              Compliance & Legal Readiness
            </h4>
            <div className="BenchDrawer-complianceList">
              <div className="BenchDrawer-complianceItem">
                <span className="material-symbols-outlined BenchDrawer-checkIcon">
                  check_circle
                </span>
                <div>
                  <strong>Identity & Criminal Background Clear</strong>
                  <p>
                    Comprehensive 7-year federal & state background check
                    verified.
                  </p>
                </div>
              </div>
              <div className="BenchDrawer-complianceItem">
                <span className="material-symbols-outlined BenchDrawer-checkIcon">
                  check_circle
                </span>
                <div>
                  <strong>Enterprise IP Assignment Executed</strong>
                  <p>
                    All work product, patent rights, and code belong 100% to
                    client.
                  </p>
                </div>
              </div>
              <div className="BenchDrawer-complianceItem">
                <span className="material-symbols-outlined BenchDrawer-checkIcon">
                  check_circle
                </span>
                <div>
                  <strong>Global EOR / C2C Onboarding Ready</strong>
                  <p>
                    Direct W2, C2C, or global employer of record contract ready
                    to sign.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interview Booking Form */}
          <div className="BenchDrawer-bookingCard">
            <h4 className="BenchDrawer-bookingTitle">
              <span className="material-symbols-outlined">event_available</span>
              Schedule 30-Minute Technical Screen
            </h4>
            <p className="BenchDrawer-bookingSubtitle">
              Lock in a 48-hour hiring hold on {selectedTalent.code}. Meet
              directly with the engineer and our lead assessor.
            </p>

            {bookingStatus === 'success' ? (
              <div className="BenchDrawer-bookingSuccess">
                <span className="material-symbols-outlined BenchDrawer-successIcon">
                  task_alt
                </span>
                <h5>Interview Request Confirmed!</h5>
                <p>{bookingMessage}</p>
                <button
                  type="button"
                  className="BenchDrawer-btnDone"
                  onClick={() => dispatch(resetBookingStatus())}
                >
                  Book Another Time
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="BenchDrawer-form">
                <div className="BenchDrawer-formGroup">
                  <label>Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="hiring.manager@enterprise.com"
                    value={formData.workEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, workEmail: e.target.value })
                    }
                  />
                </div>
                <div className="BenchDrawer-formRow">
                  <div className="BenchDrawer-formGroup">
                    <label>Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Cloud Corp"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="BenchDrawer-formGroup">
                    <label>Hiring Manager</label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Connor, VP Eng"
                      value={formData.hiringManager}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hiringManager: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="BenchDrawer-formGroup">
                  <label>Preferred Time Slot</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) =>
                      setFormData({ ...formData, timeSlot: e.target.value })
                    }
                  >
                    <option value="Tomorrow at 10:00 AM EST">
                      Tomorrow at 10:00 AM EST
                    </option>
                    <option value="Tomorrow at 2:00 PM EST">
                      Tomorrow at 2:00 PM EST
                    </option>
                    <option value="In 2 Days at 11:30 AM EST">
                      In 2 Days at 11:30 AM EST
                    </option>
                    <option value="In 2 Days at 4:00 PM EST">
                      In 2 Days at 4:00 PM EST
                    </option>
                  </select>
                </div>

                {bookingStatus === 'failed' && (
                  <p className="BenchDrawer-errorText">{bookingMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={bookingStatus === 'loading'}
                  className="BenchDrawer-submitBtn"
                >
                  {bookingStatus === 'loading' ? (
                    'Reserving Slot...'
                  ) : (
                    <>
                      <span className="material-symbols-outlined">bolt</span>
                      <span>Lock 48h Hold & Schedule Call</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchDossierDrawer;
