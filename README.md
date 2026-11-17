# Thinkwires Enterprise Platform

## 1. Company Details

**Thinkwires** is an enterprise technical workforce solutions, global staffing, and talent management company. The platform provides end-to-end infrastructure connecting enterprise employers, pre-vetted engineering talent, and recruitment operations across three core ecosystems:

### Core Services & Solutions
- **Staff Augmentation**: Rapid deployment of pre-vetted engineers and software specialists to scale engineering teams on demand.
- **Permanent Technical Staffing**: End-to-end recruitment pipelines with dual-score candidate validation (resume claims vs. proctored technical evaluations).
- **Employer of Record (EOR)**: Global entity compliance, cross-border payroll, benefits administration, and risk mitigation for international hires.
- **Payroll Outsourcing**: Compliant payroll processing, timesheet tracking, and invoice margin management.
- **Talent Cloud Bench**: Real-time deployment desk for active, unallocated engineers with blind profile sharing (`TW-CAND-XXXX`) and direct client interview scheduling.

### Platform Ecosystems & Users
1. **Enterprise Clients**: Submit technical requisitions, browse the verified talent bench, review blind dossiers, and manage active contractor placements.
2. **Candidates & Talent**: Discover engineering mandates, apply with resume parsing, complete AI-assisted screening assessments, and track interview pipelines.
3. **Internal HR, ATS Recruiters & CMS Admins**: Full-lifecycle Applicant Tracking System (ATS), bench utilization analytics, automated candidate notification queues, and content management (blog, legal policies, pages, and announcements).

### Corporate Information
- **Organization**: Thinkwires Staffing & Workforce Solutions
- **Industry**: Information Technology, Technical Manpower & Global Staffing
- **Support & Inquiries**: `support@thinkwires.com`
- **Headquarters**: Hyderabad, Telangana, India

---

## 2. Folder Structure

The repository is structured as an npm workspaces monorepo:

```
thinkwires/
├── apps/
│   ├── frontend/                     # React 19 Client Application (Port 5173)
│   │   ├── src/
│   │   │   ├── admin/                # 15 ATS & CMS views (Candidates, Jobs, Bench, etc.)
│   │   │   ├── components/           # Reusable UI components, Modals, Navbar, Footer
│   │   │   ├── hooks/                # Custom hooks (useDebounce, useTheme, etc.)
│   │   │   ├── pages/                # Public pages, candidate portal, and auth views
│   │   │   ├── store/                # Redux Toolkit store and domain slices
│   │   │   ├── test/                 # Vitest, React Testing Library, and MSW test suites
│   │   │   ├── App.jsx               # Route definitions with lazy loading & Suspense
│   │   │   └── main.jsx              # React application entry point
│   │   ├── index.html                # HTML entry template
│   │   ├── package.json              # Frontend dependencies and test scripts
│   │   └── vite.config.js            # Vite bundler config with /api reverse proxy
│   │
│   ├── backend/                      # Node.js & Express 5 Core API Gateway (Port 5000)
│   │   ├── src/
│   │   │   ├── configs/              # MongoDB Atlas, PostgreSQL Sequelize, Redis, and env validator
│   │   │   ├── controllers/          # Candidate Portal, Admin ATS, and Auth controllers
│   │   │   ├── middlewares/          # JWT auth, RBAC guards, CSRF defense, sanitization, Multer
│   │   │   ├── migrations/           # Deterministic PostgreSQL and MongoDB index migrations
│   │   │   ├── models/               # Mongoose document models with compound ESR indexes
│   │   │   ├── routes/               # REST API routers (/api/auth, /api/candidate, /api/admin, /healthz, /ready)
│   │   │   ├── services/             # AI gateway and external service integrations
│   │   │   ├── test/                 # Vitest backend unit, integration, and security test suites
│   │   │   ├── utils/                # S3/R2 storage adapter, dual-score logic, auth helpers
│   │   │   ├── app.js                # Express app configuration & middleware pipeline
│   │   │   └── server.js             # Server startup, 0.0.0.0 binding, graceful shutdown
│   │   ├── uploads/                  # Local fallback directory for resumes and avatars
│   │   └── package.json              # Backend dependencies and runner scripts
│   │
│   └── ai_services/                  # Python 3.12 & FastAPI Microservice (Port 8000)
│       ├── app/                      # Microservice application package (services, schemas, routes)
│       ├── tests/                    # Pytest automated test suites
│       ├── main.py                   # FastAPI server entry point
│       └── requirements.txt          # Python dependencies (FastAPI, pypdf, httpx, uvicorn)
│
├── docs/                             # Engineering guides, architecture, and security audit plans
├── thinkwires_policies_md/           # Corporate policies (privacy, terms, GDPR, data protection)
├── .dockerignore                     # Docker build exclusion rules
├── Dockerfile                        # Multi-stage rootless production container specification
├── docker-compose.yml                # Multi-container local stack (backend, MongoDB 7, PostgreSQL 16, Redis 7)
├── package.json                      # Monorepo root manifest and orchestration scripts
└── vercel.json                       # Vercel deployment and routing configuration
```

---

## 3. Setup Details

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Python**: `v3.12.x` or higher (for AI microservice)
- **Git**
- **Docker & Docker Compose** (optional, for containerized local databases)

---

### Step 1: Install Dependencies

Run the automated setup command from the repository root to install dependencies across all workspaces and set up the Python virtual environment:

```bash
# Install npm dependencies for all workspaces + configure Python AI microservice
npm run setup
```

Or install individual workspaces independently:

```bash
# Install root and workspace npm packages
npm install

# Setup Python virtual environment and install requirements
npm run install:requirements
```

---

### Step 2: Configure Environment Variables

Copy the example configuration files to `.env` in the root and respective application directories:

```bash
# Root environment
cp .env.example .env

# Backend environment
cp apps/backend/.env.example apps/backend/.env

# Frontend environment
cp apps/frontend/.env.example apps/frontend/.env

# AI Microservice environment
cp apps/ai_services/.env.example apps/ai_services/.env
```

#### Key Backend Variables (`apps/backend/.env`)
```ini
PORT=5000
HOST=0.0.0.0
NODE_ENV=development

# Database URIs
MONGODB_URI=mongodb://localhost:27017/thinkwires
DATABASE_URL=postgresql://thinkwires:thinkwires_secret@localhost:5432/thinkwires
REDIS_URL=redis://localhost:6379

# Authentication Secrets (minimum 32 characters in production)
JWT_SECRET=your_development_jwt_secret_key_32_chars_min
JWT_ADMIN_SECRET=your_development_admin_jwt_secret_32_chars
JWT_CANDIDATE_SECRET=your_development_candidate_jwt_secret_32

# Initial Superadmin Setup (Production Security Requirement)
INITIAL_SUPERADMIN_EMAIL=admin@yourcompany.com
INITIAL_SUPERADMIN_PASSWORD=ConfigureAStrongRandomPassword16Chars!
ALLOW_PRODUCTION_SEED=false

# Cloud Object Storage (optional; defaults to local disk if omitted)
STORAGE_DRIVER=local
# STORAGE_DRIVER=s3
# S3_BUCKET=thinkwires-storage
# S3_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
# S3_REGION=auto
# S3_ACCESS_KEY_ID=your_access_key_id
# S3_SECRET_ACCESS_KEY=your_secret_access_key
# CDN_DOMAIN=cdn.thinkwires.com

# Microservices & Inter-Service Security
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_API_KEY=your_secure_shared_ai_service_api_key_min_32_chars
```

---

### Step 3: Start the Development Environment

Launch all services concurrently from the root directory:

```bash
# Runs Backend (5000) and Frontend (5173) concurrently
npm run dev

# Or run all three services including Python AI Microservice (8000)
npm run dev:all
```

#### Service URLs
| Service | Local URL | Description |
| :--- | :--- | :--- |
| **Frontend** | `http://localhost:5173` | React web application and admin panel |
| **Backend API** | `http://localhost:5000` | Core Express REST API Gateway |
| **Liveness Probe** | `http://localhost:5000/healthz` | Process liveness healthcheck |
| **Readiness Probe** | `http://localhost:5000/ready` | Datastore readiness probe |
| **AI Microservice** | `http://localhost:8000` | FastAPI resume scoring microservice |
| **Interactive API Docs**| `http://localhost:8000/docs` | Swagger / OpenAPI interface for AI service |

---

### Step 4: Docker Container Setup (Alternative)

To run the complete platform using containerized databases (MongoDB, PostgreSQL, Redis) and the backend API:

```bash
# Build and start all services in the background
docker compose up -d

# View service logs
docker compose logs -f backend

# Stop all containers
docker compose down
```

---

### Step 5: Database Migrations & Seeds

```bash
# Run pending PostgreSQL migrations
npm run migrate

# Check migration status
npm run migrate:status

# Seed database with initial fixtures (development)
npm run seed
```

---

### Step 6: Testing & Quality Assurance

```bash
# Run all unit tests across the monorepo
npm test

# Run backend unit tests specifically (Vitest)
npm run test:unit

# Run frontend tests (Vitest + React Testing Library)
npm --prefix apps/frontend run test

# Production bundle build
npm run vercel-build
```

---

## 7. Production Deployment & Security Requirements

### 1. Boot-Time Secret Enforcement
In production (`NODE_ENV=production`), the application halts startup immediately if critical secrets are omitted or set to localhost:
- `JWT_SECRET`, `JWT_ADMIN_SECRET`, and `JWT_CANDIDATE_SECRET` must each be at least 32 characters, cryptographically random, and pairwise distinct.
- `MONGODB_URI` and `DATABASE_URL` must point to production-managed database clusters, not `127.0.0.1` or `localhost`.
- `AI_SERVICE_API_KEY` must match between the backend and AI microservice containers.

### 2. Initial Superadmin Provisioning
On first production deployment:
1. Configure `INITIAL_SUPERADMIN_EMAIL` and a strong `INITIAL_SUPERADMIN_PASSWORD` (min 16 characters, uppercase, lowercase, numbers, symbols).
2. Set `ALLOW_PRODUCTION_SEED=true` during the initial deployment run only.
3. Execute `npm run seed`. Only the superadmin administrator account is provisioned; demo candidates, mock clients, and fake placements are skipped.
4. Unset or set `ALLOW_PRODUCTION_SEED=false` for ongoing production runtime.

### 3. Cloud Object Storage (S3 / Cloudflare R2)
For production container environments (Render, Railway, AWS ECS, GCP Cloud Run), ephemeral local disk storage must be decoupled:
1. Set `STORAGE_DRIVER=s3`.
2. Configure `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, and optionally `S3_ENDPOINT` (e.g. `https://<account_id>.r2.cloudflarestorage.com`) and `CDN_DOMAIN`.
3. Pre-signed download URLs and SigV4 signed PUT/DELETE requests are generated automatically with zero external dependencies.

### 4. Health Checks & SRE Probes
- **Liveness Probe**: `GET /healthz` returns HTTP 200 `{ status: "alive" }` for Kubernetes/Docker container restarts.
- **Readiness Probe**: `GET /ready` returns HTTP 200 if MongoDB is connected, or HTTP 503 if disconnected, preventing traffic routing to unready replicas.
- **Public Health Check**: `GET /api/health` returns minimal `{ status: "healthy" }` without leaking infrastructure details. Detailed diagnostics require authenticated operator credentials or `x-monitoring-key`.

