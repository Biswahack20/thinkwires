import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const ComingSoonPage = () => {
  return (
    <div className="ComingSoonPage-wrapper bg-surface min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Coming Soon</h1>
        <p className="text-lg text-on-surface-variant max-w-lg mx-auto">
          We are currently working hard on this page. Please check back later!
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default ComingSoonPage;
