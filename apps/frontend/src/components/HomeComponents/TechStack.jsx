import React, { useEffect, useRef, useState, useMemo } from 'react';

// Original downloaded brand logo images
import sapLogo from '../../assets/tech-logos/sap.svg';
import awsLogo from '../../assets/tech-logos/aws.svg';
import azureLogo from '../../assets/tech-logos/microsoft-azure.svg';
import googleCloudLogo from '../../assets/tech-logos/google-cloud.svg';
import oracleLogo from '../../assets/tech-logos/oracle.svg';
import salesforceLogo from '../../assets/tech-logos/salesforce.svg';
import siemensLogo from '../../assets/tech-logos/siemens.svg';
import adobeLogo from '../../assets/tech-logos/adobe.svg';
import ibmLogo from '../../assets/tech-logos/ibm.svg';
import snowflakeLogo from '../../assets/tech-logos/snowflake.svg';
import ciscoLogo from '../../assets/tech-logos/cisco.svg';
import servicenowLogo from '../../assets/tech-logos/servicenow.svg';
import nvidiaLogo from '../../assets/tech-logos/nvidia.svg';
import intelLogo from '../../assets/tech-logos/intel.svg';
import redhatLogo from '../../assets/tech-logos/redhat.svg';
import kubernetesLogo from '../../assets/tech-logos/kubernetes.svg';
import dockerLogo from '../../assets/tech-logos/docker.svg';
import reactLogo from '../../assets/tech-logos/react.svg';
import pythonLogo from '../../assets/tech-logos/python.svg';
import mongodbLogo from '../../assets/tech-logos/mongodb.svg';

const STATIC_TECH_STACK = [
  { name: 'SAP', logo: sapLogo },
  { name: 'Amazon Web Services', logo: awsLogo },
  { name: 'Microsoft Azure', logo: azureLogo },
  { name: 'Google Cloud', logo: googleCloudLogo },
  { name: 'Oracle', logo: oracleLogo },
  { name: 'Salesforce', logo: salesforceLogo },
  { name: 'Siemens', logo: siemensLogo },
  { name: 'Adobe', logo: adobeLogo },
  { name: 'IBM', logo: ibmLogo },
  { name: 'Snowflake', logo: snowflakeLogo },
  { name: 'Cisco', logo: ciscoLogo },
  { name: 'ServiceNow', logo: servicenowLogo },
  { name: 'NVIDIA', logo: nvidiaLogo },
  { name: 'Intel', logo: intelLogo },
  { name: 'Red Hat', logo: redhatLogo },
  { name: 'Kubernetes', logo: kubernetesLogo },
  { name: 'Docker', logo: dockerLogo },
  { name: 'React', logo: reactLogo },
  { name: 'Python', logo: pythonLogo },
  { name: 'MongoDB', logo: mongodbLogo },
];

const TechStack = () => {
  const trackRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Triple the static items for continuous seamless marquee scroll
  const marqueeItems = useMemo(
    () => [...STATIC_TECH_STACK, ...STATIC_TECH_STACK, ...STATIC_TECH_STACK],
    []
  );

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

      const segmentWidth = track.scrollWidth / 3;
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
      {/* Infinite Velocity-Reactive Scrolling Marquee - Authentic Downloaded Brand Logos Only */}
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
                <img
                  src={tech.logo}
                  alt={`${tech.name} logo`}
                  className="TechStack-logoImg"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
