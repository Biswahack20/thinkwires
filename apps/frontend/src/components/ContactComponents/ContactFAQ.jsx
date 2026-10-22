import React, { useState } from 'react';
import SectionBadge from '../common/SectionBadge';
import ScrollReveal from '../common/ScrollReveal';

const ContactFAQ = ({ faq = [] }) => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="ContactFAQ-section">
      <div className="ContactFAQ-container">
        <ScrollReveal direction="up">
          <div className="ContactFAQ-header">
            <SectionBadge
              text="FREQUENTLY ASKED"
              icon={
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              }
            />
            <h2 className="ContactFAQ-title">Common Questions</h2>
            <p className="ContactFAQ-subtitle">
              Quick answers to questions we hear from enterprise clients and
              talent teams every day.
            </p>
          </div>
        </ScrollReveal>

        <div className="ContactFAQ-list" role="list">
          {faq.map((item, idx) => {
            const isOpen = openId === item.id;
            return (
              <ScrollReveal key={item.id} direction="up" delay={idx * 0.08}>
                <div
                  className={`ContactFAQ-item ${isOpen ? 'ContactFAQ-item--open' : ''}`}
                  role="listitem"
                >
                  <button
                    className="ContactFAQ-question"
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    id={`faq-btn-${item.id}`}
                    aria-controls={`faq-ans-${item.id}`}
                  >
                    <span className="ContactFAQ-questionNum">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="ContactFAQ-questionText">
                      {item.question}
                    </span>
                    <span
                      className={`ContactFAQ-chevron ${isOpen ? 'ContactFAQ-chevron--open' : ''}`}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>

                  <div
                    id={`faq-ans-${item.id}`}
                    className={`ContactFAQ-answer ${isOpen ? 'ContactFAQ-answer--open' : ''}`}
                    role="region"
                    aria-labelledby={`faq-btn-${item.id}`}
                  >
                    <p className="ContactFAQ-answerText">{item.answer}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactFAQ;
