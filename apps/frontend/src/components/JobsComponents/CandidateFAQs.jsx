import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFaqs } from '../../store/slices/homeSlice';

const DEFAULT_FAQS = [
  {
    question: 'What is the average turnaround time between applying and client interviews?',
    answer: 'Our talent acquisition directors review incoming candidate profiles within 24 to 48 hours. Pre-screened candidates typically receive direct interview routing with client VPs of Engineering within 3 to 5 business days.'
  },
  {
    question: 'Does ThinkWires deduct any commission or placement fees from my salary?',
    answer: 'No, 100% free for candidates. All recruitment, technical vetting, and placement advisory costs are funded entirely by enterprise client partners.'
  },
  {
    question: 'Can I transition from a contract or C2H role to a full-time position?',
    answer: 'Yes! Over 80% of our contract and Contract-to-Hire (C2H) placements convert to permanent full-time employment within 6 to 12 months based on mutual performance evaluations.'
  },
  {
    question: 'How does ThinkWires handle cross-border payments for Remote US/Canada roles?',
    answer: 'We manage end-to-end Employer of Record (EOR) operations, handling multi-currency salary disbursements, local tax compliance, health insurance, and statutory benefits with zero hassle.'
  }
];

const CandidateFAQs = () => {
  const dispatch = useDispatch();
  const { faqs, status } = useSelector((state) => state.home);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    if (status.faqs === 'idle') {
      dispatch(fetchFaqs());
    }
  }, [dispatch, status.faqs]);

  const displayFaqs = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="CandidateFAQs-figmaSection" id="candidate-faqs">
      <div className="CandidateFAQs-figmaContainer">
        <div className="CandidateFAQs-figmaHeader">
          <div className="CandidateFAQs-badgeTag">
            💬 FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="CandidateFAQs-headingTitle">Candidate FAQs</h2>
        </div>

        <div className="CandidateFAQs-accordionList">
          {displayFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`CandidateFAQs-accordionItem ${isOpen ? 'CandidateFAQs-itemOpen' : ''}`}
              >
                <button 
                  className="CandidateFAQs-questionBtn"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                >
                  <span className="CandidateFAQs-questionText">{faq.question}</span>
                  <span className="CandidateFAQs-chevronIcon">
                    <svg 
                      width="16" 
                      height="10" 
                      viewBox="0 0 16 10" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                    >
                      <path d="M2 2L8 8L14 2" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="CandidateFAQs-answerBody">
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

export default CandidateFAQs;
