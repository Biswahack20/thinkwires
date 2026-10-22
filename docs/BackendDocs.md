# ThinkWires Backend Architecture and API Documentation (BackendDocs.md)

This document is the authoritative guide to the **ThinkWires Backend Core** (`apps/backend`). It details the server lifecycle, dual-persistence database strategy, connection resilience, authentication protocols, middleware pipeline, database migrations, and a comprehensive REST API endpoint reference designed for both human engineers and AI agent workflows.

---

## 1. Architectural Overview and Design Philosophy

The ThinkWires backend is an **Express 5 API Gateway** written in modern ES Modules (`type: "module"`). It powers the ThinkWires platform with authentication, candidate portal workflows, enterprise staffing operations, recruitment email dispatching, and an integrated Content Management System (CMS).

```
                            ┌────────────────────────────────────────┐
                            │      React 19 Frontend (Port 5173)     │
                            └───────────────────┬────────────────────┘
                                                │ (HTTP / JSON / Cookies)
                                                ▼
                     ┌─────────────────────────────────────────────────────┐
                     │         Express 5 API Gateway (Port 5000)          │
                     │  - CORS & Cookie Parser                             │
                     │  - Rate Limiting                                    │
                     │  - Role-Based Access Control (RBAC)                 │
                     │  - Multer File Uploads                              │
                     └─────────┬──────────────────────┬────────────────────┘
                               │                      │
                  ┌────────────▼─────────┐    ┌───────▼─────────────┐
                  │ PostgreSQL (Sequelize)│    │ MongoDB (Mongoose)  │
                  │ (Neon Serverless)    │    │ (Atlas Cluster)     │
                  └────────────┬─────────┘    └───────┬─────────────┘
                               │                      │
                               └───────────┬──────────┘
                                           │ (Connection Failures)
                                           ▼
                              ┌─────────────────────────┐
                              │ In-Memory Fallback Store│
                              │ (mockData / adminSeeds) │
                              └─────────────────────────┘
```

### Core Design Principles

1. **Non-Blocking Bootstrap**: The HTTP server begins listening on port 5000 immediately upon execution. It does not await external database network connections, guaranteeing that frontend Vite proxy requests and health checks are never held hostage by database connection latency or timeouts.
2. **Dual-Persistence Resilience**:
   - **PostgreSQL (Sequelize)**: Manages relational records with schema auto-alter enabled in development.
   - **MongoDB (Mongoose)**: Manages unstructured document entities, CMS pages, media catalogs, blog articles, and administrative announcements across 14 collections.
   - **Atlas Connection Pooling and Supervisor**: Configured with explicit IPv4 DNS resolution (`family: 4`), `maxIdleTimeMS: 60000`, `heartbeatFrequencyMS: 10000`, and `serverSelectionTimeoutMS: 15000`. An automated health supervisor monitors connection states and initiates graceful auto-reconnections if idle cluster drops occur.
   - **In-Memory Fallback Store**: If either PostgreSQL or MongoDB is offline or blocked, the backend seamlessly serves in-memory mock data arrays (`mockData.json` and `adminSeedData.json`), ensuring uninterrupted development continuity.

---

## 2. Directory and File Organization

The backend is housed in `apps/backend`:

```
apps/backend/
├── .env / .env.example       # Database credentials, SMTP settings & JWT secrets
├── package.json              # Express, Sequelize, Mongoose, and migration scripts
├── uploads/                  # Local storage for candidate resume uploads (.gitignore protected)
│   └── resumes/              # Uploaded PDF and DOCX documents
└── src/
    ├── app.js                # Express app initialization, CORS, cookie parser, and route mounts
    ├── server.js             # Server startup & non-blocking DB connection orchestrator
    │
    ├── configs/              # Infrastructure Configurations
    │   ├── dotenv.js         # Centralized environment variable loader
    │   ├── db.js             # Sequelize connection to Neon PostgreSQL
    │   └── mongodb.js        # Mongoose connection to MongoDB Atlas with connection pool and auto-reconnect
    │
    ├── controllers/          # Business Logic Controllers
    │   ├── auth.controller.js            # Registration, login, JWT cookies, password resets
    │   ├── candidatePortal.controller.js # Dashboard metrics, candidate profile, job applications, withdrawals
    │   └── admin.controller.js           # Comprehensive controller for all admin & CMS views
    │
    ├── middlewares/          # Request Pipeline Interceptors
    │   ├── auth.middleware.js   # Candidate JWT cookie verification & Admin RBAC
    │   └── upload.middleware.js # Multer disk storage and PDF/DOCX file validation
    │
    ├── models/               # Mongoose Schema Definitions (14 Models)
    │   ├── activity.mongo.model.js       # Operational audit stream logs
    │   ├── announcement.mongo.model.js   # Corporate broadcast notifications
    │   ├── article.mongo.model.js        # CMS blog articles
    │   ├── candidate.mongo.model.js      # ATS candidate pipeline records
    │   ├── client.mongo.model.js         # Corporate enterprise accounts
    │   ├── employee.mongo.model.js       # Technical workforce & bench personnel
    │   ├── job.mongo.model.js            # Open staffing requisitions
    │   ├── jobApplication.mongo.model.js # Applied candidate records, terms consent, and resume paths
    │   ├── media.mongo.model.js          # Digital asset library metadata
    │   ├── page.mongo.model.js           # CMS website pages
    │   ├── placement.mongo.model.js      # Billable talent deployments & contract rates
    │   └── user.mongo.model.js           # Candidate accounts & passwords
    │
    ├── migrations/           # Database Migration Framework
    │   ├── runner.js         # Migration executor (up, down, status, create)
    │   └── scripts/          # Version-controlled migration files
    │
    ├── routes/               # Express Route Declarations
    │   ├── admin.route.js    # Administrative & CMS management routes
    │   ├── api.route.js      # Public content APIs (talent bench, services, blog)
    │   ├── auth.route.js     # Candidate authentication endpoints
    │   └── candidate.route.js# Protected candidate portal endpoints
    │
    ├── utils/                # Helper Utilities
    │   ├── auth.util.js      # JWT signing and verification helpers
    │   ├── logger.js         # Structured JSON logging utility
    │   └── recruitmentEmail.util.js # SMTP recruitment and candidate notification dispatcher
    │
    ├── test/                 # 5-Layer Automated Testing Suite (Vitest + Supertest)
    │   ├── setup.js          # Test environment bootstrap and teardown
    │   ├── test-helper.js    # Supertest client initialization and test JWT generator
    │   ├── unit/             # Unit tests for middlewares, utils, and pure functions
    │   ├── integration/      # API integration tests with Supertest against Express app
    │   ├── functional/       # End-to-end multi-step candidate user lifecycle journeys
    │   ├── non-functional/   # Performance benchmarks, latency SLAs, SQL/NoSQL injection defense
    │   └── exploratory/      # Chaos engineering, fuzzing, and corrupted payload resilience
    │
    └── seeds/                # Seed Data & Population Scripts
        ├── adminSeedData.json# Fictional demo dataset for admin views
        ├── mockData.json     # Public content datasets (jobs, bench, stats)
        └── seedDemoData.js   # Idempotent MongoDB seed runner
```

---

## 3. Server Lifecycle and Connection Resilience

Server bootstrap is defined in `src/server.js`:

1. **Immediate Port Binding**: `app.listen(PORT)` is triggered right away, binding port 5000 synchronously.
2. **PostgreSQL Sync**: `connectDB()` connects to the Sequelize pool. In development (`NODE_ENV !== 'production'`), it safely synchronizes model definitions using `alter: true`.
3. **MongoDB Connection**: `connectMongoDB()` initializes Mongoose with configured connection options:
   - `family: 4`: Forces IPv4 DNS lookups to prevent Node.js dual-stack IPv6 resolution timeouts on Atlas.
   - `maxIdleTimeMS: 60000`: Automatically cleans up idle sockets before cloud NAT firewalls sever them.
   - `heartbeatFrequencyMS: 10000`: Regularly verifies cluster topology and replica set health.
   - `serverSelectionTimeoutMS: 15000`: Sets a responsive connection timeout.
4. **Active Reconnection Supervisor**: An interval timer checks `mongoose.connection.readyState`. If the cluster disconnects unexpectedly, the supervisor triggers a reconnection automatically.
5. **In-Memory Fallback**: Both database connection routines contain error catches that safely preserve in-memory operational datasets so development and testing proceed without interruptions.

---

## 4. Authentication, Authorization, and Compliance

### Candidate Authentication (`/api/auth/*`)

- **Password Security**: Hashes user passwords with `bcryptjs` using a minimum salt factor of 10.
- **Session Tokens**: Issues JSON Web Tokens (JWT) signed with `JWT_SECRET`. Tokens are stored in an **`HttpOnly`** cookie (`token`), preventing client-side JavaScript access and XSS exploitation.
- **Brute-Force Protection**: Auth routes (`/login`, `/forgot-password`, `/reset-password`) are protected by an `express-rate-limit` window restricting each IP address to 20 attempts per 15 minutes.
- **Session Verification**: The `GET /api/auth/me` endpoint checks incoming cookies, validates the JWT, and returns the sanitized candidate profile.

### Role-Based Access Control (RBAC) in Admin Suite (`/api/admin/*`)

Admin endpoints verify permissions via `auth.middleware.js`:

- Reads the **`X-Demo-Role`** HTTP request header or user session.
- **Supported Personas**:
  - `superadmin`: Unrestricted access across all manpower, financial, CMS, and system member management.
  - `admin`: Manages workforce, candidates, clients, jobs, placements, and CMS resources.
  - `cms_admin`: Exclusive access to website pages, blog articles, media library, and SEO.
  - `editor`: Can create/edit CMS content and post jobs, but cannot alter system members or platform settings.
  - `viewer`: Read-only access (`GET` requests permitted; all mutation attempts receive `403 Forbidden`).

---

## 5. Complete REST API Endpoint Reference

### A. Candidate Authentication Routes (`/api/auth`)

| Method | Endpoint                    | Auth   | Description                                                      |
| ------ | --------------------------- | ------ | ---------------------------------------------------------------- |
| `POST` | `/api/auth/register`        | None   | Register new candidate account (`fullName`, `email`, `password`) |
| `POST` | `/api/auth/login`           | None   | Authenticate candidate; sets `HttpOnly` JWT cookie               |
| `POST` | `/api/auth/logout`          | None   | Clears `token` cookie and terminates session                     |
| `GET`  | `/api/auth/me`              | Cookie | Restores candidate session from `HttpOnly` cookie                |
| `POST` | `/api/auth/forgot-password` | None   | Generates and dispatches password recovery link                  |
| `POST` | `/api/auth/reset-password`  | None   | Updates candidate password via valid reset token                 |

---

### B. Candidate Portal & AI Screening Routes (`/api/candidate`)

| Method | Endpoint                                            | Body / Query          | Description                                                                                                                                        |
| ------ | --------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/api/candidate/parse-resume`                       | `multipart/form-data` | Extracts name, contact, skills, experience, summary, and links (LinkedIn, GitHub, portfolio) from PDF/DOCX for form prefill                        |
| `GET`  | `/api/candidate/dashboard`                          | None                  | Retrieves candidate application metrics, ATS scores, and AI assessment benchmark status                                                            |
| `PUT`  | `/api/candidate/profile`                            | JSON (profile fields) | Updates candidate contact info, technical skills, title, expected salary, and bench work mode                                                      |
| `GET`  | `/api/candidate/applications`                       | None                  | Fetches all submitted applications with ATS Fit Score and AI Assessment results                                                                    |
| `POST` | `/api/candidate/apply`                              | `multipart/form-data` | Submits application; enforces candidate authentication, verifies Terms & Conditions agreement (`agreedToTerms`), triggers ATS scoring & assessment |
| `POST` | `/api/candidate/applications/:id/withdraw`          | None                  | Withdraws an active job application and sets status to 'Withdrawn'                                                                                 |
| `GET`  | `/api/candidate/applications/:id/assessment`        | None                  | Retrieves the proctored 10-question screening assessment generated for the application                                                             |
| `POST` | `/api/candidate/applications/:id/assessment/submit` | JSON (`{ answers }`)  | Evaluates assessment against rubric; stores score and updates Candidate Portal and Active Bench                                                    |

---

### C. FastAPI AI Microservice Architecture (`apps/ai_services`)

A dedicated FastAPI service (`port 8000`) communicates with the Express backend (`port 5000`) for high-performance ML inference, resume parsing, and screening generation:

| Method | Endpoint                       | Input Payload                   | Output Schema                                                                                                                  |
| ------ | ------------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `GET`  | `/`                            | None                            | Service health and version status                                                                                              |
| `POST` | `/api/resume/parse`            | PDF file or text string         | `first_name`, `last_name`, `email`, `phone`, `skills`, `total_experience_years`, `linkedin_url`, `github_url`, `portfolio_url` |
| `POST` | `/api/resume/match-score`      | Candidate skills + Job spec     | `fit_score` (0-100%), `fit_badge` (`Top Match`, etc.), `matched_skills`                                                        |
| `POST` | `/api/screening/generate-test` | Job spec + Candidate resume     | 10 questions (7 MCQs, 2 Scenarios, 1 Practical coding task) with grading criteria                                              |
| `POST` | `/api/screening/evaluate-test` | Test rubric + Candidate answers | Percentage score, passed status (`>=75%`), and gatekeeper stage feedback                                                       |

---

### D. Admin & CMS Management Routes (`/api/admin`)

_All routes require admin authentication and respect `X-Demo-Role` persona permissions._

#### 1. Dashboard & Core Analytics

| Method | Endpoint                | Query Parameters               | Description                                                         |
| ------ | ----------------------- | ------------------------------ | ------------------------------------------------------------------- |
| `GET`  | `/api/admin/stats`      | `?period=month\|quarter\|year` | Dashboard KPIs, revenue charts, recent placements, announcements    |
| `GET`  | `/api/admin/activities` | `?limit=20`                    | Operational audit trail stream                                      |
| `GET`  | `/api/admin/auth/me`    | None                           | Current persona, permission flags, and database connectivity status |

#### 2. Workforce & Manpower Management

| Method   | Endpoint                   | Description                                                        |
| -------- | -------------------------- | ------------------------------------------------------------------ |
| `GET`    | `/api/admin/employees`     | Search & paginated list of technical workforce (Bench vs Deployed) |
| `POST`   | `/api/admin/employees`     | Create workforce employee record                                   |
| `PUT`    | `/api/admin/employees/:id` | Update employee information or deployment status                   |
| `DELETE` | `/api/admin/employees/:id` | Remove employee record                                             |

#### 3. Candidate ATS Pipeline

| Method   | Endpoint                           | Description                                                                                                      |
| -------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/admin/candidates`            | Candidate ATS records across all pipeline stages, synchronized with JobApplication submissions                   |
| `POST`   | `/api/admin/candidates`            | Create candidate in ATS pipeline                                                                                 |
| `PATCH`  | `/api/admin/candidates/:id/status` | Advance candidate pipeline stage (`Applied` -> `Screening` -> `Interview` -> `Offered` -> `Hired` -> `Rejected`) |
| `DELETE` | `/api/admin/candidates/:id`        | Archive candidate                                                                                                |

#### 4. Corporate Clients & Requisitions

| Method   | Endpoint                 | Description                    |
| -------- | ------------------------ | ------------------------------ |
| `GET`    | `/api/admin/clients`     | List corporate client accounts |
| `POST`   | `/api/admin/clients`     | Register new corporate client  |
| `PUT`    | `/api/admin/clients/:id` | Update client details          |
| `DELETE` | `/api/admin/clients/:id` | Archive client                 |
| `GET`    | `/api/admin/jobs`        | List staffing requisitions     |
| `POST`   | `/api/admin/jobs`        | Post new staffing requisition  |
| `PUT`    | `/api/admin/jobs/:id`    | Update job requisition details |
| `DELETE` | `/api/admin/jobs/:id`    | Close staffing requisition     |

#### 5. Placements & System Members

| Method   | Endpoint                        | Description                                                               |
| -------- | ------------------------------- | ------------------------------------------------------------------------- |
| `GET`    | `/api/admin/placements`         | List active billable client deployments                                   |
| `POST`   | `/api/admin/placements`         | Deploy candidate/employee to client mandate (checks duplicate deployment) |
| `PUT`    | `/api/admin/placements/:id`     | Update placement status or billing rates                                  |
| `DELETE` | `/api/admin/placements/:id`     | Terminate placement                                                       |
| `GET`    | `/api/admin/system-members`     | List administrative users & assigned RBAC roles                           |
| `POST`   | `/api/admin/system-members`     | Invite new system member                                                  |
| `PUT`    | `/api/admin/system-members/:id` | Update member role or status                                              |
| `DELETE` | `/api/admin/system-members/:id` | Revoke member access                                                      |

#### 6. CMS Suite (Pages, Blog, Media, SEO, Announcements)

| Method   | Endpoint                                   | Description                                                   |
| -------- | ------------------------------------------ | ------------------------------------------------------------- |
| `GET`    | `/api/admin/cms/stats`                     | CMS overview metrics (pages, published articles, media items) |
| `GET`    | `/api/admin/cms/pages`                     | List all website pages                                        |
| `POST`   | `/api/admin/cms/pages`                     | Create new website page with slug                             |
| `PUT`    | `/api/admin/cms/pages/:id`                 | Update page metadata & content blocks                         |
| `PATCH`  | `/api/admin/cms/pages/:id/publish`         | Toggle page draft vs published state                          |
| `DELETE` | `/api/admin/cms/pages/:id`                 | Delete page                                                   |
| `GET`    | `/api/admin/cms/articles`                  | List blog articles                                            |
| `POST`   | `/api/admin/cms/articles`                  | Author and publish new article                                |
| `PUT`    | `/api/admin/cms/articles/:id`              | Update article body, tags, read time                          |
| `PATCH`  | `/api/admin/cms/articles/:id/publish`      | Toggle article publication                                    |
| `DELETE` | `/api/admin/cms/articles/:id`              | Delete article                                                |
| `GET`    | `/api/admin/cms/media`                     | List registered media assets                                  |
| `POST`   | `/api/admin/cms/media`                     | Register asset URL, dimensions, and type                      |
| `DELETE` | `/api/admin/cms/media/:id`                 | Delete media asset                                            |
| `GET`    | `/api/admin/cms/seo`                       | Get global site SEO and page-level directives                 |
| `PUT`    | `/api/admin/cms/seo`                       | Save SEO meta titles, descriptions, and OG share tags         |
| `GET`    | `/api/admin/cms/announcements`             | List corporate broadcast alerts                               |
| `POST`   | `/api/admin/cms/announcements`             | Create broadcast alert                                        |
| `PATCH`  | `/api/admin/cms/announcements/:id/publish` | Toggle announcement visibility                                |
| `DELETE` | `/api/admin/cms/announcements/:id`         | Remove announcement                                           |

---

### E. Public Content & Service Routes (`/api`)

_Public endpoints consumed by public landing pages and talent search._

| Method | Endpoint                  | Description                                           |
| ------ | ------------------------- | ----------------------------------------------------- |
| `GET`  | `/api/tech-stack`         | Returns static tech stack items                       |
| `GET`  | `/api/openings`           | Returns active job openings with department filtering |
| `GET`  | `/api/stats`              | Returns company milestones, placements, and metrics   |
| `GET`  | `/api/industries`         | Returns industry vertical data                        |
| `GET`  | `/api/bench`              | Returns talent bench pool for public client browsing  |
| `GET`  | `/api/articles`           | Returns published blog articles                       |
| `GET`  | `/api/payroll`            | Returns payroll outsourcing content and FAQ data      |
| `GET`  | `/api/eor`                | Returns Employer of Record service breakdown          |
| `GET`  | `/api/staff-augmentation` | Returns staff augmentation engagement models          |
| `GET`  | `/api/permanent-staffing` | Returns executive search & permanent hiring models    |
| `POST` | `/api/contact`            | Receives client enterprise staffing inquiry           |

---

## 6. Database Migrations & Seeds

### Running Migrations

The backend includes a dedicated migration runner in `src/migrations/runner.js`:

```bash
# Apply pending migrations
npm run migrate:up

# Roll back the most recent migration
npm run migrate:down

# View status of applied migrations
npm run migrate:status
```

### Seeding Demo Data

To seed a live MongoDB cluster with demonstration records (employees, clients, jobs, CMS articles):

```bash
cd apps/backend
npm run seed
```

_Note: Seeding is idempotent and uses `findOneAndUpdate` with `upsert: true` to prevent duplicate record generation._

---

## 7. Environment Variables & Troubleshooting

### Environment Variable Reference (`apps/backend/.env`)

```ini
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/thinkwire_db
REDIS_URL=redis://localhost:6379
AI_SERVICE_URL=http://localhost:8000
JWT_SECRET=super_secret_jwt_key_here

# SMTP Recruitment Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=careers@thinkwires.com
SMTP_PASS=your_app_password
SMTP_SECURE=false
EMAIL_FROM="ThinkWires Recruitment" <careers@thinkwires.com>
RECRUITMENT_NOTIFICATION_EMAIL=recruitment@thinkwires.com
```

### Common Troubleshooting Scenarios

1. **MongoDB Atlas IP Whitelisting**:
   - **Symptom**: Console logs `MongoDB connection error: ... Operating with dual-mode in-memory store`.
   - **Resolution**: Open your **MongoDB Atlas Console** -> **Network Access** -> **Add IP Address**. Add your current public IP address or choose `Allow Access from Anywhere` (`0.0.0.0/0`) for development.
   - **Resilience**: The backend continues running normally even if network whitelisting is delayed, utilizing the in-memory fallback dataset.

2. **File Upload Restrictions**:
   - Resumes must be **PDF**, **DOC**, or **DOCX** format.
   - Maximum file size is strictly enforced at **10 MB** in `upload.middleware.js`.
   - Resume files stored in `apps/backend/uploads/resumes/` are ignored by Git, preserving directory structure through `.gitkeep`.

---

## 8. Backend Automated Testing Architecture & Quality Assurance

ThinkWires Backend utilizes **Vitest** paired with **Supertest** for testing. Following project conventions, all backend test suites, fixtures, helpers, and mocks are organized inside `apps/backend/src/test/`.

### 8.1 The 5-Layer Testing Taxonomy

| Test Category                   | Directory                  | Purpose                                                                                                                                                                                                                  | Key Test Files                                                              |
| :------------------------------ | :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| **Unit Testing**                | `src/test/unit/`           | Tests individual pure functions, password hashing/salting, token generation, and isolated Express middleware guards without database dependencies.                                                                       | `auth.util.test.js`, `auth.middleware.test.js`, `upload.middleware.test.js` |
| **Integration Testing**         | `src/test/integration/`    | Tests live Express endpoints using Supertest, verifying HTTP routing, request parsing, cookie headers, and controller interactions with in-memory fallback stores.                                                       | `auth.api.test.js`, `candidate.api.test.js`, `health.api.test.js`           |
| **Functional Testing**          | `src/test/functional/`     | Tests multi-step user business journeys that reflect authentic end-user flows across sequential API calls (e.g. register -> login -> inspect session -> update profile -> view applications -> logout).                  | `candidate-journey.functional.test.js`                                      |
| **Non-Functional Testing**      | `src/test/non-functional/` | Evaluates performance SLAs (sub-250ms response latency, concurrent burst throughput) and adversarial security boundaries (SQL injection probes, NoSQL operator injection, HttpOnly/SameSite cookie security attributes). | `performance.test.js`, `security-injection.test.js`                         |
| **Exploratory & Chaos Testing** | `src/test/exploratory/`    | Subjects endpoints to unpredictable input combinations, corrupted JSON bodies, deeply nested tree structures, and malformed characters to ensure zero unhandled server crashes.                                          | `chaos-fuzzing.test.js`                                                     |

### 8.2 Execution Scripts

All test suites can be executed via `npm` from the monorepo root or directly within `apps/backend`:

```bash
# Run all backend tests (all 5 layers)
npm --prefix apps/backend test

# Run tests in interactive watch mode
npm --prefix apps/backend run test:watch

# Run tests with code coverage metrics
npm --prefix apps/backend run test:coverage

# Target specific testing layers
npm --prefix apps/backend run test:unit
npm --prefix apps/backend run test:integration
npm --prefix apps/backend run test:functional
npm --prefix apps/backend run test:non-functional
npm --prefix apps/backend run test:exploratory

# Run workspace-wide tests (Frontend Vitest + Backend Vitest in parallel via Turborepo)
npm test
```

### 8.3 In-Memory Hermetic Test Environment

The test suite runs **hermetically without requiring live cloud database instances**:

- `NODE_ENV=test` triggers in-memory mock fallback mode.
- Express router requests invoke the real controller logic and middlewares without mocking Supertest.
- JWT cookies are minted cryptographically with matching test secrets to test realistic session handling.
