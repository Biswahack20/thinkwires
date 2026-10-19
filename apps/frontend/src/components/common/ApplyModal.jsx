import React from 'react';
import GlobalJobApplicationForm from './GlobalJobApplicationForm';

/**
 * ApplyModal (Backward-Compatible Wrapper)
 *
 * Wraps GlobalJobApplicationForm to maintain complete backwards compatibility
 * with existing legacy props (`isOpen`, `onClose`, `roleTitle`).
 */
const ApplyModal = ({ isOpen, onClose, roleTitle, jobData }) => {
  const mergedJob = jobData || (roleTitle ? { title: roleTitle } : {});
  return (
    <GlobalJobApplicationForm
      isOpen={isOpen}
      onClose={onClose}
      jobData={mergedJob}
    />
  );
};

export default ApplyModal;
