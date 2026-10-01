import React, { useState } from 'react';

const ApplyModal = ({ isOpen, onClose, roleTitle }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '3 - 5 Years',
    location: '',
    skills: '',
    resume: null,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form:', formData);
    // Add logic to post to backend here
    alert('Application submitted successfully!');
    onClose();
  };

  return (
    <div className="ApplyModal-overlay">
      <div className="ApplyModal-content">
        <button className="ApplyModal-closeBtn" onClick={onClose}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="ApplyModal-header">
          <p className="ApplyModal-intakeText">THINKWIRES EXPEDITED INTAKE</p>
          <h2 className="ApplyModal-title">Apply for: {roleTitle}</h2>
        </div>

        <form onSubmit={handleSubmit} className="ApplyModal-form">
          <div className="ApplyModal-fieldGroup">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Anand Sharma"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="ApplyModal-row">
            <div className="ApplyModal-fieldGroup">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="anand@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="ApplyModal-fieldGroup">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ApplyModal-row">
            <div className="ApplyModal-fieldGroup">
              <label>Total Experience</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              >
                <option value="0 - 2 Years">0 - 2 Years</option>
                <option value="3 - 5 Years">3 - 5 Years</option>
                <option value="5 - 8 Years">5 - 8 Years</option>
                <option value="8+ Years">8+ Years</option>
              </select>
            </div>
            <div className="ApplyModal-fieldGroup">
              <label>Preferred Location</label>
              <input
                type="text"
                name="location"
                placeholder="Bangalore / Remote"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ApplyModal-fieldGroup">
            <label>Key Technical Skills</label>
            <input
              type="text"
              name="skills"
              placeholder="e.g. SAP ABAP, HANA, Node.js, AEM"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          <div className="ApplyModal-fieldGroup">
            <label>Upload Resume (PDF, DOCX) *</label>
            <div className="ApplyModal-uploadBox">
              <input
                type="file"
                accept=".pdf,.docx"
                className="ApplyModal-fileInput"
                onChange={handleFileChange}
                required
              />
              <div className="ApplyModal-uploadContent">
                <svg
                  className="ApplyModal-uploadIcon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p className="ApplyModal-uploadText">
                  {formData.resume
                    ? formData.resume.name
                    : 'Click to browse or drop file here'}
                </p>
                <p className="ApplyModal-uploadSubText">Max size 10MB</p>
              </div>
            </div>
          </div>

          <div className="ApplyModal-actions">
            <button
              type="button"
              className="ApplyModal-btnCancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="ApplyModal-btnSubmit">
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
