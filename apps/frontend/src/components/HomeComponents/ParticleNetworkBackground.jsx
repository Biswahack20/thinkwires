import React, { useEffect, useRef } from 'react';

/**
 * Premium Interactive Particle-Network Background for Thinkwires Homepage Hero.
 * Matches Thinkwires enterprise branding:
 * - Primary blue: #1551D1
 * - Secondary blue: #2563EB
 * - Light cyan: #38BDF8
 * - Accent green: #22C55E
 *
 * Lightweight, 60-120fps Canvas rendering, DPR-aware, ResizeObserver responsive,
 * prefers-reduced-motion accessible, and zero-overhead tab visibility suspension.
 */

const PALETTE = [
  { r: 21, g: 81, b: 209, weight: 0.45 }, // #1551D1 Primary Blue
  { r: 37, g: 99, b: 235, weight: 0.3 }, // #2563EB Secondary Blue
  { r: 56, g: 189, b: 248, weight: 0.15 }, // #38BDF8 Light Cyan
  { r: 34, g: 197, b: 94, weight: 0.1 }, // #22C55E Accent Green
];

const getRandomColor = () => {
  const rand = Math.random();
  let cumulative = 0;
  for (const c of PALETTE) {
    cumulative += c.weight;
    if (rand <= cumulative) return c;
  }
  return PALETTE[0];
};

const ParticleNetworkBackground = ({ className = '', style = {} }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let animationFrameId = null;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let particles = [];

    // Mouse tracking state (persists across rAF without triggering React re-renders)
    const mouse = {
      x: null,
      y: null,
      targetX: null,
      targetY: null,
      isHovering: false,
    };

    // Accessibility check: prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;

    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        drawStaticFrame();
      } else {
        startAnimation();
      }
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Dynamic particle configuration based on viewport width
    const getParticleConfig = (w, h) => {
      const isMobile = w < 640;
      const isTablet = w >= 640 && w < 1024;

      let count;
      let maxDist;
      let mouseRadius;
      let speedFactor;

      if (isMobile) {
        count = Math.min(32, Math.max(20, Math.floor((w * h) / 18000)));
        maxDist = 95;
        mouseRadius = 90;
        speedFactor = 0.45;
      } else if (isTablet) {
        count = Math.min(52, Math.max(34, Math.floor((w * h) / 16000)));
        maxDist = 115;
        mouseRadius = 115;
        speedFactor = 0.55;
      } else {
        count = Math.min(85, Math.max(50, Math.floor((w * h) / 15000)));
        maxDist = 135;
        mouseRadius = 140;
        speedFactor = 0.65;
      }

      return { count, maxDist, mouseRadius, speedFactor };
    };

    const createParticle = (w, h, speedFactor) => {
      const color = getRandomColor();
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.2 + Math.random() * 0.4) * speedFactor;

      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        radius: 1.2 + Math.random() * 2.0,
        color,
        baseAlpha: 0.35 + Math.random() * 0.4,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.02,
      };
    };

    const initParticles = () => {
      if (width <= 0 || height <= 0) return;
      const { count, speedFactor } = getParticleConfig(width, height);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(width, height, speedFactor));
      }
    };

    const resizeCanvas = () => {
      const rect = parent.getBoundingClientRect();
      const newWidth = Math.floor(rect.width);
      const newHeight = Math.floor(rect.height);

      if (newWidth <= 0 || newHeight <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = newWidth;
      height = newHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      ctx.scale(dpr, dpr);

      initParticles();

      if (prefersReducedMotion) {
        drawStaticFrame();
      }
    };

    // ResizeObserver cleanly monitors container box changes
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(parent);

    // Mouse event handlers attached to parent hero container
    const handlePointerMove = (e) => {
      const rect = parent.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovering = true;
    };

    const handlePointerLeave = () => {
      mouse.isHovering = false;
      mouse.targetX = null;
      mouse.targetY = null;
    };

    parent.addEventListener('pointermove', handlePointerMove, { passive: true });
    parent.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Stop animation when browser tab is inactive to preserve CPU / battery
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !prefersReducedMotion) {
        startAnimation();
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Static frame for reduced motion users
    const drawStaticFrame = () => {
      if (!ctx || width <= 0 || height <= 0) return;
      ctx.clearRect(0, 0, width, height);

      const { maxDist } = getParticleConfig(width, height);
      const maxDistSq = maxDist * maxDist;

      // Draw subtle connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Draw static particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.baseAlpha})`;
        ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.3)`;
        ctx.shadowBlur = 4;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    // Main animation loop
    const render = () => {
      if (!isVisible || prefersReducedMotion) return;

      ctx.clearRect(0, 0, width, height);

      const { maxDist, mouseRadius } = getParticleConfig(width, height);
      const maxDistSq = maxDist * maxDist;
      const mouseRadiusSq = mouseRadius * mouseRadius;

      // Smooth mouse position interpolation (lerp)
      if (mouse.isHovering && mouse.targetX !== null) {
        if (mouse.x === null) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.18;
          mouse.y += (mouse.targetY - mouse.y) * 0.18;
        }
      } else {
        mouse.x = null;
        mouse.y = null;
      }

      // Update particle positions and apply physics
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Pulse alpha
        p.pulse += p.pulseSpeed;

        // Mouse repulsion physics
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDistSq = mdx * mdx + mdy * mdy;

          if (mDistSq < mouseRadiusSq && mDistSq > 0.01) {
            const mDist = Math.sqrt(mDistSq);
            const force = (1 - mDist / mouseRadius) * 1.5;
            p.x += (mdx / mDist) * force;
            p.y += (mdy / mDist) * force;
          }
        }

        // Natural continuous drift
        p.x += p.vx;
        p.y += p.vy;

        // Smooth wrap-around edges with margin
        const margin = 20;
        if (p.x < -margin) p.x = width + margin;
        else if (p.x > width + margin) p.x = -margin;
        if (p.y < -margin) p.y = height + margin;
        else if (p.y > height + margin) p.y = -margin;
      }

      // Draw subtle connecting lines between particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Subtle dynamic connection lines to mouse cursor
      if (mouse.x !== null && mouse.y !== null) {
        const mouseConnectDist = mouseRadius * 0.85;
        const mouseConnectDistSq = mouseConnectDist * mouseConnectDist;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseConnectDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / mouseConnectDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // Draw glowing particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const currentAlpha = Math.max(
          0.15,
          Math.min(0.85, p.baseAlpha + Math.sin(p.pulse) * 0.15)
        );

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha.toFixed(2)})`;
        ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.35)`;
        ctx.shadowBlur = 5;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    const startAnimation = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(render);
    };

    // Initial resize and start
    resizeCanvas();
    if (prefersReducedMotion) {
      drawStaticFrame();
    } else {
      startAnimation();
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      parent.removeEventListener('pointermove', handlePointerMove);
      parent.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`ParticleNetwork-canvas ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        display: 'block',
        ...style,
      }}
      aria-hidden="true"
    />
  );
};

export default ParticleNetworkBackground;
