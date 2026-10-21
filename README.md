# 🚀 ThinkWires Staffing & Workforce Solutions

ThinkWires is an enterprise tech manpower supply, global staffing, and talent management platform connecting three core ecosystems:

1. **Clients (Enterprises & Startups)**: Sourcing pre-vetted engineers, managing staff augmentation, payroll outsourcing, and Employer of Record (EOR) contracts.
2. **Candidates (Job Seekers & Bench Talent)**: Browsing technical mandates, applying with resumes, tracking application pipeline statuses, and maintaining professional profiles.
3. **Internal Admins & Recruiters**: Operating an ATS (Applicant Tracking System), managing bench staff utilization and daily cost overhead, and administering the public website via an integrated Content Management System (CMS).

---

## 📚 Project Documentation Hub

| Document                                                                                                    | Primary Audience            | Scope & Contents                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 🌐 [**docs/FrontendDocs.md**](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/docs/FrontendDocs.md) | Frontend Engineers & Agents | React 19 architecture, Vite proxy, Redux Toolkit (13 slices), routing inventory, design tokens, Three.js canvas, and auth state.                 |
| ⚙️ [**docs/BackendDocs.md**](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/docs/BackendDocs.md)   | Backend Engineers & Agents  | Express 5 API Gateway, dual-persistence (PostgreSQL + MongoDB), non-blocking in-memory fallback, rate limiting, and complete REST API reference. |
| 🧠 [**docs/Ai_ServicesDocs.md**](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/docs/Ai_ServicesDocs.md) | AI Engineers & Agents     | Python FastAPI microservice, resume parsing, ATS match scorer, 10-question assessment generator, and automated test grader.                    |
| 🎛️ [**docs/adminPanel.md**](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/docs/adminPanel.md)     | Admins, Ops & Agents        | 15 Admin & CMS views, Recharts financial analytics, 6-stage ATS Kanban, RBAC persona switcher (`X-Demo-Role`), and live preview editors.         |
| 📄 [**docs/PRD.md**](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/docs/PRD.md)                   | Product Managers & Leads    | Product Requirements Document, business KPIs, screening test specifications, and platform roadmap.                                               |
| 🎨 [**docs/Design.md**](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/docs/Design.md)             | Designers & Developers      | Design aesthetic rules, color tokens, typography scales, glassmorphism specs, and UI guidelines.                                                 |

---

## 🏗️ System Architecture (Turborepo Monorepo)

The repository is managed via **Turborepo** (`apps/*` workspaces) to provide fast, isolated development across web, API, and machine learning services:

```
thinkwires/
├── apps/
│   ├── frontend/         # React 19 + Vite + Redux Toolkit (Port 5173)
│   ├── backend/          # Node.js + Express 5 Core API Gateway (Port 5000)
│   └── ai_services/      # Python 3.12 + FastAPI Microservice (Port 8000)
├── docs/                 # Consolidated documentation suite (Frontend, Backend, AI, Admin, PRD)
├── package.json          # Root orchestration & unified scripts
└── turbo.json            # Turborepo task pipeline configuration
```

```
                               ┌────────────────────────────────────────────────┐
                               │           Browser / Client Applications         │
                               └───────────────────────┬────────────────────────┘
                                                       │
                      ┌────────────────────────────────┴────────────────────────────────┐
                      │ HTTP / REST                                                     │ HTTP / REST
                      ▼                                                                 ▼
      ┌──────────────────────────────┐                                  ┌──────────────────────────────┐
      │   React 19 Frontend (5173)   │ ────(Vite Reverse Proxy /api)───▶│   Express 5 Backend (5000)   │
      │   - Public Marketing Pages   │                                  │   - JWT Cookie Auth & RBAC   │
      │   - Protected Candidate App  │                                  │   - Candidate Portal Routes  │
      │   - Admin Dashboard & CMS    │                                  │   - Admin & CMS Controllers  │
      └──────────────────────────────┘                                  └───────────────┬──────────────┘
                                                                                        │
                                        ┌───────────────────────────────────────────────┼──────────────────────────────┐
                                        │                                               │                              │
                                        ▼                                               ▼                              ▼
                         ┌─────────────────────────────┐                 ┌─────────────────────────────┐┌─────────────────────────────┐
                         │   PostgreSQL (Sequelize)    │                 │     MongoDB (Mongoose)      ││   FastAPI AI Service (8000) │
                         │   - Neon Cloud Database     │                 │     - Atlas Document Store  ││   - Resume Vector Scorer    │
                         │   - Relational Structures   │                 │     - CMS & Candidate ATS   ││   - AI Test Gatekeeper      │
                         └──────────────┬──────────────┘                 └──────────────┬──────────────┘└─────────────────────────────┘
                                        │                                               │
                                        └───────────────────────┬───────────────────────┘
                                                                │ (Graceful Non-Blocking Fallback)
                                                                ▼
                                                 ┌─────────────────────────────┐
                                                 │   In-Memory Mock Fallback   │
                                                 │   (mockData / adminSeeds)   │
                                                 └─────────────────────────────┘
```

---

## ✨ Key Platform Features

- **🤖 AI Screening Gatekeeper**: Auto-generates custom screening assessments matched to job requirements.
- **📄 Resume Match Scorer**: Semantic comparison of applicant resumes against requisitions to generate a **Fit Score (0–100%)**.
- **💼 Bench Management**: Monitors internal unassigned engineers on payroll, tracks daily cost overhead, and enables single-click deployment to client projects.
- **🎛️ Admin Control Panel & CMS**: 15 integrated modules for ATS recruitment, client billing, staff directories, and live website CMS (pages, blog, media, SEO, announcements).
- **🛡️ Resilient Dual-Persistence**: The backend boots instantly on port 5000 and connects non-blockingly to PostgreSQL and MongoDB. If remote connections are offline or firewalled, an automatic in-memory fallback guarantees uninterrupted UI testing and demos.

---

## 🚀 Quickstart Setup Guide

### 1️⃣ Prerequisites

- **Node.js** (v20.x or higher)
- **Python** (v3.12.x or higher)
- **Git**

### 2️⃣ Install Dependencies

Run from the root directory to install JavaScript packages across all monorepo apps:

```bash
npm install
```

### 3️⃣ Configure Environment Variables (`.env`)

Templates are provided in each application directory:

```bash
# 1. Backend environment
cp apps/backend/.env.example apps/backend/.env

# 2. Frontend environment
cp apps/frontend/.env.example apps/frontend/.env

# 3. AI microservice environment
cp apps/ai_services/.env.example apps/ai_services/.env
```

#### Backend `.env` Keys:

```ini
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/
JWT_SECRET=your_secure_random_jwt_secret
AI_SERVICE_URL=http://localhost:8000
```

### 4️⃣ Set Up AI Microservice (Python Virtual Environment)

```bash
cd apps/ai_services
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
cd ../..
```

### 5️⃣ Launch the Entire Application Suite

Run the root Turborepo development script:

```bash
npm run dev
```

Turborepo will concurrently launch:

- 🌐 **Frontend Application**: [`http://localhost:5173`](http://localhost:5173)
- ⚙️ **Express Core API**: [`http://localhost:5000`](http://localhost:5000)
- 🧠 **FastAPI AI Microservice**: [`http://localhost:8000`](http://localhost:8000) (Interactive Swagger UI: [`http://localhost:8000/docs`](http://localhost:8000/docs))

---

## 🛠️ Monorepo Scripts Reference

All primary operations can be executed from the root using npm:

| Command                  | Action                                                                       |
| ------------------------ | ---------------------------------------------------------------------------- |
| `npm run dev`            | Runs Frontend, Backend, and AI Service concurrently in persistent watch mode |
| `npm run build`          | Builds production-optimized artifacts across all workspaces via Turborepo    |
| `npm run lint`           | Runs ESLint analysis across apps                                             |
| `npm run format`         | Auto-formats the entire repository using Prettier                            |
| `npm run format:check`   | Verifies code adherence to Prettier formatting standards                     |
| `npm run migrate`        | Executes pending database migrations (`apps/backend`)                        |
| `npm run migrate:status` | Checks database migration status                                             |
| `npm run migrate:down`   | Rolls back the latest database migration                                     |

---

## 📂 Detailed Directory Map

```
thinkwires/
├── apps/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── admin/            # 15 Admin & CMS management modules
│   │   │   ├── components/       # Reusable components & 3D Three.js canvas
│   │   │   ├── pages/            # Public, Auth, and Candidate portal views
│   │   │   ├── store/            # Redux Toolkit store & 13 domain slices
│   │   │   ├── index.css         # Design tokens & responsive styles
│   │   │   └── App.jsx           # React Router v7 routes & React.lazy code-splitting
│   │   └── vite.config.js        # Vite config with /api proxy to localhost:5000
│   │
│   ├── backend/
│   │   ├── src/
│   │   │   ├── configs/          # Database (PostgreSQL, MongoDB) & env loaders
│   │   │   ├── controllers/      # Auth, Candidate Portal, and Admin controllers
│   │   │   ├── middlewares/      # JWT auth, RBAC permissions, Multer uploads
│   │   │   ├── migrations/       # Version-controlled schema migrations
│   │   │   ├── models/           # 14 Mongoose Schema definitions
│   │   │   ├── routes/           # REST endpoints (/api/auth, /api/candidate, /api/admin)
│   │   │   ├── seeds/            # Demo data fixtures & seed runners
│   │   │   ├── app.js            # Express app configuration & middlewares
│   │   │   └── server.js         # Non-blocking server bootstrap
│   │   └── uploads/              # Local storage for candidate resumes
│   │
│   └── ai_services/
│       ├── main.py               # FastAPI application entry point
│       ├── requirements.txt      # FastAPI, pypdf, httpx dependencies
│       ├── tests/                # Automated pytest suites (13 passing tests)
│       ├── app/                  # Modular package (config, schemas, services, api/v1)
│       └── venv/                 # Python virtual environment
│
├── docs/                         # Platform & Microservice Documentation
│   ├── adminPanel.md             # Admin Panel & CMS manual
│   ├── Ai_ServicesDocs.md        # Comprehensive AI Microservice architecture & API guide
│   ├── BackendDocs.md            # Detailed backend developer & agent guide
│   ├── Design.md                 # Design system, tokens, and aesthetic specifications
│   ├── FrontendDocs.md           # Detailed frontend developer & agent guide
│   └── PRD.md                    # Platform Product Requirements Document
├── package.json                  # Turborepo root configuration
└── turbo.json                    # Turborepo pipeline tasks
```

---

## 🤝 Contribution & Coding Standards

1. **Branching Strategy**: Always branch from `master` with descriptive prefixes: `feature/your-feature`, `bugfix/issue-description`, or `chore/cleanup`.
2. **Conventional Commits**: Format commit messages cleanly:
   - `feat: added candidate resume match visualizer`
   - `fix: resolved admin persona switching header persistence`
   - `docs: updated backend API documentation`
3. **Frontend Rules**: Adhere to CSS design tokens in [`index.css`](file:///c:/Users/Tanjil%20Alam/Desktop/ThinkWires/thinkwires/apps/frontend/src/index.css). Do not use arbitrary inline styles or Tailwind unless explicitly instructed.
4. **Backend Rules**: Maintain non-blocking database connections and resilient in-memory fallbacks when adding new endpoints.
