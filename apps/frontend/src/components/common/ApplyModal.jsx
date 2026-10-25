import React from 'react';
import QuickApplyModal from './QuickApplyModal';

/**
 * ApplyModal (Backward-Compatible Wrapper)
 *
 * Wraps QuickApplyModal so all existing entry points (Navbar, Openings, CTA)
 * immediately benefit from the streamlined Quick Apply experience.
 */
const ApplyModal = ({ isOpen, onClose, roleTitle, jobData }) => {
  const mergedJob = jobData || (roleTitle ? { title: roleTitle } : {});
  return (
    <QuickApplyModal
      isOpen={isOpen}
      onClose={onClose}
      jobData={mergedJob}
      roleTitle={roleTitle}
    />
  );
};

export default ApplyModal;

