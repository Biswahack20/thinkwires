# 🌐 ThinkWires Frontend Architecture & Documentation (`FrontendDocs.md`)

This document is the definitive guide to the **ThinkWires Frontend Application** (`apps/frontend`). It provides comprehensive architectural, state management, routing, component, and design system documentation engineered for both human developers and autonomous AI agents.

---

## 1. Executive Summary & Tech Stack

The ThinkWires frontend is a high-performance **React 19 Single-Page Application (SPA)** bundled with **Vite**. It provides a unified, responsive interface serving three distinct user cohorts:

1. **Public Visitors & Corporate Clients**: Interactive landing pages, service breakdowns (Staff Augmentation, Permanent Staffing, Payroll, EOR), talent bench browsing, and job board.
2. **Candidates (Job Seekers & Bench Talent)**: Protected portal for profile management, multi-step job applications with resume uploads, and real-time application pipeline tracking.
3. **Admins & Recruiters**: Code-split, enterprise-grade Admin Dashboard and CMS Suite (`/admin`) featuring live metrics, Kanban ATS, Recharts visualizations, and full content management.

### Tech Stack Inventory

| Component              | Library / Technology        | Version                | Purpose                                                           |
| ---------------------- | --------------------------- | ---------------------- | ----------------------------------------------------------------- |
| **Core Framework**     | React                       | `^19.2.8`              | Declarative UI rendering & Concurrent features                    |
| **Build & Bundler**    | Vite                        | `^8.3.0`               | Ultra-fast HMR and optimized Rolldown/ESBuild bundling            |
| **Routing**            | React Router DOM            | `^7.18.4`              | Declarative client-side routing, nested routes, and lazy loading  |
| **State Management**   | Redux Toolkit & React-Redux | `^2.13.0` / `^9.3.0`   | Centralized global application state across 13 domain slices      |
| **Styling Engine**     | Vanilla CSS + Design Tokens | Custom                 | Modular design system with zero CSS-in-JS runtime overhead        |
| **Visuals & 3D**       | Three.js & Framer Motion    | `^0.186.1` / `^14.2.0` | Interactive 3D hero animation and micro-interactions              |
| **Smooth Scrolling**   | Lenis                       | `^1.3.26`              | Momentum-based, buttery smooth document scrolling                 |
| **Data Visualization** | Recharts                    | `^3.10.1`              | Financial analytics, placement quotas, and SLA performance charts |

---

## 2. Directory & File Organization

The frontend codebase is located in [`apps/frontend`](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/apps/frontend):

```
apps/frontend/
├── .env / .env.example       # Vite client environment variables
├── index.html                # Single-page HTML container with Google Fonts
├── vite.config.js            # Vite configuration with /api reverse proxy
├── package.json              # Frontend scripts & dependencies
└── src/
    ├── main.jsx              # React 19 root bootstrap & Redux Provider
    ├── App.jsx               # Route orchestrator & React.lazy code splitting
    ├── index.css             # Global CSS design tokens, typography, and reset
    ├── theme.js              # Token mirror for JavaScript runtime consumers
    ├── ThemeProvider.jsx     # Context provider for light/dark theme switching
    ├── useTheme.js           # Custom hook for theme consumption
    │
    ├── admin/                # Admin Panel & CMS Workspace
    │   ├── admin.css         # Admin design system tokens & layout styling
    │   ├── adminService.js   # Admin REST client with persona/role injection
    │   ├── AdminLayout.jsx   # Topbar, persona switcher, collapsible sidebar
    │   ├── AdminDashboard.jsx# KPI metric cards, Recharts, audit stream
    │   ├── EmployeesView.jsx # Workforce directory & bench tracking
    │   ├── CandidatesView.jsx# ATS Kanban board & candidate evaluation
    │   ├── ClientsView.jsx   # Enterprise partner accounts
    │   ├── JobsView.jsx      # Requisitions & headcount allocation
    │   ├── PlacementsView.jsx# Active billable client assignments
    │   ├── SystemMembersView.jsx # Platform user RBAC management
    │   ├── CmsDashboard.jsx  # CMS workspace launcher & status
    │   ├── PagesManager.jsx  # Website page CMS with live preview modal
    │   ├── BlogManager.jsx   # Article authoring & publishing suite
    │   ├── MediaLibrary.jsx  # Asset library with copyable URLs
    │   ├── SeoManager.jsx    # SERP preview & meta directives
    │   ├── AnnouncementsManager.jsx # Broadcast alerts
    │   └── TechStackManager.jsx     # Skills & technologies manager
    │
    ├── components/           # UI Component Library
    │   ├── common/           # Shared reusable components (Navbar, Footer, ProtectedRoute, etc.)
    │   ├── ThinkWiresAnimation.jsx # Three.js interactive 3D hero canvas
    │   ├── HomeComponents/   # Hero, Stats, Openings, Solutions showcase
    │   ├── BenchComponents/  # Talent cloud filtering, engineer profile cards
    │   ├── JobsComponents/   # Job search, department filters, job cards
    │   ├── BlogComponents/   # Blog grid, featured article, newsletter CTA
    │   ├── CandidatePortalComponents/ # Dashboard widgets, application lists
    │   └── [Service]Components/ # Staff Augmentation, Payroll, EOR, Permanent Staffing
    │
    ├── pages/                # Top-level page views (Public, Auth, Candidate)
    │   ├── HomePage.jsx
    │   ├── AboutPage.jsx
    │   ├── JobPage.jsx
    │   ├── BlogPage.jsx
    │   ├── ContactPage.jsx
    │   ├── BenchPage.jsx
    │   ├── IndustriesPage.jsx
    │   ├── FindTalentPage.jsx
    │   ├── LegalPage.jsx
    │   ├── StaffAugmentationPage.jsx
    │   ├── PermanentStaffingPage.jsx
    │   ├── PayrollPage.jsx
    │   ├── EorPage.jsx
    │   ├── auth/             # LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage
    │   └── candidate/        # CandidateDashboardPage, CandidateProfilePage, JobApplyPage, etc.
    │
    ├── store/                # Redux Toolkit Global State
    │   ├── index.js          # Store configuration & root reducer
    │   └── slices/           # 13 modular Redux domain slices
    │
    ├── context/              # Context API providers & custom hooks
    └── utils/                # Helper utilities (formatting, validators)
```

---

## 3. Routing Architecture & Route Inventory

All routing is centrally declared in [`src/App.jsx`](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/apps/frontend/src/App.jsx) using **React Router DOM v7**.

### Code Splitting Strategy

To minimize the critical initial bundle size, the entire Admin Dashboard and CMS module suite is dynamically loaded using **`React.lazy()`** and wrapped in a top-level `<Suspense>` fallback:

```jsx
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
// ... subsequent admin views
```

### Complete Route Inventory

| Route Path                       | View / Component            | Access Level   | Description                                             |
| -------------------------------- | --------------------------- | -------------- | ------------------------------------------------------- |
| `/`                              | `HomePage`                  | Public         | Main landing page with 3D animation, services, stats    |
| `/about`                         | `AboutPage`                 | Public         | Company philosophy, leadership, and mission             |
| `/industries`                    | `IndustriesPage`            | Public         | Verticals served (FinTech, HealthTech, SaaS, AI/ML)     |
| `/bench` or `/talent-cloud`      | `BenchPage`                 | Public         | Pre-vetted technical talent available for deployment    |
| `/jobs` or `/hot-jobs`           | `JobPage`                   | Public         | Career openings with filters and direct apply links     |
| `/blog`                          | `BlogPage`                  | Public         | Engineering insights, industry research, articles       |
| `/contact`                       | `ContactPage`               | Public         | Enterprise contact form & global office locations       |
| `/find-talent` or `/hire-talent` | `FindTalentPage`            | Public         | Client lead intake for rapid workforce deployment       |
| `/staff-augmentation`            | `StaffAugmentationPage`     | Public         | Dedicated staff augmentation service landing page       |
| `/permanent-staffing`            | `PermanentStaffingPage`     | Public         | Executive search & permanent recruitment page           |
| `/payroll`                       | `PayrollPage`               | Public         | Payroll outsourcing & compliance overview               |
| `/eor`                           | `EorPage`                   | Public         | Employer of Record global hiring solutions              |
| `/privacy`, `/terms`, `/cookies` | `LegalPage`                 | Public         | Legal compliance, cookie policies, and terms of service |
| `/login`                         | `LoginPage`                 | Public / Guest | Candidate sign-in portal                                |
| `/register`                      | `RegisterPage`              | Public / Guest | New candidate profile registration                      |
| `/forgot-password`               | `ForgotPasswordPage`        | Public / Guest | Password reset email requisition                        |
| `/reset-password`                | `ResetPasswordPage`         | Public / Guest | Password change token submission                        |
| `/candidate/dashboard`           | `CandidateDashboardPage`    | Protected      | Candidate overview: active applications & profile score |
| `/candidate/profile`             | `CandidateProfilePage`      | Protected      | Editable candidate profile, skills, and resume link     |
| `/candidate/applications`        | `CandidateApplicationsPage` | Protected      | Application pipeline status & interview schedule        |
| `/jobs/:jobId/apply`             | `JobApplyPage`              | Protected      | Multi-step job application submission with resume       |
| `/admin`                         | `AdminDashboard`            | Admin Layout   | Executive KPIs, revenue charts, and audit stream        |
| `/admin/employees`               | `EmployeesView`             | Admin Layout   | Technical workforce directory (Bench vs Deployed)       |
| `/admin/candidates`              | `CandidatesView`            | Admin Layout   | 6-Stage ATS Kanban Board & candidate intake             |
| `/admin/clients`                 | `ClientsView`               | Admin Layout   | Corporate client account management                     |
| `/admin/jobs`                    | `JobsView`                  | Admin Layout   | Open staffing requisitions & headcount allocation       |
| `/admin/placements`              | `PlacementsView`            | Admin Layout   | Billable client deployments & hourly/monthly rates      |
| `/admin/system-members`          | `SystemMembersView`         | Admin Layout   | Platform team members and RBAC role assignments         |
| `/admin/cms`                     | `CmsDashboard`              | Admin Layout   | CMS overview metrics and module launcher                |
| `/admin/cms/pages`               | `PagesManager`              | Admin Layout   | Website pages CMS with live preview modal               |
| `/admin/cms/blog`                | `BlogManager`               | Admin Layout   | Full article editor, markdown, and authoring            |
| `/admin/cms/media`               | `MediaLibrary`              | Admin Layout   | Asset library with copyable CDN/upload URLs             |
| `/admin/cms/seo`                 | `SeoManager`                | Admin Layout   | Page-by-page SEO meta directives & Google SERP preview  |
| `/admin/cms/announcements`       | `AnnouncementsManager`      | Admin Layout   | Corporate broadcasts & topbar alert notifications       |
| `/admin/cms/tech-stack`          | `TechStackManager`          | Admin Layout   | Manage verified tech stack tags & featured items        |

---

## 4. State Management (Redux Toolkit)

Global state is centralized using **Redux Toolkit (RTK)** in [`src/store/index.js`](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/apps/frontend/src/store/index.js).

```
store/
├── index.js                  # configureStore with all combined reducers
└── slices/
    ├── authSlice.js          # Authentication state, session check, token restore
    ├── candidatePortalSlice.js # Candidate dashboard data, application submissions
    ├── benchSlice.js         # Bench talent directory & filter criteria
    ├── homeSlice.js          # Home page stats, tech stacks, and open jobs
    ├── blogSlice.js          # Blog articles, categories, and active filters
    ├── contactSlice.js       # Contact inquiry form state and submissions
    ├── aboutSlice.js         # About page milestones and team data
    ├── eorSlice.js           # EOR service capabilities & calculators
    ├── findTalentSlice.js    # Client hiring request wizard state
    ├── industriesSlice.js    # Industry verticals & case studies
    ├── payrollSlice.js       # Payroll outsourcing metrics and workflows
    ├── permanentStaffingSlice.js # Permanent recruitment capabilities
    └── staffAugmentationSlice.js # Augmentation models and SLA metrics
```

### Authentication State Flow (`authSlice.js`)

Authentication is decoupled from local storage to prevent XSS exposure; credentials rely on **HttpOnly JWT cookies** set by the Express backend.

1. **Bootstrap Session Check**: On application load, `App.jsx` dispatches `checkAuthSession()`.
2. **Session Verification**: Hits `GET /api/auth/me`. If the cookie is valid, the candidate object is restored into `state.auth.candidate` and `isAuthenticated` becomes `true`.
3. **Protected Guarding**: The `<ProtectedRoute>` component monitors `state.auth`. If unauthenticated and not loading, it seamlessly redirects the user to `/login` with the attempted route in navigation state.
4. **Logout**: Calling `logoutCandidate()` hits `POST /api/auth/logout`, clears the HttpOnly cookie, and resets Redux state to null.

---

## 5. Styling Architecture & Design Tokens

Styling follows a **CSS Custom Properties (Variables)** design token architecture located in [`src/index.css`](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/apps/frontend/src/index.css) and mirrored in [`src/theme.js`](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/apps/frontend/src/theme.js).

### Verified Brand Color Tokens

```css
:root {
  /* Brand Emerald (Primary) */
  --color-primary: #008f68;
  --color-primary-hover: #007a58;
  --color-primary-dark: #006548;
  --color-primary-light: #e6f4f0;

  /* Accent & Action Colors */
  --tw-blue: #3478d4; /* SRE / DevOps / Secondary actions */
  --tw-violet: #8064d8; /* CMS / Editorial / AI Pipeline */
  --color-success: #16a34a; /* Published / Deployed / Active */
  --color-warning: #d97706; /* Bench / Under Review / Pending */
  --color-error: #dc2626; /* Rejected / Destructive actions */

  /* Neutral Surface Palette */
  --color-bg: #ffffff;
  --color-surface: #f8fafc;
  --color-surface-alt: #f1f5f9;
  --color-text: #0f172a; /* Deep slate for high contrast */
  --color-text-muted: #64748b; /* Secondary metadata */
  --color-border: #e2e8f0; /* Crisp container outlines */
}
```

### Theme Engine (`ThemeProvider.jsx` & `useTheme.js`)

- Supports dynamic `light` and `dark` modes by toggling the `data-theme` attribute on `document.documentElement`.
- Theme selection persists across browser refreshes using `localStorage.getItem('tw-theme')` with a fallback to `window.matchMedia('(prefers-color-scheme: dark)')`.

---

## 6. Client API Integration & Reverse Proxy

To prevent cross-origin issues during local development, [`vite.config.js`](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/apps/frontend/vite.config.js) configures a built-in reverse proxy:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

- When the frontend executes `fetch('/api/jobs')` or `axios.get('/api/admin/stats')`, Vite automatically routes the request to port `5000` without triggering browser CORS blocks.
- In production, requests are routed to the Express gateway via Nginx reverse proxy or cloud ingress.

---

## 7. Candidate Application & AI Screening Test Workflow

### Application Form Modes (`GlobalJobApplicationForm.jsx`)
- **Fill from Scratch**: Fresh empty inputs for candidate contact, skills, and portfolio details.
- **Pre-fill from Profile**: Automatically loads verified fields from candidate's logged-in profile.
- **Resume Upload Auto-Fill**:
  - Drag-and-drop or select PDF/DOC resume.
  - Automatically sends file to `/api/candidate/parse-resume`.
  - Parses first name, last name, phone, email, skills, experience, and summary.
  - Form fields populate immediately while remaining **100% editable** by the applicant prior to submission.

### AI Assessment Gatekeeper Modal (`ScreeningAssessmentModal.jsx`)
- Upon submission, the backend triggers the Python FastAPI AI service (`/api/screening/generate-test`) to craft a 10-question evaluation tailored to the job's requirements and candidate skills:
  - 7 Multiple Choice Questions (MCQs)
  - 2 Architectural / Engineering Scenarios
  - 1 Hands-on Practical Task
- Modal features proctored 20-minute countdown timer, question navigator, and real-time grading.
- Score is saved to Candidate Portal and placed on the Active Bench (`/bench`).

---

## 8. Running & Building the Frontend

### Development Mode

```bash
# From workspace root
npm run dev

# Or directly inside the frontend folder
cd apps/frontend
npm run dev
```

- Local URL: **`http://localhost:5173/`**

### Production Build & Preview

```bash
cd apps/frontend
npm run build
npm run preview
```

- Output directory: `apps/frontend/dist/`
- Build time: ~1.4 seconds with minified assets, code-split JS chunks, and extracted CSS.
