import React, { useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import GlobalJobApplicationForm from '../../components/common/GlobalJobApplicationForm';
import '../auth/auth.css';

/**
 * JobApplyPage
 * Dedicated route /jobs/:jobId/apply rendering the standard GlobalJobApplicationForm
 * with route parameters pre-populated.
 */
const JobApplyPage = () => {
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const jobData = useMemo(() => ({
    jobId: jobId || 'general-pool',
    title: searchParams.get('title') || 'Featured Technical Position',
    department: searchParams.get('department') || 'Engineering',
    location: searchParams.get('location') || 'Remote',
    employmentType: searchParams.get('employmentType') || 'Permanent',
    postingDate: searchParams.get('postingDate') || 'Active Mandate',
  }), [jobId, searchParams]);

  const handleClose = () => {
    navigate('/jobs');
  };

  return (
    <div className="tw-candidate-shell">
      <Navbar />
      <GlobalJobApplicationForm
        isOpen={true}
        onClose={handleClose}
        jobData={jobData}
      />
      <Footer />
    </div>
  );
};

export default JobApplyPage;
