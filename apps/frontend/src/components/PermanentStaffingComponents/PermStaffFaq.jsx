import React, { useState } from 'react';

const PermStaffFaq = ({ faqs = [] }) => {
  const [openIdx, setOpenIdx] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="PermStaff-faqSection">
      <div className="PermStaff-container">
        <div className="PermStaff-faqGrid">
          {/* Left: Context and Protection Box */}
          <div className="faq-context-col">
            <span className="PermStaff-eyebrow primary">Transparency &amp; Governance</span>
            <h2 className="faq-title">Common Questions About Permanent Staffing &amp; Executive Search</h2>
            <p className="faq-desc">
              Permanent appointments require operational clarity and mutual trust. Review our standard engagement parameters, placement protections, and selection frameworks.
            </p>

            <div className="protection-card">
              <div className="prot-header">
                <span className="material-symbols-outlined">verified_user</span>
                <h4>Guaranteed Protection</h4>
              </div>
              <p>
                Every permanent mandate executed by ThinkWires includes our comprehensive 90-day replacement commitment backed by formal corporate SLA.
              </p>
              <a href="#consultation-booking" className="prot-link">
                <span>Initiate Mandate Consultation</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Right: Accordion Items */}
          <div className="faq-accordion-col">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="PermStaff-faqCard">
                  <button
                    type="button"
                    className="faq-toggle-btn"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span className={`material-symbols-outlined toggle-icon ${isOpen ? 'rotated' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-body">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PermStaffFaq;
