import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitTalentRequisition, resetRequisitionState } from '../../store/slices/findTalentSlice';

const FindTalentIntakeForm = ({ data }) => {
  const dispatch = useDispatch();
  const { submitStatus, submitError, submitSuccess } = useSelector((state) => state.findTalent || {});

  const [engagementModel, setEngagementModel] = useState('staff_augmentation');
  const [targetRole, setTargetRole] = useState('');
  const [headcount, setHeadcount] = useState('1');
  const [seniority, setSeniority] = useState('senior');
  const [selectedTechs, setSelectedTechs] = useState(['AWS & Kubernetes', 'SAP HANA / ABAP', 'GenAI & PyTorch']);
  const [urgency, setUrgency] = useState('immediate');
  const [workArrangement, setWorkArrangement] = useState('remote_global');
  const [budgetEnvelope, setBudgetEnvelope] = useState('bracket_2');
  const [fullName, setFullName] = useState('');
  const [corporateEmail, setCorporateEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  if (!data) return null;
  const { tag, title, status, engagementModels = [], techTags = [] } = data;

  const toggleTech = (tag) => {
    if (selectedTechs.includes(tag)) {
      setSelectedTechs(selectedTechs.filter((t) => t !== tag));
    } else {
      setSelectedTechs([...selectedTechs, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      submitTalentRequisition({
        engagementModel,
        targetRole,
        headcount,
        seniority,
        techStack: selectedTechs,
        deploymentUrgency: urgency,
        workArrangement,
        budgetEnvelope,
        fullName,
        corporateEmail,
        company,
        phone,
        jobDescription
      })
    );
  };

  const handleReset = () => {
    dispatch(resetRequisitionState());
    setTargetRole('');
    setFullName('');
    setCorporateEmail('');
    setCompany('');
    setPhone('');
    setJobDescription('');
  };

  return (
    <section className="FindTalent-intakeSection" id="talent-intake-form">
      <div className="FindTalent-container">
        {/* Header Bar */}
        <div className="FindTalent-intakeHeader">
          <div>
            <span className="FindTalent-eyebrow">{tag || 'Dynamic Requisition Desk'}</span>
            <h2 className="FindTalent-sectionTitle">{title || 'Post Your Technical Requirements'}</h2>
          </div>
          <div className="FindTalent-statusPill">
            <span className="status-dot"></span>
            <span>{status || 'Talent Specialists Online • Instant Dispatch Queue'}</span>
          </div>
        </div>

        {/* Success Banner */}
        {submitSuccess && (
          <div className="FindTalent-successBanner">
            <div className="banner-content">
              <span className="material-symbols-outlined icon">check_circle</span>
              <div>
                <h4 className="banner-title">Requisition Logged with Enterprise Queue</h4>
                <p className="banner-desc">
                  Our Technical Staffing Director has received your request. Candidate profiles are currently compiling.
                </p>
              </div>
            </div>
            <button type="button" onClick={handleReset} className="FindTalent-btnSuccessReset">
              Submit Another Role
            </button>
          </div>
        )}

        {/* Intake Card */}
        <div className="FindTalent-intakeCard">
          <form onSubmit={handleSubmit} className="FindTalent-form">
            {/* STAGE 1: Engagement Architecture */}
            <div className="FindTalent-formStage">
              <div className="stage-header">
                <div className="stage-title-wrap">
                  <span className="stage-number">1</span>
                  <h3 className="stage-title">Select Enterprise Engagement Model</h3>
                </div>
                <span className="stage-indicator">Stage 1 of 4</span>
              </div>

              <div className="FindTalent-engagementGrid">
                {engagementModels.map((model) => {
                  const isSelected = engagementModel === model.id;
                  return (
                    <div
                      key={model.id}
                      className={`engagement-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setEngagementModel(model.id)}
                    >
                      <div className="card-top">
                        <span className="material-symbols-outlined icon">{model.icon}</span>
                        <span className={`check-dot ${isSelected ? 'active' : ''}`}>
                          <span className="material-symbols-outlined check-icon">check</span>
                        </span>
                      </div>
                      <div className="card-bottom">
                        <span className="card-title">{model.title}</span>
                        <span className="card-desc">{model.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="stage-divider"></div>

            {/* STAGE 2: Role Specification & Tech Stack */}
            <div className="FindTalent-formStage">
              <div className="stage-header">
                <div className="stage-title-wrap">
                  <span className="stage-number">2</span>
                  <h3 className="stage-title">Role Specification &amp; Tech Stack</h3>
                </div>
                <span className="stage-indicator">Stage 2 of 4</span>
              </div>

              <div className="FindTalent-rowGrid">
                <div className="field-group span-8">
                  <label className="field-label" htmlFor="target-role">
                    Target Job Title / Technical Mandate <span className="req">*</span>
                  </label>
                  <div className="input-wrap icon-left">
                    <span className="material-symbols-outlined field-icon">terminal</span>
                    <input
                      id="target-role"
                      type="text"
                      required
                      placeholder="e.g. Lead Cloud Architect, SAP ABAP with HANA, GenAI / LLM Lead"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-group span-4">
                  <label className="field-label">Positions to Fill</label>
                  <div className="toggle-button-group">
                    {['1', '2-5', '6-10', '10+ Pod'].map((hc) => (
                      <button
                        key={hc}
                        type="button"
                        className={`toggle-btn ${headcount === hc ? 'active' : ''}`}
                        onClick={() => setHeadcount(hc)}
                      >
                        {hc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field-group span-12">
                  <label className="field-label">Required Seniority Level</label>
                  <div className="seniority-grid">
                    {[
                      { id: 'mid', title: 'Mid-Level', desc: '3 – 5 Years Experience' },
                      { id: 'senior', title: 'Senior Engineer', desc: '5 – 8 Years Experience' },
                      { id: 'principal', title: 'Principal / Staff', desc: '8 – 12 Years Experience' },
                      { id: 'executive', title: 'VP / Director / Head', desc: '12+ Years Leadership' }
                    ].map((s) => (
                      <div
                        key={s.id}
                        className={`seniority-btn ${seniority === s.id ? 'active' : ''}`}
                        onClick={() => setSeniority(s.id)}
                      >
                        <span className="s-title">{s.title}</span>
                        <span className="s-desc">{s.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="field-group span-12">
                  <div className="label-with-counter">
                    <label className="field-label">Mandatory Technical Stack (Click to tag)</label>
                    <span className="counter-text">Selected: <strong>{selectedTechs.length}</strong> tags</span>
                  </div>
                  <div className="tech-tags-list">
                    {techTags.map((tag) => {
                      const isActive = selectedTechs.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          className={`tech-pill-btn ${isActive ? 'active' : ''}`}
                          onClick={() => toggleTech(tag)}
                        >
                          {isActive ? '✓ ' : '+ '} {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="stage-divider"></div>

            {/* STAGE 3: Timeline & Budget */}
            <div className="FindTalent-formStage">
              <div className="stage-header">
                <div className="stage-title-wrap">
                  <span className="stage-number">3</span>
                  <h3 className="stage-title">Timeline, Location &amp; Budget Envelope</h3>
                </div>
                <span className="stage-indicator">Stage 3 of 4</span>
              </div>

              <div className="FindTalent-triGrid">
                <div className="field-group">
                  <label className="field-label">Deployment Urgency</label>
                  <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                    <option value="immediate">Immediate Joining (&lt; 48 Hours)</option>
                    <option value="15days">Notice Period: Under 15 Days</option>
                    <option value="30days">Standard Notice: 30 Days</option>
                    <option value="pipeline">Strategic Pipeline (Next Quarter)</option>
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Work Arrangement</label>
                  <select value={workArrangement} onChange={(e) => setWorkArrangement(e.target.value)}>
                    <option value="remote_global">100% Remote (Pan-India / US / CA)</option>
                    <option value="hybrid_ncr">Hybrid — Noida / Delhi-NCR Tech Hub</option>
                    <option value="hybrid_bangalore">Hybrid — Bengaluru / Hyderabad / Pune</option>
                    <option value="onsite">On-Site Dedicated Client Facility</option>
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Commercial Target / Bracket</label>
                  <select value={budgetEnvelope} onChange={(e) => setBudgetEnvelope(e.target.value)}>
                    <option value="bracket_1">12 – 18 LPA (₹2,500 – ₹3,750 / hr)</option>
                    <option value="bracket_2">18 – 28 LPA (₹3,750 – ₹6,250 / hr)</option>
                    <option value="bracket_3">28 – 45 LPA (₹6,250 – ₹9,500 / hr)</option>
                    <option value="bracket_4">45+ LPA / Executive Retainer Tier</option>
                    <option value="market_rate">Advise Market Rate for Scope</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="stage-divider"></div>

            {/* STAGE 4: Authority & Job Description */}
            <div className="FindTalent-formStage">
              <div className="stage-header">
                <div className="stage-title-wrap">
                  <span className="stage-number">4</span>
                  <h3 className="stage-title">Company Authority &amp; Job Description</h3>
                </div>
                <span className="stage-indicator">Final Stage</span>
              </div>

              <div className="FindTalent-quadGrid">
                <div className="field-group">
                  <label className="field-label" htmlFor="corp-name">
                    Full Name <span className="req">*</span>
                  </label>
                  <input
                    id="corp-name"
                    type="text"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="corp-email">
                    Corporate Email <span className="req">*</span>
                  </label>
                  <input
                    id="corp-email"
                    type="email"
                    required
                    placeholder="v.malhotra@enterprise.com"
                    value={corporateEmail}
                    onChange={(e) => setCorporateEmail(e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="corp-company">
                    Company / Entity <span className="req">*</span>
                  </label>
                  <input
                    id="corp-company"
                    type="text"
                    required
                    placeholder="e.g. Apex FinTech Solutions"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="corp-phone">
                    Direct Phone / WhatsApp <span className="req">*</span>
                  </label>
                  <input
                    id="corp-phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="FindTalent-rowGrid pt-3">
                <div className="field-group span-8">
                  <label className="field-label" htmlFor="jd-text">
                    Paste Job Description / Critical Must-Haves (Optional)
                  </label>
                  <textarea
                    id="jd-text"
                    rows="3"
                    placeholder="Key responsibilities, deliverables, mandatory integrations, or niche domain constraints..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="field-group span-4 upload-box-field">
                  <label className="field-label">Attach Official Spec (PDF / DOCX)</label>
                  <div className="file-drop-area">
                    <span className="material-symbols-outlined file-icon">upload_file</span>
                    <span className="file-label">Drop Job Description</span>
                    <span className="file-sub">PDF, DOCX up to 15MB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {submitError && <div className="FindTalent-errorMessage">{submitError}</div>}

            {/* Bottom Action Bar */}
            <div className="FindTalent-formFooter">
              <div className="nda-note">
                <span className="material-symbols-outlined nda-icon">verified</span>
                <div>
                  <span className="nda-title">Standard Mutual NDA Protection Applied</span>
                  <span className="nda-sub">Zero placement fee incurred until successful hire trial approval.</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                className="FindTalent-btnSubmit"
              >
                <span>
                  {submitStatus === 'loading'
                    ? 'Transmitting Mandate...'
                    : 'Submit Mandate & Receive 3 Profiles in 5 Hours'}
                </span>
                <span className="material-symbols-outlined arrow">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FindTalentIntakeForm;
