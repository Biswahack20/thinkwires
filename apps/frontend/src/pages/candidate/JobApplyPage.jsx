import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import '../auth/auth.css';

const JobApplyPage = () => {
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  // Extract initial title from query parameter or placeholder
  const jobTitleParam = searchParams.get('title') || 'Featured Technical Position';

  const [formData, setFormData] = useState({
    jobId: jobId || 'job_general',
    jobTitle: jobTitleParam,
    department: searchParams.get('department') || 'Engineering',
    location: searchParams.get('location') || 'Remote',
    experience: user?.experience ? `${user.experience} Years` : '3 - 5 Years',
    skills: user?.technicalSkills ? user.technicalSkills.join(', ') : '',
    coverLetter: '',
    resumeUrl: user?.resumeUrl || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Apply for ${formData.jobTitle} | Thinkwires`;
  }, [formData.jobTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.jobTitle) {
      setError('Job title is required.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/candidate/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          jobId: formData.jobId,
          jobTitle: formData.jobTitle,
          department: formData.department,
          location: formData.location,
          experience: formData.experience,
          skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
          coverLetter: formData.coverLetter,
          resumeUrl: formData.resumeUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Application submitted successfully for ${formData.jobTitle}!`);
        setTimeout(() => {
          navigate('/candidate/applications');
        }, 1800);
      } else {
        setError(data.error || 'Failed to submit application.');
      }
    } catch (err) {
      setError('Network error during application submission.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tw-candidate-shell">
      <Navbar />

      <main className="tw-portal-container" style={{ maxWidth: '780px' }}>
        <div className="tw-portal-card">
          <div className="tw-portal-card-header">
            <div>
              <span className="tw-auth-badge">Expedited Intake</span>
              <h1 className="tw-portal-card-title" style={{ fontSize: '1.6rem', marginTop: '0.4rem' }}>
                Apply for: {formData.jobTitle}
              </h1>
              <p style={{ color: '#64748B', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                Job ID: <strong>{jobId}</strong> • Verified Candidate:{' '}
                <strong>{user?.name}</strong> ({user?.email})
              </p>
            </div>
          </div>

          {error && (
            <div className="tw-auth-alert tw-auth-alert-error" role="alert">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="tw-auth-alert tw-auth-alert-success" role="alert">
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="tw-auth-form">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="tw-form-group">
                <label className="tw-form-label">Full Name</label>
                <input
                  type="text"
                  disabled
                  className="tw-form-input"
                  style={{ background: '#F8FAFC', color: '#64748B' }}
                  value={user?.name || ''}
                />
              </div>

              <div className="tw-form-group">
                <label className="tw-form-label">Verified Email</label>
                <input
                  type="email"
                  disabled
                  className="tw-form-input"
                  style={{ background: '#F8FAFC', color: '#64748B' }}
                  value={user?.email || ''}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="tw-form-group">
                <label className="tw-form-label">Total Experience</label>
                <select
                  name="experience"
                  className="tw-form-input"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  <option value="0 - 2 Years">0 - 2 Years</option>
                  <option value="3 - 5 Years">3 - 5 Years</option>
                  <option value="5 - 8 Years">5 - 8 Years</option>
                  <option value="8+ Years">8+ Years</option>
                </select>
              </div>

              <div className="tw-form-group">
                <label className="tw-form-label">Preferred Location / Mode</label>
                <input
                  type="text"
                  name="location"
                  className="tw-form-input"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote (India / US overlap)"
                />
              </div>
            </div>

            <div className="tw-form-group">
              <label className="tw-form-label">Key Technical Skills for this Role</label>
              <input
                type="text"
                name="skills"
                className="tw-form-input"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, AWS, Kubernetes"
              />
            </div>

            <div className="tw-form-group">
              <label className="tw-form-label">Resume / CV Link</label>
              <input
                type="url"
                name="resumeUrl"
                className="tw-form-input"
                placeholder="https://drive.google.com/your-resume or portfolio link"
                value={formData.resumeUrl}
                onChange={handleChange}
              />
              <span className="tw-form-help">
                Direct link to your verified CV, GitHub, or LinkedIn portfolio.
              </span>
            </div>

            <div className="tw-form-group">
              <label className="tw-form-label">Why are you a good fit for this role? (Optional)</label>
              <textarea
                name="coverLetter"
                rows="4"
                className="tw-form-input"
                placeholder="Share any highlights relevant to this position..."
                value={formData.coverLetter}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
              <button
                type="submit"
                className="tw-btn-submit"
                disabled={submitting}
                style={{ maxWidth: '280px', margin: 0 }}
              >
                {submitting ? 'Submitting Application...' : 'Confirm & Submit Application'}
              </button>

              <Link
                to="/jobs"
                className="ApplyModal-btnCancel"
                style={{
                  textDecoration: 'none',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '8px',
                  background: '#F1F5F9',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobApplyPage;
