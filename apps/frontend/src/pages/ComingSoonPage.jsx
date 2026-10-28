import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const ComingSoonPage = () => {
  return (
    <div className="ComingSoonPage-wrapper bg-surface min-h-screen flex flex-col">
      <Helmet>
        <title>Coming Soon | Thinkwires</title>
        <meta
          name="description"
          content="Exciting new workforce intelligence and platform features are launching soon on Thinkwires."
        />
        <meta property="og:title" content="Coming Soon | Thinkwires" />
        <meta
          property="og:description"
          content="Exciting new workforce intelligence and platform features are launching soon on Thinkwires."
        />
        <meta property="og:image" content="https://thinkwires.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Coming Soon | Thinkwires" />
        <meta
          name="twitter:description"
          content="Exciting new workforce intelligence and platform features are launching soon on Thinkwires."
        />
        <meta name="twitter:image" content="https://thinkwires.com/og-image.jpg" />
      </Helmet>
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
