import { useContext } from 'react';
import JobApplicationModalContext from './JobApplicationModalContext';

export const useJobApplicationModal = () => {
  const context = useContext(JobApplicationModalContext);
  if (!context) {
    throw new Error('useJobApplicationModal must be used within a JobApplicationModalProvider');
  }
  return context;
};

export default useJobApplicationModal;
