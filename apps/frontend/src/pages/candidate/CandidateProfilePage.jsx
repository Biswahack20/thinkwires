import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/slices/authSlice';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import '../auth/auth.css';

const CandidateProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error, successMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    headline: '',
    currentRole: '',
    location: '',
    experience: 0,
    expectedSalary: '',
    technicalSkills: '',
    portfolioUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    bio: '',
  });

  const [localSuccess, setLocalSuccess] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Edit Candidate Profile | Thinkwires';

    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        headline: user.headline || '',
        currentRole: user.currentRole || '',
        location: user.location || '',
        experience: user.experience || 0,
        expectedSalary: user.expectedSalary || '',
        technicalSkills: Array.isArray(user.technicalSkills)
          ? user.technicalSkills.join(', ')
          : user.technicalSkills || '',
        portfolioUrl: user.portfolioUrl || '',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalSuccess('');

    const payload = {
      ...formData,
      experience: Number(formData.experience) || 0,
      technicalSkills: formData.technicalSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const action = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(action)) {
      setLocalSuccess('Your profile details have been saved successfully.');
    }
  };

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
          <Link to="/candidate/profile" className="tw-portal-tab active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Candidate Profile
          </Link>
          <Link to="/candidate/applications" className="tw-portal-tab">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            My Applications
          </Link>
        </div>

        <div className="tw-portal-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="tw-portal-card-header">
            <div>
              <h1 className="tw-portal-card-title">Candidate Profile &amp; Preferences</h1>
              <p style={{ color: '#64748B', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                Keep your technical information up to date so recruitment partners can match you with enterprise openings.
              </p>
            </div>
          </div>

          {(localSuccess || successMessage) && (
            <div className="tw-auth-alert tw-auth-alert-success">
              <span>{localSuccess || successMessage}</span>
            </div>
          )}

          {error && (
            <div className="tw-auth-alert tw-auth-alert-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="tw-auth-form">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="tw-form-group">
                <label className="tw-form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="tw-form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="tw-form-group">
                <label className="tw-form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="tw-form-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="tw-form-group">
                <label className="tw-form-label">Current Role / Title</label>
                <input
                  type="text"
                  name="currentRole"
                  placeholder="e.g. Lead Kubernetes Architect"
                  className="tw-form-input"
                  value={formData.currentRole}
                  onChange={handleChange}
                />
              </div>

              <div className="tw-form-group">
                <label className="tw-form-label">Preferred Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Bengaluru / Remote US Overlap"
                  className="tw-form-input"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="tw-form-group">
                <label className="tw-form-label">Total Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  name="experience"
                  className="tw-form-input"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>

              <div className="tw-form-group">
                <label className="tw-form-label">Expected CTC / Retainer</label>
                <input
                  type="text"
                  name="expectedSalary"
                  placeholder="e.g. ₹38 LPA or $120,000/yr"
                  className="tw-form-input"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="tw-form-group">
              <label className="tw-form-label">
                Key Technical Skills (Comma-separated)
              </label>
              <input
                type="text"
                name="technicalSkills"
                placeholder="e.g. Go, Kubernetes, Terraform, AWS, Kafka, Microservices"
                className="tw-form-input"
                value={formData.technicalSkills}
                onChange={handleChange}
              />
              <span className="tw-form-help">
                Separate skills with commas. These are indexed by enterprise hiring managers.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="tw-form-group">
                <label className="tw-form-label">LinkedIn Profile URL</label>
                <input
                  type="url"
                  name="linkedinUrl"
                  placeholder="https://linkedin.com/in/username"
                  className="tw-form-input"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="tw-form-group">
                <label className="tw-form-label">GitHub URL</label>
                <input
                  type="url"
                  name="githubUrl"
                  placeholder="https://github.com/username"
                  className="tw-form-input"
                  value={formData.githubUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="tw-form-group">
                <label className="tw-form-label">Portfolio / Blog</label>
                <input
                  type="url"
                  name="portfolioUrl"
                  placeholder="https://portfolio.dev"
                  className="tw-form-input"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="tw-form-group">
              <label className="tw-form-label">Professional Summary &amp; Specialization</label>
              <textarea
                name="bio"
                rows="4"
                className="tw-form-input"
                style={{ resize: 'vertical' }}
                placeholder="Briefly describe your high-scale systems experience, team leadership, and core domains."
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="tw-btn-submit" disabled={loading} style={{ maxWidth: '240px' }}>
              {loading ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CandidateProfilePage;
