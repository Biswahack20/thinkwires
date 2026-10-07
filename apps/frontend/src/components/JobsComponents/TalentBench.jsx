import React, { useState } from 'react';

const TalentBench = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email) return;
    setIsSubmitted(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <section className="TalentBench-figmaSection" id="drop-cv-section">
      <div className="TalentBench-figmaContainer">
        <div className="TalentBench-bannerCard">
          {/* Left Column */}
          <div className="TalentBench-leftCol">
            <div className="TalentBench-fastTrackBadge">
              📍 Fast-Track Placement Engine
            </div>

            <h2 className="TalentBench-bannerHeading">
              Don't see your exact stack? Drop your CV here.
            </h2>

            <p className="TalentBench-bannerSubtext">
              Our talent benchmarks analyze unlisted mandates from 740+ enterprise partners daily. 
              Submit your resume, and our senior recruitment directors will connect with targeted roles in under 24 hours.
            </p>

            <div className="TalentBench-checksRow">
              <span className="TalentBench-checkItem">
                <span className="TalentBench-checkIcon">✓</span> 100% Confidential
              </span>
              <span className="TalentBench-checkItem">
                <span className="TalentBench-checkIcon">✓</span> Direct CTO Referrals
              </span>
              <span className="TalentBench-checkItem">
                <span className="TalentBench-checkIcon">✓</span> Free Salary Benchmarking
              </span>
            </div>
          </div>

          {/* Right Column: Instant Talent Match Form */}
          <div className="TalentBench-rightCol">
            <div className="TalentBench-instantMatchCard">
              <h3 className="TalentBench-matchTitle">Instant Talent Match</h3>
              <p className="TalentBench-matchSub">
                Upload PDF/DOCX (Max 10MB) to join the active talent bench.
              </p>

              {isSubmitted ? (
                <div className="TalentBench-formSuccess">
                  <div className="TalentBench-successCheck">✓</div>
                  <h4>CV Submitted Successfully!</h4>
                  <p>
                    Thank you, <strong>{fullName}</strong>. Our senior recruitment team will review your profile and match you with unlisted roles.
                  </p>
                  <button 
                    className="TalentBench-submitAnotherBtn"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFullName('');
                      setEmail('');
                      setFile(null);
                    }}
                  >
                    Submit Another CV
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="TalentBench-matchForm">
                  <div className="TalentBench-inputGroup">
                    <input
                      type="text"
                      className="TalentBench-formInput"
                      placeholder="Full Name *"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="TalentBench-inputGroup">
                    <input
                      type="email"
                      className="TalentBench-formInput"
                      placeholder="Email Address *"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Upload Dropzone */}
                  <div className="TalentBench-uploadZone">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="TalentBench-hiddenFileInput"
                      id="bench-cv-upload"
                    />
                    <label htmlFor="bench-cv-upload" className="TalentBench-uploadLabel">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="TalentBench-cloudIcon">
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                        <polyline points="12 13 12 9 12 9"></polyline>
                        <polyline points="9 11 12 8 15 11"></polyline>
                      </svg>
                      {file ? (
                        <span className="TalentBench-selectedFileName">📄 {file.name}</span>
                      ) : (
                        <>
                          <span className="TalentBench-uploadMainText">Click to browse or drop file</span>
                          <span className="TalentBench-uploadSubText">PDF, DOC, DOCX up to 10MB</span>
                        </>
                      )}
                    </label>
                  </div>

                  <button type="submit" className="TalentBench-benchSubmitBtn">
                    <span>⚡ Submit to Talent Bench</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TalentBench;
