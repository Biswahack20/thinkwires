import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import JobPage from './pages/JobPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import IndustriesPage from './pages/IndustriesPage';
import BenchPage from './pages/BenchPage';


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
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
