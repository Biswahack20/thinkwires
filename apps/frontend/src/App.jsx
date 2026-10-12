import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import JobPage from './pages/JobPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import IndustriesPage from './pages/IndustriesPage';
import BenchPage from './pages/BenchPage';
import PayrollPage from './pages/PayrollPage';
import EorPage from './pages/EorPage';
import StaffAugmentationPage from './pages/StaffAugmentationPage';
import PermanentStaffingPage from './pages/PermanentStaffingPage';
import FindTalentPage from './pages/FindTalentPage';
import CandidatePortalPage from './pages/CandidatePortalPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/industries" element={<IndustriesPage />} />
        <Route path="/talent-cloud" element={<BenchPage />} />
        <Route path="/bench" element={<BenchPage />} />
        <Route path="/jobs" element={<JobPage />} />
        <Route path="/hot-jobs" element={<JobPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* Find Talent & Candidate Portal */}
        <Route path="/find-talent" element={<FindTalentPage />} />
        <Route path="/hire-talent" element={<FindTalentPage />} />
        <Route path="/candidate-portal" element={<CandidatePortalPage />} />
        <Route path="/portal" element={<CandidatePortalPage />} />
        <Route path="/candidate" element={<CandidatePortalPage />} />
        {/* Services Routes */}
        <Route path="/services/staff-augmentation" element={<StaffAugmentationPage />} />
        <Route path="/staff-augmentation" element={<StaffAugmentationPage />} />
        <Route path="/services/permanent-staffing" element={<PermanentStaffingPage />} />
        <Route path="/permanent-staffing" element={<PermanentStaffingPage />} />
        <Route path="/services/permanent-staffing-and-executive-search" element={<PermanentStaffingPage />} />
        <Route path="/permanent-staffing-and-executive-search" element={<PermanentStaffingPage />} />
        <Route path="/services/executive-search" element={<PermanentStaffingPage />} />
        <Route path="/executive-search" element={<PermanentStaffingPage />} />
        <Route path="/services/payroll" element={<PayrollPage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/payroll-outsourcing" element={<PayrollPage />} />
        <Route path="/services/eor" element={<EorPage />} />
        <Route path="/eor" element={<EorPage />} />
        <Route path="/employer-of-record" element={<EorPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
