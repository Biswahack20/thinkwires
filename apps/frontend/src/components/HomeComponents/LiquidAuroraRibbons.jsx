import React from 'react';

/**
 * Premium Liquid Aurora + 3D Glass Ribbons Background for Thinkwires Homepage Hero.
 *
 * Combines:
 * A. Liquid Aurora: Volumetric fluid moving gradients (Royal Blue #1551D1,
 *    Cobalt #2563EB, Cyan #38BDF8, Lavender #A5B4FC, subtle Green #22C55E).
 * B. 3D Glass Ribbons: Translucent flowing glass surfaces with specular highlights,
 *    caustic optical glows, and dimensional depth.
 *
 * Absolutely NO particle effects, dots, networks, or connecting lines.
 */
const LiquidAuroraRibbons = () => {
  return (
    <div className="tw-liquid-aurora-root" aria-hidden="true">
      {/* ------------------------------------------------------------------
          A. Liquid Aurora Layer (Fluid Volumetric Gradient Formations)
          ------------------------------------------------------------------ */}
      <div className="tw-aurora-mesh-container">
        {/* Primary Cobalt / Royal Blue Swell */}
        <div className="tw-aurora-blob-primary" />

        {/* Cyan & Lavender Light Stream */}
        <div className="tw-aurora-blob-cyan" />

        {/* Subtle Emerald / Spring Green Accent */}
        <div className="tw-aurora-blob-green" />

        {/* Soft Lavender Veil behind Left Column Headline */}
        <div className="tw-aurora-blob-lavender" />
      </div>

      {/* ------------------------------------------------------------------
          B. 3D Glass Ribbons Layer (Translucent Vector Geometry)
          ------------------------------------------------------------------ */}
      <div className="tw-glass-ribbons-svg-wrap">
        <svg
          className="tw-glass-ribbon-svg"
          viewBox="0 0 1440 850"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Ribbon 1: Primary Translucent Cyan/Cobalt/Lavender Glass */}
            <linearGradient
              id="twGlassRibbonGrad1"
              x1="920"
              y1="0"
              x2="1360"
              y2="780"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.32" />
              <stop offset="28%" stopColor="#2563EB" stopOpacity="0.24" />
              <stop offset="65%" stopColor="#A5B4FC" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1551D1" stopOpacity="0.12" />
            </linearGradient>

            {/* Ribbon 1: Specular Rim Light */}
            <linearGradient
              id="twSpecularEdgeGrad1"
              x1="930"
              y1="-20"
              x2="1340"
              y2="800"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="22%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="42%" stopColor="#38BDF8" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#A5B4FC" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Ribbon 2: Secondary Interlaced Cyan/Emerald Glass */}
            <linearGradient
              id="twGlassRibbonGrad2"
              x1="1380"
              y1="100"
              x2="960"
              y2="780"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.26" />
              <stop offset="38%" stopColor="#22C55E" stopOpacity="0.15" />
              <stop offset="72%" stopColor="#2563EB" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#A5B4FC" stopOpacity="0.1" />
            </linearGradient>

            {/* Ribbon 2: Specular Rim Light */}
            <linearGradient
              id="twSpecularEdgeGrad2"
              x1="1360"
              y1="80"
              x2="970"
              y2="820"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="30%" stopColor="#38BDF8" stopOpacity="0.7" />
              <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.88" />
              <stop offset="82%" stopColor="#22C55E" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Ribbon 3: Deep Ambient Glass Veil */}
            <linearGradient
              id="twGlassRibbonGrad3"
              x1="800"
              y1="80"
              x2="1280"
              y2="760"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.08" />
            </linearGradient>

            {/* Depth of field blur for Ribbon 3 */}
            <filter
              id="twGlassDepthBlur"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="5.5" />
            </filter>
          </defs>

          {/* Ribbon 3 (Deep Layer - Soft Depth Blur) */}
          <g filter="url(#twGlassDepthBlur)" opacity="0.8">
            <path
              d="M 820 60 C 1040 160, 1240 320, 1280 540 C 1310 700, 1180 810, 860 860 L 835 825 C 1140 775, 1255 675, 1225 530 C 1185 330, 1005 180, 795 90 Z"
              fill="url(#twGlassRibbonGrad3)"
            />
          </g>

          {/* Ribbon 2 (Secondary Interlaced Flowing Glass) */}
          <g className="tw-glass-group-secondary">
            {/* Main glass ribbon body */}
            <path
              d="M 1390 80 C 1160 180, 1010 320, 990 490 C 970 660, 1060 730, 1160 820 L 1120 845 C 1015 745, 930 655, 950 480 C 970 300, 1120 160, 1350 60 Z"
              fill="url(#twGlassRibbonGrad2)"
            />

            {/* Specular crest rim highlight */}
            <path
              d="M 1385 78 C 1158 178, 1008 318, 988 488 C 968 658, 1058 728, 1158 818"
              stroke="url(#twSpecularEdgeGrad2)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Internal light refraction streak */}
            <path
              d="M 1320 110 C 1130 210, 1015 340, 995 495 C 980 620, 1050 710, 1110 780"
              stroke="#FFFFFF"
              strokeWidth="1"
              strokeOpacity="0.4"
              strokeDasharray="140 50"
              strokeLinecap="round"
            />
          </g>

          {/* Ribbon 1 (Primary Foreground Glass Ribbon) */}
          <g className="tw-glass-group-primary">
            {/* Main glass ribbon body */}
            <path
              d="M 920 -40 C 1140 80, 1340 240, 1370 430 C 1400 620, 1260 720, 960 790 L 935 830 C 1285 770, 1435 640, 1405 420 C 1375 200, 1175 40, 955 -40 Z"
              fill="url(#twGlassRibbonGrad1)"
            />

            {/* Specular crest rim highlight */}
            <path
              d="M 925 -38 C 1143 82, 1343 242, 1373 428 C 1403 618, 1263 718, 963 788"
              stroke="url(#twSpecularEdgeGrad1)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Fine secondary crystalline edge reflection */}
            <path
              d="M 960 -36 C 1178 44, 1378 204, 1408 424 C 1438 644, 1288 774, 938 834"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeOpacity="0.35"
              strokeDasharray="180 70"
            />

            {/* Internal glass illumination streak */}
            <path
              d="M 980 20 C 1170 140, 1320 280, 1350 440 C 1370 560, 1280 670, 1020 750"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeOpacity="0.45"
              strokeDasharray="120 40"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* Optical Caustic Glow Flares */}
        <div className="tw-glass-caustic-flare tw-glass-caustic-1" />
        <div className="tw-glass-caustic-flare tw-glass-caustic-2" />
      </div>

      {/* Soft Bottom Light Diffusion Bed */}
      <div className="tw-aurora-bottom-diffusion" />
    </div>
  );
};

export default LiquidAuroraRibbons;

