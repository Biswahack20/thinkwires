import React, { useEffect, useState, useRef } from 'react';

/**
 * AnimatedCounter
 * Kinetic telemetry counter that smoothly animates numbers up to their target
 * when they enter the viewport using high-precision easing.
 */
const AnimatedCounter = ({
  value = 0,
  duration = 1800,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  // Extract pure numeric target and auto-resolve suffix if not explicitly given
  const stringVal = String(value ?? 0);
  const numericTarget = typeof value === 'number'
    ? value
    : parseFloat(stringVal.replace(/[^0-9.-]+/g, '')) || 0;

  const resolvedSuffix = suffix || stringVal.replace(/^[^\d]*[\d,.]+/, '').trim();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const startAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const startTime = performance.now();
      const startVal = 0;
      const endVal = numericTarget;

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Quintic ease-out for a snappy start and luxurious deceleration
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const current = startVal + (endVal - startVal) * easeOut;

        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayValue(endVal);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          startAnimation();
          observer.unobserve(element);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [numericTarget, duration]);

  const formattedNumber = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toLocaleString();

  return (
    <span ref={elementRef} className={`tw-kinetic-counter ${className}`}>
      {prefix}
      {formattedNumber}
      {resolvedSuffix}
    </span>
  );
};

export default AnimatedCounter;
