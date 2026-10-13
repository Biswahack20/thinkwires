import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAboutData, fallbackAboutData } from '../store/slices/aboutSlice';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AboutHero from '../components/AboutComponents/AboutHero';
import StatsStrip from '../components/AboutComponents/StatsStrip';
import CompanyOverview from '../components/AboutComponents/CompanyOverview';
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
        {/* 1. Hero Section */}
        <AboutHero data={aboutData.hero || aboutData.company} />

        {/* 2. Horizontal Key Metrics Strip */}
        <StatsStrip stats={aboutData.statsStrip || aboutData.stats} />

        {/* 3. Company Overview & Core Mission */}
        <CompanyOverview company={aboutData.company} />

        {/* 4. The ThinkWires Aggregator Model */}
        <AggregatorModel data={aboutData.aggregatorModel} />

        {/* 5. Our Core Philosophy (Deep Navy Editorial) */}
        <Philosophy data={aboutData.philosophy} />

        {/* 6. Executive Leadership Team (3+2 Arrangement) */}
        <LeadershipTeam data={aboutData.leadershipTeam || { members: aboutData.leadership }} />

        {/* 7. Our Growth Journey & Separated Future Roadmap */}
        <GrowthTimeline data={aboutData.growthTimeline} />

        {/* 8. Methodology (Spec to Squad) */}
        <Methodology data={aboutData.methodology} />

        {/* 9. Strategy Consultation & Direct Operations */}
        <AboutCTA data={aboutData.ctaSection || aboutData.contact} />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
