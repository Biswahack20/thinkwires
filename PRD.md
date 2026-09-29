# Product Requirements Document (PRD)

**Project Title:** ThinkWire Staffing and Solutions

**Document Version:** 1.0

**Target Architecture:** Modern Web Application built with **JavaScript (Node.js/Express + React)**, **Python (FastAPI for AI)**, **PostgreSQL (Database)**, and **Redis (Caching & Fast Memory)**.

---

## 1. Executive Summary & Core Platform Vision

### What is ThinkWire?

ThinkWire is a complete platform that connects three groups of people:

1. **Clients (Companies):** Looking to hire temporary workers, full-time staff, or freelancers.
2. **Candidates (Job Seekers / Freelancers / Bench Staff):** Looking for work or currently on the company's paid internal "bench" (waiting for the next client assignment).
3. **Internal Admins & Recruiters:** The team managing the company, matching candidates to client jobs, running payroll, and overseeing platform settings.

### What Makes ThinkWire Special?

- **AI Screening Gatekeeper:** When a candidate applies for a job, our AI creates a custom 10-question test based on the job description. Candidates must pass this test before their application is shown to recruiters or clients.
- **Resume Match Scorer:** The system automatically reads candidate resumes, compares them against the job requirements, and generates a **Fit Score (0–100%)**.
- **Bench Management:** Keeps track of candidates currently on the internal payroll who are between client projects, showing daily cost overhead and enabling single-click reassignment.
- **Admin Control Panel (CMS & Feature Flags):** Admins can change website text, add new job categories, and turn platform features ON or OFF in real time without touching any code.

### 1.1 Glossary of Key Terms

- **Bench:** Internal employees who are currently on payroll but between active client assignments.
- **Vector Search:** An AI technique that converts text (like resumes) into numbers to find semantic similarities rather than just matching exact keywords.
- **CMS (Content Management System):** A dashboard that allows non-developers to change website text and content.
- **JWT (JSON Web Token):** A secure digital key used to keep users logged in.
- **Feature Flag:** A digital switch that allows admins to turn specific platform features on or off without writing code or redeploying the site.

### 1.2 Success Metrics & KPIs (Version 1.0)

To determine if the V1.0 launch is successful, we will measure:

- **Time-to-Fill (TTF):** Reduce the average time it takes to place a candidate by 30%.
- **AI Screening Accuracy:** Achieve a 90% positive feedback rate from clients on AI-scored candidates (Scores > 80%).
- **Platform Uptime:** Maintain 99.9% uptime during the launch month.
- **Bench Utilization:** Increase the reassignment speed of "On-Bench" candidates by 40%.

### 1.3 Out of Scope for Version 1.0

To ensure we meet our strict 1-month deadline, the following features are intentionally excluded from this release:

- Native iOS or Android mobile applications (Web responsive only).
- Automated tax calculations for payroll.
- Third-party integrations with external HR systems (e.g., Workday, Salesforce).
- Video interviewing built directly into the platform.

---

## 2. Complete Technical Prerequisites & Stack Inventory (JavaScript Focus)

Everything in this project is written in **Modern JavaScript (ES6+)** for the web and backend, with a small **Python** microservice strictly dedicated to AI operations.

### 2.1 Software Prerequisites (What Developers Need Installed)

- **Node.js (v20 or higher):** The JavaScript runtime environment used to execute JavaScript code on the backend and build the frontend.
- **npm (Node Package Manager v10 or higher):** Comes bundled with Node.js; used to install all JavaScript libraries.
- **Python (v3.12 or higher):** Required exclusively to run the FastAPI AI microservice.
- **Docker & Docker Desktop:** Software that runs PostgreSQL, Redis, and our web applications inside isolated, lightweight containers.
- **PostgreSQL (v16):** The primary database that stores users, jobs, timesheets, and candidate data.
- **Redis (v7):** Fast in-memory storage used for real-time feature toggles, user session blacklists, and task queues.
- **VS Code (Visual Studio Code):** The recommended code editor for building this project.

---

### 2.2 Complete JavaScript & Technology Stack

#### A. Frontend (What Users See in the Browser)

- **Language:** **JavaScript (ES6+)** — Standard, native JavaScript.
- **Framework:** **React 18 / 19 (Vite)** — A popular JavaScript library for building fast single-page applications (SPAs).
- **Routing:** **React Router v6** — Handles page navigation (e.g., going from `/login` to `/dashboard`) without refreshing the browser.
- **State Management:** **Redux Toolkit (RTK) + RTK Query** — A central store in JavaScript that holds data accessible across all components (e.g., who is logged in, active feature flags). RTK Query handles fetching and caching data from APIs.
- **Styling & UI Components:**
- **Tailwind CSS:** A utility-first CSS framework for styling components using simple class names.
- **Shadcn UI & Radix UI:** Pre-built, accessible JavaScript/React components like modals, buttons, dropdowns, and forms.
- **Lucide React:** A light collection of modern UI icons.

- **3D Visuals & Animations:**
- **Three.js & `@react-three/fiber`:** Runs interactive 3D graphics in the browser (e.g., floating 3D score badges and analytics globes).
- **Framer Motion:** Adds smooth animations when modals pop up or pages transition.

- **Security & Helpers:**
- **DOMPurify:** Sanitizes user inputs to prevent malicious JavaScript execution (XSS attacks).
- **Zod:** Validates form inputs (e.g., making sure an email address is valid before submitting).
- **`react-window`:** Renders large candidate lists efficiently by only displaying items visible on the screen.

- **UI/UX Prototyping:**
- **Figma:** The design tool used to prototype and approve all screens and workflows before any React code is written.

- **Monitoring, Analytics & SEO:**
- **Sentry:** Captures and reports frontend JavaScript errors in real-time.
- **LogRocket:** Records user sessions to replay exactly what the user was doing when an error occurred.
- **Google Analytics / PostHog:** Tracks user behavior, click-through rates on job postings, and applicant drop-offs.
- **React Helmet / Next-SEO:** Manages meta tags and OpenGraph tags to ensure job postings rank highly in Google Search.

#### B. Core Backend (The Main Express API Gateway)

- **Language & Runtime:** **JavaScript (Node.js)**
- **Framework:** **Express.js** — A lightweight JavaScript framework for building REST APIs.
- **Database Driver & ORM:** **Sequelize ORM** — Translates JavaScript code directly into SQL queries for PostgreSQL.
- **Security Libraries:**
- **`jsonwebtoken` (JWT):** Generates secure login tokens for authenticated users.
- **`bcryptjs`:** Encrypts user passwords before saving them to the database.
- **Passport.js / OAuth 2.0:** Enables Social Single Sign-On (SSO) like "Sign in with Google" or "LinkedIn Login" for a frictionless user experience.
- **`helmet`:** Sets secure HTTP headers to protect against common web attacks.
- **`cors`:** Controls which domain names are allowed to send requests to our API.
- **`express-rate-limit`:** Prevents spam by limiting the number of API requests a user can make per minute.

- **Real-Time Communication & Queues:**
- **Socket.io:** Powers real-time WebSockets for live assessment countdown timers and live feature flag updates.
- **BullMQ:** Manages background task queues in JavaScript (e.g., sending emails or dispatching heavy tasks to the AI service).

- **API Documentation & Billing:**
- **Swagger / OpenAPI (`swagger-ui-express`):** Auto-generates interactive API documentation for frontend developers and external clients.
- **Stripe Node SDK:** Processes transactions, handles client billing, and manages invoice generation.

- **Transactional Email Provider:**
- **Resend / SendGrid:** Handles outbound emails (interview invites, password resets, application updates) reliably to avoid spam filters.

- **Logging & Error Tracking:**
- **Winston / Pino:** Outputs structured JSON logs instead of basic console logs, enabling easier debugging and log aggregation.
- **Sentry (Node):** Tracks backend exceptions, slow database queries, and API failures.

#### C. Dedicated AI Microservice

- **Language:** **Python 3.12**
- **Framework:** **FastAPI** — A fast Python web framework.
- **AI Libraries:** **LangChain**, **OpenAI Python SDK** (uses GPT-4o for generating tests and analyzing resumes), **`pdfplumber`** (extracts text from PDF resumes), and **`asyncpg`** (interacts directly with PostgreSQL for vector similarity searches).

#### D. Database & Cache Layer

- **PostgreSQL:** Stores structured relational data like user accounts, client jobs, timesheets, and invoice records.
- **Soft Deletes Strategy:** Instead of hard-deleting records, Sequelize is configured with `paranoid: true` to use `deletedAt` timestamps, preserving data for legal compliance and auditing.
- **`pgvector`:** A PostgreSQL extension that stores candidate resume vector embeddings for AI similarity matching.
- **Redis:** Stores temporary, fast-access data like active user sessions, feature flag settings, and background queue jobs.

- **Database Seeding & Mock Data:**
- **Faker.js:** Used to generate thousands of realistic mock records (candidates, jobs, timesheets) for local development and testing.
  **_Production Safety Protocol:_** Seeding scripts must strictly check `if (process.env.NODE_ENV === 'production') process.exit(1);` before executing. Furthermore, the production database role must explicitly deny `TRUNCATE` or `DROP` permissions to physically prevent accidental execution or deletion of live data.

#### E. Testing & DevOps (CI/CD)

- **Testing Tools:**
- **Vitest & React Testing Library:** Tests frontend React components and JavaScript logic.
- **Supertest:** Tests Express backend API endpoints.
- **PyTest:** Tests Python FastAPI AI functions.
- **Playwright:** Runs automated browser tests simulating real user clicks from login to hiring.

- **Code Quality & Pre-commit Automation:**
- **Prettier & ESLint:** Enforces consistent code formatting and catches problematic patterns before runtime.
- **Husky & `lint-staged`:** Implements Git hooks that block developers from committing code if it fails linting or unit tests, keeping the main repository completely pristine.

- **DevSecOps & Automated Scanning:**
- **Dependabot / Snyk:** Integrated into GitHub to scan the repository daily for vulnerabilities in NPM packages and auto-generate pull requests to patch them.

- **DevOps & Cloud:**
- **Docker:** Package applications into standardized container images.
- **GitHub Actions:** Automatically runs tests and builds containers every time new code is pushed.
- **Kubernetes & Helm:** Deploys and manages containers in production cloud environments (AWS EKS or GCP GKE).

- **Disaster Recovery & Backups:**
- **Automated `pg_dump` to AWS S3:** Daily automated backups of the PostgreSQL database, encrypted and stored in cloud storage to prevent catastrophic data loss.

---

## 3. Decoupled System Architecture & How Services Talk to Each Other

To ensure the system remains stable and easy to maintain, different parts of the platform are **loosely coupled** (decoupled). This means if the AI service goes down temporarily, the main website and client dashboard continue to function without crashing.

```
                                  +---------------------------------------+
                                  |     React 19 Frontend (Vite)          |
                                  +-------------------+-------------------+
                                                      |
                                          (HTTP / REST / WebSockets)
                                                      |
                                                      v
                                  +-------------------+-------------------+
                                  |    Express.js API Gateway Core        |
                                  | (Auth, RBAC, Billing, CMS, Flags)     |
                                  +---------+-------------------+---------+
                                            |                   |
                    (Async Queues via BullMQ)                   (Circuit-Breaker REST)
                                            |                   |
                                            v                   v
+--------------------------------+       +--+-------------------+-------------------+
|          Redis Cache           | <---> |        FastAPI AI Microservice           |
| (Session Tokens, Flag Matrix)  |       | (Async Python + LangChain + OpenAI)       |
+--------------------------------+       +----------------------+-------------------+
                                                                |
                                                    (Vector Search / Embeddings)
                                                                |
                                                                v
                                         +----------------------+-------------------+
                                         |   PostgreSQL + Sequelize / pgvector      |
                                         +------------------------------------------+

```

### 3.1 Monorepo Directory & Testing Structure

The project is structured as a single monorepo (`Thinkwires`). All tests must be written directly inside their respective app folders alongside the code, NOT saved until the very end of the project.

- `/apps/frontend/` : React app. Unit tests go in `frontend/src/__tests__/` (Vitest/RTL).
- `/apps/backend/` : Express API. Integration tests go in `backend/tests/` (Jest/Supertest).
- `/apps/ai_services/` : Python API. Tests go in `ai_services/tests/` (PyTest).
- `/e2e_tests/` : Global End-to-End browser tests (Playwright).

---

### How Data Moves Through the System

1. **User Request:** A user interacts with the React frontend (e.g., clicking "Apply for Job").
2. **Express API Gateway:** Receives the request, checks the user's login token (JWT), and verifies user permissions.
3. **Asynchronous Processing:** Express pushes heavy AI tasks (like resume parsing) into a **Redis Queue (BullMQ)** and immediately sends a success response back to the user interface.
4. **FastAPI AI Execution:** The Python FastAPI microservice listens to the queue, processes the resume using OpenAI, converts the text into numerical vector embeddings, and saves the vector data into PostgreSQL (`pgvector`).
5. **Real-time Notification:** Once processed, a WebSocket notification (via Socket.io) informs the React frontend to update the candidate card on the screen.

---

## 4. Complete Feature Requirements & Workflows

### Core User Stories

To guide development, here are the primary user stories for our main user types:

**Candidates:**

- _As a candidate, I want to toggle my status to 'On-Bench' so that recruiters know I am ready for a new internal assignment._
- _As a candidate, I want to take an AI-generated assessment so that I can prove my skills for a specific job._

**Clients:**

- _As a client, I want to see a candidate's 'Fit Score' so that I can quickly identify the best matches for my job posting._
- _As a client, I want profiles below my set threshold to be hidden so that my pipeline remains clutter-free._

**Admins/Recruiters:**

- _As an admin, I want to toggle the 'AI Assessment' feature on or off via the dashboard so that I can control candidate flow in real-time._
- _As a recruiter, I want to see the daily cost of my 'Bench' so that I can prioritize reassigning those candidates to clients._

### 4.1 Candidate Engagement Modes & Bench Management

- **3 Availability Options:** Candidates can toggle their current work mode in their profile settings:

1. **`Full-Time Looking`:** Seeking traditional full-time employment.
2. **`Freelancer`:** Open for contract, project-based work.
3. **`On-Bench`:** Internal employee currently between client assignments.

- **Bench Ledger:** When marked as `On-Bench`, the candidate is listed on the Admin Bench Dashboard. This view displays:
- Number of days spent on the bench.
- Daily cost overhead burn rate to the company.
- A single-click "Reassign" button that allows recruiters to attach the bench candidate directly to open client job orders.

### 4.2 AI Assessment Screening Gatekeeper

1. **Trigger:** Candidate clicks "Apply" on a job requisition that requires screening.
2. **Async AI Generation:** The FastAPI microservice reads the job description and generates a 10-question evaluation (7 Multiple Choice Questions, 2 Situational Scenarios, and 1 Practical exercise).
3. **Proctored Test Window:**

- A timed countdown clock runs in the browser via WebSockets.
- Event listeners block right-clicking (`onContextMenu`), copying text (`onCopy`), and detect if the candidate switches browser tabs (`visibilitychange`).

4. **Gatekeeping Decision:**

- If Candidate Score $\ge$ Job Passing Threshold (e.g., $75\%$), the application status becomes **`Accepted - Screened`** and becomes visible to the client.
- If Candidate Score $<$ Passing Threshold, the application status is marked **`Filtered - Below Threshold`**.

### 4.3 Metric-Driven Resume Scorer & Client Visibility

- **Custom Weight Configuration:** Admins or Clients can set percentage weights for candidate evaluations:
- _Technical Skills Match:_ 40%
- _Experience Level:_ 30%
- _Certifications:_ 20%
- _Location / Pay Rate Fit:_ 10%

- **Vector Semantic Search:** OpenAI converts the candidate's resume into a vector embedding. The database evaluates semantic similarity using PostgreSQL's `pgvector` distance operators (`<->`).
- **Fit Score & Badges:** Calculates a final **Fit Score (0–100%)** displayed as a badge on candidate profile cards:
- **Green Badge (80% – 100%):** Top Match
- **Yellow Badge (60% – 79%):** Moderate Match
- **Gray / Masked Badge (< 60%):** Below Threshold

- **Automated Client Masking:** Profiles falling below the client's visibility threshold are masked or hidden from the client portal feed to keep client pipelines focused on high-quality matches.

### 4.4 Dynamic Admin CMS & Feature Flag Engine

- **Dynamic Content Management (CMS):** Admins can update website content directly from the Admin Panel without asking developers to change code:
- Edit home page banner headlines, subtext, and call-to-action buttons.
- Create, update, or remove job categories and skill taxonomy tags.
- Update FAQ questions and support contact details.

- **Real-Time Feature Flag Toggles:** Admins can turn core platform capabilities ON or OFF instantly using toggle switches backed by Redis:
- `FEATURE_AI_ASSESSMENT_GATE`: Turns mandatory candidate AI tests on/off.
- `FEATURE_RESUME_METRIC_SCORER`: Enables/disables automated fit scores.
- `FEATURE_BENCH_MODULE`: Shows/hides the internal bench tracking ledger.
- `FEATURE_FREELANCE_MARKETPLACE`: Toggles freelance job listings.
- `FEATURE_CLIENT_SCORE_MASKING`: Controls automatic candidate masking.
- `FEATURE_PROCTORED_ANTI_CHEAT`: Toggles tab-switch detection during assessments.

### 4.5 Executive Admin Business Intelligence (BI) Analytics

- **Job & Supply Performance:** Real-time charts showing open vs. filled jobs, average Time-to-Fill (TTF), and applicant drop-off points.
- **AI Pass/Fail Ratios:** Visual metrics showing how many candidates pass vs. fail AI screening tests across different skill categories.
- **Financial & Bench Margins:** Real-time monitoring of total billings, candidate payouts, daily bench idle costs, and net profit margins per deployment.

---

## 5. Complete Page & UI Navigation Map

### 5.1 Public / Unauthenticated Pages (Anyone can view)

1. **Home / Landing Page (`/`):** Displays platform features, 3D hero visuals, dynamic CMS text blocks, and login buttons.
2. **Job & Freelance Directory (`/jobs`):** Publicly searchable list of open positions with skill tag filters and position details.
3. **Login & Registration Portal (`/auth`):** Multi-role login screen (Candidate, Client, Recruiter, Admin) with password reset workflows.

### 5.2 Candidate Portal Pages (Job Seekers)

4. **Candidate Dashboard (`/candidate/dashboard`):** Summary of submitted applications, pending assessment test alerts, and interview invites.
5. **Profile & Status Manager (`/candidate/profile`):** Resume upload interface, skill tag selector, and the tri-state status toggle switch (`Full-Time`, `Freelance`, `On-Bench`).
6. **AI Assessment Portal (`/candidate/assessment/:testId`):** Timed assessment interface featuring a proctored question stepper, timer countdown, and instant score results.
7. **Timesheet & Payouts Page (`/candidate/timesheets`):** Log daily work hours, upload project deliverables, and track payout releases.

### 5.3 Corporate Client Portal Pages (Employers)

8. **Client Dashboard (`/client/dashboard`):** Overview of open requisitions, candidate pipeline status, and pending timesheet approvals.
9. **Job Requisition Builder (`/client/requisitions/new`):** Form to post new job openings, define required skills, set bill/pay rates, and configure AI assessment passing thresholds.
10. **Scored Candidate Pipeline (`/client/candidates`):** Candidate review feed featuring fit scores (0–100%), metric badges, resume preview drawers, and interview scheduling buttons.
11. **Invoicing & Timesheets (`/client/billing`):** Approve candidate timesheets, view calculated invoice totals, and manage billing accounts.

### 5.4 Internal Admin / Operations Portal Pages (Company Staff)

12. **Executive Analytics Dashboard (`/admin/analytics`):** Real-time BI analytics showing job fulfillment rates, AI pass/fail metrics, and revenue profit margins.
13. **Bench Management Ledger (`/admin/bench`):** Central dashboard tracking unassigned bench resources, daily cost burn rates, and single-click client redeployment drawers.
14. **Dynamic CMS Manager (`/admin/cms`):** Content management panel to update home page text, FAQs, skill categories, and platform banners.
15. **Feature Flag Control Console (`/admin/flags`):** Redis-backed switch matrix to toggle platform features ON/OFF in real time.

---

## 6. Frontend Security & Performance Best Practices

### 6.1 Security Best Practices

- **DOM Sanitization:** All user text and job descriptions pass through `DOMPurify` before rendering to prevent Cross-Site Scripting (XSS) attacks.
- **Token Isolation:**
- **Access Tokens:** Stored strictly in **Redux memory** (in-memory state) and cleared when the browser tab closes.
- **Refresh Tokens:** Managed using **HTTP-Only, SameSite=Strict, Secure cookies**, preventing JavaScript access and protecting against token theft.

- **Content Security Policy (CSP):** Express backend uses `helmet` middleware to enforce strict rules regarding which domains can load scripts, styles, and images.
- **Input Validation:** All frontend forms use **Zod** schema validation to sanitize and format data before dispatching network requests.

### 6.2 Performance Best Practices

- **Code Splitting (Lazy Loading):** React `React.lazy()` and `Suspense` split heavy routes (Analytics, 3D Canvas, Resume Scorer) into smaller JavaScript bundle chunks loaded only when requested.
- **List Virtualization (`react-window`):** Large lists containing hundreds of candidates or timesheets render only the DOM nodes currently visible in the viewport, maintaining 60 FPS scrolling performance.
- **Database Pagination:** APIs must never return all records at once. All list endpoints (candidates, jobs) must implement Offset/Limit or Cursor-based pagination in Sequelize. Frontend components will use Infinite Scrolling or numbered pages to load data progressively.
- **Web Workers:** Heavy processing operations (e.g., parsing large CSV files or local data filtering) are offloaded to Web Workers using `comlink`, preventing the UI thread from freezing.

---

## 7. Testing, CI/CD Pipeline & Production Deployment

### 7.1 Comprehensive Testing Strategy & Implementation Guide

To ensure enterprise-grade stability, the team must learn and implement the following testing methodologies across the monorepo:

| Testing Type             | Tool / Framework                               | What to Learn                                                                                                              | How to Implement                                                                                                                                                                     |
| :----------------------- | :--------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Unit Testing**         | Vitest (Frontend), Jest (Backend), PyTest (AI) | Learn how to isolate functions using _mocks_ and _spies_ (e.g., mocking a database call or OpenAI API call).               | Write tests alongside new functions. For a React component, assert that a button click calls a function. For a Node route, assert that passing bad data returns a `400 Bad Request`. |
| **Integration Testing**  | Supertest (Node API)                           | Learn how to spin up an in-memory database or a test database container to test how multiple units work together.          | Use Supertest to make actual HTTP requests to the Express endpoints. Validate that a JWT token is required and that data is successfully saved to the test PostgreSQL database.      |
| **System (E2E) Testing** | Playwright                                     | Learn how to write scripts that launch a headless Chromium browser, find elements by ARIA roles, and assert UI visibility. | Create a folder `/e2e_tests`. Write a script that simulates a user logging in, uploading a resume, and viewing their AI score. Run this before deploying to production.              |
| **Performance Testing**  | Lighthouse (Frontend)                          | Learn how to interpret Core Web Vitals (Largest Contentful Paint, Cumulative Layout Shift).                                | Run Google Lighthouse audits on the candidate job board to ensure it loads in under 2 seconds and achieves a 90+ performance score.                                                  |
| **Load Testing**         | Artillery or k6                                | Learn how to simulate hundreds of concurrent users hammering the API to see at what point the server crashes.              | Write an Artillery script that sends 500 requests per second to the `GET /jobs` endpoint. Ensure the `express-rate-limit` middleware correctly blocks abusive traffic.               |
| **Security Testing**     | Dependabot, Snyk, OWASP ZAP                    | Learn how to read vulnerability reports and update NPM packages safely without breaking the app.                           | Enable Dependabot on GitHub to auto-scan dependencies. Use OWASP ZAP to scan the live staging site for vulnerabilities like XSS and SQL Injection before the final launch.           |

---

### 7.2 Automated CI/CD Pipeline Flow (GitHub Actions)

Every time a developer pushes code to GitHub, an automated pipeline executes the following stages:

```
[ Code Push to GitHub ]
           |
           v
[ Run Lint & Type Checks ] (ESLint)
           |
           v
[ Run Frontend Unit Tests ] (Vitest)
           |
           v
[ Run Express & FastAPI Tests ] (Jest + PyTest)
           |
           v
[ Build Docker Container Images ]
           |
           v
[ Deploy to Kubernetes Cluster via Helm ]

```

---

### 7.3 Production Deployment Strategy

- **Containerized Infrastructure:** All applications run inside **Docker containers** managed by **Kubernetes** on cloud platforms (AWS EKS or GCP GKE).
- **Static Asset Delivery:** Compiled frontend assets are stored in Cloud Storage (AWS S3) and delivered globally using **Cloudflare CDN** for fast load times.
- **Zero-Downtime Deployments:** Kubernetes executes **Rolling Updates**, ensuring new container versions pass health checks before older versions are shut down. Feature rollouts are managed using the **Admin Feature Flag Control Panel**.

---

## 8. Project Timeline & Delivery Milestones

**Strict Deadline:** The fully-fledged website, including all testing and production deployment, must be delivered within **One (1) Month**.

### 1-Month Accelerated Delivery Schedule:

- **Week 1: Foundation & Backend Core**
  - Database schema setup (PostgreSQL, Redis).
  - Express API Gateway and Authentication (JWT).
  - Setup GitHub Actions CI/CD pipeline.
- **Week 2: Frontend UI & AI Microservice**
  - Develop React frontend UI (Tailwind, Shadcn).
  - Build Python FastAPI microservice and integrate OpenAI/LangChain.
- **Week 3: Integration, Workflows & CMS**
  - Connect frontend to backend and AI service.
  - Implement Feature Flags, Candidate Workflows, and Admin CMS.
- **Week 4: QA Testing & Production Deployment**
  - Execute full suite of tests (Unit, API, E2E via Playwright).
  - User Acceptance Testing (UAT) and bug fixes.
  - Final production deployment to Kubernetes/Cloud.

---

## 9. Involved Domains & Required Learning Topics

### 9.1 Involved Domains

This project is a modern, full-stack application that intersects several key domains:

- **Full-Stack Web Development:** Building the user interfaces and the core API gateway.
- **Artificial Intelligence (AI) / Machine Learning:** Implementing LLM-powered candidate screening and semantic vector search for resume matching.
- **Database Management & Architecture:** Handling relational data, in-memory caching, and vector storage.
- **DevOps & Cloud Infrastructure:** Managing containerization, automated testing, and scalable deployments.

### 9.2 Required Learning Topics

**A. Frontend Development (User Interface)**

- **Core:** Modern JavaScript (ES6+) and TypeScript.
- **Frameworks & Routing:** React 18/19 (Vite) and React Router v6.
- **State Management:** Redux Toolkit (RTK) and RTK Query.
- **UI/UX Prototyping:** Figma (Designing before coding).
- **Styling & Components:** Tailwind CSS, Shadcn UI, and Radix UI.
- **3D Graphics & Animations:** Three.js (`@react-three/fiber`) and Framer Motion.
- **Security & Validation:** DOMPurify and Zod.
- **Performance:** `react-window` and Web Workers (`comlink`).
- **SEO & Analytics:** Google Analytics, PostHog, and React Helmet.

**B. Core Backend Development (API Gateway)**

- **Core Runtime & Framework:** Node.js (v20+) and Express.js.
- **Security Practices:** JSON Web Tokens (JWT), `bcryptjs`, `helmet`, and CORS.
- **Authentication:** OAuth 2.0 and Passport.js (Social SSO).
- **Database Interaction:** Sequelize ORM.
- **Real-time & Queues:** Socket.io and BullMQ (Redis).
- **Communication & Emails:** Resend, SendGrid, or AWS SES.

**C. AI Microservice Development**

- **Core Language & Framework:** Python 3.12+ and FastAPI.
- **AI Integration:** OpenAI Python SDK (GPT-4o) and LangChain.
- **Data Processing:** `pdfplumber` and `asyncpg`.

**D. Databases & Caching Layer**

- **Relational Database:** PostgreSQL (v16).
- **Data Retention:** Soft Deletes strategy (`paranoid: true`).
- **Vector Search:** `pgvector`.
- **In-Memory Storage:** Redis (v7).

**E. Quality Assurance (Testing)**

- **Unit & Integration:** Vitest, React Testing Library, Jest, Supertest, PyTest.
- **System (E2E) Testing:** Playwright.
- **Performance Testing:** Google Lighthouse.
- **Load Testing:** Artillery or k6.
- **Security Testing:** Dependabot, Snyk, and OWASP ZAP.

**F. DevOps, CI/CD, and Deployment**

- **Containerization:** Docker & Docker Desktop.
- **Automation:** GitHub Actions.
- **DevSecOps:** Automated vulnerability scanning (Dependabot/Snyk).
- **Cloud Orchestration:** Kubernetes and Helm.
- **Disaster Recovery:** Automated Database Backups (e.g., `pg_dump` to AWS S3).

---

## 10. Enterprise Readiness & Professional Best Practices

### 10.1 Additional System Capabilities

- **Application Monitoring & Error Tracking:** When the site breaks in production, you can't just check your terminal. You need to know before the client complains. Integrate **Sentry** (for backend/frontend error tracking) and **LogRocket** (to replay what the user did when a bug occurred).
- **Data Privacy & Compliance (Crucial):** Resumes contain Personally Identifiable Information (PII) like phone numbers and addresses. Strict adherence to GDPR/CCPA compliance, ensuring candidate data can be permanently deleted upon request ("Right to be Forgotten") and that backups are encrypted.
- **API Documentation:** The frontend and backend developers need a contract to work together. Add **Swagger / OpenAPI** integration (FastAPI does this automatically, but Express needs `swagger-ui-express`).

### 10.2 Development Best Practices

As students transitioning to professionals, the team must adopt these industry-standard workflows immediately:

- **Strict Environment Management:** Never hardcode passwords, API keys, or database URLs in your code. Use `.env` files. Maintain at least three separate environments:
  - **Local (Dev):** Where you write code on your laptops.
  - **Staging:** A live server that matches production exactly, used only for the business owner to test features before they go live.
  - **Production:** The live site for actual customers.
- **Git Feature-Branch Workflow & Code Reviews:** Do not push directly to the `main` branch.
  - Create a branch for every feature (e.g., `feature/ai-resume-scorer`).
  - Open a Pull Request (PR) when done.
  - **Rule:** At least one other student must review and approve the code before it merges.
- **Iterative Client Demos (Agile):** Do not disappear for a month and build the whole thing. Meet with the business owner every 1-2 weeks. Show them working parts (even if they are ugly) to ensure you are building exactly what they want.
- **Global Error Handling & Fallbacks:**
  - **Frontend:** Implement **React Error Boundaries** to catch UI crashes and display a friendly fallback UI instead of a blank white screen. Intercept all failed API calls globally (via RTK Query middleware) to show standardized toast notifications.
  - **Backend:** Create a centralized **Express Error Middleware**. Never let the Node.js server crash; catch all thrown exceptions and return a consistent JSON schema (`{ error: true, message: '...', code: 500 }`).

### 10.3 Essential "Pro" Skills to Learn

To execute this successfully, the team should spend time learning these specific topics:

- **Security Engineering (DevSecOps):** How to properly store secrets (using GitHub Secrets for CI/CD), understand CORS (Cross-Origin Resource Sharing) deeply so the frontend can securely talk to the API, and understand SQL Injection and how ORMs (like Sequelize) prevent it.
- **Monitoring and Logging:** Learn how to write structured logs. Instead of `console.log("error")`, use a logging library like **Winston** or **Pino** that outputs JSON logs (e.g., `logger.error({ event: 'AI_FAIL', userId: 123, error: e.message })`).
- **System Design & Rate Limiting:** Since the project uses OpenAI, every API call costs the business real money. Implement **Rate Limiting** (preventing a user from clicking "Generate" 100 times in a row) and Cost Guardrails to prevent bankruptcy from malicious users.
- **Client Communication & Scope Management:** Anticipate scope creep. When the business owner asks for a mobile app or payroll taxes, learn to say: _"That's a great idea, but to ensure we hit our 1-month deadline with high quality, let's put that in the 'Phase 2' backlog."_

---

## 11. Step-by-Step Developer Execution Plan

To execute this project logically without being overwhelmed, follow these sequential steps. Do not move to the next phase until the previous one is fully tested.

### Phase 1: Repository & Infrastructure Setup (Days 1-3)

1. **Initialize the Monorepo:** Setup `Turborepo` with three empty apps: `frontend` (React/Vite), `backend` (Express), and `ai_services` (FastAPI).
2. **Setup Git & CI/CD Hooks:** Install Husky, ESLint, Prettier, and lint-staged. Ensure nobody can commit broken code.
3. **Provision Databases:** Setup PostgreSQL (`pgvector` enabled) and Redis via a local `docker-compose.yml` file so every developer has the same local database.

### Phase 2: Backend Core & Database Schema (Days 4-10)

4. **Define Sequelize Models:** Write the database schema (Users, Candidates, Jobs, Timesheets) and apply **Soft Deletes**.
5. **Seed the Database:** Use `Faker.js` to populate 50 fake candidates and 10 fake jobs for testing.
6. **Implement Authentication:** Build the login/registration routes using JWT and Passport.js (Google SSO).
7. **Build CRUD Endpoints:** Create basic REST APIs for fetching jobs and candidates. **Implement Pagination.**
8. **Write Backend Tests (`backend/tests/`):** Immediately write Jest/Supertest assertions for every API endpoint before moving to the frontend.

### Phase 3: Frontend Foundation & API Wiring (Days 11-17)

8. **UI Component Library:** Install Tailwind CSS, Shadcn UI, and `react-i18next`. Create the base layout (Navbar, Sidebar).
9. **Global State & API Fetching:** Setup Redux Toolkit (RTK Query) and configure it to talk to the Express backend.
10. **Build the Core Pages:** Create the Public Job Board, the Candidate Dashboard, and the Client Pipeline.
11. **Frontend Error Handling:** Wrap the app in React Error Boundaries and configure global toast notifications for API failures.
12. **Write Frontend Tests (`frontend/src/__tests__/`):** Write Vitest/RTL tests for complex UI components and Redux slices.

### Phase 4: AI Microservice & Background Queues (Days 18-23)

12. **Build Python API:** Setup FastAPI. Write the endpoint that accepts a PDF file.
13. **Resume Parsing & Embeddings:** Use `pdfplumber` to extract text, send it to OpenAI to get embeddings, and save it to PostgreSQL `pgvector`.
14. **Asynchronous Queues:** Setup BullMQ on the Node backend. When a client uploads a resume, push a job to BullMQ, let the Python server process it, and send a WebSocket notification back to the frontend when done.

### Phase 5: "Pro" Integrations & Polish (Days 24-28)

15. **Payment Gateway:** Integrate Stripe for client invoicing.
16. **Emails:** Integrate Resend/SendGrid to send candidate interview invites.
17. **Monitoring:** Install Sentry and LogRocket on both frontend and backend.
18. **API Docs:** Add Swagger UI to the Express app.

### Phase 6: Final QA & Deployment (Days 29-30)

20. **E2E Testing (`e2e_tests/`):** Now that both UI and Backend are fully connected, write Playwright E2E browser tests for the complete "Apply to Job" flow. Run all Vitest/Jest suites in GitHub Actions.
21. **Security Scan:** Run Dependabot/Snyk to check for vulnerabilities.
22. **Deploy:** Push Docker containers to production (Kubernetes or a PaaS like Render/Heroku).
