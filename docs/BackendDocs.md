# ⚙️ ThinkWires Backend Architecture & API Documentation (`BackendDocs.md`)

This document is the authoritative guide to the **ThinkWires Backend Core** (`apps/backend`). It details the server lifecycle, dual-persistence database strategy, authentication protocols, middleware pipeline, database migrations, and a comprehensive REST API endpoint reference designed for both human engineers and AI agent workflows.

---

## 1. Architectural Overview & Design Philosophy

The ThinkWires backend is an **Express 5 API Gateway** written in modern ES Modules (`type: "module"`). It powers the ThinkWires platform with authentication, candidate portal workflows, enterprise staffing operations, and an integrated Content Management System (CMS).

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

1. **Non-Blocking Bootstrap**: The HTTP server begins listening on port 5000 _immediately_ upon execution. It does not await external database network connections, guaranteeing that frontend Vite proxy requests and health checks are never held hostage by database connection latency or timeouts.
2. **Dual-Persistence Resilience**:
   - **PostgreSQL (Sequelize)**: Manages relational records with schema auto-alter enabled in development.
   - **MongoDB (Mongoose)**: Manages unstructured document entities, CMS pages, media catalogs, blog articles, and administrative announcements across 14 collections.
   - **In-Memory Fallback Store**: If either PostgreSQL or MongoDB is offline or blocked (e.g. MongoDB Atlas IP whitelist restriction), the backend automatically and seamlessly serves mock data arrays ([`mockData.json`](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/apps/backend/src/seeds/mockData.json) and [`adminSeedData.json`](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/apps/backend/src/seeds/adminSeedData.json)), ensuring 100% development continuity.

---

## 2. Directory & File Organization

The backend is housed in [`apps/backend`](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/apps/backend):

```
apps/backend/
├── .env / .env.example       # Database credentials & JWT secrets
├── package.json              # Express, Sequelize, Mongoose, and migration scripts
├── uploads/                  # Local storage for candidate resume uploads
└── src/
    ├── app.js                # Express app initialization, CORS, cookie parser, and route mounts
    ├── server.js             # Server startup & non-blocking DB connection orchestrator
    │
    ├── configs/              # Infrastructure Configurations
    │   ├── dotenv.js         # Centralized environment variable loader
    │   ├── db.js             # Sequelize connection to Neon PostgreSQL
    │   └── mongodb.js        # Mongoose connection to MongoDB Atlas
    │
    ├── controllers/          # Business Logic Controllers
    │   ├── auth.controller.js            # Registration, login, JWT cookies, password resets
    │   ├── candidatePortal.controller.js # Dashboard metrics, candidate profile, job applications
    │   └── admin.controller.js           # 80KB+ comprehensive controller for all admin & CMS views
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
    │   ├── jobApplication.mongo.model.js # Applied candidate records & resume paths
    │   ├── media.mongo.model.js          # Digital asset library metadata
    │   ├── page.mongo.model.js           # CMS website pages
    │   ├── placement.mongo.model.js      # Billable talent deployments & contract rates
    │   ├── techStack.mongo.model.js      # Skill tags & technology directories
    │   └── user.mongo.model.js           # Candidate accounts & passwords
    │
    ├── migrations/           # Database Migration Framework
    │   ├── runner.js         # Migration executor (up, down, status, create)
    │   └── scripts/          # Version-controlled migration files
    │
    ├── routes/               # Express Route Declarations
    │   ├── admin.route.js    # All administrative & CMS management routes
    │   ├── api.route.js      # Public content APIs (talent bench, services, blog)
    │   ├── auth.route.js     # Candidate authentication endpoints
    │   └── candidate.route.js# Protected candidate portal endpoints
    │
    └── seeds/                # Seed Data & Population Scripts
        ├── adminSeedData.json# Fictional demo dataset for admin views
        ├── mockData.json     # Public content datasets (jobs, bench, stats)
        └── seedDemoData.js   # Idempotent MongoDB seed runner

apps/ai_services/
├── main.py                   # Root entrypoint (delegates to app.main:app for uvicorn)
├── package.json              # Turbo dev & test task scripts
├── requirements.txt          # Python dependencies (FastAPI, pypdf, httpx, etc.)
├── tests/                    # Automated pytest test suites (13 passing tests)
│   ├── test_api.py           # FastAPI TestClient endpoint integration tests
│   ├── test_match_scorer.py  # ATS match scoring algorithm tests
│   ├── test_resume_parser.py # Resume PDF & heuristic extraction tests
│   └── test_screening.py     # 10-Question generation & rubric grading tests
└── app/                      # Modular Application Architecture
    ├── __init__.py           # Package initialization
    ├── config.py             # Settings, environment configuration, and logger
    ├── main.py               # create_app() factory, CORS, and router registration
    ├── api/                  # API Routing Layer
    │   ├── router.py         # Root API router mounting v1 routes
    │   └── v1/               # Version 1 Sub-Routers
    │       ├── health.py     # GET / and GET /health
    │       ├── resume.py     # POST /api/resume/parse & POST /api/resume/match-score
    │       └── screening.py  # POST /api/screening/generate-test & evaluate-test
    ├── schemas/              # Pydantic Schemas & DTOs
    │   ├── resume.py         # ParsedResumeResponse, ResumeMatchRequest, etc.
    │   └── screening.py      # GenerateAssessmentRequest, EvaluateAssessmentRequest, etc.
    └── services/             # Domain Logic & ML Services
        ├── match_scorer.py   # PRD 4.3 ATS weighted scoring engine
        ├── resume_parser.py  # pypdf stream extraction and heuristic/LLM parser
        ├── test_evaluator.py # Automated grading, rubric scoring, and gatekeeper decisions
        └── test_generator.py # 10-Question assessment suite generator
```

---

## 3. Server Lifecycle & Bootstrap Sequence

Server bootstrap is defined in [`src/server.js`](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/apps/backend/src/server.js):

1. **Immediate Port Binding**: `app.listen(PORT)` is triggered on line 10. The HTTP server is instantly live.
2. **PostgreSQL Sync**: `connectDB()` connects to the Sequelize pool. In development (`NODE_ENV !== 'production'`), it executes `sequelize.sync({ alter: true })` to safely sync model schemas with table definitions.
3. **MongoDB Handshake**: `connectMongoDB()` initializes Mongoose with a 5000ms server selection timeout.
4. **Resilience Handlers**: Both database connection promises contain `.catch()` blocks that log a non-fatal warning and automatically switch the operational mode to the in-memory fallback datasets.

---

## 4. Authentication, Authorization & Security Architecture

### Candidate Authentication (`/api/auth/*`)

- **Password Security**: Hashes user passwords with `bcryptjs` using a minimum salt factor of 10.
- **Session Tokens**: Issues JSON Web Tokens (JWT) signed with `JWT_SECRET`. Tokens are stored in an **`HttpOnly`** cookie (`token`), preventing client-side JavaScript access and XSS exploitation.
- **Brute-Force Protection**: Auth routes (`/login`, `/forgot-password`, `/reset-password`) are protected by an `express-rate-limit` window restricting each IP address to 20 attempts per 15 minutes.
- **Session Verification**: The `GET /api/auth/me` endpoint checks the incoming cookie, validates the JWT, and returns the sanitized candidate profile.

### Role-Based Access Control (RBAC) in Admin Suite (`/api/admin/*`)

Admin endpoints verify permissions via [`auth.middleware.js`](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/apps/backend/src/middlewares/auth.middleware.js):

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

| Method | Endpoint                                                | Body / Query          | Description                                                                                     |
| ------ | ------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------- |
| `POST` | `/api/candidate/parse-resume`                          | `multipart/form-data` | Extracts name, contact, skills, experience, and summary from resume for instant form auto-fill  |
| `GET`  | `/api/candidate/dashboard`                              | None                  | Retrieves candidate application metrics, ATS scores, and AI assessment benchmark status         |
| `PUT`  | `/api/candidate/profile`                                | JSON (profile fields) | Updates candidate contact info, technical skills, title, expected salary, and bench work mode   |
| `GET`  | `/api/candidate/applications`                           | None                  | Fetches all submitted applications with ATS Fit Score and AI Assessment results                 |
| `POST` | `/api/candidate/apply`                                  | `multipart/form-data` | Submits application; triggers automatic ATS fit scoring and AI assessment generation            |
| `GET`  | `/api/candidate/applications/:id/assessment`            | None                  | Retrieves the proctored 10-question screening assessment generated for the application          |
| `POST` | `/api/candidate/applications/:id/assessment/submit`     | JSON (`{ answers }`)  | Evaluates assessment against rubric; stores score and updates Candidate Portal and Active Bench |

---

### C. FastAPI AI Microservice Architecture (`apps/ai_services`)

A dedicated FastAPI service (`port 8000`) communicates with the Express backend (`port 5000`) for high-performance ML inference, resume parsing, and screening generation:

| Method | Endpoint                       | Input Payload                     | Output Schema                                                                      |
| ------ | ------------------------------ | --------------------------------- | ---------------------------------------------------------------------------------- |
| `GET`  | `/`                            | None                              | Service health and version status                                                  |
| `POST` | `/api/resume/parse`            | PDF file or text string           | `first_name`, `last_name`, `email`, `phone`, `skills`, `total_experience_years`    |
| `POST` | `/api/resume/match-score`      | Candidate skills + Job spec       | `fit_score` (0-100%), `fit_badge` (`Top Match`, etc.), `matched_skills`            |
| `POST` | `/api/screening/generate-test` | Job spec + Candidate resume       | 10 questions (7 MCQs, 2 Scenarios, 1 Practical coding task) with grading criteria  |
| `POST` | `/api/screening/evaluate-test` | Test rubric + Candidate answers   | Percentage score, passed status (`>=75%`), and gatekeeper stage feedback           |

---

### C. Admin & CMS Management Routes (`/api/admin`)

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

| Method   | Endpoint                           | Description                                                                                                 |
| -------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/admin/candidates`            | Candidate ATS records across all pipeline stages                                                            |
| `POST`   | `/api/admin/candidates`            | Create candidate in ATS pipeline                                                                            |
| `PATCH`  | `/api/admin/candidates/:id/status` | Advance candidate pipeline stage (`Applied` ➔ `Screening` ➔ `Interview` ➔ `Offered` ➔ `Hired` ➔ `Rejected`) |
| `DELETE` | `/api/admin/candidates/:id`        | Archive candidate                                                                                           |

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

#### 6. CMS Suite (Pages, Blog, Media, SEO, Announcements, Tech Stack)

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
| `GET`    | `/api/admin/cms/tech-stack`                | List verified technologies and skills                         |
| `POST`   | `/api/admin/cms/tech-stack`                | Add new technology tag                                        |
| `PUT`    | `/api/admin/cms/tech-stack/:id`            | Update technology details                                     |
| `PATCH`  | `/api/admin/cms/tech-stack/:id/feature`    | Toggle featured badge on home page                            |
| `DELETE` | `/api/admin/cms/tech-stack/:id`            | Delete technology tag                                         |

---

### D. Public Content & Service Routes (`/api`)

_Public endpoints consumed by public landing pages and talent search._

| Method | Endpoint                  | Description                                           |
| ------ | ------------------------- | ----------------------------------------------------- |
| `GET`  | `/api/tech-stack`         | Returns verified tech stack categories and items      |
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

The backend includes a dedicated migration runner in [`src/migrations/runner.js`](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/apps/backend/src/migrations/runner.js):

```bash
# Apply pending migrations
npm run migrate:up

# Roll back the most recent migration
npm run migrate:down

# View status of applied migrations
npm run migrate:status
```

### Seeding Demo Data

To seed a live MongoDB cluster with fictional demonstration records (employees, clients, jobs, CMS articles):

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
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/
REDIS_URL=redis://localhost:6379
AI_SERVICE_URL=http://localhost:8000
JWT_SECRET=super_secret_jwt_key_here
```

### Common Troubleshooting Scenarios

1. **MongoDB Atlas IP Whitelist (`security-whitelist` Warning)**:
   - **Symptom**: Console logs `⚠️ MongoDB connection optional/bypassed: ... Operating with dual-mode in-memory store`.
   - **Resolution**: Open your **MongoDB Atlas Console** ➔ **Network Access** ➔ **Add IP Address**. Add your current public IP address or choose `Allow Access from Anywhere` (`0.0.0.0/0`) for development.
   - **Resilience**: The backend continues running normally even without whitelisting, utilizing the in-memory fallback dataset.

2. **File Upload Restrictions**:
   - Resumes must be **PDF**, **DOC**, or **DOCX** format.
   - Maximum file size is strictly enforced at **10 MB** in [`upload.middleware.js`](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/apps/backend/src/middlewares/upload.middleware.js).
