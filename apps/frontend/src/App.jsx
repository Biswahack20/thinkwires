import React, { Suspense, lazy } from 'react';
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
import LegalPage from './pages/LegalPage';
import ScrollAnimationManager from './components/common/ScrollAnimationManager';

// ThinkWires Admin Dashboard & CMS Modules (Code-split with React.lazy)
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const EmployeesView = lazy(() => import('./admin/EmployeesView'));
const CandidatesView = lazy(() => import('./admin/CandidatesView'));
const ClientsView = lazy(() => import('./admin/ClientsView'));
const JobsView = lazy(() => import('./admin/JobsView'));
const PlacementsView = lazy(() => import('./admin/PlacementsView'));
const CmsDashboard = lazy(() => import('./admin/CmsDashboard'));
const PagesManager = lazy(() => import('./admin/PagesManager'));
const BlogManager = lazy(() => import('./admin/BlogManager'));
const MediaLibrary = lazy(() => import('./admin/MediaLibrary'));
const SeoManager = lazy(() => import('./admin/SeoManager'));
const AnnouncementsManager = lazy(() => import('./admin/AnnouncementsManager'));

function App() {
  return (
    <BrowserRouter>
      <ScrollAnimationManager />
      <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#008F68', fontWeight: 600 }}>Loading ThinkWires...</div>}>
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
        <Route path="/services" element={<StaffAugmentationPage />} />
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
        {/* Legal & Compliance Routes */}
        <Route path="/privacy" element={<LegalPage />} />
        <Route path="/privacy-policy" element={<LegalPage />} />
        <Route path="/terms" element={<LegalPage />} />
        <Route path="/terms-of-service" element={<LegalPage />} />
        <Route path="/security" element={<LegalPage />} />
        <Route path="/compliance" element={<LegalPage />} />
        <Route path="/cookies" element={<LegalPage />} />
        {/* ThinkWires Admin Dashboard & CMS */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="employees" element={<EmployeesView />} />
          <Route path="candidates" element={<CandidatesView />} />
          <Route path="clients" element={<ClientsView />} />
          <Route path="jobs" element={<JobsView />} />
          <Route path="placements" element={<PlacementsView />} />
          <Route path="cms" element={<CmsDashboard />} />
          <Route path="cms/pages" element={<PagesManager />} />
          <Route path="cms/blog" element={<BlogManager />} />
          <Route path="cms/media" element={<MediaLibrary />} />
          <Route path="cms/seo" element={<SeoManager />} />
          <Route path="cms/announcements" element={<AnnouncementsManager />} />
        </Route>

        <Route path="*" element={<HomePage />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
