import React, { Suspense } from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/HomeComponents/Hero';
import TechStack from '../components/HomeComponents/TechStack';
import About from '../components/HomeComponents/About';
import Footer from '../components/common/Footer';

const Capabilities = React.lazy(() => import('../components/HomeComponents/Capabilities'));
const Openings = React.lazy(() => import('../components/HomeComponents/Openings'));
const Process = React.lazy(() => import('../components/HomeComponents/Process'));
const StatsJourney = React.lazy(() => import('../components/HomeComponents/StatsJourney'));
const Industries = React.lazy(() => import('../components/HomeComponents/Industries'));
const Reports = React.lazy(() => import('../components/HomeComponents/Reports'));
const CTA = React.lazy(() => import('../components/common/CTA'));

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <TechStack />
        <About />
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
          <Capabilities />
          <Openings />
          <Process />
          <StatsJourney />
          <Industries />
          <Reports />
          <CTA />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
