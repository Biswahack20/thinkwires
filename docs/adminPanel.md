# ThinkWires Admin Dashboard and CMS Specification (adminPanel.md)

This document is the complete architectural specification and operational manual for the **ThinkWires Admin Panel & Content Management System (CMS)**. It covers frontend interfaces, backend controllers, role-based security, design system tokens, and dual-mode data persistence for both human operators and autonomous AI agents.

---

## 1. Overview and Objective

The **ThinkWires Admin Panel & CMS** is an enterprise-grade control suite integrated directly into the ThinkWires monorepo. It manages the full lifecycle of global tech manpower supply, from candidate intake and bench tracking to corporate client placements and marketing website CMS administration.

### Key Capabilities

- **Manpower & Bench Management**: Tracks technical talent between assignments, displays daily billing overhead, and enables single-click deployment to client projects.
- **6-Stage ATS Pipeline**: Visual applicant tracking system (`Applied` -> `Screening` -> `Interview` -> `Offered` -> `Hired` -> `Rejected`).
- **Full-Stack CMS Suite**: Non-developers can create and edit website pages with live modal preview, author blog articles, manage SEO meta tags with live Google SERP previews, curate the digital media library, broadcast corporate announcements, and manage verified tech stacks.
- **Role-Based Access Control (RBAC)**: Enforces granular permissions across 5 distinct operational personas.
- **Dual-Mode Persistence Architecture**: Runs seamlessly in both cloud-connected live database environments and offline demo environments via an instant in-memory fallback.

---

## 2. Technology Stack and System Architecture

```
                               ┌────────────────────────────────────────────────┐
                               │       Admin Layout (React 19 + React Router)    │
                               │  - Collapsible Sidebar                         │
                               │  - Global Search & Notification Bell           │
                               │  - Interactive Persona Switcher (X-Demo-Role)  │
                               └───────────────────────┬────────────────────────┘
                                                       │
                           ┌───────────────────────────┴──────────────────────────┐
                           ▼                                                      ▼
        ┌────────────────────────────────────┐                 ┌────────────────────────────────────┐
        │       Manpower & ATS Modules       │                 │             CMS Suite              │
        │ - Executive Dashboard (Recharts)   │                 │ - CMS Workspace Dashboard          │
        │ - Employees & Bench Directory      │                 │ - Website Pages (Live Preview)     │
        │ - Candidate ATS Pipeline           │                 │ - Blog Articles Authoring          │
        │ - Corporate Clients                │                 │ - Digital Media Asset Library      │
        │ - Staffing Requisitions (Jobs)     │                 │ - SEO Directives & SERP Preview    │
        │ - Placements & Billable Deployments│                 │ - Broadcast Announcements          │
        │ - System Members (RBAC)            │                 │ - Tech Stack & Skill Tags          │
        └─────────────────┬──────────────────┘                 └─────────────────┬──────────────────┘
                          │                                                      │
                          └───────────────────────────┬──────────────────────────┘
                                                      │ (HTTP / adminService.js)
                                                      ▼
                                ┌────────────────────────────────────────┐
                                │   Backend Controller (admin.controller) │
                                │   - Permission Middleware (403 Guard)  │
                                │   - Audit Stream Logger (Activity)     │
                                └─────────────────────┬──────────────────┘
                                                      │
                                   ┌──────────────────┴──────────────────┐
                                   ▼                                     ▼
                      ┌────────────────────────┐            ┌────────────────────────┐
                      │    MongoDB / Mongoose  │            │ In-Memory Fallback JSON│
                      │   (Live Atlas Cluster) │            │  (adminSeedData.json)  │
                      └────────────────────────┘            └────────────────────────┘
```

- **Frontend Framework**: React 19 bundled with Vite.
- **Code Splitting**: Dynamic imports (`React.lazy()`) in `App.jsx` keep admin code isolated from public site bundles.
- **Visualizations**: **Recharts** for revenue gradients, placement quotas, and recruitment SLA metrics.
- **Styling Architecture**: Modular CSS in `admin.css` utilizing ThinkWires brand custom properties.
- **Backend Controller**: `admin.controller.js` providing unified REST endpoints.
- **Dual-Mode Persistence**:
  - _Live Mode_: Direct persistence through Mongoose schemas on MongoDB Atlas.
  - _Fallback Mode_: In-memory cache loaded from `adminSeedData.json`. If MongoDB is temporarily offline or restricted by IP whitelisting, the admin panel remains completely responsive and interactive.

---

## 3. Brand Identity and Design System Tokens

The admin panel interface uses ThinkWires' emerald and slate design system:

| Token Name            | Value     | Purpose                                                              |
| --------------------- | --------- | -------------------------------------------------------------------- |
| `--tw-emerald`        | `#008F68` | Primary brand emerald; active navigation, primary action buttons     |
| `--tw-emerald-hover`  | `#007A58` | Interactive hover states                                             |
| `--tw-emerald-dark`   | `#006548` | Dark emerald for headings, badges, and high-contrast borders         |
| `--tw-emerald-light`  | `#E6F4F0` | Soft emerald background for active pills and table rows              |
| `--tw-blue`           | `#3478D4` | Technical tags, DevOps indicators, secondary action accents          |
| `--tw-violet`         | `#8064D8` | CMS indicators, AI/editorial tags, and candidate pipeline highlights |
| `--tw-bg`             | `#F4F7FB` | Main admin canvas surface background                                 |
| `--tw-card`           | `#FFFFFF` | Cards, modals, slide-out drawers, and table backgrounds              |
| `--tw-text-primary`   | `#172033` | Deep slate primary text for crisp readability                        |
| `--tw-text-secondary` | `#64748B` | Subtitles, timestamps, and secondary metadata                        |
| `--tw-border`         | `#E2E8F0` | Structural card and divider borders                                  |
| `--tw-success`        | `#16A34A` | Active deployments, hired candidates, published pages                |
| `--tw-warning`        | `#D97706` | Bench status, in-review candidates, urgent mandates                  |
| `--tw-error`          | `#DC2626` | Destructive operations, rejected applicants, terminated contracts    |

---

## 4. Directory and File Organization

```
thinkwires/
├── apps/
│   ├── frontend/src/admin/
│   │   ├── admin.css               # Design system tokens and layout styles
│   │   ├── adminService.js         # API client with dynamic persona & role injection
│   │   ├── AdminIcons.jsx          # SVG icon library optimized for admin modules
│   │   ├── AdminLayout.jsx         # Topbar, collapsible sidebar, notifications
│   │   ├── AdminDashboard.jsx      # KPI cards, Recharts, period filters, audit stream
│   │   ├── EmployeesView.jsx       # Technical workforce directory & bench tracking
│   │   ├── CandidatesView.jsx      # ATS pipeline & candidate intake
│   │   ├── ClientsView.jsx         # Corporate client account management
│   │   ├── JobsView.jsx            # Staffing requisitions & headcount allocation
│   │   ├── PlacementsView.jsx      # Billable client deployments & rate tracking
│   │   ├── SystemMembersView.jsx   # Platform user RBAC management
│   │   ├── CmsDashboard.jsx        # CMS workspace stats & module launcher
│   │   ├── PagesManager.jsx        # Website pages manager with live preview
│   │   ├── BlogManager.jsx         # Blog articles authoring & publishing
│   │   ├── MediaLibrary.jsx        # Modular media asset library with copyable URLs
│   │   ├── SeoManager.jsx          # SEO meta directives & Google SERP preview
│   │   ├── AnnouncementsManager.jsx# Corporate broadcasts & topbar alerts
│   │   └── VisualSectionEditor.jsx # Section-level content editor
│   │
│   └── backend/src/
│       ├── controllers/admin.controller.js  # Unified dual-mode controller
│       ├── middlewares/auth.middleware.js   # Persona verification & 403 enforcement
│       ├── models/                          # 14 Mongoose Schema definitions
│       ├── routes/admin.route.js            # REST endpoints for admin & CMS
│       └── seeds/
│           ├── adminSeedData.json           # Demonstration dataset
│           └── seedDemoData.js              # Idempotent MongoDB seed runner
```

---

## 5. Detailed Module Breakdown

### 5.1. Top Navigation & Global Controls

- **Brand Identity**: `ThinkWires ADMIN` badge.
- **Global Search**: Instant client-side search across talent, clients, and pages.
- **Interactive Persona Switcher**: Seamlessly switch between **Superadmin**, **Admin**, **CMS Admin**, **Editor**, and **Viewer**. Injects the `X-Demo-Role` header on all outbound API calls to test permissions live.
- **Notification Bell**: Displays live count of corporate announcements.
- **Public Site Shortcut**: One-click jump to the public website (`/`).

### 5.2. Executive Dashboard Overview (`/admin`)

- **Real-Time KPI Cards**:
  - Total Talent Pool: Pre-vetted technical workforce count.
  - Active Deployments: Billable client engagements.
  - Corporate Clients: Active partner companies (FinTech, MedTech, Cloud).
  - Open Requisitions: Active job mandates with priority indicators.
  - Billing Revenue: Calculated from live deployment rates across **Month**, **Quarter**, and **Year**.
  - Candidate Pipeline: Active applicants across ATS stages.
  - Recruitment SLA: Average delivery velocity (< 5 hours).
  - Fulfillment Ratio: Statutory delivery benchmark (88.2%).
- **3 Recharts Visualizations**:
  1. Revenue vs Operational Costs (Smooth Area Gradient Chart).
  2. Placements vs Quota Targets (Dual Bar Chart).
  3. Recruitment Velocity vs Satisfaction Trends (Dual Line Chart).
- **Date Period Filter**: Instantly switch between `Month`, `Quarter`, and `Year` metrics.
- **Live Audit Stream**: Real-time activity feed logging actor, action, timestamp, and target entity.

### 5.3. Manpower and Recruitment Management

- **Employees (`/admin/employees`)**:
  - Filter by Availability (`Immediate`, `15 Days`, `30 Days`) and Deployment Status (`Bench`, `Deployed`, `Available`).
  - Search by name, designation, or primary technical skills.
  - Modals for Add, View Profile, Edit, and Delete.
- **Candidates & ATS Pipeline (`/admin/candidates`)**:
  - Shows candidate pipeline records synchronized with incoming JobApplication submissions.
  - Displays Candidate Name, Target Role, Contact Details, ATS Fit Score (0-100), Assessment status, and resume links.
  - Pipeline stages: `Applied` -> `Screening` -> `Interview` -> `Offered` -> `Hired` -> `Rejected`.
  - One-click stage advancement and slide-out candidate detail drawer with direct resume preview.
- **Corporate Clients (`/admin/clients`)**:
  - Enterprise partner directory (FinTech Nexus, Apex Health, CloudScale Labs).
  - Track active job requisitions and contract terms.
- **Staffing Requisitions (`/admin/jobs`)**:
  - Job orders with priority levels (`Urgent`, `High`, `Medium`, `Low`).
  - Required skills, budget ranges, and open vs. fulfilled headcounts.
- **Placements & Deployments (`/admin/placements`)**:
  - Assign talent to client requisitions with duplicate deployment prevention.
  - Tracks monthly billing rates, contract start/end dates, and contract status.
- **System Members (`/admin/system-members`)**:
  - Manage internal platform operators and assign roles (`superadmin`, `admin`, `cms_admin`, `editor`, `viewer`).

### 5.4. Content Management System (CMS)

- **CMS Workspace Dashboard (`/admin/cms`)**:
  - High-level asset statistics: Total Pages, Published Articles, Media Items, Active Announcements.
- **Website Pages Manager (`/admin/cms/pages`)**:
  - Manage core site pages: `Home`, `About Us`, `Services`, `Careers`, `Contact`, `Privacy Policy`.
  - Slug validation, draft/published toggle, and **Live Preview Modal** rendering actual page blocks.
- **Blog & Articles Manager (`/admin/cms/blog`)**:
  - Rich article authoring: Title, slug, summary, markdown body, author, category, read time, and cover image URL.
  - Filter by publication status and category tags.
- **Digital Media Library (`/admin/cms/media`)**:
  - Media asset cards with image preview, dimensions, MIME type, and file size.
  - One-click **"Copy URL"** button with automatic clipboard copy and notification.
- **SEO Settings (`/admin/cms/seo`)**:
  - Global site domain configuration and canonical URL settings.
  - Page-by-page directives: Meta Title, Meta Description, Social Share OG Image, and Index/NoIndex toggles.
  - **Live Google SERP Snippet Preview** showing desktop and mobile search engine appearance.
- **Corporate Announcements (`/admin/cms/announcements`)**:
  - Create broadcasts with priority tags (`Normal`, `Important`, `Urgent Alert`) and audience targeting (`All`, `Clients`, `Staff`).

---

## 6. Role-Based Access Control (RBAC) Permissions Matrix

Permissions are verified in `auth.middleware.js` using the `X-Demo-Role` header or session state:

| Permission / Action                  | `superadmin` | `admin` |  `cms_admin`  |     `editor`      |        `viewer`        |
| ------------------------------------ | :----------: | :-----: | :-----------: | :---------------: | :--------------------: |
| **View Dashboard & Metrics**         |   Allowed    | Allowed |    Allowed    |      Allowed      |        Allowed         |
| **Manage Employees & Bench**         |   Allowed    | Allowed |    Denied     |      Denied       |         Denied         |
| **Manage Candidates & ATS**          |   Allowed    | Allowed |    Denied     |     Read Only     |       Read Only        |
| **Manage Clients & Placements**      |   Allowed    | Allowed |    Denied     |      Denied       |         Denied         |
| **Manage Job Requisitions**          |   Allowed    | Allowed |    Denied     |      Allowed      |       Read Only        |
| **Manage System Members**            |   Allowed    | Denied  |    Denied     |      Denied       |         Denied         |
| **Manage CMS Pages & Blog**          |   Allowed    | Allowed |    Allowed    |      Allowed      |       Read Only        |
| **Manage Media & Announcements**     |   Allowed    | Allowed |    Allowed    |      Allowed      |       Read Only        |
| **Manage SEO Settings**              |   Allowed    | Allowed |    Allowed    |     Read Only     |       Read Only        |
| **Data Mutations (POST/PUT/DELETE)** |   Allowed    | Allowed | Allowed (CMS) | Allowed (Content) | Denied (403 Forbidden) |

---

## 7. Complete Admin REST API Reference

All admin routes are mounted under `/api/admin` in `admin.route.js`:

| HTTP Method        | Route                                          | Description                                                    |
| ------------------ | ---------------------------------------------- | -------------------------------------------------------------- |
| `GET`              | `/api/admin/stats?period=month\|quarter\|year` | Dashboard KPIs, Recharts datasets, recent placements           |
| `GET`              | `/api/admin/activities`                        | Audit trail stream                                             |
| `GET`              | `/api/admin/auth/me`                           | Current persona information & database connection status       |
| `GET` / `POST`     | `/api/admin/employees`                         | List / Create workforce employee                               |
| `PUT` / `DELETE`   | `/api/admin/employees/:id`                     | Update / Remove workforce employee                             |
| `GET` / `POST`     | `/api/admin/candidates`                        | List / Intake candidates into ATS pipeline                     |
| `PATCH`            | `/api/admin/candidates/:id/status`             | Advance candidate ATS stage (`Applied` -> `Screening` -> etc.) |
| `DELETE`           | `/api/admin/candidates/:id`                    | Archive candidate                                              |
| `GET` / `POST`     | `/api/admin/clients`                           | List / Register corporate client accounts                      |
| `PUT` / `DELETE`   | `/api/admin/clients/:id`                       | Update / Archive corporate client                              |
| `GET` / `POST`     | `/api/admin/jobs`                              | List / Post open staffing requisitions                         |
| `PUT` / `DELETE`   | `/api/admin/jobs/:id`                          | Update / Close staffing requisition                            |
| `GET` / `POST`     | `/api/admin/placements`                        | List / Deploy talent to client requirement                     |
| `PUT` / `DELETE`   | `/api/admin/placements/:id`                    | Update / Terminate placement                                   |
| `GET` / `POST`     | `/api/admin/system-members`                    | List / Invite administrative system members                    |
| `PUT` / `DELETE`   | `/api/admin/system-members/:id`                | Update role / Revoke member access                             |
| `GET`              | `/api/admin/cms/stats`                         | CMS overview statistics                                        |
| `GET` / `POST`     | `/api/admin/cms/pages`                         | List / Create website pages                                    |
| `PUT` / `DELETE`   | `/api/admin/cms/pages/:id`                     | Update content / Delete page                                   |
| `PATCH`            | `/api/admin/cms/pages/:id/publish`             | Toggle page draft vs published state                           |
| `GET` / `POST`     | `/api/admin/cms/articles`                      | List / Author blog articles                                    |
| `PUT` / `DELETE`   | `/api/admin/cms/articles/:id`                  | Update / Delete article                                        |
| `PATCH`            | `/api/admin/cms/articles/:id/publish`          | Toggle article publication                                     |
| `GET` / `POST`     | `/api/admin/cms/media`                         | List / Register media assets                                   |
| `DELETE`           | `/api/admin/cms/media/:id`                     | Delete media asset                                             |
| `GET` / `PUT`      | `/api/admin/cms/seo`                           | Get / Save global & page-level SEO directives                  |
| `GET` / `POST`     | `/api/admin/cms/announcements`                 | List / Broadcast corporate announcements                       |
| `PATCH` / `DELETE` | `/api/admin/cms/announcements/:id/publish`     | Toggle visibility / Remove announcement                        |

---

## 8. Direct Navigation URLs

| Screen                       | URL                                             |
| ---------------------------- | ----------------------------------------------- |
| **Executive Dashboard**      | `http://localhost:5173/admin`                   |
| **Employees Directory**      | `http://localhost:5173/admin/employees`         |
| **Candidates ATS Pipeline**  | `http://localhost:5173/admin/candidates`        |
| **Corporate Clients**        | `http://localhost:5173/admin/clients`           |
| **Job Requisitions**         | `http://localhost:5173/admin/jobs`              |
| **Placements & Deployments** | `http://localhost:5173/admin/placements`        |
| **System Members (RBAC)**    | `http://localhost:5173/admin/system-members`    |
| **CMS Workspace Dashboard**  | `http://localhost:5173/admin/cms`               |
| **Website Pages Manager**    | `http://localhost:5173/admin/cms/pages`         |
| **Blog & Articles Manager**  | `http://localhost:5173/admin/cms/blog`          |
| **Digital Media Library**    | `http://localhost:5173/admin/cms/media`         |
| **SEO Settings**             | `http://localhost:5173/admin/cms/seo`           |
| **Announcements**            | `http://localhost:5173/admin/cms/announcements` |
