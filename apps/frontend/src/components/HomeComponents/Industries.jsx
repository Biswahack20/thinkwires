import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchIndustries } from '../../store/slices/homeSlice';
import SectionBadge from '../common/SectionBadge';

const IconMonitor = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const IconBuilding = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 2 7 22 7 12 2"></polygon>
    <polyline points="2 17 2 22 22 22 22 17"></polyline>
    <line x1="6" y1="12" x2="6" y2="17"></line>
    <line x1="10" y1="12" x2="10" y2="17"></line>
    <line x1="14" y1="12" x2="14" y2="17"></line>
    <line x1="18" y1="12" x2="18" y2="17"></line>
  </svg>
);

const IconMedical = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="6" width="18" height="15" rx="2" ry="2"></rect>
    <path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2"></path>
    <line x1="12" y1="11" x2="12" y2="17"></line>
    <line x1="9" y1="14" x2="15" y2="14"></line>
  </svg>
);

const IconRobot = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
    <circle cx="12" cy="5" r="2"></circle>
    <path d="M12 7v4"></path>
    <line x1="8" y1="16" x2="8" y2="16"></line>
    <line x1="16" y1="16" x2="16" y2="16"></line>
  </svg>
);

const IconPlane = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.3c-.1.3.1.7.4.8l6.8 2.8L8 16l-3.3-.8c-.3-.1-.7.1-.8.4l-1.2 3.3c-.1.5.2.9.7 1.1l7.6 2.3c.3.1.7 0 1-.2L21.8 13"></path>
  </svg>
);

const IconAntenna = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 10a12 12 0 0 1 16 0"></path>
    <path d="M7 14a8 8 0 0 1 10 0"></path>
    <path d="M10 18a4 4 0 0 1 4 0"></path>
    <circle cx="12" cy="22" r="1"></circle>
  </svg>
);

const getIconComponent = (iconName) => {
  switch (iconName) {
    case 'monitor':
      return <IconMonitor />;
    case 'building':
      return <IconBuilding />;
    case 'medical':
      return <IconMedical />;
    case 'robot':
      return <IconRobot />;
    case 'plane':
      return <IconPlane />;
    case 'antenna':
      return <IconAntenna />;
    default:
      return <IconMonitor />;
  }
};

const Industries = () => {
  const dispatch = useDispatch();
  const { industries, status } = useSelector((state) => state.home);

  useEffect(() => {
    if (status.industries === 'idle') {
      dispatch(fetchIndustries());
    }
  }, [dispatch, status.industries]);

  return (
    <section className={'Industries-section'}>
      <div className={'Industries-container'}>
        <div className={'Industries-header'}>
          <SectionBadge text="DOMAIN EXPERTISE" />
          <h2 className={'Industries-title'}>Industries We Empower</h2>
          <p className={'Industries-description'}>
            Supplying deep niche technical knowledge tailored to regulatory,
            compliance, and velocity needs across key sectors.
          </p>
        </div>

        <div className={'Industries-grid'}>
          {industries.map((ind) => (
            <div key={ind.id} className={'Industries-card'}>
              <div className={`Industries-iconWrapper Industries-${ind.color}`}>
                {getIconComponent(ind.icon)}
              </div>
              <h3 className={'Industries-cardTitle'}>{ind.name}</h3>
              <p className={'Industries-cardDesc'}>{ind.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
