import React, { createContext, useState, useCallback } from 'react';

const JobApplicationModalContext = createContext({
  isOpen: false,
  jobData: null,
  openJobApplication: () => {},
  closeJobApplication: () => {},
});

export const JobApplicationModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [jobData, setJobData] = useState(null);

  /**
   * openJobApplication
   * @param {Object|string} job - Can be either a job object { id, title, department, location, employmentType, ... }
   *                              or a string representing the job/role title.
   */
  const openJobApplication = useCallback((job = {}) => {
    if (typeof job === 'string') {
      setJobData({
        jobId: 'general-pool',
        title: job,
        department: 'Engineering',
        location: 'Remote',
        employmentType: 'Full-time / Permanent',
      });
    } else if (job && typeof job === 'object') {
      const jobId = job.id || job._id || job.jobId || 'general-pool';
      const title =
        job.title ||
        job.jobTitle ||
        job.roleTitle ||
        'Featured Technical Position';
      const department = job.department || job.category || 'Engineering';
      const location = job.location || 'Remote';
      const employmentType =
        job.jobMode || job.employmentType || job.type || 'Permanent';
      const postingDate = job.postedDate
        ? new Date(job.postedDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : job.postingDate || 'Active Mandate';

      setJobData({
        jobId: String(jobId),
        title,
        department,
        location,
        employmentType,
        postingDate,
        ...job,
      });
    } else {
      setJobData({
        jobId: 'general-pool',
        title: 'General Engineering Candidate Pool',
        department: 'Engineering',
        location: 'Remote',
        employmentType: 'Full-time',
      });
    }
    setIsOpen(true);
  }, []);

  const closeJobApplication = useCallback(() => {
    setIsOpen(false);
    setJobData(null);
  }, []);

  return (
    <JobApplicationModalContext.Provider
      value={{
        isOpen,
        jobData,
        openJobApplication,
        closeJobApplication,
      }}
    >
      {children}
    </JobApplicationModalContext.Provider>
  );
};

export default JobApplicationModalContext;
