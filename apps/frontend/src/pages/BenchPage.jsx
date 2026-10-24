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
    activeNoticePeriod,
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
          (t.role && t.role.toLowerCase().includes(q)) ||
          (t.code && t.code.toLowerCase().includes(q)) ||
          (t.skills && t.skills.some((s) => s.toLowerCase().includes(q))) ||
          (t.proofQuote && t.proofQuote.toLowerCase().includes(q)) ||
          (t.location && t.location.toLowerCase().includes(q)) ||
          (t.noticePeriod && t.noticePeriod.toLowerCase().includes(q))
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

    // Notice Period filter
    if (
      activeNoticePeriod &&
      activeNoticePeriod !== 'All Notice Periods' &&
      activeNoticePeriod !== 'All Notice' &&
      activeNoticePeriod !== 'All'
    ) {
      const filterTarget = activeNoticePeriod.toString().toLowerCase().trim();
      result = result.filter((t) => {
        // Read raw notice period from candidate data
        const raw = t.noticePeriod !== undefined && t.noticePeriod !== null
          ? t.noticePeriod
          : t.urgency;

        if (raw === undefined || raw === null) return false;

        // If filtering by 30 days
        if (
          filterTarget === '30 days' ||
          filterTarget === '30' ||
          filterTarget === '30-day' ||
          filterTarget === '30 day' ||
          filterTarget === 'within 30 days' ||
          filterTarget === '30-day notice'
        ) {
          // Exact numerical representation 30
          if (typeof raw === 'number') {
            return raw === 30;
          }
          const str = raw.toString().toLowerCase().trim();
          // Avoid matching 60 days or 90 days or 300 days
          if (str.includes('60') || str.includes('90') || str.includes('15')) {
            return false;
          }
          return str === '30' || str === '30 days' || str === '30-day' || str === '30 days notice' || str.includes('30');
        }

        // Generic matching for other options like 'Immediate', '60 Days', etc.
        const str = raw.toString().toLowerCase().trim();
        return str === filterTarget || str.includes(filterTarget);
      });
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

    // Helper to extract actual AI assessment score from backend data
    const getAiScore = (candidate) => {
      if (typeof candidate.assessmentScore === 'number' && !isNaN(candidate.assessmentScore)) {
        return candidate.assessmentScore;
      }
      if (candidate.rubric && typeof candidate.rubric.systemDesign === 'number') {
        return candidate.rubric.systemDesign;
      }
      if (candidate.dossier?.rubric?.systemDesign) {
        const parsed = parseInt(candidate.dossier.rubric.systemDesign, 10);
        if (!isNaN(parsed)) return parsed;
      }
      return null;
    };

    // Sorting (AI Assessment as primary default)
    if (sortBy === 'AI Assessment') {
      result.sort((a, b) => {
        const scoreA = getAiScore(a);
        const scoreB = getAiScore(b);

        const hasScoreA = scoreA !== null;
        const hasScoreB = scoreB !== null;

        // Candidates without valid scores appear after scored candidates
        if (hasScoreA && !hasScoreB) return -1;
        if (!hasScoreA && hasScoreB) return 1;
        if (!hasScoreA && !hasScoreB) return (b.score || 0) - (a.score || 0);

        // Descending sorting: highest score -> lowest score
        return scoreB - scoreA;
      });
    } else if (sortBy === 'Highest Score') {
      result.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'Fastest Availability') {
      const urgencyOrder = {
        'Immediate (24-48h)': 1,
        'Immediate': 1,
        'Within 1 Week': 2,
        'Within 2 Weeks': 3,
        '30 Days': 4,
        '60 Days': 5,
        '90 Days': 6,
      };
      result.sort(
        (a, b) =>
          (urgencyOrder[a.noticePeriod || a.urgency] || 99) -
          (urgencyOrder[b.noticePeriod || b.urgency] || 99)
      );
    } else if (sortBy === 'Lowest Rate') {
      result.sort((a, b) => {
        const rateA = parseInt((a.hourlyRate || '').replace(/[^0-9]/g, '')) || 0;
        const rateB = parseInt((b.hourlyRate || '').replace(/[^0-9]/g, '')) || 0;
        return rateA - rateB;
      });
    }

    return result;
  }, [
    talents,
    searchQuery,
    activeSpecialty,
    activeUrgency,
    activeNoticePeriod,
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
