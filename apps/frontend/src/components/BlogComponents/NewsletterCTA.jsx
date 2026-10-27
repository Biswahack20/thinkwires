import React, { useState } from 'react';

const NewsletterCTA = ({ isSubmitted = false, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(isSubmitted);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
    onSubmit && onSubmit({ email, role });
  };

  return (
    <section className="NewsletterCTA-figmaSection blog-container">
      <div className="NewsletterCTA-figmaCard">
        <div className="NewsletterCTA-figmaGrid">
          {/* Left Column: Title, Subtitle, Checkmarks */}
          <div className="NewsletterCTA-figmaLeft">
            <span className="NewsletterCTA-figmaBadge">
              Quarterly Tech Hiring &amp; Salary Benchmark Reports
            </span>

            <h2 className="NewsletterCTA-figmaTitle">
              Make Board-Level Tech Hiring Decisions with Real Telemetry
            </h2>

            <p className="NewsletterCTA-figmaSubtitle">
              Join over 4,800 CTOs, VPs of Engineering, and People Leaders
              receiving Thinkwires unvarnished quarterly compensation,
              time-to-hire, and skill scarcity reports.
            </p>

            <div className="NewsletterCTA-figmaCheckmarks">
              <div className="NewsletterCTA-figmaCheckItem">
                <span className="NewsletterCTA-checkIcon">✓</span>
                <span>Zero Vendor Fluff</span>
              </div>
              <div className="NewsletterCTA-figmaCheckItem">
                <span className="NewsletterCTA-checkIcon">✓</span>
                <span>Full Raw Compensation Quartiles</span>
              </div>
              <div className="NewsletterCTA-figmaCheckItem">
                <span className="NewsletterCTA-checkIcon">✓</span>
                <span>Instant Quarterly PDF &amp; API Feed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Form Box */}
          <div className="NewsletterCTA-figmaRight">
            <div className="NewsletterCTA-figmaFormBox">
              {submitted ? (
                <div className="NewsletterCTA-figmaSuccess">
                  <h3>Subscription Confirmed</h3>
                  <p>
                    You have been added to the quarterly benchmark dispatch.
                    Your first report is in your inbox.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="NewsletterCTA-figmaForm"
                >
                  <div className="NewsletterCTA-figmaField">
                    <label className="NewsletterCTA-figmaLabel">
                      Work Email Address
                    </label>
                    <input
                      type="email"
                      required
                      className="NewsletterCTA-figmaInput"
                      placeholder="cto@enterprise.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="NewsletterCTA-figmaField">
                    <label className="NewsletterCTA-figmaLabel">
                      Organization Role
                    </label>
                    <input
                      type="text"
                      className="NewsletterCTA-figmaInput"
                      placeholder="CTO / VP Engineering / Tech Leadership"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="NewsletterCTA-figmaSubmitBtn"
                  >
                    Subscribe to Benchmark Dispatch ⬎
                  </button>

                  <p className="NewsletterCTA-figmaNote">
                    Strictly enterprise research. Unsubscribe at any time with 1
                    click.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
