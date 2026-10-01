import { useState } from 'react';
import ApplyModal from './ApplyModal';

const IconLock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const IconFile = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const IconCheck = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconBuilding = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 2 7 22 7 12 2"></polygon>
    <polyline points="2 17 2 22 22 22 22 17"></polyline>
    <line x1="6" y1="12" x2="6" y2="17"></line>
    <line x1="10" y1="12" x2="10" y2="17"></line>
    <line x1="14" y1="12" x2="14" y2="17"></line>
    <line x1="18" y1="12" x2="18" y2="17"></line>
  </svg>
);

const IconUser = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CTA = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !phone) return;

    setStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      });

      if (response.ok) {
        setStatus({ loading: false, success: true, error: null });
        setEmail('');
        setPhone('');
      } else {
        const data = await response.json();
        setStatus({
          loading: false,
          success: false,
          error: data.error || 'Failed to submit',
        });
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: 'Network error. Please try again.',
      });
    }
  };

  return (
    <section className={'CTA-section'}>
      <div className={'CTA-container'}>
        {/* Employer Card */}
        <div className={`${'CTA-card'} ${'CTA-employerCard'}`}>
          <span className={'CTA-employerTag'}>
            <IconBuilding /> For Enterprise Employers
          </span>
          <h2 className={'CTA-employerTitle'}>
            Need Scalable Engineering Squads?
          </h2>
          <p className={'CTA-employerDesc'}>
            Book a 20-minute workforce consultation. We will audit your current
            sprint bottlenecks, match vetted candidates within 48 hours, and
            manage cross-border compliance.
          </p>

          <form className={'CTA-form'} onSubmit={handleSubmit}>
            {status.success && (
              <div className={'CTA-successMsg'}>
                Callback requested successfully!
              </div>
            )}
            {status.error && (
              <div className={'CTA-errorMsg'}>{status.error}</div>
            )}

            <div className={'CTA-inputGroup'}>
              <input
                type="email"
                placeholder="Work Email"
                className={'CTA-input'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className={'CTA-input'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={'CTA-submitBtn'}
              disabled={status.loading}
            >
              {status.loading
                ? 'Submitting...'
                : 'Request Immediate Talent Callback'}
            </button>
          </form>

          <div className={'CTA-footerNote'}>
            <IconLock /> Guaranteed NDA & Enterprise Security Standard
          </div>
        </div>

        {/* Engineer Card */}
        <div className={`${'CTA-card'} ${'CTA-engineerCard'}`}>
          <span className={'CTA-engineerTag'}>
            <IconUser /> For Software Engineers & Leads
          </span>
          <h2 className={'CTA-engineerTitle'}>
            Accelerate Your Technical Career
          </h2>
          <p className={'CTA-engineerDesc'}>
            Get matched directly with funded US/India startups and
            multi-national enterprises. Transparent compensation, direct
            feedback, and rapid onboarding.
          </p>

          <div className={'CTA-priorityBox'}>
            <div className={'CTA-priorityHeader'}>
              <span className={'CTA-priorityTitle'}>
                Priority Placement Network
              </span>
              <span className={'CTA-activeIntake'}>Active Intake</span>
            </div>
            <p className={'CTA-priorityDesc'}>
              Fast-track routing for SAP, Full Stack, AEM, and Cloud System
              Specialists.
            </p>
          </div>

          <button
            onClick={() => setIsApplyModalOpen(true)}
            className={'CTA-applyBtn'}
          >
            <IconFile /> Drop Resume / Quick Apply
          </button>

          <div className={'CTA-engineerFooterNote'}>
            <IconCheck /> Direct client interviews &bull; Zero recruiter
            commission cut
          </div>
        </div>
      </div>
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        roleTitle="General Engineering Candidate Pool"
      />
    </section>
  );
};

export default CTA;
