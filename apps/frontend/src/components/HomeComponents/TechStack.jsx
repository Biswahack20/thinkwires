import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTechStack } from '../../store/slices/homeSlice';
import SectionBadge from '../common/SectionBadge';

const TechStack = () => {
  const dispatch = useDispatch();
  const { techStack: technologies, status } = useSelector(
    (state) => state.home
  );

  useEffect(() => {
    if (status.techStack === 'idle') {
      dispatch(fetchTechStack());
    }
  }, [dispatch, status.techStack]);

  const defaultTechs = [
    'SAP HANA',
    'Adobe AEM',
    'Node / Python',
    'Teamcenter PLM',
    'AWS & Azure',
    'Salesforce CRM',
    'Oracle DB',
    'Kubernetes',
  ];

  const items = technologies && technologies.length > 0 ? technologies : defaultTechs;

  return (
    <section className="TechStack-techStackSection">
      <div className="TechStack-techStackContainer">
        <div className="TechStack-techStackHeader">
          <div className="TechStack-headerLeft">
            <span className="TechStack-eyebrow">Enterprise Tech Stack Ecosystem</span>
            <p className="TechStack-subtext">
              Engineered talent pools rigorously validated for leading enterprise platforms
            </p>
          </div>
          <div className="TechStack-headerRight">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Pre-screened Bench Available</span>
          </div>
        </div>

        <div className="TechStack-grid">
          {items.slice(0, 8).map((tech, index) => (
            <div key={index} className="TechStack-gridCard group">
              <span className="TechStack-cardText">{tech}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
