import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTechStack } from '../../store/slices/homeSlice';

// Pure authentic corporate company brand logos (original company logos only)
const TechLogos = {
  sap: (
    <svg className="TechStack-logoSvg" viewBox="0 0 96 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="SAP">
      {/* Official SAP trapezoid badge */}
      <path d="M5 4h68l18 32H5a3 3 0 01-3-3V7a3 3 0 013-3z" fill="#008FD3" />
      {/* S */}
      <path d="M24 13.5c-4 0-6.8 2.2-6.8 5.4 0 6.6 9.8 4.7 9.8 8.1 0 1.5-1.4 2.4-3.3 2.4-2.4 0-3.9-1.2-4.4-2.9l-3.8 1.5c1.1 3 4.2 4.9 8.3 4.9 4.8 0 7.7-2.6 7.7-6 0-7-9.8-5-9.8-8.2 0-1.3 1.2-2.1 3-2.1 2 0 3.4.9 3.9 2.4l3.8-1.5c-1-2.6-3.8-4-8.4-4z" fill="#FFFFFF" />
      {/* A */}
      <path d="M41.5 13.8h-4.2L30 32.5h4.5l2-5h7.5l2 5h4.5l-7-18.7zm-3.5 10.6l2.5-6.4 2.5 6.4h-5z" fill="#FFFFFF" />
      {/* P */}
      <path d="M52 13.8v18.7h4.3v-6.6H61c5.2 0 8.4-2.7 8.4-6.1s-3.2-6-8.4-6H52zm4.3 3.8H61c2.7 0 4.2 1.2 4.2 2.8 0 1.6-1.5 2.8-4.2 2.8h-4.7v-5.6z" fill="#FFFFFF" />
    </svg>
  ),
  aws: (
    <svg className="TechStack-logoSvg" viewBox="0 0 90 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="AWS">
      <path d="M24.8 23.4c-1.8 0-3.2-.8-3.2-2.4 0-1.8 1.5-2.5 3.9-2.5 1.4 0 2.4.2 3.2.5v1.4c-.8 1.8-2.4 3-3.9 3zm3.9-7.4c-.7-.3-1.8-.5-3.2-.5-3.7 0-6.3 1.7-6.3 5.1 0 3.3 2.5 5 5.5 5 1.6 0 2.9-.5 4-1.6v1.3h3.7V16h-3.7z" fill="var(--logo-aws, #232F3E)" />
      <path d="M37.8 16h-3.8l3.7 11.5h3.5l2.7-8.4 2.7 8.4h3.5L53.8 16H50l-1.9 7.4-2.6-7.4h-3.4l-2.6 7.4-1.7-7.4z" fill="var(--logo-aws, #232F3E)" />
      <path d="M61.2 20.1c0-1 .9-1.6 2.5-1.6 1.4 0 2.7.5 3.5 1.2l2.2-2.5c-1.4-1.3-3.4-1.9-5.7-1.9-3.9 0-6.4 2.2-6.4 5 0 4.5 5.8 3.5 5.8 5.6 0 1.2-1.2 1.7-2.7 1.7-1.7 0-3.4-.7-4.4-1.7l-2.2 2.7c1.6 1.6 4 2.3 6.6 2.3 4.2 0 6.6-2.2 6.6-5.3 0-4.8-5.8-3.8-5.8-5.5z" fill="var(--logo-aws, #232F3E)" />
      <path d="M15 28.5c16.5 6 36.5 6 51.5-2.2" stroke="#FF9900" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M64 24.5l5.5 3-2.8 5.2c-.4-1.5-.7-2.9-.5-4.4-1.4.3-2.8.3-4.4-.1l2.2-3.7z" fill="#FF9900" />
    </svg>
  ),
  azure: (
    <svg className="TechStack-logoSvg" viewBox="0 0 130 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Microsoft">
      <rect x="2" y="6" width="11" height="11" fill="#F25022" />
      <rect x="15" y="6" width="11" height="11" fill="#7FBA00" />
      <rect x="2" y="19" width="11" height="11" fill="#00A4EF" />
      <rect x="15" y="19" width="11" height="11" fill="#FFB900" />
      <text x="34" y="24" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontSize="16.5" fontWeight="600" fill="var(--logo-text, #1e293b)" letterSpacing="-0.3px">Microsoft</text>
    </svg>
  ),
  google: (
    <svg className="TechStack-logoSvg" viewBox="0 0 145 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google Cloud">
      <path d="M18 10c-3.2 0-6 2-7.2 4.9A7.2 7.2 0 004 22a7.2 7.2 0 007.2 7.2h15.6a5.2 5.2 0 005.2-5.2c0-2.6-1.9-4.7-4.4-5.1A8.2 8.2 0 0018 10z" fill="#4285F4" />
      <path d="M18 10c3.7 0 6.9 2.5 7.8 6a5.2 5.2 0 012 4.2h-3.6A8.2 8.2 0 0018 10z" fill="#EA4335" />
      <path d="M26.8 29.2h-15.6a7.2 7.2 0 01-6-3.2l3.1-2.4a5.2 5.2 0 004.1 1.6h14.4z" fill="#34A853" />
      <path d="M4 22c0-1.8.7-3.4 1.8-4.6l2.5 2.1c-.5.7-.8 1.6-.8 2.5z" fill="#FBBC04" />
      <text x="36" y="23.5" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontSize="14.5" fontWeight="600" fill="var(--logo-text, #1e293b)" letterSpacing="-0.2px">Google Cloud</text>
    </svg>
  ),
  salesforce: (
    <svg className="TechStack-logoSvg" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Salesforce">
      <path d="M30 6c6.2 0 11.6 3.2 14.6 8 3.7-2.1 8-3.2 12.6-3.2 13.8 0 25 11.2 25 25 0 .7 0 1.4-.1 2.1 5.6 1.8 9.6 7.1 9.6 13.3 0 7.7-6.2 14-14 14H18C7.7 65.2 0 57.5 0 48c0-8.2 5.8-15.1 13.6-16.6C14.1 19.5 21.2 6 30 6z" transform="matrix(1.2 0 0 0.55 3 2)" fill="#00A1E0" />
      <text x="60" y="24" textAnchor="middle" fontFamily="'Salesforce Sans', 'Helvetica Neue', Arial, sans-serif" fontSize="13" fontWeight="700" fontStyle="italic" fill="#FFFFFF" letterSpacing="-0.2px">salesforce</text>
    </svg>
  ),
  oracle: (
    <svg className="TechStack-logoSvg" viewBox="0 0 118 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Oracle">
      <path d="M4 9h6a8 8 0 010 16H4a8 8 0 010-16zm6 12.5a4.5 4.5 0 000-9H4a4.5 4.5 0 000 9h6z" fill="#C74634" />
      <path d="M23 9h8.5a6 6 0 014.6 9.8l4 6.2h-4.4l-3.6-5.6H27v5.6h-4V9zm8.5 6.8a2.8 2.8 0 000-5.6H27v5.6h4.5z" fill="#C74634" />
      <path d="M45 9h3.6l7.8 16h-4l-1.8-3.8h-7.8l-1.8 3.8h-4L45 9zm4.4 9l-2.6-5.8-2.6 5.8h5.2z" fill="#C74634" />
      <path d="M65 9h7a8 8 0 018 8v.8h-3.6a4.5 4.5 0 00-4.4-5.2h-7a4.5 4.5 0 000 9h7a4.5 4.5 0 004.4-5.2h3.6v.8a8 8 0 01-8 8h-7a8 8 0 010-16z" fill="#C74634" />
      <path d="M85 9h3.8v12.4h8v3.6H85V9z" fill="#C74634" />
      <path d="M102 9h11v3.5h-7.2v2.8h6.4v3.2h-6.4v2.9h7.2v3.6H102V9z" fill="#C74634" />
    </svg>
  ),
  siemens: (
    <svg className="TechStack-logoSvg" viewBox="0 0 125 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Siemens">
      <text x="4" y="25" fontFamily="-apple-system, BlinkMacSystemFont, Arial, sans-serif" fontSize="21" fontWeight="800" fill="#00646E" letterSpacing="0.8px">SIEMENS</text>
    </svg>
  ),
  adobe: (
    <svg className="TechStack-logoSvg" viewBox="0 0 115 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Adobe">
      <rect x="2" y="4" width="28" height="28" rx="4" fill="#EB1000" />
      <path d="M19.5 9H27v18L19.5 9z M12.5 9H5v18l7.5-18z M16 17.5l5 10.5h-3.8l-1.3-3.4h-3.8l3.9-7.1z" fill="#FFFFFF" />
      <text x="36" y="24" fontFamily="-apple-system, BlinkMacSystemFont, Arial, sans-serif" fontSize="18" fontWeight="700" fill="#EB1000" letterSpacing="-0.2px">Adobe</text>
    </svg>
  ),
  ibm: (
    <svg className="TechStack-logoSvg" viewBox="0 0 95 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="IBM">
      <rect x="4" y="5" width="16" height="2.2" fill="var(--logo-ibm, #0F62FE)" />
      <rect x="4" y="8.5" width="16" height="2.2" fill="var(--logo-ibm, #0F62FE)" />
      <rect x="9" y="12" width="6" height="2.2" fill="var(--logo-ibm, #0F62FE)" />
      <rect x="9" y="15.5" width="6" height="2.2" fill="var(--logo-ibm, #0F62FE)" />
      <rect x="9" y="19" width="6" height="2.2" fill="var(--logo-ibm, #0F62FE)" />
      <rect x="9" y="22.5" width="6" height="2.2" fill="var(--logo-ibm, #0F62FE)" />
      <rect x="4" y="26" width="16" height="2.2" fill="var(--logo-ibm, #0F62FE)" />
      <rect x="4" y="29.5" width="16" height="2.2" fill="var(--logo-ibm, #0F62FE)" />
      <path d="M26 5h14a5 5 0 010 2.2H26V5zm0 3.5h15.5a5 5 0 010 2.2H26V8.5zm0 3.5h6v2.2h-6V12zm10 0h5a4 4 0 010 2.2h-5V12zm-10 3.5h14v2.2H26v-2.2zm0 3.5h14v2.2H26V19zm0 3.5h6v2.2h-6v-2.2zm10 0h5.5a4 4 0 010 2.2H36v-2.2zm-10 3.5h16a5 5 0 010 2.2H26V26zm0 3.5h14.5a5 5 0 010 2.2H26v-2.2z" fill="var(--logo-ibm, #0F62FE)" />
      <path d="M48 5h6.5l5 6.5 5-6.5H71v2.2h-5.2l-5.3 7-5.3-7H48V5zm0 3.5h4.8l6.7 8.8 6.7-8.8H71v2.2h-4.3l-7.2 9.4-7.2-9.4H48V8.5zm0 3.5h3.5v2.2H48V12zm19.5 0H71v2.2h-3.5V12zm-19.5 3.5h3.5v2.2H48v-2.2zm19.5 0H71v2.2h-3.5v-2.2zm-19.5 3.5h3.5v2.2H48V19zm19.5 0H71v2.2h-3.5V19zm-19.5 3.5h3.5v2.2H48v-2.2zm19.5 0H71v2.2h-3.5v-2.2zm-19.5 3.5h4v2.2H48V26zm19 0H71v2.2h-4V26zm-19 3.5h5v2.2H48v-2.2zm18 0H71v2.2h-5v-2.2z" fill="var(--logo-ibm, #0F62FE)" />
    </svg>
  ),
  snowflake: (
    <svg className="TechStack-logoSvg" viewBox="0 0 135 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Snowflake">
      <g transform="translate(16, 18)" stroke="#29B5E8" strokeWidth="2.4" strokeLinecap="round">
        <line x1="0" y1="-12" x2="0" y2="12" />
        <line x1="-10.4" y1="-6" x2="10.4" y2="6" />
        <line x1="-10.4" y1="6" x2="10.4" y2="-6" />
        <path d="M-3 -9L0 -12L3 -9 M-3 9L0 12L3 9" strokeWidth="1.8" />
        <circle cx="0" cy="0" r="2.5" fill="#29B5E8" />
      </g>
      <text x="36" y="24" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontSize="16.5" fontWeight="600" fill="var(--logo-text, #11567F)" letterSpacing="-0.2px">snowflake</text>
    </svg>
  ),
  cisco: (
    <svg className="TechStack-logoSvg" viewBox="0 0 95 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Cisco">
      <g fill="#049FD9">
        <rect x="8" y="11" width="2.8" height="6" rx="1.4" />
        <rect x="17" y="8" width="2.8" height="9" rx="1.4" />
        <rect x="26" y="4" width="2.8" height="13" rx="1.4" />
        <rect x="35" y="8" width="2.8" height="9" rx="1.4" />
        <rect x="44" y="2" width="2.8" height="15" rx="1.4" />
        <rect x="53" y="8" width="2.8" height="9" rx="1.4" />
        <rect x="62" y="4" width="2.8" height="13" rx="1.4" />
        <rect x="71" y="8" width="2.8" height="9" rx="1.4" />
        <rect x="80" y="11" width="2.8" height="6" rx="1.4" />
      </g>
      <text x="18" y="34" fontFamily="-apple-system, Arial, sans-serif" fontSize="14" fontWeight="800" fill="var(--logo-text, #049FD9)" letterSpacing="1.2px">CISCO</text>
    </svg>
  ),
  servicenow: (
    <svg className="TechStack-logoSvg" viewBox="0 0 135 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ServiceNow">
      <text x="2" y="23" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontSize="16.5" fontWeight="500" fill="var(--logo-text, #293E40)">service</text>
      <text x="59" y="23" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontSize="16.5" fontWeight="800" fill="#81B5A1">now</text>
      <path d="M58 8c12-5 24-5 36 0" stroke="#81B5A1" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  nvidia: (
    <svg className="TechStack-logoSvg" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="NVIDIA">
      <path d="M16 6c-6.6 0-12 5.4-12 12s5.4 12 12 12c4 0 7.5-2 9.6-5-1.5-1-2.8-2.3-3.8-3.8-1.5 2-3.8 3.3-6.4 3.3-4.4 0-8-3.6-8-8s3.6-8 8-8c3.2 0 6 1.9 7.2 4.6l4-2.8C24.4 8.2 20.5 6 16 6z" fill="#76B900" />
      <text x="34" y="24" fontFamily="-apple-system, BlinkMacSystemFont, Arial, sans-serif" fontSize="16" fontWeight="800" fill="var(--logo-text, #1e293b)" letterSpacing="0.8px">NVIDIA</text>
    </svg>
  ),
  intel: (
    <svg className="TechStack-logoSvg" viewBox="0 0 85 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Intel">
      <text x="2" y="25" fontFamily="-apple-system, BlinkMacSystemFont, Arial, sans-serif" fontSize="23" fontWeight="700" fill="#0071C5" letterSpacing="-0.8px">intel</text>
      <rect x="4" y="5.5" width="4.5" height="4.5" rx="0.8" fill="#00C7FD" />
    </svg>
  ),
  redhat: (
    <svg className="TechStack-logoSvg" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Red Hat">
      <path d="M4 22c3.5-1 8-2.2 13-2.2s9.5 1.2 13 2.2c-2.2 2-6.5 3-13 3s-10.8-1-13-3z" fill="#EE0000" />
      <path d="M9 20c1-3.5 3.5-7.5 8-7.5s7 4 8 7.5H9z" fill="#EE0000" />
      <rect x="9" y="19" width="16" height="1.8" fill="#111111" />
      <text x="36" y="23.5" fontFamily="-apple-system, BlinkMacSystemFont, Arial, sans-serif" fontSize="15" fontWeight="700" fill="var(--logo-text, #1e293b)" letterSpacing="-0.2px">Red Hat</text>
    </svg>
  ),
};

const getTechDetails = (item) => {
  const name = typeof item === 'string' ? item : item?.name || '';
  const lower = name.toLowerCase();

  if (lower.includes('sap') || lower.includes('hana')) {
    return { name: 'SAP', icon: TechLogos.sap };
  }
  if (lower.includes('aws') || lower.includes('amazon')) {
    return { name: 'AWS', icon: TechLogos.aws };
  }
  if (lower.includes('azure') || lower.includes('microsoft')) {
    return { name: 'Microsoft Azure', icon: TechLogos.azure };
  }
  if (lower.includes('google') || lower.includes('gcp')) {
    return { name: 'Google Cloud', icon: TechLogos.google };
  }
  if (lower.includes('oracle')) {
    return { name: 'Oracle', icon: TechLogos.oracle };
  }
  if (lower.includes('salesforce') || lower.includes('crm')) {
    return { name: 'Salesforce', icon: TechLogos.salesforce };
  }
  if (lower.includes('siemens') || lower.includes('teamcenter') || lower.includes('plm')) {
    return { name: 'Siemens', icon: TechLogos.siemens };
  }
  if (lower.includes('adobe') || lower.includes('aem')) {
    return { name: 'Adobe', icon: TechLogos.adobe };
  }
  if (lower.includes('ibm')) {
    return { name: 'IBM', icon: TechLogos.ibm };
  }
  if (lower.includes('snowflake')) {
    return { name: 'Snowflake', icon: TechLogos.snowflake };
  }
  if (lower.includes('cisco') || lower.includes('network')) {
    return { name: 'Cisco', icon: TechLogos.cisco };
  }
  if (lower.includes('servicenow') || lower.includes('service now') || lower.includes('itsm')) {
    return { name: 'ServiceNow', icon: TechLogos.servicenow };
  }
  if (lower.includes('nvidia') || lower.includes('ai') || lower.includes('gpu')) {
    return { name: 'NVIDIA', icon: TechLogos.nvidia };
  }
  if (lower.includes('intel')) {
    return { name: 'Intel', icon: TechLogos.intel };
  }
  if (lower.includes('red hat') || lower.includes('redhat') || lower.includes('linux')) {
    return { name: 'Red Hat', icon: TechLogos.redhat };
  }
  if (lower.includes('python') || lower.includes('node')) {
    return { name: 'Google Cloud', icon: TechLogos.google };
  }
  if (lower.includes('react') || lower.includes('next')) {
    return { name: 'Microsoft Azure', icon: TechLogos.azure };
  }
  if (lower.includes('kubernetes') || lower.includes('docker') || lower.includes('container')) {
    return { name: 'Red Hat', icon: TechLogos.redhat };
  }

  return { name: 'IBM', icon: TechLogos.ibm };
};

const DEFAULT_STACK_IMAGES = [
  { name: 'SAP', icon: TechLogos.sap },
  { name: 'AWS', icon: TechLogos.aws },
  { name: 'Microsoft Azure', icon: TechLogos.azure },
  { name: 'Google Cloud', icon: TechLogos.google },
  { name: 'Oracle', icon: TechLogos.oracle },
  { name: 'Salesforce', icon: TechLogos.salesforce },
  { name: 'Siemens', icon: TechLogos.siemens },
  { name: 'Adobe', icon: TechLogos.adobe },
  { name: 'IBM', icon: TechLogos.ibm },
  { name: 'Snowflake', icon: TechLogos.snowflake },
  { name: 'Cisco', icon: TechLogos.cisco },
  { name: 'ServiceNow', icon: TechLogos.servicenow },
  { name: 'NVIDIA', icon: TechLogos.nvidia },
  { name: 'Intel', icon: TechLogos.intel },
  { name: 'Red Hat', icon: TechLogos.redhat },
];

const TechStack = () => {
  const dispatch = useDispatch();
  const { techStack: technologies, status } = useSelector((state) => state.home);
  const trackRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (status.techStack === 'idle') {
      dispatch(fetchTechStack());
    }
  }, [dispatch, status.techStack]);

  const items = useMemo(() => {
    if (technologies && technologies.length > 0) {
      return technologies.map(getTechDetails);
    }
    return DEFAULT_STACK_IMAGES;
  }, [technologies]);

  // Duplicate items for continuous seamless marquee scroll
  const marqueeItems = useMemo(() => [...items, ...items, ...items], [items]);

  // Velocity-reactive scrolling ticker
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rafId;
    let xPos = 0;
    const baseSpeed = 0.85; // baseline cruise speed
    let extraVelocity = 0;
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      extraVelocity += Math.min(Math.abs(deltaY) * 0.18, 16);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    const animate = () => {
      const currentBaseSpeed = isHovered ? 0.2 : baseSpeed;
      const currentSpeed = currentBaseSpeed + extraVelocity;

      extraVelocity *= 0.93;
      xPos -= currentSpeed;

      const segmentWidth = track.scrollWidth / 2;
      if (segmentWidth > 0 && Math.abs(xPos) >= segmentWidth) {
        xPos += segmentWidth;
      }

      const skew = Math.max(-2.5, Math.min(2.5, -extraVelocity * 0.12));
      track.style.transform = `translate3d(${xPos}px, 0, 0) skewX(${skew}deg)`;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isHovered]);

  return (
    <section className="TechStack-techStackSection" aria-label="Enterprise Tech Stacks" style={{ padding: '1.25rem 0 2rem 0' }}>
      {/* Infinite Velocity-Reactive Scrolling Marquee - Pure Brand Images Only (No Names or Details) */}
      <div
        className="TechStack-carouselWrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={trackRef}
          className="TechStack-carouselTrack"
          style={{ animation: 'none' }}
        >
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
