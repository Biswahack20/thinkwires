import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/* ─────────────────────────────────────────────────────────────
   Service card data — all routes point to existing pages
   ───────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    id: 'staff-augmentation',
    icon: 'group_add',
    label: 'Staff Augmentation',
    tagline: 'Scale on demand',
    description:
      'Deploy pre-vetted engineering pods into your teams within 48 hours. Flexible contracts, zero infrastructure overhead, and instant expertise across full-stack, cloud, and data engineering.',
    highlights: ['48-hr deployment', 'Dedicated pods', 'Zero onboarding tax'],
    href: '/services/staff-augmentation',
    accentColor: '#0037b0',
    accentBg: '#eff6ff',
  },
  {
    id: 'eor',
    icon: 'gavel',
    label: 'Employer of Record (EOR)',
    tagline: 'Compliant global hiring',
    description:
      'Hire talent across India, US, and 30+ countries without setting up a local entity. We handle payroll, statutory compliance, benefits administration, and tax obligations end-to-end.',
    highlights: ['30+ countries', 'Full compliance', 'No entity required'],
    href: '/services/eor',
    accentColor: '#004f35',
    accentBg: '#f0fdf4',
  },
  {
    id: 'permanent-staffing',
    icon: 'star_rate',
    label: 'Permanent Staffing & Executive Search',
    tagline: 'Build for the long term',
    description:
      'Recruit senior engineers, architects, and CXO-level leaders who align with your culture and technical vision. AI-assisted screening and a curated 50,000+ talent network ensure the right hire, fast.',
    highlights: ['CXO-level search', 'AI screening', '50K+ network'],
    href: '/services/permanent-staffing',
    accentColor: '#7c3aed',
    accentBg: '#faf5ff',
  },
  {
    id: 'payroll',
    icon: 'payments',
    label: 'Payroll Outsourcing',
    tagline: 'Precision, every pay cycle',
    description:
      'Outsource your entire payroll operations — from salary processing and TDS computation to PF/ESI filings and Form-16 generation — with guaranteed accuracy and statutory timeliness.',
    highlights: ['Multi-state payroll', 'TDS & PF filing', 'Form-16 generation'],
    href: '/services/payroll',
    accentColor: '#b45309',
    accentBg: '#fffbeb',
  },
];

/* ─────────────────────────────────────────────────────────────
   ServicesPage
   ───────────────────────────────────────────────────────────── */
const ServicesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Our Services | Thinkwires — Workforce & Talent Solutions';
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf8ff', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section
          style={{
            background: 'linear-gradient(135deg, #0a0f1e 0%, #0037b0 60%, #004f35 100%)',
            padding: 'clamp(5rem, 12vw, 8rem) 1.5rem 5rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* subtle grid texture */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
              backgroundSize: '32px 32px',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', maxWidth: '780px', margin: '0 auto' }}>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '999px', padding: '0.35rem 1rem',
                fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em',
                color: '#a5f3c4', textTransform: 'uppercase', marginBottom: '1.5rem',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span>
              Workforce & Talent Solutions
            </span>

            <h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800,
                color: '#ffffff', lineHeight: 1.15, marginBottom: '1.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              Everything your workforce&nbsp;needs,<br />
              <span style={{ color: '#4ade80' }}>under one roof.</span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.7, maxWidth: '620px', margin: '0 auto 2rem',
              }}
            >
              From agile staff augmentation to compliant global hiring and precision
              payroll — ThinkWires architects elite talent solutions that scale with
              your ambition, across North America, India, and emerging tech corridors.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/find-talent"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: '#ffffff', color: '#0037b0',
                  padding: '0.75rem 1.75rem', borderRadius: '8px',
                  fontWeight: 700, fontSize: '0.95rem',
                  textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_search</span>
                Hire Talent Now
              </Link>
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: 'rgba(255,255,255,0.1)', color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '0.75rem 1.75rem', borderRadius: '8px',
                  fontWeight: 600, fontSize: '0.95rem',
                  textDecoration: 'none', transition: 'background 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              >
                Talk to an Advisor
              </Link>
            </div>
          </div>
        </section>

        {/* ── Service Cards ─────────────────────────────────────── */}
        <section style={{ padding: 'clamp(3rem, 8vw, 5rem) 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 520px), 1fr))',
              gap: '1.5rem',
            }}
          >
            {SERVICES.map((svc) => (
              <ServiceCard key={svc.id} service={svc} />
            ))}
          </div>
        </section>

        {/* ── Bottom CTA strip ─────────────────────────────────── */}
        <section
          style={{
            background: '#f0f4ff',
            borderTop: '1px solid #dde4f7',
            padding: 'clamp(2.5rem, 6vw, 4rem) 1.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#0037b0', display: 'block', marginBottom: '0.75rem' }}>
              support_agent
            </span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
              Not sure which service fits your need?
            </h2>
            <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '1.75rem', fontSize: '1rem' }}>
              Our workforce advisors will map your requirements to the right
              solution — no sales pitch, just a focused 20-minute discovery call.
            </p>
            <Link
              to="/contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: '#0037b0', color: '#ffffff',
                padding: '0.8rem 2rem', borderRadius: '8px',
                fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
                transition: 'background 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#002d8f'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0037b0'; e.currentTarget.style.transform = 'none'; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
              Book a Free Consultation
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ServiceCard — extracted to keep ServicesPage readable
   ───────────────────────────────────────────────────────────── */
const ServiceCard = ({ service }) => {
  const { icon, label, tagline, description, highlights, href, accentColor, accentBg } = service;

  return (
    <article
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderColor = accentColor + '55';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      {/* Icon + tagline */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div
          style={{
            width: '52px', height: '52px', borderRadius: '12px',
            background: accentBg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '26px', color: accentColor }}>
            {icon}
          </span>
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
            {tagline}
          </p>
          <h2 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', fontWeight: 700, color: '#0f172a', margin: '0.15rem 0 0', lineHeight: 1.3 }}>
            {label}
          </h2>
        </div>
      </div>

      {/* Description */}
      <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.9375rem', margin: 0, flex: 1 }}>
        {description}
      </p>

      {/* Highlights */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {highlights.map((h) => (
          <li
            key={h}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              background: accentBg, color: accentColor,
              fontSize: '0.78rem', fontWeight: 600,
              padding: '0.25rem 0.65rem', borderRadius: '999px',
              border: `1px solid ${accentColor}22`,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>check_circle</span>
            {h}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        to={href}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          color: accentColor, fontWeight: 700, fontSize: '0.9rem',
          textDecoration: 'none', marginTop: '0.25rem',
          transition: 'gap 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.gap = '0.65rem'; }}
        onMouseLeave={e => { e.currentTarget.style.gap = '0.4rem'; }}
        aria-label={`Explore ${label}`}
      >
        Explore Service
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
      </Link>
    </article>
  );
};

export default ServicesPage;
