import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/common/Navbar';
// import Hero from '../components/HomeComponents/Hero';
import NewHero from '../components/HomeComponents/NewHero';
import TechStack from '../components/HomeComponents/TechStack';
import About from '../components/HomeComponents/About';
import MissionVisionExperience from '../components/HomeComponents/MissionVisionExperience';
import Footer from '../components/common/Footer';

const Capabilities = React.lazy(
  () => import('../components/HomeComponents/Capabilities')
);
const Openings = React.lazy(
  () => import('../components/HomeComponents/Openings')
);
const Process = React.lazy(
  () => import('../components/HomeComponents/Process')
);
const StatsJourney = React.lazy(
  () => import('../components/HomeComponents/StatsJourney')
);
const Industries = React.lazy(
  () => import('../components/HomeComponents/Industries')
);
const Reports = React.lazy(
  () => import('../components/HomeComponents/Reports')
);
const CTA = React.lazy(() => import('../components/common/CTA'));

const HomePage = () => {
  return (
    <div>
      <Helmet>
        <title>Thinkwires | Global Talent Cloud & Workforce Solutions</title>
        <meta
          name="description"
          content="Thinkwires connects high-growth engineering teams with pre-vetted global tech talent, offering staff augmentation, permanent staffing, payroll, and EOR solutions."
        />
        <meta
          property="og:title"
          content="Thinkwires | Global Talent Cloud & Workforce Solutions"
        />
        <meta
          property="og:description"
          content="Next-generation AI-powered talent cloud and global workforce solutions platform connecting enterprise engineering teams with top tier global talent."
        />
        <meta property="og:image" content="https://thinkwires.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Thinkwires | Global Talent Cloud & Workforce Solutions"
        />
        <meta
          name="twitter:description"
          content="Next-generation AI-powered talent cloud and global workforce solutions platform connecting enterprise engineering teams with top tier global talent."
        />
        <meta name="twitter:image" content="https://thinkwires.com/og-image.jpg" />
      </Helmet>
      <Navbar />
      <main>
        {/* <Hero /> */}
        <NewHero />
        <TechStack />
        <About />
        <MissionVisionExperience />
        <Suspense
          fallback={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              Loading...
            </div>
          }
        >
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
