import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
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

  const jobData = useMemo(
    () => ({
      jobId: jobId || 'general-pool',
      title: searchParams.get('title') || 'Featured Technical Position',
      department: searchParams.get('department') || 'Engineering',
      location: searchParams.get('location') || 'Remote',
      employmentType: searchParams.get('employmentType') || 'Permanent',
      postingDate: searchParams.get('postingDate') || 'Active Mandate',
    }),
    [jobId, searchParams]
  );

  const handleClose = () => {
    navigate('/jobs');
  };

  return (
    <div className="tw-candidate-shell">
      <Helmet>
        <title>{`Apply for ${jobData.title} | Thinkwires Career Portal`}</title>
        <meta
          name="description"
          content={`Submit your resume and assessment responses for the ${jobData.title} role at Thinkwires.`}
        />
        <meta property="og:title" content={`Apply for ${jobData.title} | Thinkwires`} />
        <meta
          property="og:description"
          content={`Submit your resume and assessment responses for the ${jobData.title} role at Thinkwires.`}
        />
        <meta property="og:image" content="https://thinkwires.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Apply for ${jobData.title} | Thinkwires`} />
        <meta
          name="twitter:description"
          content={`Submit your resume and assessment responses for the ${jobData.title} role at Thinkwires.`}
        />
        <meta name="twitter:image" content="https://thinkwires.com/og-image.jpg" />
      </Helmet>
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
