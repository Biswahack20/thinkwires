import React from 'react';
import SectionBadge from '../common/SectionBadge';
import ScrollReveal from '../common/ScrollReveal';

const ContactOffices = ({ offices = [] }) => {
  return (
    <section className="ContactOffices-section">
      <div className="ContactOffices-container">
        <ScrollReveal direction="up">
          <div className="ContactOffices-header">
            <SectionBadge
              text="OFFICE LOCATIONS"
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
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              }
            />
            <h2 className="ContactOffices-title">Find Us Around the Globe</h2>
            <p className="ContactOffices-subtitle">
              Headquartered in Noida with active delivery corridors across the
              United States and Canada.
            </p>
          </div>
        </ScrollReveal>

        <div className="ContactOffices-grid">
          {offices.map((office, idx) => (
            <ScrollReveal key={office.id} direction="up" delay={idx * 0.15}>
              <div className="ContactOffices-card">
                {/* Tag */}
                <div className="ContactOffices-tagRow">
                  <span className="ContactOffices-tag">{office.tag}</span>
                  <span className="ContactOffices-coverageChip">
                    {office.coverageTag}
                  </span>
                </div>

                {/* City name */}
                <h3 className="ContactOffices-city">{office.city}</h3>

                {/* Address Block */}
                <div className="ContactOffices-detail">
                  <div className="ContactOffices-detailIcon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <p className="ContactOffices-addressLine">
                      {office.address}
                    </p>
                    <p className="ContactOffices-addressLine">
                      {office.cityLine}
                    </p>
                  </div>
                </div>


                {/* Email */}
                <div className="ContactOffices-detail">
                  <div className="ContactOffices-detailIcon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <a
                    href={`mailto:${office.email}`}
                    className="ContactOffices-email"
                  >
                    {office.email}
                  </a>
                </div>

                {/* Hours */}
                <div className="ContactOffices-detail">
                  <div className="ContactOffices-detailIcon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <span className="ContactOffices-hours">{office.hours}</span>
                </div>

                {/* Online indicator */}
                <div className="ContactOffices-footer">
                  <span className="ContactOffices-onlineDot"></span>
                  <span className="ContactOffices-onlineLabel">
                    Actively Staffing
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactOffices;
