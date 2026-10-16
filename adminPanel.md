# ThinkWires — Admin Dashboard & CMS Overview (`adminPanel.md`)

## 1. Overview & Project Objective

The **ThinkWires Admin Panel & Content Management System (CMS)** is a functional, enterprise-grade demonstration of a tech manpower supply and global staffing management platform integrated directly into the ThinkWires repository.

It delivers real frontend-backend-database interactions, role-based permission enforcement, live metrics calculation, interactive data visualizations, and full CMS capabilities without affecting the existing ThinkWires public website or its responsive design.

---

## 2. Technology Stack & Design Architecture

* **Frontend Framework**: React 19 (Vite)
* **Routing**: React Router DOM (v7) with `React.lazy()` and `<Suspense>` code-splitting
* **Styling**: Modular CSS (`admin.css`) with CSS custom properties (theme tokens)
* **Charts & Visualizations**: Recharts
* **Backend Runtime**: Node.js & Express (ES Modules)
* **Database & ORM**: MongoDB with Mongoose
* **Persistence Model**: **Dual-Mode Architecture**
  * *Live Mode*: Persistent Mongoose models connected via `MONGODB_URI`.
  * *Resilient Fallback Mode*: Instant in-memory/JSON store initialized from `adminSeedData.json` so the dashboard runs seamlessly even if MongoDB is not locally running.
* **Role-Based Access Control (RBAC)**: Backend middleware verifying `X-Demo-Role` headers (`admin`, `editor`, `viewer`).

---

## 3. Brand Identity & Design System Tokens

The admin panel follows a clean corporate interface designed around ThinkWires' verified emerald green palette:

| Token Name | Hex Code | Purpose |
|---|---|---|
| `--tw-emerald` | `#008F68` | Primary brand emerald green, active highlights, primary buttons |
| `--tw-emerald-hover` | `#007A58` | Interactive hover states for primary actions |
| `--tw-emerald-dark` | `#006548` | Dark green for headings, brand badges, and contrast borders |
| `--tw-emerald-light` | `#E6F4F0` | Soft emerald background for active nav items and pills |
| `--tw-blue` | `#3478D4` | Secondary actions, technical skill tags, SRE/DevOps indicators |
| `--tw-violet` | `#8064D8` | CMS indicators, AI/editorial tags, and candidate pipeline accents |
| `--tw-bg` | `#F4F7FB` | Main application canvas background |
| `--tw-card` | `#FFFFFF` | Card, modal, table, and sidebar background |
| `--tw-text-primary` | `#172033` | Deep slate primary text for maximum readability |
| `--tw-text-secondary` | `#64748B` | Subtitles, labels, and secondary metadata |
| `--tw-border` | `#E2E8F0` | Subtle clean card and container borders |
| `--tw-success` | `#16A34A` | Success states, active placements, and published tags |
| `--tw-warning` | `#D97706` | Pending, in-progress, bench, and urgent tags |
| `--tw-error` | `#DC2626` | Destructive actions, rejected candidates, terminated contracts |

---

## 4. Directory & File Organization

All admin and CMS code adheres to the existing monorepo structure:

```
thinkwires/
├── apps/
│   ├── frontend/
│   │   └── src/
│   │       ├── admin/                      # Dedicated Admin & CMS directory
│   │       │   ├── admin.css               # Design system tokens and responsive styles
│   │       │   ├── adminService.js         # API client with dynamic persona injection
│   │       │   ├── AdminLayout.jsx         # Topbar, collapsible sidebar, notifications
│   │       │   ├── AdminDashboard.jsx      # KPI cards, Recharts, period filters, audit stream
│   │       │   ├── EmployeesView.jsx       # Technical workforce directory & CRUD
│   │       │   ├── CandidatesView.jsx      # ATS pipeline Kanban & candidate intake
│   │       │   ├── ClientsView.jsx         # Corporate client accounts management
│   │       │   ├── JobsView.jsx            # Staffing requisitions & headcount allocation
│   │       │   ├── PlacementsView.jsx      # Billable client deployments & rate tracking
│   │       │   ├── CmsDashboard.jsx        # CMS workspace stats & module launcher
│   │       │   ├── PagesManager.jsx        # Website pages manager with live preview
│   │       │   ├── BlogManager.jsx         # Blog articles authoring & publishing
│   │       │   ├── MediaLibrary.jsx        # Modular media asset library with copyable URLs
│   │       │   ├── SeoManager.jsx          # SEO meta directives & Google SERP preview
│   │       │   └── AnnouncementsManager.jsx # Corporate broadcasts & alerts
│   │       ├── App.jsx                     # Code-split lazy routes for /admin/*
│   │       └── components/common/Footer.jsx # Public footer link to Admin Portal Demo
│   │
│   └── backend/
│       └── src/
│           ├── controllers/
│           │   └── admin.controller.js     # Unified dual-mode controller
│           ├── middlewares/
│           │   └── auth.middleware.js      # Role verification & 403 enforcement
│           ├── models/                     # Mongoose Schemas
│           │   ├── employee.mongo.model.js
│           │   ├── candidate.mongo.model.js
│           │   ├── client.mongo.model.js
│           │   ├── job.mongo.model.js
│           │   ├── placement.mongo.model.js
│           │   ├── page.mongo.model.js
│           │   ├── article.mongo.model.js
│           │   ├── media.mongo.model.js
│           │   ├── announcement.mongo.model.js
│           │   ├── activity.mongo.model.js
│           │   └── user.mongo.model.js
│           ├── routes/
│           │   └── admin.route.js          # REST endpoints for admin & CMS
│           └── seeds/
│               ├── adminSeedData.json      # Repeatable fictional demo dataset
│               └── seedDemoData.js         # Idempotent MongoDB seed runner
```

---

## 5. Detailed Module Breakdown

### 5.1. Top Navigation & Global Controls
* **Brand Indicator**: `ThinkWires ADMIN` badge.
* **Global Search**: Search across talent, clients, and pages.
* **Interactive Persona Switcher**: Switch between **Admin**, **Editor**, and **Viewer** with live header injection to test permissions.
* **Notification Center**: Bell icon showing live count of published corporate announcements.
* **User Profile**: Active avatar with name and current role badge.
* **Public Site Shortcut**: One-click return to the main landing page (`/`).

### 5.2. Executive Dashboard Overview (`/admin`)
* **Live KPI Metrics**:
  * *Total Talent Pool*: 10+ pre-vetted engineers.
  * *Active Deployments*: Billable client engagements.
  * *Corporate Clients*: Active partner companies (FinTech, MedTech, SaaS).
  * *Open Requisitions*: Active open positions with priority flags.
  * *Billing Revenue*: Calculated from live deployment rates across **Month**, **Quarter**, and **Year**.
  * *Candidate Pipeline*: Active applicants across 6 ATS stages.
  * *Recruitment SLA*: Curation velocity (curated profiles delivered in < 5 hours).
  * *Fulfillment Ratio*: Statutory delivery benchmark (88.2%).
* **3 Recharts Visualizations**:
  1. *Revenue vs Operational Costs* (Smooth Area Gradient Chart).
  2. *Placements vs Quota Targets* (Dual Bar Chart).
  3. *Recruitment Performance & SLA Trends* (Velocity vs Satisfaction Line Chart).
* **Date Filter Strip**: Real-time switching between `Month`, `Quarter`, and `Year` metrics from the backend.
* **Live Audit Log**: System activity feed logging user actions, timestamp, role, and color-coded entity tags.
* **Recent Deployments Table**: Quick billing and assignment summary.
* **Quick Actions Panel**: Direct modal launchers for common operations.

### 5.3. Manpower & Recruitment Management
* **Employees (`/admin/employees`)**:
  * Search by name, designation, or skill.
  * Filter by Availability (`Immediate`, `15 Days`, `30 Days`, `Employed`) and Deployment Status (`Available`, `Deployed`, `On Notice`, `Bench`).
  * Server-side pagination.
  * Add, View, Edit, and Delete modals with validation and instant feedback.
* **Candidates & ATS Pipeline (`/admin/candidates`)**:
  * Dual-mode view: **6-Stage Kanban Board** and **Table List View**.
  * Stages: `Applied` ➔ `Screening` ➔ `Interview` ➔ `Offered` ➔ `Hired` ➔ `Rejected`.
  * One-click stage advancement via dropdown or detailed candidate drawer.
* **Corporate Clients (`/admin/clients`)**:
  * Manage enterprise partner accounts (FinTech Nexus, Apex Health, CloudScale Labs, etc.).
  * Track active staffing requisitions per client.
  * Filter by status and industry.
* **Staffing Requisitions (`/admin/jobs`)**:
  * Manage open job orders, priority allocations (`Urgent`, `High`, `Medium`, `Low`), and required skill sets.
  * Track fulfilled vs. total openings count.
* **Placements & Deployments (`/admin/placements`)**:
  * Assign talent to client requirements.
  * Track statutory deployment dates, monthly billing rates, and contract durations.
  * Enforces duplicate assignment prevention.

### 5.4. Content Management System (CMS)
* **CMS Dashboard (`/admin/cms`)**:
  * Real-time metrics calculated from database: Total Pages, Published Count, Draft Count, Total Articles, Media Count, and Announcements.
* **Website Pages Manager (`/admin/cms/pages`)**:
  * Manage `Home`, `About Us`, `Services`, `Careers`, `Contact`, `Privacy Policy`.
  * Create, edit, validate unique slugs, and toggle draft/published status.
  * **Live Modal Preview** rendering actual page content and metadata.
* **Blog & Articles Manager (`/admin/cms/blog`)**:
  * Full editorial authoring and editing modal (title, slug, summary, body, author, category, featured image URL, tags, read time).
  * Filter by publication status and category.
  * Article preview drawer.
* **Digital Media Library (`/admin/cms/media`)**:
  * Media card grid with previews and file metadata (file size, dimensions, MIME type, upload author).
  * One-click "Copy URL" button with clipboard toast notification.
  * Modular URL workflow (prevents binary image storage in MongoDB documents).
* **SEO Settings (`/admin/cms/seo`)**:
  * Global canonical site domain settings.
  * Page-by-page SEO directives: Meta Title, Meta Description, Social Share OG Image, and Index/NoIndex directives.
  * Live **Google SERP Snippet Preview** card displaying search engine rendering.
* **Corporate Announcements (`/admin/cms/announcements`)**:
  * Create and broadcast operational notices.
  * Priority tags (`Normal`, `Important`, `Urgent Alert`) and audience targeting (`All`, `Clients`, `Staff`, `Public`).
  * Live sync with the topbar notification bell.

---

## 6. Role-Based Permissions (RBAC)

The system enforces permissions at the backend middleware level based on the active persona:

| Persona | Permitted Operations | Restricted Operations |
|---|---|---|
| **Admin** | Full read, create, update, delete across all resources. | None |
| **Editor** | Read all; create/edit CMS pages, articles, announcements, and job requisitions. | User account management, system configuration deletion. |
| **Viewer** | Read-only access across all endpoints (`GET` requests only). | Blocked on all `POST`, `PUT`, `PATCH`, `DELETE` operations with **`HTTP 403 Forbidden`**. |

---

## 7. API Reference Table

All admin routes are prefixed with `/api/admin` and accept the `X-Demo-Role` header:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/stats?period=month\|quarter\|year` | Dashboard KPIs, Recharts datasets, recent placements, announcements |
| `GET` | `/api/admin/activities` | Operational audit stream |
| `GET` | `/api/admin/auth/me` | Current persona information & database connection status |
| `GET` | `/api/admin/employees` | Search & paginated list of employees |
| `POST` | `/api/admin/employees` | Create employee |
| `PUT` | `/api/admin/employees/:id` | Update employee |
| `DELETE` | `/api/admin/employees/:id` | Delete employee |
| `GET` | `/api/admin/candidates` | Candidate ATS records across all pipeline stages |
| `POST` | `/api/admin/candidates` | Create candidate |
| `PATCH` | `/api/admin/candidates/:id/status` | Update candidate pipeline stage |
| `DELETE` | `/api/admin/candidates/:id` | Delete candidate |
| `GET` | `/api/admin/clients` | List corporate client accounts |
| `POST` | `/api/admin/clients` | Register new corporate client |
| `PUT` | `/api/admin/clients/:id` | Update client details |
| `DELETE` | `/api/admin/clients/:id` | Archive client |
| `GET` | `/api/admin/jobs` | List staffing requisitions |
| `POST` | `/api/admin/jobs` | Post new staffing requisition |
| `PUT` | `/api/admin/jobs/:id` | Update job requisition |
| `DELETE` | `/api/admin/jobs/:id` | Close requisition |
| `GET` | `/api/admin/placements` | List active billable deployments |
| `POST` | `/api/admin/placements` | Deploy talent to client (with validation) |
| `PUT` | `/api/admin/placements/:id` | Update placement status |
| `DELETE` | `/api/admin/placements/:id` | Terminate placement |
| `GET` | `/api/admin/cms/stats` | CMS overview statistics |
| `GET` | `/api/admin/cms/pages` | List website pages |
| `POST` | `/api/admin/cms/pages` | Create website page |
| `PUT` | `/api/admin/cms/pages/:id` | Update page content/slug |
| `PATCH` | `/api/admin/cms/pages/:id/publish` | Toggle publish / draft status |
| `DELETE` | `/api/admin/cms/pages/:id` | Delete page |
| `GET` | `/api/admin/cms/articles` | List blog articles |
| `POST` | `/api/admin/cms/articles` | Create blog article |
| `PUT` | `/api/admin/cms/articles/:id` | Update article |
| `PATCH` | `/api/admin/cms/articles/:id/publish` | Toggle article publication |
| `DELETE` | `/api/admin/cms/articles/:id` | Delete article |
| `GET` | `/api/admin/cms/media` | List media library assets |
| `POST` | `/api/admin/cms/media` | Register media asset URL |
| `DELETE` | `/api/admin/cms/media/:id` | Delete media asset |
| `GET` | `/api/admin/cms/seo` | Get global site SEO and page directives |
| `PUT` | `/api/admin/cms/seo` | Save SEO meta directives |
| `GET` | `/api/admin/cms/announcements` | List corporate broadcasts |
| `POST` | `/api/admin/cms/announcements` | Create broadcast |
| `PATCH` | `/api/admin/cms/announcements/:id/publish` | Toggle broadcast status |
| `DELETE` | `/api/admin/cms/announcements/:id` | Delete announcement |

---

## 8. How to Run the Application

### 8.1. Start Backend Server
```bash
cd apps/backend
node src/server.js
```
* Binds to: `http://localhost:5000`

### 8.2. Start Frontend Application
```bash
cd apps/frontend
npm run dev
```
* Binds to: `http://localhost:5173/`

### 8.3. Direct Dashboard URLs
* **Executive Dashboard**: [http://localhost:5173/admin](http://localhost:5173/admin)
* **Employees**: [http://localhost:5173/admin/employees](http://localhost:5173/admin/employees)
* **Candidates**: [http://localhost:5173/admin/candidates](http://localhost:5173/admin/candidates)
* **Clients**: [http://localhost:5173/admin/clients](http://localhost:5173/admin/clients)
* **Job Requisitions**: [http://localhost:5173/admin/jobs](http://localhost:5173/admin/jobs)
* **Placements**: [http://localhost:5173/admin/placements](http://localhost:5173/admin/placements)
* **CMS Workspace**: [http://localhost:5173/admin/cms](http://localhost:5173/admin/cms)
* **Website Pages**: [http://localhost:5173/admin/cms/pages](http://localhost:5173/admin/cms/pages)
* **Blog & Articles**: [http://localhost:5173/admin/cms/blog](http://localhost:5173/admin/cms/blog)
* **Media Library**: [http://localhost:5173/admin/cms/media](http://localhost:5173/admin/cms/media)
* **SEO Settings**: [http://localhost:5173/admin/cms/seo](http://localhost:5173/admin/cms/seo)
* **Announcements**: [http://localhost:5173/admin/cms/announcements](http://localhost:5173/admin/cms/announcements)

---

## 9. Seeding MongoDB (Optional)

To seed a live MongoDB database with fictional demo records:
```bash
cd apps/backend
npm run seed
```
The script uses `findOneAndUpdate` with `upsert: true`, making it safe to rerun without creating duplicates.
