# Thinkwires Frontend Architecture and Documentation (FrontendDocs.md)

This document is the definitive guide to the **Thinkwires Frontend Application** (`apps/frontend`). It provides comprehensive architectural, state management, routing, component, and design system documentation engineered for both human developers and autonomous AI agents.

---

## 1. Executive Summary and Tech Stack

The Thinkwires frontend is a high-performance **React 19 Single-Page Application (SPA)** bundled with **Vite**. It provides a unified, responsive interface serving three distinct user cohorts:

1. **Public Visitors and Corporate Clients**: Interactive landing pages, service breakdowns (Staff Augmentation, Permanent Staffing, Payroll, EOR), talent bench browsing, and job board.
2. **Candidates (Job Seekers and Bench Talent)**: Protected portal for profile management, job applications with resume uploads, Terms & Conditions consent, proctored assessments, and application pipeline tracking with withdrawal support.
3. **Admins and Recruiters**: Code-split, enterprise-grade Admin Dashboard and CMS Suite (`/admin`) featuring live metrics, Kanban ATS, Recharts visualizations, synchronized applicant evaluation, and full content management.

### Tech Stack Inventory

| Component                          | Library / Technology               | Version                | Purpose                                                                      |
| ---------------------------------- | ---------------------------------- | ---------------------- | ---------------------------------------------------------------------------- |
| **Core Framework**                 | React                              | `^19.2.8`              | Declarative UI rendering & Concurrent features                               |
| **Build & Bundler**                | Vite                               | `^8.3.0`               | Fast HMR and optimized Rolldown/ESBuild bundling                             |
| **Routing**                        | React Router DOM                   | `^7.18.4`              | Declarative client-side routing, nested routes, and lazy loading             |
| **State Management**               | Redux Toolkit & React-Redux        | `^2.13.0` / `^9.3.0`   | Centralized global application state across 13 domain slices                 |
| **Styling Engine**                 | Vanilla CSS + Design Tokens        | Custom                 | Modular design system with zero CSS-in-JS runtime overhead                   |
| **Visuals & 3D**                   | Three.js & Framer Motion           | `^0.186.1` / `^14.2.0` | Interactive 3D hero animation and micro-interactions                         |
| **Smooth Scrolling**               | Lenis                              | `^1.3.26`              | Momentum-based document scrolling                                            |
| **Data Visualization**             | Recharts                           | `^3.10.1`              | Financial analytics, placement quotas, and SLA performance charts            |
| **Unit & Integration Test Runner** | Vitest                             | `^5.0.5`               | High-speed ESM native test runner integrated with Vite                       |
| **DOM Testing & User Interaction** | React Testing Library & user-event | `^16.3.3` / `^14.6.8`  | User-centric DOM rendering, query, and realistic browser event simulation    |
| **DOM Simulation Environment**     | jsdom                              | `^29.1.1`              | Headless browser DOM environment for Node.js test execution                  |
| **API Network Mocking**            | MSW (Mock Service Worker)          | `^2.12.9`              | Declarative HTTP request interception for backend-agnostic integration tests |
| **End-to-End (E2E) Automation**    | Playwright                         | `^1.58.2`              | Multi-browser (Chromium, Mobile) headless/headed user journey testing        |
| **Automated Accessibility Engine** | Axe-core Playwright                | `^4.11.1`              | Automated WCAG 2.1 A/AA accessibility scanning and compliance validation     |

---

## 2. Directory and File Organization

The frontend codebase is located in `apps/frontend`:

```
apps/frontend/
├── .env / .env.example       # Vite client environment variables
├── index.html                # Single-page HTML container with Google Fonts
├── vite.config.js            # Vite configuration with /api reverse proxy
├── vitest.config.js          # Vitest configuration with jsdom, coverage, and setupFiles
├── playwright.config.js      # Playwright multi-browser & mobile viewport configuration
├── package.json              # Frontend scripts & dependencies
└── src/
    ├── main.jsx              # React 19 root bootstrap & Redux Provider
    ├── App.jsx               # Route orchestrator & React.lazy code splitting
    ├── index.css             # Global CSS design tokens, ApplyModal styles, and layout utilities
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
    │   ├── CandidatesView.jsx# ATS Kanban board, ATS fit scoring & candidate evaluation
    │   ├── ClientsView.jsx   # Enterprise partner accounts
    │   ├── JobsView.jsx      # Requisitions & headcount allocation
    │   ├── PlacementsView.jsx# Active billable client assignments
    │   ├── SystemMembersView.jsx # Platform user RBAC management
    │   ├── CmsDashboard.jsx  # CMS workspace launcher & status
    │   ├── PagesManager.jsx  # Website page CMS with live preview modal
    │   ├── BlogManager.jsx   # Article authoring & publishing suite
    │   ├── MediaLibrary.jsx  # Asset library with copyable URLs
    │   ├── SeoManager.jsx    # SERP preview & meta directives
    │   └── AnnouncementsManager.jsx # Broadcast alerts
    │
    ├── components/           # UI Component Library
    │   ├── common/           # Shared reusable components (GlobalJobApplicationForm, ApplyModal, Navbar, Footer)
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
    │   ├── LegalPage.jsx     # Unified terms, privacy, security, and cookie policies
    │   ├── StaffAugmentationPage.jsx
    │   ├── PermanentStaffingPage.jsx
    │   ├── PayrollPage.jsx
    │   ├── EorPage.jsx
    │   ├── auth/             # LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage
    │   └── candidate/        # CandidateDashboardPage, CandidateProfilePage, JobApplyPage, CandidateApplicationsPage
    │
    ├── store/                # Redux Toolkit Global State
    │   ├── index.js          # Store configuration & root reducer
    │   └── slices/           # 13 modular Redux domain slices
    │
    ├── test/                 # Centralized Frontend Automation Test Suite
    │   ├── unit/             # Redux slice state transitions & security utility tests
    │   ├── components/       # UI component & custom hook tests (ProtectedRoute, ThemeProvider, Badges)
    │   ├── integration/      # Multi-component user workflows with MSW (CandidateApplicationsPage)
    │   ├── e2e/              # Playwright End-to-End tests (Smoke, a11y, Adversarial Security)
    │   ├── mocks/            # MSW mock handlers & Node test server
    │   ├── setup.js          # Global test environment, Three.js canvas mocks, and MSW lifecycle listeners
    │   └── test-utils.jsx    # Custom renderWithProviders helper (Redux + Router + ThemeProvider + userEvent)
    │
    ├── context/              # Context API providers & custom hooks
    └── utils/                # Helper utilities (formatting, validators, redirect security)
```

---

## 3. Routing Architecture and Route Inventory

All routing is centrally declared in `src/App.jsx` using **React Router DOM v7**.

### Code Splitting Strategy

To minimize the critical initial bundle size, the entire Admin Dashboard and CMS module suite is dynamically loaded using **`React.lazy()`** and wrapped in a top-level `<Suspense>` fallback:

```jsx
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
```

### Complete Route Inventory

| Route Path                                                   | View / Component            | Access Level   | Description                                                   |
| ------------------------------------------------------------ | --------------------------- | -------------- | ------------------------------------------------------------- |
| `/`                                                          | `HomePage`                  | Public         | Main landing page with 3D animation, services, stats          |
| `/about`                                                     | `AboutPage`                 | Public         | Company philosophy, leadership, and mission                   |
| `/industries`                                                | `IndustriesPage`            | Public         | Verticals served (FinTech, HealthTech, SaaS, AI/ML)           |
| `/bench` or `/talent-cloud`                                  | `BenchPage`                 | Public         | Pre-vetted technical talent available for deployment          |
| `/jobs` or `/hot-jobs`                                       | `JobPage`                   | Public         | Career openings with filters and direct apply links           |
| `/blog`                                                      | `BlogPage`                  | Public         | Engineering insights, industry research, articles             |
| `/contact`                                                   | `ContactPage`               | Public         | Enterprise contact form & global office locations             |
| `/find-talent` or `/hire-talent`                             | `FindTalentPage`            | Public         | Client lead intake for rapid workforce deployment             |
| `/staff-augmentation`                                        | `StaffAugmentationPage`     | Public         | Dedicated staff augmentation service landing page             |
| `/permanent-staffing`                                        | `PermanentStaffingPage`     | Public         | Executive search & permanent recruitment page                 |
| `/payroll`                                                   | `PayrollPage`               | Public         | Payroll outsourcing & compliance overview                     |
| `/eor`                                                       | `EorPage`                   | Public         | Employer of Record global hiring solutions                    |
| `/privacy`, `/terms`, `/terms-of-service`, `/privacy-policy` | `LegalPage`                 | Public         | Legal compliance, cookie policies, and terms of service       |
| `/login`                                                     | `LoginPage`                 | Public / Guest | Candidate sign-in portal                                      |
| `/register`                                                  | `RegisterPage`              | Public / Guest | New candidate profile registration                            |
| `/forgot-password`                                           | `ForgotPasswordPage`        | Public / Guest | Password reset email requisition                              |
| `/reset-password`                                            | `ResetPasswordPage`         | Public / Guest | Password change token submission                              |
| `/candidate/dashboard`                                       | `CandidateDashboardPage`    | Protected      | Candidate overview: active applications & profile score       |
| `/candidate/profile`                                         | `CandidateProfilePage`      | Protected      | Editable candidate profile, skills, and resume link           |
| `/candidate/applications`                                    | `CandidateApplicationsPage` | Protected      | Application pipeline status, test results & withdrawal action |
| `/jobs/:jobId/apply`                                         | `JobApplyPage`              | Protected      | Multi-step job application submission with resume             |
| `/admin`                                                     | `AdminDashboard`            | Admin Layout   | Executive KPIs, revenue charts, and audit stream              |
| `/admin/employees`                                           | `EmployeesView`             | Admin Layout   | Technical workforce directory (Bench vs Deployed)             |
| `/admin/candidates`                                          | `CandidatesView`            | Admin Layout   | Candidate pipeline view, ATS scores & synchronized intake     |
| `/admin/clients`                                             | `ClientsView`               | Admin Layout   | Corporate client account management                           |
| `/admin/jobs`                                                | `JobsView`                  | Admin Layout   | Open staffing requisitions & headcount allocation             |
| `/admin/placements`                                          | `PlacementsView`            | Admin Layout   | Billable client deployments & hourly/monthly rates            |
| `/admin/system-members`                                      | `SystemMembersView`         | Admin Layout   | Platform team members and RBAC role assignments               |
| `/admin/cms`                                                 | `CmsDashboard`              | Admin Layout   | CMS overview metrics and module launcher                      |
| `/admin/cms/pages`                                           | `PagesManager`              | Admin Layout   | Website pages CMS with live preview modal                     |
| `/admin/cms/blog`                                            | `BlogManager`               | Admin Layout   | Full article editor, markdown, and authoring                  |
| `/admin/cms/media`                                           | `MediaLibrary`              | Admin Layout   | Asset library with copyable CDN/upload URLs                   |
| `/admin/cms/seo`                                             | `SeoManager`                | Admin Layout   | Page-by-page SEO meta directives & Google SERP preview        |
| `/admin/cms/announcements`                                   | `AnnouncementsManager`      | Admin Layout   | Corporate broadcasts & topbar alert notifications             |

---

## 4. State Management (Redux Toolkit)

Global state is centralized using **Redux Toolkit (RTK)** in `src/store/index.js`.

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

Authentication relies on **HttpOnly JWT cookies** set by the Express backend:

1. **Bootstrap Session Check**: On application load, `App.jsx` dispatches `checkAuthSession()`.
2. **Session Verification**: Hits `GET /api/auth/me`. If valid, the candidate object is restored into `state.auth.candidate` and `isAuthenticated` becomes `true`.
3. **Protected Guarding**: The `<ProtectedRoute>` component monitors `state.auth`. If unauthenticated, it seamlessly redirects the user to `/login` with the attempted route in navigation state.
4. **Logout**: Calling `logoutCandidate()` hits `POST /api/auth/logout`, clears the HttpOnly cookie, and resets Redux state.

---

## 5. Styling Architecture and Design Tokens

Styling follows a **CSS Custom Properties (Variables)** design token architecture located in `src/index.css` and mirrored in `src/theme.js`.

### Verified Brand Color Tokens

```css
:root {
  /* Brand Primary */
  --color-primary: #008f68;
  --color-primary-hover: #007a58;
  --color-primary-dark: #006548;
  --color-primary-light: #e6f4f0;

  /* Accent & Action Colors */
  --tw-blue: #3478d4;
  --tw-violet: #8064d8;
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-error: #dc2626;

  /* Neutral Surface Palette */
  --color-bg: #ffffff;
  --color-surface: #f8fafc;
  --color-surface-alt: #f1f5f9;
  --color-text: #0f172a;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;
}
```

---

## 6. Client API Integration and Reverse Proxy

During local development, `vite.config.js` configures a reverse proxy:

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

---

## 7. Candidate Application & AI Screening Test Workflow

### Application Form Features (`GlobalJobApplicationForm.jsx`)

1. **Strict Candidate Authentication**: Only authenticated candidates can apply; guest users are directed to log in or create an account with a return redirect.
2. **Pre-fill Options**:
   - **Pre-fill from Profile**: Automatically loads verified fields from the logged-in candidate profile.
   - **Resume Upload Auto-Fill**: Sends uploaded document to `/api/candidate/parse-resume` to extract name, phone, email, skills, experience, summary, and links (LinkedIn, GitHub, portfolio).
   - **Clear Form**: Resets inputs to fill from scratch.
3. **Mandatory Terms & Conditions Agreement**:
   - Includes an explicit agreement checkbox for the **Terms & Conditions** (`/terms-of-service`) and **Privacy Policy** (`/privacy-policy`).
   - Links open in new browser tabs (`target="_blank" rel="noopener noreferrer"`) so candidates do not lose form state.
   - Client and server validation prevent submission without agreement.
4. **AI Assessment Gatekeeper Modal (`ScreeningAssessmentModal.jsx`)**:
   - Automatically generates a 10-question evaluation tailored to the job requirements (7 MCQs, 2 Scenarios, 1 Practical coding task).
   - Includes a 20-minute timer and real-time grading submission.

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

Local URL: `http://localhost:5173/`

### Production Build & Preview

```bash
cd apps/frontend
npm run build
npm run preview
```

Output directory: `apps/frontend/dist/`

---

## 9. Automation Testing Architecture & Quality Assurance

Thinkwires frontend features a comprehensive, 5-tier automated testing architecture powered by **Vitest**, **React Testing Library**, **Mock Service Worker (MSW)**, and **Playwright**.

### 9.1. The 5-Tier Testing Taxonomy

All test files are organized in `apps/frontend/src/test/`:

| Test Tier                     | Directory                  | Scope & Highlights                                                                                                 | Test Files                                                                                                                                            |
| :---------------------------- | :------------------------- | :----------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Unit Testing**           | `src/test/unit/`           | Pure logic, Redux slice reducers, security utilities, and isolated components.                                     | `authSlice.test.js`, `redirectUtil.test.js`, `AnimatedCounter.test.jsx`, `SectionBadge.test.jsx`, `ThemeProvider.test.jsx`, `ProtectedRoute.test.jsx` |
| **2. Integration Testing**    | `src/test/integration/`    | React views integrated with Redux and MSW network request interception.                                            | `LoginPage.test.jsx`, `CandidateApplicationsPage.test.jsx`                                                                                            |
| **3. Functional Testing**     | `src/test/functional/`     | Multi-step candidate lifecycle flows (Login -> View Applications -> Withdraw Application).                         | `candidate-journey.functional.test.jsx`                                                                                                               |
| **4. Non-Functional Testing** | `src/test/non-functional/` | Mount latency SLAs (<50ms), rapid mount/unmount memory stability, accessible roles, form input semantics.          | `performance.test.jsx`, `accessibility.test.jsx`                                                                                                      |
| **5. Exploratory & Chaos**    | `src/test/exploratory/`    | Rapid button click storms, extreme input fuzzing (script tags/XSS), empty and corrupted API payload resilience.    | `ui-chaos-fuzzing.test.jsx`                                                                                                                           |
| **Browser E2E Suite**         | `src/test/e2e/`            | Playwright real-browser cross-device tests (Chromium, Mobile Chrome), navigation, and Axe-core WCAG 2.1 AA audits. | `public-smoke.spec.js`, `accessibility.spec.js`, `security-adversarial.spec.js`                                                                       |

### 9.2. Test Helper Infrastructure

- **`renderWithProviders(ui, options)`** ([src/test/test-utils.jsx](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/frontend/src/test/test-utils.jsx)): Wraps tested components in an isolated Redux store, the application's `ThemeProvider`, and a React Router `MemoryRouter`. Returns initialized `userEvent` alongside standard Testing Library utilities.
- **Global Environment Mocks** ([src/test/setup.js](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/frontend/src/test/setup.js)): Provides polyfills and mocks for `window.matchMedia`, `ResizeObserver`, `IntersectionObserver`, `scrollTo`, and `HTMLCanvasElement.getContext` (preventing DOM crashes from Three.js 3D canvas rendering).
- **MSW Lifecycle Hooks**: Automatically intercepts network requests during integration testing, resets handlers after each test, and closes cleanly after execution.

### 9.3. Test Execution Commands

```bash
# Workspace-Wide Testing (Turborepo executes all packages in parallel)
npm test                                       # Runs Unit, Component, and MSW Integration tests (154 total tests)
npm run test:e2e                               # Runs Playwright E2E suites across Desktop & Mobile

# Frontend Package Direct Commands (All 5 Tiers)
npm --prefix apps/frontend test                # Single execution of all Vitest suites (50 tests)
npm --prefix apps/frontend run test:watch      # Interactive TDD watch mode with instant HMR
npm --prefix apps/frontend run test:coverage   # V8 code coverage report generation
npm --prefix apps/frontend run test:unit       # Run Unit tests (30 tests)
npm --prefix apps/frontend run test:integration# Run Integration tests (10 tests)
npm --prefix apps/frontend run test:functional # Run Functional tests (1 test)
npm --prefix apps/frontend run test:non-functional # Run Performance & Accessibility tests (5 tests)
npm --prefix apps/frontend run test:exploratory# Run UI Chaos & Fuzzing tests (4 tests)

# Playwright Browser E2E Commands
npm --prefix apps/frontend run test:e2e        # Run Playwright E2E tests headless
npm --prefix apps/frontend run test:e2e:ui     # Interactive Playwright Test Runner UI
npm --prefix apps/frontend run test:e2e:headed # Run Playwright tests with visible browser window
```
