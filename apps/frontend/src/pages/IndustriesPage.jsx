import React, { useEffect } from 'react';
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
