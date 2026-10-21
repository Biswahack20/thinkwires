import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAboutData, fallbackAboutData } from '../store/slices/aboutSlice';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AboutHero from '../components/AboutComponents/AboutHero';
import AggregatorModel from '../components/AboutComponents/AggregatorModel';
import Philosophy from '../components/AboutComponents/Philosophy';
import LeadershipTeam from '../components/AboutComponents/LeadershipTeam';
import GrowthTimeline from '../components/AboutComponents/GrowthTimeline';
import Methodology from '../components/AboutComponents/Methodology';
import AboutCTA from '../components/AboutComponents/AboutCTA';

const AboutPage = () => {
  const dispatch = useDispatch();
  const { data: rawData, status } = useSelector((state) => state.about || {});

  // Fallback to fallbackAboutData if redux state is empty or still initializing
  const aboutData = rawData && Object.keys(rawData).length > 0 ? rawData : fallbackAboutData;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'About Us | ThinkWires — Borderless Tech Talent & Workforce Advisory';
    if (status === 'idle') {
      dispatch(fetchAboutData());
    }
  }, [dispatch, status]);

  return (
    <div className="AboutPage-wrapper">
      <Navbar />
      <main className="AboutPage-main" id="main-content">
        {/* 1. Hero Section with Integrated Key Value Metrics Bar (Stitch Screen 4f907a13785d4a6b9bd9c0cdfa784466) */}
        <AboutHero
          data={aboutData.hero || aboutData.company}
          stats={aboutData.statsStrip || aboutData.stats}
        />

        {/* 2. The ThinkWires Aggregator Model */}
        <AggregatorModel data={aboutData.aggregatorModel} />

        {/* 3. Our Core Philosophy (Deep Navy Editorial) */}
        <Philosophy data={aboutData.philosophy} />

        {/* 4. Executive Leadership Team (3+2 Arrangement) */}
        <LeadershipTeam data={aboutData.leadershipTeam || { members: aboutData.leadership }} />

        {/* 5. Chronicle of Execution / Our Growth Evolution (4 Milestone Cards) */}
        <GrowthTimeline data={aboutData.growthTimeline} />

        {/* 6. Methodology (Spec to Squad) */}
        <Methodology data={aboutData.methodology} />

        {/* 7. Strategy Consultation & Direct Operations Container */}
        <AboutCTA data={aboutData.ctaSection || aboutData.contact} />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
