import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitContactMessage, resetSubmitStatus } from '../../store/slices/contactSlice';

const validate = (formData, fields) => {
  const errors = {};
  fields.forEach((f) => {
    if (f.required && !formData[f.name]?.trim()) {
      errors[f.name] = `${f.label} is required.`;
    }
    if (f.type === 'email' && formData[f.name] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[f.name])) {
      errors[f.name] = 'Please enter a valid email address.';
    }
  });
  return errors;
};

const ContactForm = ({ formConfig }) => {
  const dispatch = useDispatch();
  const { submitStatus, submitMessage } = useSelector((state) => state.contact);

  const {
    title = 'Send Us a Message',
    subtitle = 'Tell us about your hiring challenge.',
    inquiryTypes = ['Staff Augmentation', 'Permanent Hiring', 'EOR', 'Executive Search', 'General Inquiry'],
    fields = [],
    submitLabel = 'Send Message',
    footerNote = 'No spam. We respond within 5 business hours.'
  } = formConfig || {};

  const emptyForm = fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {
    inquiryType: inquiryTypes[0] || ''
  });

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    return () => {
      dispatch(resetSubmitStatus());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validate({ ...formData, [name]: value }, fields)[name] || ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validate(formData, fields)[name] || ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = fields.reduce((acc, f) => ({ ...acc, [f.name]: true }), {});
    setTouched(allTouched);
    const validationErrors = validate(formData, fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).filter((k) => validationErrors[k]).length > 0) return;
    dispatch(submitContactMessage(formData));
  };

  const handleReset = () => {
    setFormData(emptyForm);
    setErrors({});
    setTouched({});
    dispatch(resetSubmitStatus());
  };

  if (submitStatus === 'succeeded') {
    return (
      <div className="ContactForm-wrapper">
        <div className="ContactForm-successPanel">
          <div className="ContactForm-successIcon">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3 className="ContactForm-successTitle">Message Received!</h3>
          <p className="ContactForm-successMsg">
            {submitMessage || 'Thank you! A ThinkWires staffing director will respond within 5 business hours.'}
          </p>
          <button onClick={handleReset} className="ContactForm-resetBtn">
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ContactForm-wrapper">
      <div className="ContactForm-header">
        <h2 className="ContactForm-title" id="contact-form-heading">
          {title}
        </h2>
        <p className="ContactForm-subtitle">{subtitle}</p>
      </div>

      <form
        className="ContactForm-form"
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby="contact-form-heading"
      >
        {/* Dual-column row for Name + Email */}
        <div className="ContactForm-row">
          {fields.slice(0, 2).map((field) => (
            <div key={field.name} className="ContactForm-fieldGroup">
              <label className="ContactForm-label" htmlFor={`contact-${field.name}`}>
                {field.label}
                {field.required && <span className="ContactForm-required"> *</span>}
              </label>
              <input
                id={`contact-${field.name}`}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`ContactForm-input ${errors[field.name] ? 'ContactForm-input--error' : ''}`}
                aria-invalid={!!errors[field.name]}
                aria-describedby={errors[field.name] ? `error-${field.name}` : undefined}
              />
              {errors[field.name] && (
                <span id={`error-${field.name}`} className="ContactForm-error" role="alert">
                  {errors[field.name]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Dual-column row for Phone + Company */}
        <div className="ContactForm-row">
          {fields.slice(2, 4).map((field) => (
            <div key={field.name} className="ContactForm-fieldGroup">
              <label className="ContactForm-label" htmlFor={`contact-${field.name}`}>
                {field.label}
                {field.required && <span className="ContactForm-required"> *</span>}
              </label>
              <input
                id={`contact-${field.name}`}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`ContactForm-input ${errors[field.name] ? 'ContactForm-input--error' : ''}`}
              />
            </div>
          ))}
        </div>

        {/* Inquiry Type Select */}
        {fields.slice(4, 5).map((field) => (
          <div key={field.name} className="ContactForm-fieldGroup">
            <label className="ContactForm-label" htmlFor={`contact-${field.name}`}>
              {field.label}
              {field.required && <span className="ContactForm-required"> *</span>}
            </label>
            <select
              id={`contact-${field.name}`}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`ContactForm-select ${errors[field.name] ? 'ContactForm-input--error' : ''}`}
              aria-invalid={!!errors[field.name]}
            >
              <option value="" disabled>
                {field.placeholder || 'Select inquiry type'}
              </option>
              {inquiryTypes.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <span className="ContactForm-error" role="alert">
                {errors[field.name]}
              </span>
            )}
          </div>
        ))}

        {/* Message Textarea */}
        {fields.slice(5).map((field) => (
          <div key={field.name} className="ContactForm-fieldGroup">
            <label className="ContactForm-label" htmlFor={`contact-${field.name}`}>
              {field.label}
              {field.required && <span className="ContactForm-required"> *</span>}
            </label>
            <textarea
              id={`contact-${field.name}`}
              name={field.name}
              rows="4"
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className="ContactForm-textarea"
            />
          </div>
        ))}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitStatus === 'submitting'}
          className="ContactForm-submitBtn"
          id="contact-submit-btn"
        >
          {submitStatus === 'submitting' ? (
            <>
              <span className="ContactForm-spinner"></span>
              Sending...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              {submitLabel}
            </>
          )}
        </button>

        {submitStatus === 'failed' && (
          <div className="ContactForm-errorAlert" role="alert">
            {submitMessage || 'Failed to send. Please try again or email us directly.'}
          </div>
        )}

        <p className="ContactForm-footerNote">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          {footerNote}
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
