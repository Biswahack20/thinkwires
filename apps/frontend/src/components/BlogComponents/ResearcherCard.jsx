import React from 'react';

const ResearcherCard = ({ researcher }) => {
  if (!researcher) return null;

  return (
    <div className="ResearcherCard-figmaCard">
      <img
        src={researcher.avatar}
        alt={researcher.name}
        className="ResearcherCard-figmaAvatar"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
        }}
      />
      <div className="ResearcherCard-figmaMeta">
        <h4 className="ResearcherCard-figmaName">{researcher.name}</h4>
        <div className="ResearcherCard-figmaRole">{researcher.role}</div>
        <p className="ResearcherCard-figmaOrg">{researcher.organization}</p>
      </div>
    </div>
  );
};

export default ResearcherCard;
