# Frontend Architecture & Overview

## 1. Overview
ThinkWires is an enterprise talent cloud and global HR tech platform connecting enterprise clients across India, North America, and global hubs with elite technical specialists. The frontend client delivers:
- High-performance marketing and discovery pages (Jobs, Bench, Staff Augmentation, EOR, Payroll).
- Candidate Portal for candidate onboarding, profile management, and interview/placement tracking.
- Admin Panel & CMS for managing candidates, client accounts, live job openings, placements, and website content.

## 2. Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Core Framework** | React 19 (`react`, `react-dom`) | Modern concurrent React features, hooks, and suspense |
| **Build Tool & Bundler** | Vite 8 (`@vitejs/plugin-react`) | Rapid HMR, Rollup production bundling, dynamic code splitting |
| **Routing** | React Router DOM v7 (`react-router-dom`) | Nested routes, route-level code splitting (`React.lazy`), URL search params |
| **State Management** | Redux Toolkit v2 (`@reduxjs/toolkit`, `react-redux`) | Domain slices, async thunks, immutable state updates |
| **Styling & Design System** | Vanilla CSS (`index.css`) | CSS Custom Properties (Tokens), mobile-first and desktop media queries |
| **Motion & Physics** | Framer Motion v14 (`framer-motion`) | Springs, spotlight gradients, micro-interactions |
| **Interactive Visuals** | Three.js (`three`) & Recharts (`recharts`) | 3D animations and metric analytics dashboards |
| **Smooth Scrolling** | Lenis (`lenis`) | Inertial scroll management with prefers-reduced-motion support |
| **Linting & Code Quality** | ESLint 10 (`@eslint/js`, `eslint-plugin-react-hooks`) | Hook rules, syntax validation |

## 3. Architectural Highlights
- **Single Source of Truth for Jobs**: Openings data flows centrally from the backend `/api/openings` through Redux store (`homeSlice.js`).
- **Unified Global Application Layer**: All entry points across the marketing site and candidate portal feed into a single `GlobalJobApplicationForm` component.
- **Stateless Secure Auth**: Authentication relies on standard HTTP cookies containing signed JWTs (`HttpOnly; Secure; SameSite=Lax`). Session persistence is checked upon initial page mount via `GET /api/auth/me`.
