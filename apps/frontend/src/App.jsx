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
