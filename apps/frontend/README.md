# ThinkWires Frontend

[![React](https://img.shields.io/badge/React-19.x-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vite.dev/)
[![Vanilla CSS](https://img.shields.io/badge/Styling-Vanilla%20CSS%20%2B%20CSS%20Variables-1572B6.svg?style=flat&logo=css3&logoColor=white)](<>)
[![ESLint](https://img.shields.io/badge/Linting-ESLint%2010.x-4B32C3.svg?style=flat&logo=eslint&logoColor=white)](https://eslint.org/)
[![Plus Jakarta Sans](https://img.shields.io/badge/Font-Plus%20Jakarta%20Sans-orange.svg?style=flat&logo=google-fonts)](<>)

The **ThinkWire Frontend** is the public-facing React 19 Single-Page Application (SPA) for the ThinkWire Staffing and Solutions platform. It serves as the primary interface for candidates, corporate clients, and internal admins, consuming the Express.js Backend API Gateway.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Folder Structure](#2-folder-structure)
3. [State Management & Data Flow](#3-state-management--data-flow)
4. [Styling Architecture & Design System](#4-styling-architecture--design-system)
   - [CSS Custom Properties (Tokens)](#css-custom-properties-tokens)
   - [Dark Mode / Theming](#dark-mode--theming)
   - [Component Class Reference](#component-class-reference)
5. [Key Components & Hooks Documentation](#5-key-components--hooks-documentation)
   - [ThemeProvider](#themeprovider)
   - [useTheme Hook](#usetheme-hook)
   - [App (Design System Showcase)](#app-design-system-showcase)
6. [Quickstart Setup Guide](#6-quickstart-setup-guide)
   - [Prerequisites](#prerequisites)
   - [1. Install Dependencies](#1-install-dependencies)
   - [2. Configure Environment Variables](#2-configure-environment-variables-env)
   - [3. Run the Development Server](#3-run-the-development-server)
   - [4. Build for Production](#4-build-for-production)
   - [5. Preview the Production Build](#5-preview-the-production-build)
   - [6. Run Linting](#6-run-linting)
7. [Environment Variables Reference](#7-environment-variables-reference)
8. [API Integration Pattern](#8-api-integration-pattern)
9. [Testing Guide](#9-testing-guide)
10. [Contribution Guidelines](#10-contribution-guidelines)
    - [Coding Standards](#coding-standards)
    - [CSS & Styling Rules](#css--styling-rules)
    - [Git Branching Strategy](#git-branching-strategy)
    - [Conventional Commit Format](#conventional-commit-format)

---

## 1. Architecture Overview

The Frontend operates as a **decoupled SPA** within the ThinkWire monorepo. It has zero knowledge of the database or AI layer — it communicates exclusively with the Backend API Gateway via standard REST HTTP calls.

```
+-----------------------------------------------------------------------------------+
|                      React 19 + Vite Frontend (Port 5173)                         |
|                                                                                    |
|  ┌─────────────┐  ┌──────────────────┐  ┌────────────────────────────────────┐   |
|  │  ThemeProvider│  │   App / Pages     │  │  Component Library (CSS Classes)   │   |
|  │  (dark mode) │  │  (routing logic)  │  │  .btn, .card, .chip, .input, …    │   |
|  └─────────────┘  └──────────────────┘  └────────────────────────────────────┘   |
|                                │                                                   |
|                    VITE_API_URL environment variable                               |
|                                │                                                   |
+--------------------------------│--------------------------------------------------+
                                 │   (HTTP / REST)
                                 ▼
            +────────────────────────────────────────+
            │  Express.js API Gateway  (Port 5000)    │
            │  (Authentication, Jobs, Candidates …)   │
            +────────────────────────────────────────+
```

### Why this architecture?

- **Decoupled**: The frontend can be developed and tested independently of the backend using mock fixtures (`VITE_ENABLE_MOCK_API=true`).
- **Zero Build-Time Backend Dependency**: Vite bundles the frontend as static HTML/CSS/JS. The backend URL is injected at runtime via the `VITE_API_URL` environment variable.
- **Containerized for Production**: The `Dockerfile` builds the Vite bundle and serves it via Nginx.

---

## 2. Folder Structure

```
apps/frontend/
├── .env.example             # Documented environment variable template
├── .gitignore               # Git exclusion rules (node_modules, dist, .env)
├── Dockerfile               # Multi-stage production container (Vite build → Nginx)
├── eslint.config.js         # ESLint flat config with React hooks and refresh rules
├── index.html               # HTML entry point with meta tags and Google Fonts
├── nginx.conf               # Nginx SPA config for production container routing
├── package.json             # Dependencies and npm scripts
├── README.md                # This file
├── vite.config.js           # Vite build configuration
└── src/
    ├── main.jsx             # Application bootstrap — mounts React root into #root
    ├── App.jsx              # Root application component and Design System Showcase
    ├── App.css              # Component-specific styles for App.jsx sections
    ├── index.css            # Global design system: CSS variables, tokens, utilities
    ├── theme.js             # Design tokens mirrored as a JS object (for programmatic use)
    ├── ThemeContext.js      # React Context object for theme state (Fast Refresh compatible)
    ├── ThemeProvider.jsx    # Context provider for light/dark mode state management
    ├── useTheme.js          # React hook to read and toggle the active theme
    └── assets/              # Static assets (SVG icons, images, fonts)
```

### What goes where?

| Location                | Purpose                                                                                                                                                       |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/main.jsx`          | **Entry point only** — mounts `<App />` inside `<ThemeProvider>`. No logic here.                                                                              |
| `src/App.jsx`           | **Root component** — starter showcase with state counter and theme toggle. Will be refactored into routing as pages are built.                                |
| `src/index.css`         | **Global stylesheet** — all CSS custom properties (tokens), resets, typography utilities, and component base classes. **This is the primary styling source.** |
| `src/App.css`           | **Page-scoped styles** — layout and animation styles specific to `App.jsx` sections. Do not add component base styles here.                                   |
| `src/theme.js`          | **JS token mirror** — programmatic access to design tokens. Use for canvas, dynamic inline styles, Storybook, or unit test assertions.                        |
| `src/ThemeContext.js`   | **Context definition** — isolated `createContext(null)` instance for React Fast Refresh compatibility.                                                        |
| `src/ThemeProvider.jsx` | **Theme state owner** — reads OS preference, persists to `localStorage`, injects `data-theme` attribute on `<html>`.                                          |
| `src/useTheme.js`       | **Theme consumer hook** — any component needing the current theme or toggle function imports this.                                                            |
| `src/assets/`           | **Static files** — SVGs, images. Import directly: `import logo from './assets/logo.svg'`.                                                                     |

> **Upcoming directories** (as the app grows):
>
> - `src/components/` — Reusable UI components (Button, Card, Modal, etc.)
> - `src/pages/` — Route-level page components (JobBoard, Dashboard, CandidateProfile, etc.)
> - `src/hooks/` — Custom React hooks (useApi, useAuth, usePagination, etc.)
> - `src/services/` — API client functions wrapping `fetch`/`axios` calls
> - `src/store/` — Redux Toolkit slices and RTK Query API definitions
> - `src/utils/` — Pure utility functions (formatDate, formatCurrency, etc.)
> - `src/__tests__/` — Vitest unit and component tests

---

## 3. State Management & Data Flow

### Current State (Design System Phase)

The app currently uses **React Context API** for the single shared state: the active color theme (`light`/`dark`).

| State                           | Owner           | Consumer Hook |
| :------------------------------ | :-------------- | :------------ |
| `theme` (`'light'` \| `'dark'`) | `ThemeProvider` | `useTheme()`  |
| `toggleTheme` (function)        | `ThemeProvider` | `useTheme()`  |

### Planned State Architecture (Feature Development Phase)

As the application grows toward the full PRD specification, state management will expand using **Redux Toolkit (RTK) + RTK Query**:

```
src/store/
├── index.js              # Redux store configuration
├── auth/
│   └── authSlice.js      # User session, JWT tokens, RBAC role
├── jobs/
│   └── jobsApi.js        # RTK Query — fetches job listings with pagination
├── candidates/
│   └── candidatesApi.js  # RTK Query — candidate search and filtering
└── featureFlags/
    └── flagsSlice.js     # Redis-backed feature toggles from Admin API
```

**Data flow pattern:**

1. Components dispatch RTK Query hooks (e.g., `useGetJobsQuery({ page, limit })`).
2. RTK Query sends authenticated `fetch` requests to `VITE_API_URL/api/v1/...`.
3. JWT Bearer token is injected via a `prepareHeaders` middleware in the API base query.
4. Responses are cached in the Redux store and served from cache on subsequent renders.

---

## 4. Styling Architecture & Design System

ThinkWire uses **Vanilla CSS with CSS Custom Properties** — no utility-first framework is required. The design system is fully self-contained in `src/index.css`.

### CSS Custom Properties (Tokens)

All design tokens are defined as CSS variables on `:root`:

```css
/* index.css */
:root {
  --color-primary: #0037b0;
  --color-emerald-accent: #22c55e;
  --font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  --space-md: 1rem;
  --rounded-lg: 1rem;
  --elevation-2: 0 12px 24px -6px rgba(15, 23, 42, 0.08);
  /* ... all other tokens */
}
```

Use CSS variables in component styles:

```css
/* ✅ Correct */
.my-button {
  background-color: var(--color-primary);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--rounded-full);
}

/* ❌ Avoid hardcoded values */
.my-button {
  background-color: #0037b0; /* Don't hardcode */
  padding: 8px 24px; /* Don't hardcode */
}
```

### Dark Mode / Theming

Dark mode is implemented using a **CSS attribute selector override pattern**. No JavaScript re-theming is needed — switching themes only updates the `data-theme` attribute on `<html>`:

```css
/* index.css */
:root {
  --color-surface: #faf8ff;
} /* Light mode default */
[data-theme='dark'] {
  --color-surface: #1a1b27;
} /* Dark mode override */
```

**ThemeProvider** sets this attribute automatically. All components automatically adapt — just use `var(--color-surface)` and it resolves to the correct value for the active mode.

### Component Class Reference

Pre-built component classes available for use in any JSX:

#### Buttons

| Class                      | Description                      |
| :------------------------- | :------------------------------- |
| `btn btn-primary`          | Filled cobalt blue — primary CTA |
| `btn btn-primary btn-pill` | Pill-shaped primary button       |
| `btn btn-secondary`        | Outlined secondary action        |
| `btn btn-ghost`            | Transparent ghost/text button    |

```jsx
<button className="btn btn-primary btn-pill">Get Started</button>
<button className="btn btn-secondary">Learn More</button>
<button className="btn btn-ghost">Cancel →</button>
```

#### Cards

| Class                | Description                                               |
| :------------------- | :-------------------------------------------------------- |
| `card`               | Standard surface card with border, shadow, and hover lift |
| `card showcase-card` | Card with increased padding for demo/content sections     |
| `stat-card card`     | Metric/number display card                                |

```jsx
<div className="card">
  <h4>Card Title</h4>
  <p>Card content goes here.</p>
</div>
```

#### Chips & Badges

| Class                | Description                               |
| :------------------- | :---------------------------------------- |
| `chip chip-success`  | Green — active status, verified badge     |
| `chip chip-tech`     | Blue — technology/skill tag               |
| `chip chip-priority` | Amber — urgent or high-priority indicator |

```jsx
<span className="chip chip-success">● Active</span>
<span className="chip chip-tech">Node.js</span>
<span className="chip chip-priority">Urgent Hire</span>
```

#### Typography Utilities

| Class              | Token      | Usage                        |
| :----------------- | :--------- | :--------------------------- |
| `text-headline-lg` | 30px / 700 | Section headings             |
| `text-headline-md` | 22px / 600 | Card titles                  |
| `text-headline-sm` | 18px / 600 | Sub-section headings         |
| `text-body-xl`     | 18px / 400 | Lead paragraph text          |
| `text-body-md`     | 16px / 400 | Standard body text           |
| `text-body-sm`     | 14px / 400 | Secondary/helper text        |
| `text-label-sm`    | 12px / 600 | Category labels, metadata    |
| `gradient-text`    | —          | Cobalt-to-blue gradient text |

---

## 5. Key Components & Hooks Documentation

### ThemeProvider

**File**: [`src/ThemeProvider.jsx`](src/ThemeProvider.jsx)

Manages the global light/dark theme state. Wraps the entire application in `main.jsx`.

**Props:**

| Prop       | Type              | Required | Description                  |
| :--------- | :---------------- | :------: | :--------------------------- |
| `children` | `React.ReactNode` |   Yes    | Child component tree to wrap |

**Behavior:**

1. On mount, reads theme from `localStorage` → falls back to OS `prefers-color-scheme`.
2. Sets `data-theme="light"` or `data-theme="dark"` on `document.documentElement`.
3. Listens for OS preference changes (if no manual selection is stored).
4. Persists the user's manual theme choice to `localStorage`.

**Usage:**

```jsx
// main.jsx — already configured
import { ThemeProvider } from './ThemeProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
```

**Context value exposed:**

```js
{
  theme: 'light' | 'dark',   // Current active theme
  toggleTheme: () => void     // Switches between light and dark
}
```

---

### useTheme Hook

**File**: [`src/useTheme.js`](src/useTheme.js)

Consumes the ThemeContext. Use in any component that needs to read or toggle the theme.

**Returns:**

| Property      | Type                | Description                            |
| :------------ | :------------------ | :------------------------------------- |
| `theme`       | `'light' \| 'dark'` | The currently active theme             |
| `toggleTheme` | `() => void`        | Toggles between `'light'` and `'dark'` |

**Usage:**

```jsx
import { useTheme } from './useTheme.js';

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '☀️' : '🌙'}
    </button>
  );
}
```

> ⚠️ **Must be used inside `<ThemeProvider>`** — throws an error if used outside.

---

### App (Design System Showcase)

**File**: [`src/App.jsx`](src/App.jsx)

The current root component serves as a **living Design System Showcase**. It demonstrates every design token, component class, and interactive pattern integrated in `index.css`.

**Sections rendered:**

| Section ID            | Purpose                                                                                               |
| :-------------------- | :---------------------------------------------------------------------------------------------------- |
| `#showcase-header`    | Glassmorphic sticky header with logo and theme toggle button                                          |
| `#hero-section`       | Gradient hero with primary CTA and secondary button                                                   |
| `#stats-section`      | Four metric stat cards (placement accuracy, time-to-interview, candidates, clients)                   |
| `#components-section` | Interactive showcase of every component: buttons, chips, typography, colors, inputs, forms, elevation |

> 📌 **For new developers**: Run `npm run dev` and open `http://localhost:5173` to see all available components and their CSS class names. This page is the visual reference for building new features.

---

## 6. Quickstart Setup Guide

### Prerequisites

Ensure the following are installed:

| Tool               | Minimum Version | Purpose                                | Download                                                     |
| :----------------- | :-------------: | :------------------------------------- | :----------------------------------------------------------- |
| **Node.js**        |    20.x LTS     | JavaScript runtime                     | [nodejs.org](https://nodejs.org/)                            |
| **npm**            |      11.x       | Package manager (bundled with Node.js) | —                                                            |
| **Docker Desktop** |     Latest      | Run backend databases locally          | [docker.com](https://www.docker.com/products/docker-desktop) |

> **Want to run the frontend only (without the backend)?** Set `VITE_ENABLE_MOCK_API=true` in your `.env` file — this bypasses all real HTTP calls and uses local fixture data.

---

### 1. Install Dependencies

From the **repository root** (recommended — installs all workspace packages):

```bash
npm install
```

Or install the frontend package only:

```bash
cd apps/frontend
npm install
```

---

### 2. Configure Environment Variables (`.env`)

```bash
# macOS / Linux
cd apps/frontend
cp .env.example .env

# Windows PowerShell
cd apps\frontend
Copy-Item .env.example .env
```

Open `.env` and verify:

```env
VITE_API_URL=http://localhost:5000   # Points to local backend
VITE_APP_ENV=development
```

> All environment variables consumed in the browser **must** be prefixed with `VITE_`. See [Environment Variables Reference](#7-environment-variables-reference) for the full list.

---

### 3. Run the Development Server

**Recommended — run everything from the repository root (starts all apps simultaneously):**

```bash
# From repository root
npm run dev
```

**Or run the frontend in isolation:**

```bash
cd apps/frontend
npm run dev
```

The dev server starts with **Hot Module Replacement (HMR)**. Open your browser at:

👉 **[`http://localhost:5173`](http://localhost:5173)**

> The frontend expects the backend at `http://localhost:5000`. Start the backend first:
>
> ```bash
> # In a separate terminal
> cd apps/backend
> npm run dev
> ```
>
> Or use Docker Compose to spin up all services: `docker compose up -d`

---

### 4. Build for Production

Compiles and minifies the application into optimized static files in `apps/frontend/dist/`:

```bash
cd apps/frontend
npm run build
```

**Build output:**

```
dist/
├── index.html         # Entry HTML with hashed asset references
├── assets/
│   ├── index-[hash].js    # Minified and tree-shaken JavaScript bundle
│   └── index-[hash].css   # Extracted and minified CSS
```

The `dist/` directory is served by Nginx in the production Docker container.

---

### 5. Preview the Production Build

Locally serve the production build to verify it before deployment:

```bash
cd apps/frontend
npm run preview
```

Opens at **[`http://localhost:4173`](http://localhost:4173)** by default.

---

### 6. Run Linting

```bash
cd apps/frontend
npm run lint
```

ESLint is configured with `react-hooks` and `react-refresh` rules. Fix all warnings before committing — the Husky pre-commit hook enforces this.

---

## 7. Environment Variables Reference

All variables must be prefixed with `VITE_` to be included in the browser bundle at build time.

| Variable                    | Type    | Default                 | Description                                                                        | Required? |
| :-------------------------- | :------ | :---------------------- | :--------------------------------------------------------------------------------- | :-------: |
| `VITE_API_URL`              | String  | `http://localhost:5000` | Base URL of the Express.js API Gateway. All REST calls use this as the base.       |  **Yes**  |
| `VITE_APP_ENV`              | String  | `development`           | Runtime environment: `development`, `staging`, or `production`.                    | Optional  |
| `VITE_APP_NAME`             | String  | `ThinkWires`            | Human-readable app name for browser title tags.                                    | Optional  |
| `VITE_ENABLE_DEBUG_LOGGING` | Boolean | `true`                  | Log all API request/response details to the browser console (DevTools).            | Optional  |
| `VITE_ENABLE_MOCK_API`      | Boolean | `false`                 | Use local fixture data instead of real HTTP calls. Enables offline UI development. | Optional  |
| `VITE_POSTHOG_KEY`          | String  | _(empty)_               | PostHog project API key for production analytics.                                  | Optional  |
| `VITE_SENTRY_DSN`           | String  | _(empty)_               | Sentry Data Source Name for frontend error tracking in production.                 | Optional  |

**Accessing variables in code:**

```js
// In any .js or .jsx file
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.VITE_APP_ENV === 'development';
```

> ⚠️ **Security Note**: Never put secrets (private API keys, passwords) in VITE_ variables. They are embedded in the public JavaScript bundle and visible to anyone who inspects the page source.

---

## 8. API Integration Pattern

All backend API calls should go through a centralized service module (to be created in `src/services/`):

```js
// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Authenticated fetch wrapper.
 * Automatically injects the JWT Bearer token from localStorage.
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken');

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error?.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// Usage example:
// import { apiFetch } from '../services/api.js';
// const jobs = await apiFetch('/api/v1/jobs?page=1&limit=10');
```

---

## 9. Testing Guide

### Current Status

The frontend testing infrastructure is prepared for Vitest + React Testing Library as the project grows.

**Future test location:** `apps/frontend/src/__tests__/`

### Running Tests

```bash
cd apps/frontend
npm run test       # Run all Vitest tests (once configured)
```

_(Vitest and RTL will be added in a future issue as component tests are written.)_

### Adding a Component Test

```jsx
// src/__tests__/ThemeProvider.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../ThemeProvider.jsx';
import { useTheme } from '../useTheme.js';

function ThemeConsumer() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme}</button>;
}

describe('ThemeProvider', () => {
  it('defaults to light theme', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByRole('button').textContent).toBe('light');
  });

  it('toggles to dark on click', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button').textContent).toBe('dark');
  });
});
```

---

## 10. Contribution Guidelines

### Coding Standards

1. **File naming**:
   - React components: `PascalCase.jsx` (e.g., `CandidateCard.jsx`)
   - Hooks: `camelCase.js` prefixed with `use` (e.g., `useJobSearch.js`)
   - Utility functions: `camelCase.js` (e.g., `formatDate.js`)
   - CSS modules (if used): `ComponentName.module.css`

2. **Component structure** — every component file should follow this order:

   ```jsx
   // 1. Imports (React built-ins, then libraries, then local)
   import { useState, useEffect } from 'react';
   import { useTheme } from '../useTheme.js';
   import './ComponentName.css';

   /**
    * 2. JSDoc comment describing the component
    * @param {{ title: string, onClose: () => void }} props
    */
   export function ComponentName({ title, onClose }) {
     // 3. Hook calls (always at the top)
     // 4. Derived state / memoized values
     // 5. Event handlers
     // 6. Return JSX
   }

   // 7. Default export (optional if also named export)
   export default ComponentName;
   ```

3. **Always use named exports** for components — this makes auto-imports and refactoring more reliable.

4. **Always include `id` attributes** on interactive elements for browser automation and testing.

5. **Never import `theme.js` for visual styling** — use CSS classes or `var(--css-variable)` instead.

6. **JSDoc is mandatory** for all exported functions, hooks, and components.

---

### CSS & Styling Rules

1. **Prefer CSS classes over inline styles** for all layout and visual styling.
2. **Use CSS custom properties** (`var(--color-primary)`) not hardcoded values.
3. **Add new design tokens to `index.css`** on `:root` first, then mirror in `theme.js`.
4. **Use the BEM-lite naming convention** for new component classes:
   ```css
   /* Block */
   .job-card { ... }
   /* Element */
   .job-card__title { ... }
   /* Modifier */
   .job-card--featured { ... }
   ```
5. **All new base component styles** go in `index.css`. Page-specific styles go in `App.css` or a co-located component CSS file.

---

### Git Branching Strategy

| Branch Type | Naming Convention         | Example                |
| :---------- | :------------------------ | :--------------------- |
| Feature     | `issue-<number>`          | `issue-10`             |
| Bugfix      | `fix-<short-description>` | `fix-theme-flash`      |
| Hotfix      | `hotfix-<issue>`          | `hotfix-auth-redirect` |

**Never commit directly to `master` or `feature` branches.** Always open a Pull Request for review.

---

### Conventional Commit Format

```
<type>(<scope>): <short description>

[optional body]
```

| Type       | When to use                                    |
| :--------- | :--------------------------------------------- |
| `feat`     | New user-visible feature or component          |
| `fix`      | Bug fix                                        |
| `docs`     | Documentation only changes                     |
| `style`    | CSS/formatting changes that don't affect logic |
| `refactor` | Code restructuring without behavior change     |
| `test`     | Adding or updating tests                       |
| `chore`    | Build tooling, dependency updates              |

**Examples:**

```bash
git commit -m "feat(frontend): add CandidateCard component with skill chips (#12)"
git commit -m "docs(frontend): add architecture overview and component docs (#10)"
git commit -m "fix(theme): prevent flash of unstyled content on page load (#11)"
git commit -m "style(index.css): add input focus ring animation token (#10)"
```

---

## License & Maintainers

- **License**: Proprietary — ThinkWire Staffing and Solutions
- **Frontend Maintainer**: ThinkWire Frontend Engineering Team
- **Design System Reference**: [`docs/DESIGN.md`](../../docs/DESIGN.md)
- **Backend API Docs**: [`apps/backend/README.md`](../backend/README.md)
