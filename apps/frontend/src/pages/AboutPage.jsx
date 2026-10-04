import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAboutData, fallbackAboutData } from '../store/slices/aboutSlice';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AboutHero from '../components/AboutComponents/AboutHero';
import StatsStrip from '../components/AboutComponents/StatsStrip';
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
    document.title = 'About Us | ThinkWires - Borderless Tech Talent & Workforce Advisory';
    dispatch(fetchAboutData());
  }, [dispatch]);

  return (
    <div className="AboutPage-wrapper">
      <Navbar />
      <main className="AboutPage-main">
        <AboutHero data={aboutData.hero} />
        <StatsStrip stats={aboutData.statsStrip} />
        <AggregatorModel data={aboutData.aggregatorModel} />
        <Philosophy data={aboutData.philosophy} />
        <LeadershipTeam data={aboutData.leadershipTeam} />
        <GrowthTimeline data={aboutData.growthTimeline} />
        <Methodology data={aboutData.methodology} />
        <AboutCTA data={aboutData.ctaSection} />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
