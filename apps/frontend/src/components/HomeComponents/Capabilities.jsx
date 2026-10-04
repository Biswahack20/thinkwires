import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCapabilities } from '../../store/slices/homeSlice';
import SectionBadge from '../common/SectionBadge';

const getCapabilityIcon = (iconName) => {
  switch (iconName) {
    case 'users':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      );
    case 'globe':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
          <line x1="9" y1="22" x2="15" y2="22"></line>
          <line x1="8" y1="6" x2="16" y2="6"></line>
          <line x1="8" y1="10" x2="16" y2="10"></line>
          <line x1="8" y1="14" x2="16" y2="14"></line>
          <line x1="8" y1="18" x2="16" y2="18"></line>
        </svg>
      );
    case 'star':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      );
    case 'document':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      );
    default:
      return null;
  }
};

const Capabilities = () => {
  const dispatch = useDispatch();
  const { capabilities, status } = useSelector((state) => state.home);

  useEffect(() => {
    if (status.capabilities === 'idle') {
      dispatch(fetchCapabilities());
    }
  }, [dispatch, status.capabilities]);

  return (
    <section className={'Capabilities-capabilitiesSection'}>
      <div className={'Capabilities-container'}>
        <div className={'Capabilities-header'}>
          <div className={'Capabilities-headerLeft'}>
            <SectionBadge text="CAPABILITIES" />
            <h2 className={'Capabilities-title'}>
              Fully Integrated HR &amp; Staffing Services
            </h2>
            <p className={'Capabilities-subtitle'}>
              From flexible staff augmentation to comprehensive Employer of
              Record infrastructure, ThinkWires powers your end-to-end talent
              lifecycle.
            </p>
          </div>
          <div className={'Capabilities-headerRight'}>
            <span className={'Capabilities-enterpriseText'}>
              Enterprise Custom Solutions
            </span>
            <button className={'Capabilities-scopeCallBtn'}>
              Schedule Scope Call
            </button>
          </div>
        </div>

        <div className={'Capabilities-cardsGrid'}>
          {status.capabilities === 'loading' ? (
            <div>Loading capabilities...</div>
          ) : (
            capabilities.map((cap) => (
              <div key={cap.id} className={'Capabilities-card'}>
                <div
                  className={'Capabilities-iconWrapper'}
                  style={{ backgroundColor: cap.iconBg, color: cap.iconColor }}
                >
                  {getCapabilityIcon(cap.icon)}
                </div>
                <div className={'Capabilities-cardHeader'}>
                  <span
                    className={'Capabilities-cardEyebrow'}
                    style={{ color: cap.eyebrowColor }}
                  >
                    {cap.eyebrow}
                  </span>
                  <h3 className={'Capabilities-cardTitle'}>{cap.title}</h3>
                  <p className={'Capabilities-cardDesc'}>{cap.description}</p>
                </div>
                <ul className={'Capabilities-featureList'}>
                  {cap.features.map((feature, i) => (
                    <li key={i}>
                      <svg
                        className={'Capabilities-checkIcon'}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className={'Capabilities-exploreLink'}
                  style={{ color: cap.linkColor }}
                >
                  {cap.linkText}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
