import React from 'react';
import ResearcherCard from './ResearcherCard';

const ResearchCollective = ({ researchers = [] }) => {
  const defaultResearchers = [
    {
      id: 'res-1',
      name: 'Karthik Ram',
      role: 'Head of AI Advisory & Operations',
      organization: 'Ex-Tier 1 Tech Architect, 14+ yrs in global talent pipelines',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 'res-2',
      name: 'Ananya Roy',
      role: 'Director of GCC Market Intelligence',
      organization: 'Specializing in cross-border tech wage indexes & EOR',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 'res-3',
      name: 'Vikramjit Singh',
      role: 'VP of Enterprise Solutions',
      organization: 'Advising North American and European Fortune 500 GCCs',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
  ];

  const list = researchers.length > 0 ? researchers : defaultResearchers;

  return (
    <section className="ResearchCollective-figmaSection blog-container">
      <div className="ResearchCollective-figmaHeader">
        <div className="ResearchCollective-figmaLeft">
          <span className="ResearchCollective-figmaSubLabel">OUR RESEARCH COLLECTIVE</span>
          <h2 className="ResearchCollective-figmaTitle">
            Industry Analysts &amp; Engineering Directors
          </h2>
        </div>
        <p className="ResearchCollective-figmaDescription">
          Practitioners who have built and scaled GCCs, deployed ML platforms, and led technical staffing across 740+ global enterprises.
        </p>
      </div>

      <div className="ResearchCollective-figmaGrid">
        {list.map((researcher) => (
          <ResearcherCard key={researcher.id} researcher={researcher} />
        ))}
      </div>
    </section>
  );
};

export default ResearchCollective;
