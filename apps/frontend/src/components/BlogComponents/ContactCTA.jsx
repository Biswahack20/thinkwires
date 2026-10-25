import React from 'react';
import { MailIcon } from '../../admin/AdminIcons';

const ContactCTA = () => {
  return (
    <section className="ContactCTA-figmaSection blog-container">
      <div className="ContactCTA-figmaCard">
        <div className="ContactCTA-figmaLeft">
          <div className="ContactCTA-figmaIcon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
              <line x1="9" y1="6" x2="9" y2="6.01" />
              <line x1="15" y1="6" x2="15" y2="6.01" />
              <line x1="9" y1="10" x2="9" y2="10.01" />
              <line x1="15" y1="10" x2="15" y2="10.01" />
              <line x1="9" y1="14" x2="9" y2="14.01" />
              <line x1="15" y1="14" x2="15" y2="14.01" />
              <line x1="9" y1="18" x2="15" y2="18" />
            </svg>
          </div>
          <div>
            <h4 className="ContactCTA-figmaTitle">
              Have an industry trend to report?
            </h4>
            <p className="ContactCTA-figmaSubtext">
              Connect directly with our Sector Research Team at Plot: 20, Block
              H-1/A, Sector 63, Noida.
            </p>
          </div>
        </div>

        <div className="ContactCTA-figmaRight">
          <a
            href="mailto:info@thinkwires.com"
            className="ContactCTA-figmaPitchBtn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <MailIcon size={14} color="currentColor" />
            <span>Pitch a Case Study</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
