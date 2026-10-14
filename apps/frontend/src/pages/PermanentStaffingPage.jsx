import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPermanentStaffingData,
  fallbackPermanentStaffingData
} from '../store/slices/permanentStaffingSlice';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PermStaffHero from '../components/PermanentStaffingComponents/PermStaffHero';
import PermStaffPillars from '../components/PermanentStaffingComponents/PermStaffPillars';
import PermStaffProcess from '../components/PermanentStaffingComponents/PermStaffProcess';
import PermStaffRoles from '../components/PermanentStaffingComponents/PermStaffRoles';
import PermStaffFaq from '../components/PermanentStaffingComponents/PermStaffFaq';
import PermStaffConsultation from '../components/PermanentStaffingComponents/PermStaffConsultation';

const PermanentStaffingPage = () => {
  const dispatch = useDispatch();
  const { data: rawData, status } = useSelector((state) => state.permanentStaffing || {});

  const data = rawData && Object.keys(rawData).length > 0 ? rawData : fallbackPermanentStaffingData;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Permanent Staffing & Executive Search | ThinkWires';
    if (status === 'idle') {
      dispatch(fetchPermanentStaffingData());
    }
  }, [dispatch, status]);

  return (
    <div className="PermStaffPage-wrapper">
      <Navbar />
      <main className="PermStaffPage-main">
        <PermStaffHero data={data.hero} />
        <PermStaffPillars data={data.pillars} />
        <PermStaffProcess data={data.process} />
        <PermStaffRoles data={data.roles} />
        <PermStaffFaq faqs={data.faqs} />
        <PermStaffConsultation data={data.consultation} />
      </main>
      <Footer />
    </div>
  );
};

export default PermanentStaffingPage;
