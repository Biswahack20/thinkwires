import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BenchRequisitionCTA = () => {
  const { requisitionCta } = useSelector((state) => state.bench);

  const fallbackCta = {
    tag: 'CUSTOM POD PROVISIONING',
    title: 'Need a Custom Engineering Pod or Niche Enterprise Skillset?',
    description: 'If your required tech stack isn’t listed on today’s active bench, our technical directors will assemble, vet, and deliver a tailored pod within 5 business days.',
    primaryBtn: { text: 'Request Custom Pod Requisition', link: '/contact' },
    secondaryBtn: { text: 'Speak with a Director', link: '/contact' }
  };

  const cta = requisitionCta || fallbackCta;

  return (
    <section className="BenchCta-section">
      <div className="BenchCta-container">
        <div className="BenchCta-card">
          <div className="BenchCta-content">
            <span className="BenchCta-tag">{cta.tag}</span>
            <h2 className="BenchCta-title">{cta.title}</h2>
            <p className="BenchCta-desc">{cta.description}</p>
            <div className="BenchCta-btnGroup">
              <Link to={cta.primaryBtn?.link || '/contact'} className="BenchCta-btnPrimary">
                <span className="material-symbols-outlined">bolt</span>
                <span>{cta.primaryBtn?.text || 'Request Custom Pod Requisition'}</span>
              </Link>
              <Link to={cta.secondaryBtn?.link || '/contact'} className="BenchCta-btnSecondary">
                <span className="material-symbols-outlined">support_agent</span>
                <span>{cta.secondaryBtn?.text || 'Speak with a Director'}</span>
              </Link>
            </div>
          </div>
          <div className="BenchCta-graphic">
            <div className="BenchCta-statBox">
              <span className="BenchCta-statNumber">5 Days</span>
              <span className="BenchCta-statLabel">Custom Pod Delivery SLA</span>
            </div>
            <div className="BenchCta-statBox">
              <span className="BenchCta-statNumber">100%</span>
              <span className="BenchCta-statLabel">IP Ownership from Day 1</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenchRequisitionCTA;
