import React from 'react';

const SectionBadge = ({ text, icon }) => {
  return (
    <div className="section-badge">
      <span
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          backgroundColor: 'var(--color-emerald-accent)',
          borderRadius: '50%',
          boxShadow: '0 0 8px var(--color-emerald-accent)',
        }}
      ></span>
      {icon && <span className="section-badge-icon">{icon}</span>}
      {text}
    </div>
  );
};

export default SectionBadge;
