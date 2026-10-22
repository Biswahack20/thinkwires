import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBenchData } from '../store/slices/benchSlice';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import BenchHero from '../components/BenchComponents/BenchHero';
import BenchFilterBar from '../components/BenchComponents/BenchFilterBar';
import BenchCandidateGrid from '../components/BenchComponents/BenchCandidateGrid';
import BenchDossierFeatures from '../components/BenchComponents/BenchDossierFeatures';
import BenchVettingGates from '../components/BenchComponents/BenchVettingGates';
import BenchRequisitionCTA from '../components/BenchComponents/BenchRequisitionCTA';
import BenchDossierDrawer from '../components/BenchComponents/BenchDossierDrawer';

const BenchPage = () => {
  const dispatch = useDispatch();
  const {
    talents,
    activeSpecialty,
    activeUrgency,
    activeExperience,
    activeLocation,
    sortBy,
    searchQuery,
    status,
  } = useSelector((state) => state.bench);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title =
      'Talent Cloud Bench Explorer | ThinkWires - Pre-Vetted Tech Talent & Dossiers';
    if (status === 'idle') {
      dispatch(fetchBenchData());
    }
  }, [dispatch, status]);

  // Client-side filtering & sorting for instant responsiveness
  const filteredTalents = useMemo(() => {
    let result = [...(talents || [])];

    // Search query
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.role.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.skills.some((s) => s.toLowerCase().includes(q)) ||
          t.proofQuote.toLowerCase().includes(q) ||
          (t.location && t.location.toLowerCase().includes(q))
      );
    }

    // Specialty filter
    if (
      activeSpecialty &&
      activeSpecialty !== 'All Engineering' &&
      activeSpecialty !== 'All'
    ) {
      result = result.filter((t) => t.specialty === activeSpecialty);
    }

    // Urgency filter
    if (
      activeUrgency &&
      activeUrgency !== 'All Urgency' &&
      activeUrgency !== 'All'
    ) {
      result = result.filter((t) => t.urgency === activeUrgency);
    }

    // Experience filter
    if (
      activeExperience &&
      activeExperience !== 'All Experience' &&
      activeExperience !== 'All'
    ) {
      result = result.filter((t) => t.experienceLevel === activeExperience);
    }

    // Location filter
    if (
      activeLocation &&
      activeLocation !== 'All Locations' &&
      activeLocation !== 'All'
    ) {
      result = result.filter((t) => t.location === activeLocation);
    }

    // Sorting
    if (sortBy === 'Highest Score') {
      result.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'Fastest Availability') {
      const urgencyOrder = {
        'Immediate (24-48h)': 1,
        'Within 1 Week': 2,
        'Within 2 Weeks': 3,
      };
      result.sort(
        (a, b) =>
          (urgencyOrder[a.urgency] || 99) - (urgencyOrder[b.urgency] || 99)
      );
    } else if (sortBy === 'Lowest Rate') {
      result.sort((a, b) => {
        const rateA = parseInt(a.hourlyRate.replace(/[^0-9]/g, '')) || 0;
        const rateB = parseInt(b.hourlyRate.replace(/[^0-9]/g, '')) || 0;
        return rateA - rateB;
      });
    }

    return result;
  }, [
    talents,
    searchQuery,
    activeSpecialty,
    activeUrgency,
    activeExperience,
    activeLocation,
    sortBy,
  ]);

  return (
    <div className="BenchPage-root">
      <Navbar />

      <main className="BenchPage-main">
        {/* Hero Section */}
        <BenchHero />

        {/* Bench Explorer Console (Filtered List & Grid) */}
        <section className="BenchExplorer-section">
          <div className="BenchExplorer-container">
            <BenchFilterBar totalCount={filteredTalents.length} />
            <BenchCandidateGrid
              talents={filteredTalents}
              totalCount={filteredTalents.length}
            />
          </div>
        </section>

        {/* What's Inside a Technical Dossier */}
        <BenchDossierFeatures />

        {/* 3-Tier Technical Gate Funnel */}
        <BenchVettingGates />

        {/* Custom Pod Requisition CTA */}
        <BenchRequisitionCTA />
      </main>

      <Footer />

      {/* Flyout Slide-over Dossier Drawer */}
      <BenchDossierDrawer />
    </div>
  );
};

export default BenchPage;
