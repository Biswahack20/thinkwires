import React, { useState } from 'react';
import JobCard from './JobCard';

const MOCK_FEATURED_JOBS = [
  {
    id: 'job-1',
    company: 'Enterprise Cloud Systems',
    title: 'Lead SAP S/4HANA Enterprise Architect',
    location: 'New York, NY (Hybrid)',
    type: 'Full-Time',
    workMode: 'Hybrid',
    experience: 'Senior',
    experienceText: '8+ Yrs Exp',
    salary: '$165,000 - $195,000 / yr',
    department: 'SAP & Enterprise',
    tag: 'Greenfield',
    tagColor: 'blue',
    skills: ['SAP S/4HANA', 'ABAP Cloud', 'Fiori', 'Enterprise Integration'],
    description: 'Lead multi-region SAP S/4HANA transformations for Fortune 500 BFSI & manufacturing enterprise clients. Architecture, migration strategy, and pod leadership.',
    postedTime: 'Updated Today'
  },
  {
    id: 'job-2',
    company: 'FinTech Velocity Pod',
    title: 'Senior Full Stack React & Node.js Engineer',
    location: 'Remote (US/Canada)',
    type: 'Full-Time',
    workMode: 'Remote',
    experience: 'Senior',
    experienceText: '5+ Yrs Exp',
    salary: '$140,000 - $170,000 / yr',
    department: 'Full Stack & Frontend',
    tag: '100% Remote',
    tagColor: 'green',
    skills: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL'],
    description: 'Design and build high-frequency financial trading analytics dashboards and low-latency microservices with modern TypeScript and React.',
    postedTime: '2 hours ago'
  },
  {
    id: 'job-3',
    company: 'CloudSphere Mobility',
    title: 'Principal DevOps & Kubernetes Architect',
    location: 'Toronto, ON / Remote',
    type: 'Contract / C2C',
    workMode: 'Remote',
    experience: 'Lead',
    experienceText: '7+ Yrs Exp',
    salary: '$95 - $125 / hr',
    department: 'Cloud & DevOps',
    tag: 'High Rate C2C',
    tagColor: 'purple',
    skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD Pipelines', 'Istio'],
    description: 'Oversee zero-downtime multi-cloud container orchestration, Infrastructure-as-Code automation, and security hardening for global SaaS platform.',
    postedTime: '1 day ago'
  },
  {
    id: 'job-4',
    company: 'HealthTech AI Platform',
    title: 'Senior AI / LLM Infrastructure Engineer',
    location: 'San Francisco, CA / Remote',
    type: 'Full-Time',
    workMode: 'Remote',
    experience: 'Senior',
    experienceText: '4+ Yrs Exp',
    salary: '$175,000 - $210,000 + Equity',
    department: 'AI & Data Engineering',
    tag: 'Direct Client',
    tagColor: 'amber',
    skills: ['Python', 'PyTorch', 'LangChain', 'Vector DBs', 'Distributed Systems'],
    description: 'Deploy fine-tuned domain-specific LLM models into HIPAA-compliant clinical workflows. Build scalable inference engines and retrieval pipelines.',
    postedTime: 'Just now'
  },
  {
    id: 'job-5',
    company: 'CyberGuard Systems',
    title: 'Principal Cloud Security & Compliance Specialist',
    location: 'Bengaluru, India (Hybrid)',
    type: 'Full-Time',
    workMode: 'Hybrid',
    experience: 'Senior',
    experienceText: '6+ Yrs Exp',
    salary: '₹32,000,000 - ₹45,000,000 / yr',
    department: 'Cyber Security',
    tag: 'Urgent Hire',
    tagColor: 'red',
    skills: ['SOC 2', 'ISO 27001', 'Cloud Security', 'Penetration Testing', 'IAM'],
    description: 'Audit and fortify multi-region cloud infrastructures across AWS & Azure. Formulate threat detection guardrails and incident response protocols.',
    postedTime: '1 day ago'
  },
  {
    id: 'job-6',
    company: 'OmniChain Logistics',
    title: 'Senior AEM & Java Experience Platform Dev',
    location: 'Chicago, IL / Remote',
    type: 'Full-Time',
    workMode: 'Remote',
    experience: 'Mid',
    experienceText: '5+ Yrs Exp',
    salary: '$135,000 - $160,000 / yr',
    department: 'Full Stack & Frontend',
    tag: 'Global Scale',
    tagColor: 'blue',
    skills: ['Adobe Experience Manager (AEM)', 'Java Spring', 'OSGi', 'HTL'],
    description: 'Architect scalable digital customer touchpoints on AEM as a Cloud Service for global supply chain and e-commerce enterprise portals.',
    postedTime: '3 days ago'
  }
];

const FeaturedPositions = ({ jobsList, onApplyClick, activeCategory, setActiveCategory }) => {
  const [visibleCount, setVisibleCount] = useState(6);

  const jobsToDisplay = jobsList && jobsList.length > 0 ? jobsList : MOCK_FEATURED_JOBS;

  const categories = [
    'All Roles',
    'Full Stack & Frontend',
    'SAP & Enterprise',
    'Cloud & DevOps',
    'AI & Data Engineering',
    'Cyber Security'
  ];

  // Filter jobs based on active category
  const filteredJobs = jobsToDisplay.filter((job) => {
    if (!activeCategory || activeCategory === 'All Roles') return true;
    return job.department === activeCategory || job.tag === activeCategory;
  });

  const displayedJobs = filteredJobs.slice(0, visibleCount);

  return (
    <section className="FeaturedPositions-section" id="featured-positions">
      <div className="FeaturedPositions-container">
        {/* Figma Design Section Header */}
        <div className="FeaturedPositions-figmaHeader">
          <div className="FeaturedPositions-headerTitleCol">
            <div className="FeaturedPositions-curatedBadge">
              ✨ CURATED HIGH-IMPACT ROLES
            </div>
            <h2 className="FeaturedPositions-mainHeading">Featured Positions</h2>
          </div>

          <div className="FeaturedPositions-headerSubCol">
            <p className="FeaturedPositions-headerDesc">
              Verified openings from global Tier-1 software organizations and enterprise consultancies with guaranteed prompt response.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="FeaturedPositions-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`FeaturedPositions-categoryPill ${
                (activeCategory === cat || (!activeCategory && cat === 'All Roles'))
                  ? 'FeaturedPositions-activePill'
                  : ''
              }`}
              onClick={() => setActiveCategory && setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Jobs Grid */}
        {displayedJobs.length > 0 ? (
          <div className="FeaturedPositions-grid">
            {displayedJobs.map((job) => (
              <JobCard key={job.id} job={job} onApplyClick={onApplyClick} />
            ))}
          </div>
        ) : (
          <div className="FeaturedPositions-emptyState">
            <div className="FeaturedPositions-emptyIcon">🔍</div>
            <h3>No positions found matching this criteria</h3>
            <p>Try resetting your filter or searching with different keywords.</p>
            <button 
              className="FeaturedPositions-resetBtn"
              onClick={() => setActiveCategory && setActiveCategory('All Roles')}
            >
              Show All Roles
            </button>
          </div>
        )}

        {/* Load More Button */}
        {filteredJobs.length > visibleCount && (
          <div className="FeaturedPositions-loadMoreWrapper">
            <button
              className="FeaturedPositions-loadMoreBtn"
              onClick={() => setVisibleCount((prev) => prev + 6)}
            >
              View More Openings ({filteredJobs.length - visibleCount} Remaining)
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPositions;
