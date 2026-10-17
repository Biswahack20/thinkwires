import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ScrollReveal from '../common/ScrollReveal';

const CapabilityBriefing = () => {
  const [submitted, setSubmitted] = useState(false);
  const cbData = useSelector((state) => state.industries.capabilityBriefing);

  const badge = cbData?.badge || 'Global Staffing Intelligence';
  const title = cbData?.title || 'Need domain-certified engineers for your sector?';
  const description = cbData?.description || 'Request a customized industry capability briefing. We evaluate your tech architecture, compliance benchmarks, and provide an instant talent availability map.';

  const features = (cbData?.features && cbData.features.length > 0) ? cbData.features : [
    { icon: 'schedule', text: '48-hour shortlist SLA with pre-cleared engineers' },
    { icon: 'gavel', text: '100% compliant cross-border EOR contracts (US, Canada, Global)' },
    { icon: 'shield', text: 'Pre-screened against FDA, HIPAA, PCI-DSS, and ISO protocols' }
  ];

  const formCard = cbData?.formCard || {
    title: 'Request Industry Capability Briefing',
    subtitle: 'Confidential briefing tailored to your sector constraints.',
    industryOptions: [
      'Life Sciences & Healthcare',
      'Banking & FinTech (BFSI)',
      'Automotive & Mobility',
      'Manufacturing & Telecom',
      'Technology & Cloud Software',
      'Defense & Aerospace',
      'Semiconductor & Hardware',
      'Logistics & Supply Chain'
    ],
    podSizeOptions: [
      '1 - 3 Senior Specialists',
      '4 - 10 Engineered Pod',
      '10+ Scaled Global Pod',
      'Executive / Architect Search'
    ],
    privacyNote: 'Non-disclosure assured. We never distribute engineer profiles without mutual confidentiality agreements.'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="CapabilityBriefing-section" id="capability-briefing">
      <div className="CapabilityBriefing-bgGlow CapabilityBriefing-bgGlow--left" aria-hidden="true"></div>
      <div className="CapabilityBriefing-bgGlow CapabilityBriefing-bgGlow--right" aria-hidden="true"></div>

      <div className="CapabilityBriefing-container">
        {/* Left Column: Information */}
        <ScrollReveal direction="left" className="CapabilityBriefing-infoColWrap">
          <div className="CapabilityBriefing-infoCol">
            <span className="CapabilityBriefing-badge">
              <span className="CapabilityBriefing-badgeDot"></span>
              {badge}
            </span>

            <h2 className="CapabilityBriefing-title">
              {title}
            </h2>

            <p className="CapabilityBriefing-description">
              {description}
            </p>

            <div className="CapabilityBriefing-featuresList">
              {features.map((feat, idx) => (
                <div key={idx} className="CapabilityBriefing-featureItem">
                  <span className="material-symbols-outlined CapabilityBriefing-featureIcon">{feat.icon}</span>
                  <span>{feat.text}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Right Column: Form */}
        <ScrollReveal direction="right" className="CapabilityBriefing-formCardWrap">
          <div className="CapabilityBriefing-formCard">
          <h3 className="CapabilityBriefing-formTitle">{formCard.title}</h3>
          <p className="CapabilityBriefing-formSubtitle">
            {formCard.subtitle}
          </p>

          <form className="CapabilityBriefing-form" onSubmit={handleSubmit}>
            <div className="CapabilityBriefing-formRow">
              <div className="CapabilityBriefing-formGroup">
                <label className="CapabilityBriefing-label">Work Email</label>
                <input
                  className="CapabilityBriefing-input"
                  placeholder="vp.eng@enterprise.com"
                  required
                  type="email"
                />
              </div>
              <div className="CapabilityBriefing-formGroup">
                <label className="CapabilityBriefing-label">Company Name</label>
                <input
                  className="CapabilityBriefing-input"
                  placeholder="Global Corp Inc."
                  required
                  type="text"
                />
              </div>
            </div>

            <div className="CapabilityBriefing-formRow">
              <div className="CapabilityBriefing-formGroup">
                <label className="CapabilityBriefing-label">Primary Industry</label>
                <select className="CapabilityBriefing-select">
                  {formCard.industryOptions && formCard.industryOptions.map((opt, i) => (
                    <option key={i}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="CapabilityBriefing-formGroup">
                <label className="CapabilityBriefing-label">Desired Pod Size</label>
                <select className="CapabilityBriefing-select">
                  {formCard.podSizeOptions && formCard.podSizeOptions.map((opt, i) => (
                    <option key={i}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="CapabilityBriefing-formGroup">
              <label className="CapabilityBriefing-label">Tech Stack &amp; Compliance Requirements</label>
              <textarea
                className="CapabilityBriefing-textarea"
                placeholder="e.g., AUTOSAR Classic, C++, ISO 26262 ASIL-D or HIPAA HL7 FHIR with Python/AWS"
                rows="3"
              ></textarea>
            </div>

            <button className="CapabilityBriefing-submitBtn" type="submit">
              <span>Generate Customized Capability Briefing</span>
              <span className="material-symbols-outlined">send</span>
            </button>

            {submitted && (
              <div className="CapabilityBriefing-feedback">
                ✓ Briefing request received. A ThinkWires Sector Lead will deliver your capability memo within 4 hours.
              </div>
            )}

            <p className="CapabilityBriefing-privacyNote">
              {formCard.privacyNote}
            </p>
          </form>
        </div>
      </ScrollReveal>
      </div>
    </section>
  );
};

export default CapabilityBriefing;
