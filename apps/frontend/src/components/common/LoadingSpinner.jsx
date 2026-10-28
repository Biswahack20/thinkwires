import React from 'react';

const LoadingSpinner = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        backgroundColor: 'var(--color-surface, #ffffff)',
        color: 'var(--color-primary, #0037b0)',
      }}
      role="status"
      aria-label="Loading Thinkwires"
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(0, 55, 176, 0.2)',
          borderTopColor: 'var(--color-primary, #0037b0)',
          borderRadius: '50%',
          animation: 'tw-loading-spin 0.8s linear infinite',
        }}
      />
      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
        Loading Thinkwires...
      </span>
      <style>{`
        @keyframes tw-loading-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
