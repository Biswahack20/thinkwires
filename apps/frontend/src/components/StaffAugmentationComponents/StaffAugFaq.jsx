import React, { useState } from 'react';

const StaffAugFaq = ({ faqs = [] }) => {
  const [openIdx, setOpenIdx] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="StaffAug-faqSection">
      <div className="StaffAug-faqContainer">
        <div className="StaffAug-sectionHeader">
          <span className="StaffAug-eyebrow primary">Frequently Asked Questions</span>
          <h2 className="StaffAug-title">Let's Discuss How Your Setup Should Look</h2>
          <p className="StaffAug-desc">
            Answers to common questions about onboarding augmented technical specialists.
          </p>
        </div>

        <div className="StaffAug-faqList">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="StaffAug-faqItem">
                <button
                  type="button"
                  className="StaffAug-faqBtn"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className={`material-symbols-outlined faq-icon ${isOpen ? 'rotated' : ''}`}>
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="StaffAug-faqContent">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StaffAugFaq;
