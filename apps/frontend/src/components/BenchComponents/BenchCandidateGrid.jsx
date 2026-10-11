import React from 'react';
import BenchCandidateCard from './BenchCandidateCard';

const BenchCandidateGrid = ({ talents, totalCount }) => {
  if (!talents || talents.length === 0) {
    return (
      <div className="BenchGrid-emptyState">
        <span className="material-symbols-outlined BenchGrid-emptyIcon">person_search</span>
        <h3 className="BenchGrid-emptyTitle">No Talents Match Your Selected Filters</h3>
        <p className="BenchGrid-emptyDesc">
          Try expanding your specialty pills, urgency criteria, or search keywords. You can also request a custom pod requisition.
        </p>
      </div>
    );
  }

  return (
    <div className="BenchGrid-wrapper">
      <div className="BenchGrid-grid">
        {talents.map((talent) => (
          <BenchCandidateCard key={talent.id || talent.code} talent={talent} />
        ))}
      </div>
    </div>
  );
};

export default BenchCandidateGrid;
