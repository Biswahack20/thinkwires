# Pages and Routing Architecture

## 1. Route Table & Access Controls

All application routes are defined inside `src/App.jsx` using `react-router-dom` v7.

| Route Path | Component / Page | Access Control | Purpose |
|---|---|---|---|
| `/` | `HomePage` | Public | Homepage showcasing value proposition, hero, live jobs, and capabilities |
| `/about` | `AboutPage` | Public | Company philosophy, leadership, and growth evolution timeline |
| `/jobs` & `/hot-jobs` | `JobPage` | Public | Live jobs catalog, multi-criteria search, and job specs |
| `/talent-cloud` & `/bench` | `BenchPage` | Public | Pre-vetted engineering bench directory |
| `/industries` | `IndustriesPage` | Public | Industry-tailored staffing solutions |
| `/blog` | `BlogPage` | Public | Thought leadership, engineering whitepapers, and guides |
| `/contact` | `ContactPage` | Public | Direct inquiry and hiring consultation forms |
| `/find-talent` & `/hire-talent` | `FindTalentPage` | Public | Client-facing talent acquisition intake |
| `/services/*` | Staffing / EOR / Payroll Pages | Public | Dedicated service landing pages |
| `/login` | `LoginPage` | Public / Guest | Candidate sign-in supporting `?redirect=` return queries |
| `/register` | `RegisterPage` | Public / Guest | New candidate registration |
| `/forgot-password` | `ForgotPasswordPage` | Public / Guest | Password reset email trigger |
| `/reset-password` | `ResetPasswordPage` | Public / Guest | Password change confirmation |
| `/candidate/dashboard` | `CandidateDashboardPage` | Protected (`ProtectedRoute`) | Candidate overview, interview schedules, metrics |
| `/candidate/profile` | `CandidateProfilePage` | Protected (`ProtectedRoute`) | Profile information, resume link, skills editor |
| `/candidate/applications`| `CandidateApplicationsPage`| Protected (`ProtectedRoute`)| Track submitted job applications and review status |
| `/jobs/:jobId/apply` | `JobApplyPage` | Protected (`ProtectedRoute`) | Dedicated URL route for the global application form |
| `/admin/*` | `AdminLayout` (Lazy) | Admin Protected | Administrative dashboard, candidate/job CMS |

## 2. Dynamic Parameters & Query Strings
- `/jobs/:jobId/apply`:
  - `jobId`: Unique identifier of the position (e.g. `job-01` or MongoDB ObjectID).
  - Supported URL Query Parameters:
    - `title`: Decoded role title (e.g. `Staff Platform Engineer`).
    - `department`: Department name (e.g. `Cloud Architecture`).
    - `location`: Workplace location or remote policy (e.g. `Remote (India / US overlap)`).
    - `employmentType`: Job mode (e.g. `Permanent / Contract`).

## 3. Code-Splitting Strategy
Administrative modules are isolated using `React.lazy` and `React.Suspense` to ensure initial bundle loads under 1MB:
```jsx
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const JobsView = lazy(() => import('./admin/JobsView'));
```
