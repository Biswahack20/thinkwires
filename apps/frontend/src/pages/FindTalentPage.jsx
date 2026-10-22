import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFindTalentData,
  fallbackFindTalentData,
} from '../store/slices/findTalentSlice';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FindTalentHero from '../components/FindTalentComponents/FindTalentHero';
import FindTalentIntakeForm from '../components/FindTalentComponents/FindTalentIntakeForm';
import FindTalentBench from '../components/FindTalentComponents/FindTalentBench';
import FindTalentComparison from '../components/FindTalentComponents/FindTalentComparison';
import FindTalentProof from '../components/FindTalentComponents/FindTalentProof';

const FindTalentPage = () => {
  const dispatch = useDispatch();
  const { data: rawData, status } = useSelector(
    (state) => state.findTalent || {}
  );

  const data =
    rawData && Object.keys(rawData).length > 0
      ? rawData
      : fallbackFindTalentData;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Find Talent & Hire Pre-Vetted Engineers | ThinkWires';
    if (status === 'idle') {
      dispatch(fetchFindTalentData());
    }
  }, [dispatch, status]);

  return (
    <div className="FindTalentPage-wrapper">
      <Navbar />
      <main className="FindTalentPage-main">
        <FindTalentHero data={data.hero} />
        <FindTalentIntakeForm data={data.intakeForm} />
        <FindTalentBench talents={data.activeBench} />
        <FindTalentComparison matrix={data.comparisonMatrix} />
        <FindTalentProof
          metrics={data.verifiedMetrics}
          testimonial={data.testimonial}
          hotline={data.hotline}
        />
      </main>
      <Footer />
    </div>
  );
};

export default FindTalentPage;
