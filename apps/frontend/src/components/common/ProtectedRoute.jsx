import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Route protector that checks authentication state.
 * If user is not authenticated:
 * - Safely encodes current location pathname and search query into redirect parameter
 * - Directs user to /login
 * - Shows sleek branding loader while session is being verified on initial load
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isInitializing } = useSelector((state) => state.auth);

  if (isInitializing) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: '#0037B0',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(0, 55, 176, 0.15)',
            borderTopColor: '#0037B0',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#64748B' }}>
          Verifying secure session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve requested target URL
    const target = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${target}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
