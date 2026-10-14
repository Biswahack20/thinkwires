import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayrollData, fallbackPayrollData } from '../store/slices/payrollSlice';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PayrollHero from '../components/PayrollComponents/PayrollHero';
import PayrollPillars from '../components/PayrollComponents/PayrollPillars';
import PayrollBeneficiaries from '../components/PayrollComponents/PayrollBeneficiaries';
import PayrollFeatures from '../components/PayrollComponents/PayrollFeatures';
import PayrollConsultation from '../components/PayrollComponents/PayrollConsultation';

const PayrollPage = () => {
  const dispatch = useDispatch();
  const { data: rawData, status } = useSelector((state) => state.payroll || {});

  const payrollData = rawData && Object.keys(rawData).length > 0 ? rawData : fallbackPayrollData;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Payroll Outsourcing Services | ThinkWires - 100% Statutory Compliance';
    if (status === 'idle') {
      dispatch(fetchPayrollData());
    }
  }, [dispatch, status]);

  return (
    <div className="PayrollPage-wrapper">
      <Navbar />
      <main className="PayrollPage-main">
        <PayrollHero data={payrollData.hero} />
        <PayrollPillars data={payrollData.pillarsSection} />
        <PayrollBeneficiaries data={payrollData.beneficiariesSection} />
        <PayrollFeatures data={payrollData.featuresSection} />
        <PayrollConsultation data={payrollData.consultationSection} />
      </main>
      <Footer />
    </div>
  );
};

export default PayrollPage;
