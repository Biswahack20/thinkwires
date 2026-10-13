import React, { useEffect, useState, useRef } from 'react';

const AnimatedValue = ({ target, unit, suffix = '' }) => {
  const [current, setCurrent] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      return target;
    }
    return typeof target === 'number' ? 0 : target;
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const elRef = useRef(null);

  useEffect(() => {
    if (typeof target !== 'number') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1200;
          const steps = 30;
          const stepTime = duration / steps;
          const increment = target / steps;
          let currentStep = 0;

          const timer = setInterval(() => {
            currentStep += 1;
            if (currentStep >= steps) {
              setCurrent(target);
              clearInterval(timer);
            } else {
              setCurrent(Math.floor(increment * currentStep));
            }
          }, stepTime);
        }
      },
      { threshold: 0.25 }
    );

    if (elRef.current) {
      observer.observe(elRef.current);
    }

    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <span ref={elRef} className="StatsStrip-value">
      {current}
      {unit && <span className="StatsStrip-unit">{unit}</span>}
      {suffix && <span className="StatsStrip-unit">{suffix}</span>}
    </span>
  );
};

const StatsStrip = ({ stats = [] }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="StatsStrip-section" aria-label="Key Performance Metrics">
      <div className="StatsStrip-container">
        <div className="StatsStrip-card">
          {stats.map((item, index) => {
            const hasNumeric = typeof item.numericValue === 'number';
            const suffix = item.value && item.value.includes('+') && !item.unit ? '+' : (item.value && item.value.includes('%') && !item.unit ? '%' : '');

            return (
              <div key={item.id || index} className="StatsStrip-item">
                <div className="StatsStrip-topRow">
                  {hasNumeric ? (
                    <AnimatedValue target={item.numericValue} unit={item.unit} suffix={suffix} />
                  ) : (
                    <span className="StatsStrip-value">
                      {item.value}
                      {item.unit && <span className="StatsStrip-unit">{item.unit}</span>}
                    </span>
                  )}

                  {item.indicator === 'dot' && (
                    <span className="StatsStrip-indicatorDot" title="Real-time intake SLA" aria-label="Real-time intake SLA"></span>
                  )}
                  {item.indicator === 'check' && (
                    <span className="StatsStrip-indicatorIcon" title="Verified Time-to-Hire" aria-label="Verified Time-to-Hire">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  )}
                  {item.indicator === 'shield' && (
                    <span className="StatsStrip-indicatorIcon shield" title="100% Statutory Compliance" aria-label="100% Statutory Compliance">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </span>
                  )}
                </div>

                <div className="StatsStrip-label">{item.label}</div>
                <div className="StatsStrip-subLabel">{item.subLabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
