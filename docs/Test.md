# Thinkwires Automated Testing Master Guide & Command Reference (`Test.md`)

This document is the authoritative master guide to automated testing across the **Thinkwires Monorepo**. It covers all three applications—**Frontend** (`apps/frontend`), **Backend** (`apps/backend`), and **AI Microservice** (`apps/ai_services`).

---

# PART I: ALL COMMAND REFERENCE CHEAT SHEET

Run all commands from the monorepo root directory (`thinkwires/`) unless otherwise noted.

## 1. Monorepo Orchestration Commands (Root Level)

| Purpose                                         | Command                | Engine                                                                         |
| :---------------------------------------------- | :--------------------- | :----------------------------------------------------------------------------- |
| **Run All Unit & Integration Tests (All Apps)** | `npm test`             | Turborepo (`turbo test`) across Frontend, Backend, and AI Services in parallel |
| **Run Cross-Service System Tests**              | `npm run test:system`  | Turborepo (`turbo test:system`) verifying live Node Express <-> Python FastAPI |
| **Run Playwright End-to-End (E2E) Tests**       | `npm run test:e2e`     | Turborepo (`turbo test:e2e`)                                                   |
| **Format Codebase with Prettier**               | `npm run format`       | Prettier (`--write .`)                                                         |
| **Check Code Formatting**                       | `npm run format:check` | Prettier (`--check .`)                                                         |
| **Lint Entire Monorepo**                        | `npm run lint`         | Turborepo (`turbo lint`)                                                       |
| **Start Full Development Environment**          | `npm run dev`          | Turborepo (`turbo dev`) ports 5173, 5000, 8000                                 |

---

## 2. Frontend Testing Commands (`apps/frontend`)

The frontend test suite combines **Vitest + React Testing Library + Mock Service Worker (MSW)** for unit/integration tests and **Playwright** for browser E2E.

### 2.1 Vitest Unit, Component & MSW Integration Tests

```bash
# Run all frontend Vitest tests once across all 5 tiers (CI mode - 50 tests)
npm --prefix apps/frontend test

# Run frontend tests in interactive watch mode
npm --prefix apps/frontend run test:watch

# Run frontend tests with visual browser UI
npm --prefix apps/frontend run test:ui

# Generate test coverage reports (lcov, html, text)
npm --prefix apps/frontend run test:coverage

# ── TARGET SPECIFIC TESTING TIERS ──────────────────────────────────────────
# 1. Unit Tests (authSlice, redirectUtil, AnimatedCounter, SectionBadge, ThemeProvider, ProtectedRoute)
npm --prefix apps/frontend run test:unit

# 2. Integration Tests (MSW API views: LoginPage, CandidateApplicationsPage)
npm --prefix apps/frontend run test:integration

# 3. Functional Tests (Full candidate journey: Login -> Applications -> Withdraw)
npm --prefix apps/frontend run test:functional

# 4. Non-Functional Tests (Mount latency SLAs, memory cycles, accessibility semantics)
npm --prefix apps/frontend run test:non-functional

# 5. Exploratory Tests (UI click storms, XSS input fuzzing, empty/corrupted API payload resilience)
npm --prefix apps/frontend run test:exploratory

# 6. System Tests (Playwright browser driving complete candidate journey against live stack)
npm --prefix apps/frontend run test:system
```

### 2.2 Playwright Browser End-to-End (E2E) & Accessibility Tests

```bash
# Run all Playwright E2E tests headless across Chromium and Mobile Safari
npm --prefix apps/frontend run test:e2e

# Run E2E tests with Playwright Interactive UI Mode (recommended for debugging)
npm --prefix apps/frontend run test:e2e:ui

# Run E2E tests in visible headed browser
npm --prefix apps/frontend run test:e2e:headed

# View the latest generated HTML Playwright report
npm --prefix apps/frontend run test:e2e:report

# Run only a specific E2E spec file
npx --prefix apps/frontend playwright test src/test/e2e/auth-flow.spec.js
npx --prefix apps/frontend playwright test src/test/e2e/accessibility.spec.js
npx --prefix apps/frontend playwright test src/test/e2e/navigation.spec.js
npx --prefix apps/frontend playwright test src/test/e2e/mobile-responsive.spec.js

# Run E2E tests on a specific browser project
npx --prefix apps/frontend playwright test --project=chromium
npx --prefix apps/frontend playwright test --project="Mobile Safari"
```

---

## 3. Backend Testing Commands (`apps/backend`)

The backend testing suite is built on **Vitest + Supertest**, executing against the live Express 5 API gateway in hermetic in-memory mode without requiring external database connections.

```bash
# Run all backend tests across all 5 layers (CI mode)
npm --prefix apps/backend test

# Run backend tests in interactive watch mode
npm --prefix apps/backend run test:watch

# Generate code coverage metrics
npm --prefix apps/backend run test:coverage

# ── TARGET SPECIFIC TESTING TIERS ──────────────────────────────────────────
# 1. Unit Tests (auth middlewares, bcrypt utils, upload filters)
npm --prefix apps/backend run test:unit

# 2. Integration Tests (Express API routes: /api/auth, /api/candidate, /api/health)
npm --prefix apps/backend run test:integration

# 3. Functional Tests (Full multi-step candidate lifecycle journey)
npm --prefix apps/backend run test:functional

# 4. Non-Functional Tests (Performance SLAs, SQL & NoSQL injection defense)
npm --prefix apps/backend run test:non-functional

# 5. Exploratory Tests (Chaos fuzzing, prototype poisoning, corrupted payloads)
npm --prefix apps/backend run test:exploratory

# 6. System Tests (Live Node.js Express <-> Python FastAPI microservice roundtrip)
npm --prefix apps/backend run test:system

# Run a single specific backend test file
npm --prefix apps/backend test auth.api.test.js
npm --prefix apps/backend test security-injection.test.js
npm --prefix apps/backend test candidate-journey.functional.test.js
npm --prefix apps/backend test cross-service-system.test.js
```

---

## 4. AI Microservice Testing Commands (`apps/ai_services`)

The AI service test suite is built on **Pytest + FastAPI TestClient (HTTPX)**, verifying resume parsing, ATS scoring formulas, 10-question dynamic test generation, and automated code/scenario grading.

### 4.1 Via npm Scripts (Monorepo Standard)

```bash
# Run all AI microservice tests across all 5 layers
npm --prefix apps/ai_services test

# Run tests in interactive watch mode (requires pytest-xdist / pytest-watch)
npm --prefix apps/ai_services run test:watch

# ── TARGET SPECIFIC TESTING TIERS ──────────────────────────────────────────
# 1. Unit Tests (parser heuristics, match scoring weights, generator, evaluator)
npm --prefix apps/ai_services run test:unit

# 2. Integration Tests (FastAPI routes: /api/resume, /api/screening, /health)
npm --prefix apps/ai_services run test:integration

# 3. Functional Tests (End-to-end candidate AI screening journey)
npm --prefix apps/ai_services run test:functional

# 4. Non-Functional Tests (Latency SLAs, burst throughput, prompt injection)
npm --prefix apps/ai_services run test:non-functional

# 5. Exploratory Tests (Chaos fuzzing, corrupted PDF streams, Unicode bombs)
npm --prefix apps/ai_services run test:exploratory
```

### 4.2 Directly via Python Virtual Environment

```bash
# Activate or invoke pytest directly from virtualenv
cd apps/ai_services

# Run full test suite with verbose output
.\venv\Scripts\pytest -v tests

# Run specific testing folders
.\venv\Scripts\pytest tests/unit
.\venv\Scripts\pytest tests/integration
.\venv\Scripts\pytest tests/functional
.\venv\Scripts\pytest tests/non-functional
.\venv\Scripts\pytest tests/exploratory

# Run a specific test file
.\venv\Scripts\pytest tests/unit/test_resume_parser_unit.py
.\venv\Scripts\pytest tests/non-functional/test_ai_security.py

# Filter tests by function name regex (-k)
.\venv\Scripts\pytest tests -k "prompt_injection"
.\venv\Scripts\pytest tests -k "sla"

# Stop on first failure (-x)
.\venv\Scripts\pytest -x tests
```

---

# PART II: ARCHITECTURE & COMPREHENSIVE TESTING GUIDE

## 5. Testing Philosophy & Monorepo Architecture

The Thinkwires automated testing architecture is organized around four non-negotiable principles:

1. **Centralized Test Directory per Application**:
   All test files, fixtures, mocks, and specifications are centralized in a dedicated `test/` folder within each application (`apps/frontend/src/test/`, `apps/backend/src/test/`, and `apps/ai_services/tests/`). Production source folders remain clean and unpolluted.
2. **Zero-Leak Hermetic Execution**:
   Tests run self-contained without requiring live cloud databases (Neon PostgreSQL, MongoDB Atlas) or paid external API keys (OpenAI GPT-4o-mini). Deterministic in-memory stores, cryptographic test keys, and heuristic rule engines ensure tests never fail due to network hiccups.
3. **The 5-Tier Testing Pyramid**:
   Every service satisfies five rigorous testing paradigms: Unit, Integration, Functional, Non-Functional, and Exploratory Chaos testing.
4. **Monorepo Cohesion via Turborepo**:
   A single top-level `npm test` orchestrates parallel execution across all workspaces, caching untouched targets and providing instantaneous CI feedback.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TURBOREPO PIPELINE (npm test)                         │
└──────────────┬──────────────────────────────┬───────────────────────────────┘
               │                              │
     ┌─────────▼──────────┐        ┌──────────▼─────────┐        ┌────────────▼──────────┐
     │  apps/frontend     │        │  apps/backend      │        │  apps/ai_services     │
     │  (Vitest + MSW)    │        │  (Vitest + Supert) │        │  (Pytest + TestClient)│
     │  50 Tests Passing  │        │  56 Tests Passing  │        │  48 Tests Passing     │
     └────────────────────┘        └────────────────────┘        └───────────────────────┘
                                   TOTAL: 154 TESTS PASSING (100% GREEN)
```

---

## 6. The 5 Testing Paradigms Explained

| Testing Paradigm              | Objective                                                                                                                    | Implementation Method                                                                                                            | Examples in Codebase                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Unit Testing**           | Validates individual pure functions, regex parsers, state reducers, and isolated components in isolation.                    | Pure inputs/outputs, zero I/O, mocked sub-dependencies.                                                                          | [`authSlice.test.js`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/frontend/src/test/unit/authSlice.test.js), [`auth.util.test.js`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/backend/src/test/unit/auth.util.test.js), [`test_resume_parser_unit.py`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/ai_services/tests/unit/test_resume_parser_unit.py)                                                      |
| **2. Integration Testing**    | Validates interactions between adjacent layers (React UI + HTTP API, Express Routes + Middlewares, FastAPI + Pydantic DTOs). | Network interception with MSW (frontend), Supertest against Express app (backend), TestClient against FastAPI router.            | [`CandidateApplicationsPage.test.jsx`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/frontend/src/test/integration/CandidateApplicationsPage.test.jsx), [`auth.api.test.js`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/backend/src/test/integration/auth.api.test.js), [`test_screening_api.py`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/ai_services/tests/integration/test_screening_api.py)           |
| **3. Functional Testing**     | Tests end-to-end multi-step user and candidate business journeys from start to completion.                                   | Sequential API calls or browser automation preserving session state and cookies.                                                 | [`auth-flow.spec.js`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/frontend/src/test/e2e/auth-flow.spec.js), [`candidate-journey.functional.test.js`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/backend/src/test/functional/candidate-journey.functional.test.js), [`test_candidate_ai_journey.py`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/ai_services/tests/functional/test_candidate_ai_journey.py) |
| **4. Non-Functional Testing** | Validates system boundaries, latency SLAs, burst throughput, accessibility, and adversarial defenses.                        | Performance timers (`time.perf_counter`), Axe-core accessibility auditing, SQL/NoSQL injection probes, prompt injection attacks. | [`accessibility.spec.js`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/frontend/src/test/e2e/accessibility.spec.js), [`security-injection.test.js`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/backend/src/test/non-functional/security-injection.test.js), [`test_ai_security.py`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/ai_services/tests/non-functional/test_ai_security.py)                       |
| **5. Exploratory & Chaos**    | Verifies system resilience when subjected to malformed, unexpected, or hostile inputs.                                       | Automated fuzzing, random binary PDF streams, Unicode bombs, prototype poisoning, and boundary mutations.                        | [`chaos-fuzzing.test.js`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/backend/src/test/exploratory/chaos-fuzzing.test.js), [`test_ai_chaos_fuzzing.py`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/ai_services/tests/exploratory/test_ai_chaos_fuzzing.py)                                                                                                                                                                       |
| **6. System Testing**         | Validates the complete integrated multi-service platform as an undivided whole across all services.                          | Real Node.js Express API communicating live with Python FastAPI AI microservice and Playwright browser journeys.                 | [`cross-service-system.test.js`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/backend/src/test/system/cross-service-system.test.js), [`system-candidate-journey.spec.js`](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/frontend/src/test/e2e/system-candidate-journey.spec.js)                                                                                                                                                      |

---

## 7. Frontend Testing Architecture (`apps/frontend`)

The frontend testing ecosystem is split into the **5-Tier Vitest Suite** (Unit, Integration, Functional, Non-Functional, Exploratory) and the **Playwright Browser E2E Suite**.

### 7.1 Directory Layout

```
apps/frontend/
├── vitest.config.js                                    # Vitest DOM environment & path aliasing
├── playwright.config.js                                # Playwright cross-browser & mobile viewport settings
└── src/test/
    ├── setup.js                                        # JSDOM setup, matchMedia polyfill & MSW hooks
    ├── test-utils.jsx                                  # renderWithProviders helper
    ├── mocks/
    │   ├── handlers.js                                 # Mock Service Worker network request handlers
    │   └── server.js                                   # MSW server initialization
    ├── unit/                                           # 1. Unit Testing (30 tests)
    │   ├── authSlice.test.js                           # Redux toolkit candidate auth state transitions
    │   ├── redirectUtil.test.js                        # Open-redirect attack vector defenses
    │   ├── AnimatedCounter.test.jsx                    # Kinetic telemetry counter logic
    │   ├── SectionBadge.test.jsx                       # Badge variants and icon slots
    │   ├── ThemeProvider.test.jsx                      # Dark / Light mode context switching
    │   └── ProtectedRoute.test.jsx                     # Authentication redirect guards
    ├── integration/                                    # 2. Integration Testing (10 tests)
    │   ├── LoginPage.test.jsx                          # Form submission, MSW interception, token cookies
    │   └── CandidateApplicationsPage.test.jsx          # Live application tracking, optimistic withdrawal & alerts
    ├── functional/                                     # 3. Functional Testing (1 test)
    │   └── candidate-journey.functional.test.jsx       # Multi-step candidate lifecycle (Login -> View Apps -> Withdraw)
    ├── non-functional/                                 # 4. Non-Functional Testing (5 tests)
    │   ├── performance.test.jsx                        # Mount latency SLAs (<50ms) and 25-cycle memory stability
    │   └── accessibility.test.jsx                      # Form input types, accessible submit roles, valid hrefs
    ├── exploratory/                                    # 5. Exploratory & Chaos (4 tests)
    │   └── ui-chaos-fuzzing.test.jsx                   # Button click storms, XSS input fuzzing, empty/corrupt payloads
    └── e2e/                                            # Browser End-to-End Suite (Playwright)
        ├── public-smoke.spec.js                        # Cross-browser landing, navigation, theme
        ├── accessibility.spec.js                       # Axe-core WCAG 2.1 AA audits
        ├── security-adversarial.spec.js                # Phishing defense, XSS, protected routes
        └── system-candidate-journey.spec.js            # Full-stack candidate discovery, application, and portal flow
```

### 7.2 Mock Service Worker (MSW) Integration

Frontend integration tests intercept real network calls via MSW, completely isolating tests from the backend server:

```javascript
// apps/frontend/src/test/mocks/handlers.js
http.get('/api/candidate/applications', () => {
  return HttpResponse.json({
    success: true,
    applications: [
      {
        _id: 'app-101',
        job: { title: 'Senior Cloud Architect', location: 'San Francisco, CA' },
        status: 'Under Review',
      },
    ],
  });
});
```

---

## 8. Backend Testing Architecture (`apps/backend`)

The backend test suite verifies the Express 5 API gateway, middleware pipelines, authentication tokens, and business logic.

### 8.1 Directory Layout

```
apps/backend/
├── vitest.config.js                                    # Vitest Node environment configuration
└── src/test/
    ├── setup.js                                        # In-memory dual-persistence environment bootstrap
    ├── test-helper.js                                  # Supertest agent & cryptographic test JWT generator
    ├── unit/
    │   ├── auth.util.test.js                           # Bcrypt salt hashing, JWT signing, token expiry
    │   ├── auth.middleware.test.js                     # RBAC role guards (requireRole), candidate token rejection
    │   └── upload.middleware.test.js                   # Multer file size limits & MIME whitelist validation
    ├── integration/
    │   ├── auth.api.test.js                            # Supertest against /api/auth registration, login, cookies
    │   ├── candidate.api.test.js                       # Supertest /api/candidate profile, dashboard, applications
    │   └── health.api.test.js                          # Public /api/health and dual-mode database status
    ├── functional/
    │   └── candidate-journey.functional.test.js        # Multi-step candidate lifecycle (Sign-up -> Login ->
    │                                                   # Dashboard -> Update Profile -> Applications -> Logout)
    ├── non-functional/
    │   ├── performance.test.js                         # Latency SLAs (<250ms), concurrent burst throughput
    │   └── security-injection.test.js                  # SQL injection probes, NoSQL operators, HttpOnly cookie flags
    ├── exploratory/
    │   └── chaos-fuzzing.test.js                       # Corrupted headers, deeply nested objects, prototype poisoning
    └── system/
        └── cross-service-system.test.js                # Live Node.js Express <-> Python FastAPI microservice roundtrip
```

### 8.2 In-Memory Hermetic Dual-Persistence

The test environment operates with zero live database dependencies:

- Setting `NODE_ENV=test` automatically activates the in-memory fallback datasets (`mockData.json` and `adminSeedData.json`).
- Controllers and middlewares run against realistic data structures without acquiring Postgres table locks or Atlas connection pools.
- Supertest simulates authentic HTTP requests with cryptographic cookie parsing.

---

## 9. AI Microservice Testing Architecture (`apps/ai_services`)

The AI microservice test suite verifies natural language extraction, ATS matching formulas, dynamic test generation, and automated rubric grading.

### 9.1 Directory Layout

```
apps/ai_services/
├── package.json                                         # Pytest script configurations
└── tests/
    ├── conftest.py                                      # Shared TestClient, synthetic PDF & candidate fixtures
    ├── unit/
    │   ├── test_resume_parser_unit.py                   # Heuristic NLP, contact parsing, skill taxonomy normalization
    │   ├── test_match_scorer_unit.py                    # ATS scoring formula weights (40/30/20/10), fit badges & thresholds
    │   ├── test_screening_generator_unit.py             # 10-Question suite composition (7 MCQs, 2 Scenarios, 1 Practical)
    │   └── test_screening_evaluator_unit.py             # Deterministic MCQ grading, scenario rubrics, gatekeeper status
    ├── integration/
    │   ├── test_health_api.py                           # GET / and GET /health liveness probes
    │   ├── test_resume_api.py                           # POST /api/resume/parse & POST /api/resume/match-score
    │   └── test_screening_api.py                        # POST /api/screening/generate-test & evaluate-test with Pydantic DTOs
    ├── functional/
    │   └── test_candidate_ai_journey.py                # End-to-end recruitment journey across all AI microservice endpoints:
    │                                                    # Parse Resume -> Fit Score -> Generate Test -> Submit Answers -> Grade
    │   └── test_ai_performance.py                       # Latency SLAs (<50ms heuristic parsing, <15ms scoring) & burst concurrency
    │   └── test_ai_security.py                          # Prompt injection defenses, 500KB stream stress, XSS/HTML inert handling
    └── exploratory/
        └── test_ai_chaos_fuzzing.py                     # Corrupted binary PDF bytes, zero-byte uploads, Unicode RTL/zero-width,
                                                         # 1,000-skill vectors, and boundary/negative experience handling
```

### 9.2 Zero-Failure Deterministic Fallbacks

When an `OPENAI_API_KEY` is not present during testing:

- The service switches to deterministic rule-based NLP extraction and mathematical scoring formulas.
- Candidate resumes are parsed for contact details, URLs, skills, and experience via regex and heuristic rules.
- Test grading executes deterministic rubric analysis and keyword pattern matching.

---

## 10. System Testing Architecture & Cross-Service Workflows

System testing in Thinkwires tests the **entire distributed software platform as a unified whole**, verifying that multiple autonomous services communicate, serialize, and validate data contracts in real time without mocks.

### 10.1 Architecture Overview

```
                                      ┌────────────────────────────────────────┐
                                      │        Full-Stack System Test          │
                                      │ (apps/frontend/.../system-journey.spec)│
                                      └──────────────────┬─────────────────────┘
                                                         │ (Headless Browser)
                                                         ▼
┌─────────────────────────────────┐   HTTP Proxy / CORS   ┌─────────────────────────────────┐
│     apps/frontend (Port 5173)   ├──────────────────────►│      apps/backend (Port 5000)   │
│     React 19 SPA + Redux Toolkit│                       │      Express 5 Gateway + JWT    │
└─────────────────────────────────┘                       └────────────────┬────────────────┘
                                                                           │
                                                                           │ (Inter-Service HTTP)
                                                                           │
                                                                           ▼
                                                          ┌─────────────────────────────────┐
                                                          │   apps/ai_services (Port 8000)  │
                                                          │   FastAPI Python NLP & ATS Core │
                                                          └─────────────────────────────────┘
```

### 10.2 Implemented System Test Suites

1. **Cross-Service API System Suite (`apps/backend/src/test/system/cross-service-system.test.js`)**:
   - **Handshake & Health SLA**: Express pings live FastAPI Python service (`http://localhost:8000/health`) and asserts handshake duration `< 250ms`.
   - **Stream NLP Extraction**: Express streams raw candidate resume to FastAPI `/api/resume/parse` and verifies Python extracts name, email, phone, location, and technical skills (`React`, `Node.js`, `PostgreSQL`, `Docker`).
   - **ATS Fit Scoring & Assessment Generation**: Candidate submits job application via Express `/api/candidate/apply`, which simultaneously calls Python `/api/resume/match-score` (weighted ATS formula: Skills 40%, Experience 30%, Title 20%, Description 10%) and `/api/screening/generate-test`.
   - **Automated Grading & Gatekeeper Evaluation**: Candidate submits proctored assessment answers via `/api/candidate/applications/:id/assessment/submit`. Express delegates grading to Python `/api/screening/evaluate-test` (MCQ answer keys + architectural word-count rubrics), asserting score `>= 75%` promotes candidate to `Accepted - Screened`.
   - **Distributed Security & Access Control**: Verifies candidate session cookies cannot access protected admin endpoints (`HTTP 401`).

2. **Full-Stack Browser System Suite (`apps/frontend/src/test/e2e/system-candidate-journey.spec.js`)**:
   - **Discovery Journey**: Navigates to `/jobs`, performs live searches, tests keyword filter query debounce.
   - **Authentication Boundaries**: Bounces unauthenticated users from `/jobs/:jobId/apply` to `/login?redirect=...`, verifying return URL preservation.
   - **Form Verification & Accessibility**: Verifies client-side validation displays inline error pills (`.tw-field-err-msg`) on empty submit.
   - **Responsive Viewport Stability**: Audits mobile viewports (Pixel 5, 375x667) ensuring zero horizontal document overflow (`scrollWidth <= clientWidth`).

---

## 11. Security & Adversarial Testing Matrix

Thinkwires includes automated security test suites designed to detect and block adversarial attacks:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SECURITY DEFENSE COVERAGE                          │
├──────────────────────────────┬──────────────────────────────┬───────────────┤
│ Attack Vector                │ Test Suite Location          │ Defense Mech. │
├──────────────────────────────┼──────────────────────────────┼───────────────┤
│ SQL Injection (' OR 1=1--)   │ backend: security-injection  │ Parameterized │
│ NoSQL Query Objects ($gt:'') │ backend: security-injection  │ Schema Type   │
│ Prompt Injection / Override  │ ai_services: test_ai_security│ Rule-Based    │
│ Cross-Site Scripting (XSS)   │ frontend: redirectUtil       │ Inert Strings │
│ Open Redirect Attacks        │ frontend: redirectUtil       │ Origin Bounds │
│ Cookie Hijacking             │ backend: security-injection  │ HttpOnly/Same │
│ Corrupted File DOS           │ ai_services: chaos_fuzzing   │ Stream Guards │
│ Prototype Pollution          │ backend: chaos-fuzzing       │ Freeze/Block  │
└──────────────────────────────┴──────────────────────────────┴───────────────┘
```

---

## 12. Adding New Tests Checklist

When introducing new features or endpoints, follow this standard checklist:

1. **Frontend Feature**:
   - Add unit tests for utility functions or Redux slice actions in `src/test/unit/`.
   - Add component rendering and interaction tests in `src/test/components/`.
   - If calling an API, add MSW mock handler in `src/test/mocks/handlers.js` and test in `src/test/integration/`.
   - For end-to-end workflows, add a Playwright spec in `src/test/e2e/`.
2. **Backend Endpoint**:
   - Add unit test for any new middleware guards in `src/test/unit/`.
   - Add Supertest API route verification in `src/test/integration/`.
   - Ensure the endpoint is covered in functional lifecycle journeys or adversarial injection tests.
3. **AI Microservice Endpoint**:
   - Add Pydantic schema validation tests in `tests/integration/`.
   - Add domain logic tests in `tests/unit/`.
   - Ensure heuristic fallback behavior is verified without requiring external OpenAI credentials.
4. **Validation**:
   - Run `npm test` from the monorepo root to verify all 165 tests pass.
   - Run `npm run test:system` to execute live cross-service integration suites.
   - Run `npm run test:e2e` to execute Playwright browser suites.
   - Run `npm run format` to ensure Prettier compliance.

---

## 13. Troubleshooting Common Test Issues

| Issue / Symptom                  | Root Cause                                             | Solution                                                                                                                        |
| :------------------------------- | :----------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| **Port 8000 / 5000 in use**      | A previous dev server process is still listening.      | Run `Get-Process node, python \| Stop-Process` in PowerShell or kill the background process.                                    |
| **Playwright browsers missing**  | Browsers not yet installed.                            | Run `npx --prefix apps/frontend playwright install chromium`.                                                                   |
| **Python venv not found**        | Virtual environment not created in `apps/ai_services`. | Run `python -m venv apps/ai_services/venv && .\apps\ai_services\venv\Scripts\pip install -r apps/ai_services/requirements.txt`. |
| **Prettier formatting warnings** | Files modified without formatting.                     | Run `npm run format` from the monorepo root.                                                                                    |
