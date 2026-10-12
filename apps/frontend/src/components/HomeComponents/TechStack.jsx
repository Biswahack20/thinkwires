import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTechStack } from '../../store/slices/homeSlice';

// Authentic enterprise brand logos
const TechLogos = {
  sap: (
    <svg className="TechStack-logoSvg TechStack-logoSap" viewBox="0 0 68 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="SAP HANA">
      <rect width="68" height="28" rx="5" fill="#008FD3" />
      <path d="M14 18C12.5 18 11.2 17.2 10.7 16L13.2 14.8C13.4 15.4 13.9 15.7 14.5 15.7C15.2 15.7 15.7 15.4 15.7 14.8C15.7 14.2 15.2 13.9 14.2 13.5L12.9 12.9C11.3 12.2 10.5 11.1 10.5 9.6C10.5 7.7 12.1 6.5 14.2 6.5C15.8 6.5 17.1 7.4 17.6 8.6L15.2 9.6C14.9 9 14.6 8.7 14.1 8.7C13.4 8.7 12.9 9 12.9 9.6C12.9 10 13.2 10.3 14.1 10.6L15.4 11.2C17.2 11.9 18.1 13.1 18.1 14.6C18.1 16.7 16.2 18 14 18ZM23.5 6.8H26.2L31 17.7H28.2L27.3 15.6H22.5L21.6 17.7H18.9L23.5 6.8ZM26.4 13.5L24.9 9.8L23.4 13.5H26.4ZM34 6.8H38.5C40.9 6.8 42.4 8.1 42.4 10.2C42.4 12.3 40.9 13.7 38.5 13.7H36.6V17.7H34V6.8ZM36.6 11.6H38.4C39.4 11.6 39.9 11.1 39.9 10.2C39.9 9.3 39.4 8.9 38.4 8.9H36.6V11.6Z" fill="#FFFFFF" />
      <path d="M47.5 6.8H50V11.2H54.5V6.8H57V17.7H54.5V13.3H50V17.7H47.5V6.8Z" fill="#E0F2FE" />
    </svg>
  ),
  adobe: (
    <svg className="TechStack-logoSvg TechStack-logoAdobe" viewBox="0 0 84 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Adobe AEM">
      <path d="M17.5 2H27.5V26L17.5 2Z" fill="#EB1000" />
      <path d="M10 2H0V26L10 2Z" fill="#EB1000" />
      <path d="M13.8 11.5L19.2 26H14.9L13.5 22.4H10.2L13.8 11.5Z" fill="#EB1000" />
      <text x="32" y="20" fill="#EB1000" fontFamily="Plus Jakarta Sans, system-ui, sans-serif" fontWeight="800" fontSize="15" letterSpacing="0.04em">Adobe</text>
    </svg>
  ),
  nodePython: (
    <svg className="TechStack-logoSvg TechStack-logoNodePy" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Node / Python">
      <path d="M13 2.5L3 8.3V19.7L13 25.5L23 19.7V8.3L13 2.5Z" fill="#339933" />
      <path d="M13 6L5.5 10.2V17.8L13 22L20.5 17.8V10.2L13 6Z" fill="#026E00" />
      <text x="9.5" y="17.5" fill="#FFFFFF" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="10">JS</text>
      <g transform="translate(30, 2)">
        <path d="M11 1C6.8 1 6.8 2.8 6.8 2.8V6H15.2V7.6H3.8C3.8 7.6 0.8 7.2 0.8 11.5C0.8 15.8 3.5 15.4 3.5 15.4H6.2V12.6C6.2 10.8 7.8 10.8 7.8 10.8H15.4C17.5 10.8 18.5 9.5 18.5 7.5V2.8C18.5 2.8 19 1 11 1Z" fill="#3776AB" />
        <circle cx="8.5" cy="3.5" r="1.2" fill="#FFFFFF" />
        <path d="M13.5 24C17.7 24 17.7 22.2 17.7 22.2V19H9.3V17.4H20.7C20.7 17.4 23.7 17.8 23.7 13.5C23.7 9.2 21 9.6 21 9.6H18.3V12.4C18.3 14.2 16.7 14.2 16.7 14.2H9.1C7 14.2 6 15.5 6 17.5V22.2C6 22.2 5.5 24 13.5 24Z" fill="#FFD43B" />
        <circle cx="16" cy="21.5" r="1.2" fill="#285984" />
      </g>
      <text x="60" y="18.5" fill="#339933" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="12">Node/Py</text>
    </svg>
  ),
  teamcenter: (
    <svg className="TechStack-logoSvg TechStack-logoSiemens" viewBox="0 0 105 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Teamcenter PLM">
      <circle cx="14" cy="14" r="11" stroke="#00646E" strokeWidth="2.5" fill="#E6F4F5" />
      <path d="M14 6V14L19 19" stroke="#00A3A6" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="14" cy="14" r="3" fill="#00646E" />
      <text x="32" y="19" fill="#00646E" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="13.5" letterSpacing="-0.01em">SIEMENS</text>
    </svg>
  ),
  cloud: (
    <svg className="TechStack-logoSvg TechStack-logoAwsAzure" viewBox="0 0 108 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="AWS & Azure">
      <text x="2" y="17" fill="#232F3E" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="15">aws</text>
      <path d="M5 22C11 25 21 25 27 22" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M25 21.5L27.5 22.2L26.2 24" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="36" y1="5" x2="36" y2="23" stroke="#CBD5E1" strokeWidth="1.5" />
      <g transform="translate(42, 2)">
        <path d="M10.8 1.5L4.5 13.5H10.5L7.2 22.5L18.5 9.5H12.5L16.2 1.5H10.8Z" fill="#0078D4" />
        <text x="22" y="16.5" fill="#0078D4" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="14">Azure</text>
      </g>
    </svg>
  ),
  salesforce: (
    <svg className="TechStack-logoSvg TechStack-logoSalesforce" viewBox="0 0 105 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Salesforce CRM">
      <path d="M12.5 5.5C14.2 3.5 17.1 2.8 19.3 4C21.4 5.2 22.6 7.4 22.5 9.8C24.5 10.2 26.2 11.9 26.6 14C27 16.3 25.8 18.4 23.9 19.3H7C5.2 19.3 3.6 18.1 3.1 16.3C2.6 14.5 3.3 12.6 4.8 11.6C5.1 9.1 7.1 7.1 9.5 7C10.8 6.9 12 7.5 12.9 8.6V5.5H12.5Z" fill="#00A1E0" />
      <text x="32" y="19" fill="#00A1E0" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="13.5">salesforce</text>
    </svg>
  ),
  oracle: (
    <svg className="TechStack-logoSvg TechStack-logoOracle" viewBox="0 0 96 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Oracle DB">
      <rect x="2" y="4" width="28" height="20" rx="10" stroke="#F80000" strokeWidth="3" fill="none" />
      <text x="36" y="20" fill="#F80000" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="15" letterSpacing="0.04em">ORACLE</text>
    </svg>
  ),
  kubernetes: (
    <svg className="TechStack-logoSvg TechStack-logoK8s" viewBox="0 0 112 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Kubernetes">
      <g transform="translate(2, 2)">
        <circle cx="12" cy="12" r="11" fill="#326CE5" />
        <path d="M12 4V20M4 12H20M6.3 6.3L17.7 17.7M6.3 17.7L17.7 6.3" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3.2" fill="#326CE5" stroke="#FFFFFF" strokeWidth="1.5" />
      </g>
      <text x="32" y="19" fill="#326CE5" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="13.5" letterSpacing="-0.02em">kubernetes</text>
    </svg>
  ),
  snowflake: (
    <svg className="TechStack-logoSvg TechStack-logoSnowflake" viewBox="0 0 105 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Snowflake">
      <path d="M14 2V26M5.3 7L22.7 17M5.3 17L22.7 7" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="14" r="2.5" fill="#29B5E8" />
      <text x="32" y="19" fill="#29B5E8" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="14">snowflake</text>
    </svg>
  ),
  defaultIcon: (
    <svg className="TechStack-logoSvg" viewBox="0 0 70 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Technology">
      <rect x="2" y="4" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="10" r="1.5" fill="currentColor" />
      <path d="M18 16L14 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="28" y="19" fill="currentColor" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="12">TECH</text>
    </svg>
  ),
};

const getTechDetails = (item) => {
  const name = typeof item === 'string' ? item : item?.name || '';
  const lower = name.toLowerCase();

  if (lower.includes('sap') || lower.includes('hana')) {
    return { name, icon: TechLogos.sap };
  }
  if (lower.includes('adobe') || lower.includes('aem')) {
    return { name, icon: TechLogos.adobe };
  }
  if (lower.includes('node') || lower.includes('python')) {
    return { name, icon: TechLogos.nodePython };
  }
  if (lower.includes('teamcenter') || lower.includes('plm')) {
    return { name, icon: TechLogos.teamcenter };
  }
  if (lower.includes('aws') || lower.includes('azure') || lower.includes('cloud')) {
    return { name, icon: TechLogos.cloud };
  }
  if (lower.includes('salesforce') || lower.includes('crm')) {
    return { name, icon: TechLogos.salesforce };
  }
  if (lower.includes('oracle') || lower.includes('db')) {
    return { name, icon: TechLogos.oracle };
  }
  if (lower.includes('kubernetes') || lower.includes('k8s') || lower.includes('docker')) {
    return { name, icon: TechLogos.kubernetes };
  }
  if (lower.includes('snowflake') || lower.includes('data')) {
    return { name, icon: TechLogos.snowflake };
  }

  return { name, icon: TechLogos.defaultIcon };
};

const DEFAULT_TECHS = [
  { name: 'SAP HANA', icon: TechLogos.sap },
  { name: 'Adobe AEM', icon: TechLogos.adobe },
  { name: 'Node / Python', icon: TechLogos.nodePython },
  { name: 'Teamcenter PLM', icon: TechLogos.teamcenter },
  { name: 'AWS & Azure', icon: TechLogos.cloud },
  { name: 'Salesforce CRM', icon: TechLogos.salesforce },
  { name: 'Oracle DB', icon: TechLogos.oracle },
  { name: 'Kubernetes', icon: TechLogos.kubernetes },
];

const TechStack = () => {
  const dispatch = useDispatch();
  const { techStack: technologies, status } = useSelector((state) => state.home);

  useEffect(() => {
    if (status.techStack === 'idle') {
      dispatch(fetchTechStack());
    }
  }, [dispatch, status.techStack]);

  const items = useMemo(() => {
    if (technologies && technologies.length > 0) {
      return technologies.map(getTechDetails);
    }
    return DEFAULT_TECHS;
  }, [technologies]);

  // Duplicate items for continuous seamless marquee scroll
  const marqueeItems = useMemo(() => [...items, ...items, ...items], [items]);

  return (
    <section className="TechStack-techStackSection" aria-label="Enterprise Tech Stack Ecosystem">
      <div className="TechStack-techStackContainer">
        <div className="TechStack-techStackHeader">
          <div className="TechStack-headerLeft">
            <span className="TechStack-eyebrow">Enterprise Tech Stack Ecosystem</span>
            <p className="TechStack-subtext">
              Engineered talent pools rigorously validated for leading enterprise platforms
            </p>
          </div>
          <div className="TechStack-headerRight">
            <span className="material-symbols-outlined">check_circle</span>
            <span>Pre-screened Bench Available</span>
          </div>
        </div>
      </div>

      {/* Infinite Seamless Scrolling Marquee Carousel with Pure Brand Logos */}
      <div className="TechStack-carouselWrapper">
        <div className="TechStack-carouselTrack">
          {marqueeItems.map((tech, index) => (
            <div
              key={`${tech.name}-${index}`}
              className="TechStack-gridCard group"
              title={tech.name}
              aria-label={tech.name}
            >
              <div className="TechStack-logoContainer">
                {tech.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
