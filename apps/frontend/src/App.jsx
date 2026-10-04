import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import JobPage from './pages/JobPage';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route rendering based on path
  if (currentPath === '/') {
    return <HomePage />;
  }

  return <JobPage />;
}

export default App;
