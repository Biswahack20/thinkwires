import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBenefits } from '../../store/slices/homeSlice';

const DEFAULT_BENEFITS = [
  {
    title: 'Comprehensive Health & Wellness',
    description: 'Premium family healthcare coverage, periodic wellness retreats, and regular mental health support workshops that value sustainable success over burnout.',
    icon: 'shield'
  },
  {
    title: 'Global Client Footprint',
    description: 'Collaborate directly with engineering counterparts in Silicon Valley, Toronto, New York, and European tech corridors without relocation friction.',
    icon: 'globe'
  },
  {
    title: 'Continuous Tech Upskilling',
    description: 'Sponsorship for Tier-1 cloud certifications (AWS, Azure, GCP), GenAI hackathons, and enterprise solution architecture workshops.',
    icon: 'graduation'
  },
  {
    title: 'Work-Life Agility',
    description: 'Choose from completely remote, hybrid, or on-site modes. Flexible overlap schedules tailored to your individual family needs.',
    icon: 'laptop'
  },
  {
    title: 'Transparent Career Pathing',
    description: 'Bi-annual performance evaluations, direct promotions to Staff/Principal engineering cohorts, and clear payroll progression charts.',
    icon: 'trending'
  },
  {
    title: 'Impact & Social Purpose',
    description: 'Join our CSR initiatives: village children educational support, healthcare drives, and tree planting programs that empower local communities.',
    icon: 'heart'
  }
];

const renderIcon = (iconName) => {
  if (iconName === 'shield') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    );
  }
  if (iconName === 'globe') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
      </svg>
    );
  }
  if (iconName === 'graduation') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
      </svg>
    );
  }
  if (iconName === 'laptop') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    );
  }
  if (iconName === 'trending') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    </svg>
  );
};

const CareerBenefits = () => {
  const dispatch = useDispatch();
  const { benefits, status } = useSelector((state) => state.home);

  useEffect(() => {
    if (status.benefits === 'idle') {
      dispatch(fetchBenefits());
    }
  }, [dispatch, status.benefits]);

  const displayBenefits = benefits && benefits.length > 0 ? benefits : DEFAULT_BENEFITS;

  return (
    <section className="CareerBenefits-figmaSection">
      <div className="CareerBenefits-figmaContainer">
        <div className="CareerBenefits-figmaHeader">
          <div className="CareerBenefits-badgeTag">
            🛡️ COMPREHENSIVE ENGINEERING CARE
          </div>
          <h2 className="CareerBenefits-headingTitle">
            Why Build Your Career With ThinkWires?
          </h2>
          <p className="CareerBenefits-headingSub">
            We prioritize individual engineer wellness, career velocity, and institutional trust, ensuring you stay in high demand throughout your technical journey.
          </p>
        </div>

        <div className="CareerBenefits-cardGrid">
          {displayBenefits.map((item, idx) => (
            <div key={idx} className="CareerBenefits-itemCard">
              <div className="CareerBenefits-iconBox">
                {renderIcon(item.icon)}
              </div>
              <h3 className="CareerBenefits-cardItemTitle">{item.title}</h3>
              <p className="CareerBenefits-cardItemDesc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerBenefits;
