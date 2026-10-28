import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { fetchIndustriesPageData } from '../store/slices/industriesSlice';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Hero from '../components/IndustriesComponents/Hero';
import SectorCatalog from '../components/IndustriesComponents/SectorCatalog';
import FeatureComparison from '../components/IndustriesComponents/FeatureComparison';
import CaseStudies from '../components/IndustriesComponents/CaseStudies';
import CapabilityBriefing from '../components/IndustriesComponents/CapabilityBriefing';

const IndustriesPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIndustriesPageData());
  }, [dispatch]);

  return (
    <div className="IndustriesPage-page">
      <Helmet>
        <title>Industries We Serve | Thinkwires — Specialized Talent Solutions</title>
        <meta
          name="description"
          content="Tailored workforce solutions and elite tech talent specialized for SaaS, FinTech, HealthTech, AI/ML, E-Commerce, and Enterprise Infrastructure."
        />
        <meta
          property="og:title"
          content="Industries & Sectors | Thinkwires"
        />
        <meta
          property="og:description"
          content="Tailored workforce solutions and elite tech talent specialized for SaaS, FinTech, HealthTech, AI/ML, E-Commerce, and Enterprise Infrastructure."
        />
        <meta property="og:image" content="https://thinkwires.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Industries & Sectors | Thinkwires"
        />
        <meta
          name="twitter:description"
          content="Tailored workforce solutions and elite tech talent specialized for SaaS, FinTech, HealthTech, AI/ML, and Cloud."
        />
        <meta name="twitter:image" content="https://thinkwires.com/og-image.jpg" />
      </Helmet>
      <Navbar />
      <main className="IndustriesPage-main">
        <Hero />
        <SectorCatalog />
        <FeatureComparison />
        <CaseStudies />
        <CapabilityBriefing />
      </main>
      <Footer />
    </div>
  );
};

export default IndustriesPage;
