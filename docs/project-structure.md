# Project Structure & Directory Layout

## 1. Directory Tree

```
thinkwires/
├── apps/
│   ├── backend/               # Express.js REST API service & MongoDB models
│   └── frontend/              # React 19 + Vite single page application
│       ├── index.html         # HTML entry point and Google Fonts imports
│       ├── vite.config.js     # Vite configuration with /api reverse proxy
│       ├── package.json       # Frontend scripts and runtime dependencies
│       └── src/
│           ├── main.jsx       # React DOM root render with Redux Provider
│           ├── App.jsx        # Route definitions, route code splitting, session initialization
│           ├── index.css      # Core Design tokens, resets, utility classes, and responsive breakpoints
│           ├── theme.js       # Theme configuration and palette definitions
│           ├── ThemeContext.js# React Context for theme state
│           ├── useTheme.js    # Custom hook consuming ThemeContext
│           │
│           ├── admin/         # Admin Panel & CMS Module (lazy loaded)
│           │   ├── AdminLayout.jsx
│           │   ├── AdminDashboard.jsx
│           │   ├── JobsView.jsx
│           │   ├── CandidatesView.jsx
│           │   ├── ClientsView.jsx
│           │   ├── EmployeesView.jsx
│           │   ├── PlacementsView.jsx
│           │   └── ...
│           │
│           ├── components/    # Reusable UI component modules
│           │   ├── common/    # Universal layout, navigation, modals, and CTA widgets
│           │   │   ├── GlobalJobApplicationForm.jsx  # Primary universal application form
│           │   │   ├── ApplyModal.jsx                # Backward-compatible modal wrapper
│           │   │   ├── Navbar.jsx                    # Header navigation with mobile drawer
│           │   │   ├── Footer.jsx                    # Footer links and enterprise credentials
│           │   │   ├── ProtectedRoute.jsx            # Authentication gate for candidate routes
│           │   │   └── ...
│           │   ├── HomeComponents/  # Hero, Openings, Capabilities, Bench previews
│           │   ├── JobsComponents/  # JobCard, FeaturedPositions, JobSearch, JobSpecModal
│           │   └── AboutComponents/ # GrowthTimeline, Philosophy, Leadership cards
│           │
│           ├── context/       # Cross-cutting React contexts
│           │   ├── JobApplicationModalContext.jsx    # Application modal context provider
│           │   └── useJobApplicationModal.js         # Modal control hook
│           │
│           ├── pages/         # Application page views
│           │   ├── HomePage.jsx
│           │   ├── JobPage.jsx
│           │   ├── AboutPage.jsx
│           │   ├── auth/      # Auth views (LoginPage, RegisterPage, Forgot/Reset)
│           │   └── candidate/ # Protected views (Dashboard, Profile, Applications, Apply)
│           │
│           ├── store/         # Redux Toolkit centralized store
│           │   ├── index.js   # Store configuration and root reducer mapping
│           │   └── slices/    # Domain-specific slices (authSlice, homeSlice, etc.)
│           │
│           └── utils/         # Helper functions, formatters, and redirect helpers
├── docs/                      # Complete technical documentation
```

## 2. Component Boundaries & Rules
1. **Components vs Pages**: Pages (`src/pages/*`) orchestrate data fetching, layout structure, and document titles. Reusable presentation units live in `src/components/*`.
2. **Context Providers**: Global providers wrap `App` at the route root (`JobApplicationModalProvider`, `ThemeProvider`).
3. **No Duplicate Forms**: All job application entry points must invoke `GlobalJobApplicationForm` or route to `/jobs/:jobId/apply`.
