import React from 'react';
import ScrollReveal from '../common/ScrollReveal';

const channelIconMap = {
  mail: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  phone: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  linkedin: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  ),
  clock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  )
};

const ContactChannels = ({ channels = [] }) => {
  return (
    <section className="ContactChannels-section">
      <div className="ContactChannels-container">
        {channels.map((ch, idx) => {
          const inner = (
            <div className="ContactChannels-card">
              <div className="ContactChannels-iconBox">{channelIconMap[ch.icon] || channelIconMap.mail}</div>
              <div className="ContactChannels-body">
                <span className="ContactChannels-title">{ch.title}</span>
                <strong className="ContactChannels-detail">{ch.detail}</strong>
                <span className="ContactChannels-sublabel">{ch.sublabel}</span>
              </div>
              {ch.href && (
                <div className="ContactChannels-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              )}
            </div>
          );

          return (
            <ScrollReveal key={ch.id} direction="up" delay={idx * 0.1}>
              {ch.href ? (
                <a href={ch.href} className="ContactChannels-cardLink" target={ch.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  {inner}
                </a>
              ) : (
                <div className="ContactChannels-cardLink">
                  {inner}
                </div>
              )}
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};

export default ContactChannels;
