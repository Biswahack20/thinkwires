import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStaffAugmentationData,
  fallbackStaffAugmentationData
} from '../store/slices/staffAugmentationSlice';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import StaffAugHero from '../components/StaffAugmentationComponents/StaffAugHero';
import StaffAugSolutions from '../components/StaffAugmentationComponents/StaffAugSolutions';
import StaffAugBenefits from '../components/StaffAugmentationComponents/StaffAugBenefits';
import StaffAugBench from '../components/StaffAugmentationComponents/StaffAugBench';
import StaffAugComparison from '../components/StaffAugmentationComponents/StaffAugComparison';
import StaffAugFaq from '../components/StaffAugmentationComponents/StaffAugFaq';
import StaffAugConsultation from '../components/StaffAugmentationComponents/StaffAugConsultation';

const StaffAugmentationPage = () => {
  const dispatch = useDispatch();
  const { data: rawData, status } = useSelector((state) => state.staffAugmentation || {});

  const data = rawData && Object.keys(rawData).length > 0 ? rawData : fallbackStaffAugmentationData;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Staff Augmentation & Dedicated Engineering Pods | ThinkWires';
    if (status === 'idle') {
      dispatch(fetchStaffAugmentationData());
    }
  }, [dispatch, status]);

  return (
    <div className="StaffAugPage-wrapper">
      <Navbar />
      <main className="StaffAugPage-main">
        <StaffAugHero data={data.hero} valueProps={data.valueProps} />
        <StaffAugSolutions data={data.solutions} />
        <StaffAugBenefits data={data.benefits} />
        <StaffAugBench data={data.bench} />
        <StaffAugComparison data={data.comparison} />
        <StaffAugFaq faqs={data.faqs} />
        <StaffAugConsultation data={data.consultation} />
      </main>
      <Footer />
    </div>
  );
};

export default StaffAugmentationPage;
