import React, { useState, useMemo } from 'react';
import {
  BookOpenIcon,
  SearchIcon,
  LayersIcon,
  ShieldIcon,
  CheckIcon,
  ExternalLinkIcon,
  ChevronRightIcon,
  FileTextIcon,
  MonitorIcon,
  TargetIcon,
  BriefcaseIcon,
  HandshakeIcon,
} from './AdminIcons';
import './admin.css';

const DOC_ITEMS = [
  // --- Workflows ---
  {
    id: 'candidate-workflow',
    category: 'workflows',
    categoryLabel: 'Core Workflows',
    title: 'Candidate Lifecycle & Assessment Workflow',
    subtitle: 'From discovery, resume auto-fill parsing, application, to AI screening gatekeeper.',
    badge: 'Core Workflow',
    badgeColor: 'blue',
    icon: <TargetIcon size={16} />,
    lastUpdated: 'Nov 2026',
    phases: [
      {
        phase: 'Phase 1: Registration & Resume Autofill',
        badge: 'Auth & Parsing',
        color: '#2563EB',
        bg: '#EFF6FF',
        endpoint: 'POST /api/candidate/parse-resume',
        summary: 'Candidate creates account with bcrypt-12 salting. Uploaded PDF/DOCX resumes are parsed via AI to extract skills, experience years, contact details, and LinkedIn/GitHub URLs.',
        details: [
          'HttpOnly cookie session (thinkwires_candidate_jwt) issued for 7 days.',
          'Prepopulates multi-step application forms to eliminate drop-off.',
          'Supports custom photo upload, monogram, or curated SVG avatar presets.',
        ],
      },
      {
        phase: 'Phase 2: Job Application & AI Triad',
        badge: 'AI Scoring',
        color: '#7C3AED',
        bg: '#F5F3FF',
        endpoint: 'POST /api/candidate/apply',
        summary: 'Submission triggers simultaneous AI operations: match scoring (0-100), 5 dynamic technical assessment questions, and initial candidate dossier synthesis.',
        details: [
          'Calculates fitScore and assigns badge (Top Match, Moderate, Below Threshold).',
          'Generates unique anonymous candidate code (e.g. TW-ENG-742).',
          'Saves record in JobApplication collection in Applied status.',
        ],
      },
      {
        phase: 'Phase 3: Interactive Screening Gatekeeper',
        badge: 'Technical Vetting',
        color: '#059669',
        bg: '#ECFDF5',
        endpoint: 'POST /applications/:id/assessment/submit',
        summary: 'Candidate completes a 20-minute timed quiz. The AI engine evaluates answers; scoring >= 75% advances status to Screening Passed and elevates candidate vetting score to >= 80%.',
        details: [
          'Questions dynamically tailored to opening tech stack (React, Node, etc.).',
          'Detailed scorecard generated with category breakdowns.',
          'Candidate dashboard reflects verified stage and evaluation dossier.',
        ],
      },
      {
        phase: 'Phase 4: ATS Review & Talent Bench',
        badge: 'Hiring & Sourcing',
        color: '#D97706',
        bg: '#FFFBEB',
        endpoint: 'GET /api/admin/candidates/:id/dossier',
        summary: 'Recruiters review unredacted dossiers. Qualified candidates (NP <= 15 days, score >= 80%) are automatically syndicated to the Talent Cloud Bench (/bench).',
        details: [
          'Recruiter stage promotion: Applied -> Screening -> Interview -> Offered -> Hired.',
          'Clients book panel interviews directly from blind bench profiles.',
          'Hired engineers log weekly project deliverables via candidate timesheets.',
        ],
      },
    ],
    technicalSpec: {
      endpoints: [
        { method: 'POST', path: '/api/auth/register', desc: 'Candidate registration with bcrypt(12) hash' },
        { method: 'POST', path: '/api/candidate/parse-resume', desc: 'Extracts skills & PII from resume buffer' },
        { method: 'POST', path: '/api/candidate/apply', desc: 'Creates application with AI match scoring' },
        { method: 'GET', path: '/api/candidate/applications/:id/assessment', desc: 'Retrieves 5 timed quiz questions' },
        { method: 'POST', path: '/api/candidate/applications/:id/assessment/submit', desc: 'Evaluates answers and updates vetting score' },
      ],
      models: ['Candidate', 'JobApplication', 'Activity'],
      security: 'Session stored in thinkwires_candidate_jwt HttpOnly cookie. Scope checks verify portal === "candidate".',
    },
  },
  {
    id: 'admin-workflow',
    category: 'workflows',
    categoryLabel: 'Core Workflows',
    title: 'Admin Portal Governance & Multi-Tier RBAC',
    subtitle: 'Role isolation across Superadmin, Manpower ATS, and CMS Admin with double-submit CSRF protection.',
    badge: 'Security & Ops',
    badgeColor: 'purple',
    icon: <ShieldIcon size={16} />,
    lastUpdated: 'Nov 2026',
    phases: [
      {
        phase: 'Phase 1: CSRF Exchange & Authentication',
        badge: 'Session Bootstrap',
        color: '#2563EB',
        bg: '#EFF6FF',
        endpoint: 'POST /api/admin/auth/login',
        summary: 'Exchanges cryptographically secure tw_csrf_token. Authenticates official credentials and attaches scoped thinkwires_admin_jwt cookie across /, /api, and /api/admin.',
        details: [
          'Pre-login CSRF handshake via GET /api/admin/auth/csrf-token.',
          'Password verified against UserMongo with bcrypt.',
          'Multi-scope cookie clearing on logout prevents session bounce-back.',
        ],
      },
      {
        phase: 'Phase 2: Superadmin Governance & RBAC',
        badge: 'Staff Access',
        color: '#7C3AED',
        bg: '#F5F3FF',
        endpoint: '/api/admin/system-members',
        summary: 'Superadmins provision, update, and revoke staff credentials across superadmin, admin, and cms_admin roles with automatic Employee directory synchronization.',
        details: [
          'Enforces self-protection lock on root superadmin@thinkwires.com.',
          'Active session user cannot delete their own account.',
          'Modifications dynamically update portalAccess and roles.',
        ],
      },
      {
        phase: 'Phase 3: Manpower & ATS Desk',
        badge: 'Pipeline',
        color: '#059669',
        bg: '#ECFDF5',
        endpoint: '/api/admin/candidates',
        summary: 'Recruiters manage candidate applications, review unredacted evaluation dossiers, download verified resume PDFs, and approve inbound client mandates into active jobs.',
        details: [
          'Aggregated candidate pipeline across Applied, Screening, Interview, Offered, and Placed.',
          'On-demand AI re-evaluation against updated job requirements.',
          'Mandate approval publishes openings to public candidate portal.',
        ],
      },
      {
        phase: 'Phase 4: Centralized Audit Logging',
        badge: 'Compliance',
        color: '#D97706',
        bg: '#FFFBEB',
        endpoint: 'GET /api/admin/activities',
        summary: 'Every administrative mutation invokes logActivity(), recording structured entries in MongoDB displayed on the real-time Superadmin dashboard feed.',
        details: [
          'Stores action, entityType, description, acting user, and color badges.',
          'Chronological audit feed tracks all hiring, mandate, and CMS updates.',
          'Maintains immutable operational trail for system governance.',
        ],
      },
    ],
    technicalSpec: {
      endpoints: [
        { method: 'GET', path: '/api/admin/auth/csrf-token', desc: 'Issues anti-CSRF token cookie and header' },
        { method: 'POST', path: '/api/admin/auth/login', desc: 'Admin login establishing HttpOnly session' },
        { method: 'GET', path: '/api/admin/system-members', desc: 'Superadmin RBAC staff list' },
        { method: 'GET', path: '/api/admin/candidates/:id/dossier', desc: 'Unredacted full evaluation report' },
        { method: 'GET', path: '/api/admin/activities', desc: 'Real-time platform operational audit log' },
      ],
      models: ['UserMongo', 'Employee', 'Activity'],
      security: 'requireRole middleware enforces strict separation between superadmin, admin, and cms_admin.',
    },
  },
  {
    id: 'dossier-workflow',
    category: 'workflows',
    categoryLabel: 'Core Workflows',
    title: 'Candidate Evaluation Dossier & 6-Factor Engine',
    subtitle: 'Automated recruitment intelligence comparing candidate credentials against requisitions with blind bench sanitization.',
    badge: 'AI Intelligence',
    badgeColor: 'emerald',
    icon: <LayersIcon size={16} />,
    lastUpdated: 'Nov 2026',
    phases: [
      {
        phase: 'Phase 1: Ingestion & Input Aggregation',
        badge: 'Input Pipeline',
        color: '#2563EB',
        bg: '#EFF6FF',
        endpoint: 'aiService.evaluateCandidate()',
        summary: 'Aggregates parsed resume text, technical skills, verified experience, recruiter briefing notes, and target job description requirements.',
        details: [
          'Tries Python FastAPI microservice with a 10-second execution timeout.',
          'Falls back seamlessly to local Node 6-factor deterministic engine if offline.',
          'Supports multi-provider LLM cascade: Groq -> Gemini -> OpenRouter.',
        ],
      },
      {
        phase: 'Phase 2: 6-Factor Calibrated Scoring',
        badge: 'Weighting Matrix',
        color: '#7C3AED',
        bg: '#F5F3FF',
        endpoint: '6-Factor Engine',
        summary: 'Computes multi-dimensional fit score: Mandatory Skills (35%), Role & Responsibilities (25%), Seniority (15%), Notice Period (10%), Compensation (10%), and Culture (5%).',
        details: [
          'Analyzes OR variants in skills (e.g. React or Vue, AWS / Azure).',
          'Outputs composite overallMatchScore (0-100) and recommendation.',
          'Constructs Requirement Alignment Matrix matching JD specs to evidence.',
        ],
      },
      {
        phase: 'Phase 3: Persistence & Bench Trigger',
        badge: 'Lifecycle',
        color: '#059669',
        bg: '#ECFDF5',
        endpoint: 'MongoDB Persistence',
        summary: 'Saves full evaluation report in JobApplication.evaluationReport and updates candidate fitScore. Scores >= 80% with NP <= 15 days qualify for Talent Cloud Bench.',
        details: [
          'Score >= 80%: Strong Fit -> SHORTLIST recommendation.',
          'Score 65-79%: Moderate Fit -> HOLD recommendation.',
          'Score < 65%: Below Threshold -> REJECT recommendation.',
        ],
      },
      {
        phase: 'Phase 4: Multi-Tier Presentation Modes',
        badge: 'Privacy Views',
        color: '#D97706',
        bg: '#FFFBEB',
        endpoint: 'sanitizeDossierForBench()',
        summary: 'Three distinct presentation views: Recruiter mode (unredacted), Candidate mode (radar scorecard feedback), and Public Bench mode (blind screening with code TW-ENG-XXX).',
        details: [
          'Recruiter view shows full legal name, current salary, and verified resume PDF.',
          'Blind bench sanitization redacts candidate name, contact info, and employer names.',
          'Filters out internal salary gap notes for bias-free client auditing.',
        ],
      },
    ],
    technicalSpec: {
      endpoints: [
        { method: 'POST', path: '/api/screening/evaluate-candidate', desc: 'FastAPI microservice endpoint' },
        { method: 'GET', path: '/api/admin/candidates/:id/dossier', desc: 'Admin unredacted evaluation report' },
        { method: 'GET', path: '/api/candidate/applications/:id/dossier', desc: 'Candidate self-service scorecard' },
        { method: 'GET', path: '/api/bench/dossier/:id', desc: 'Sanitized blind bench dossier drawer' },
      ],
      models: ['JobApplication', 'Candidate'],
      security: 'sanitizeDossierForBench strips all PII and company names before public delivery.',
    },
  },
  {
    id: 'requisition-workflow',
    category: 'workflows',
    categoryLabel: 'Core Workflows',
    title: 'Enterprise Client Requisition & 5-Hour SLA Workflow',
    subtitle: 'Corporate talent order intake, priority triage, mandate approval, and automated bench sourcing.',
    badge: 'Enterprise Intake',
    badgeColor: 'amber',
    icon: <BriefcaseIcon size={16} />,
    lastUpdated: 'Nov 2026',
    phases: [
      {
        phase: 'Phase 1: Inbound Mandate Submission',
        badge: 'Client Intake',
        color: '#2563EB',
        bg: '#EFF6FF',
        endpoint: 'POST /api/find-talent/requisition',
        summary: 'Enterprise partners submit talent mandates choosing Staff Augmentation, Perm Staffing, EOR, or Executive Search with budget envelopes and tech stack specs.',
        details: [
          'Assigns tracking requisition ID (REQ-XXXXXX).',
          'Initiates the 5-Hour Candidate Dossier Delivery SLA timer.',
          'Guarded by public submission rate limiter (30 req / 15 mins).',
        ],
      },
      {
        phase: 'Phase 2: Recruiter Vetting & Triage',
        badge: 'SLA Triage',
        color: '#7C3AED',
        bg: '#F5F3FF',
        endpoint: '/admin/requisitions',
        summary: 'Recruiters review inbound orders categorized by urgency (Urgent, High, Medium) and evaluate contractor margin feasibility against pipeline candidates.',
        details: [
          'Evaluates budget brackets ($5k-$8k/mo up to $18k+/mo).',
          'Checks available bench engineers matching requisition stack.',
          'Opens Approve Client Mandate modal to configure terms.',
        ],
      },
      {
        phase: 'Phase 3: Conversion to Active Job',
        badge: 'Publishing',
        color: '#059669',
        bg: '#ECFDF5',
        endpoint: 'PUT /api/admin/jobs/:id',
        summary: 'Recruiter approves mandate; status updates from Inbound Request to Active, instantly publishing the job opening to the public candidate portal (/openings).',
        details: [
          'Configures deployment model (Remote Global, Hybrid, Onsite).',
          'Sets notice period benchmark (Immediate, 15 days, Serving NP).',
          'Auto-matches pre-vetted bench engineers matching required technologies.',
        ],
      },
      {
        phase: 'Phase 4: Client Interview & Placement',
        badge: 'Hiring',
        color: '#D97706',
        bg: '#FFFBEB',
        endpoint: 'POST /api/bench/book-interview',
        summary: 'Enterprise hiring manager inspects matched candidate dossiers and books panel interviews. Upon selection, initializes active Placement record.',
        details: [
          'Recruiter coordinates calendar schedules and panel invites.',
          'Initializes client billing rate and developer contractor payout rate.',
          'Transitions engineer to Placed status.',
        ],
      },
    ],
    technicalSpec: {
      endpoints: [
        { method: 'POST', path: '/api/find-talent/requisition', desc: 'Inbound client order submission' },
        { method: 'GET', path: '/api/admin/jobs', desc: 'Recruiter list of requisitions & jobs' },
        { method: 'PUT', path: '/api/admin/jobs/:id', desc: 'Approves mandate and publishes to /openings' },
        { method: 'POST', path: '/api/bench/book-interview', desc: 'Client schedules candidate panel interview' },
      ],
      models: ['JobRequirement', 'Client', 'Placement'],
      security: 'Strict client confidentiality: descriptions sanitized before public /openings delivery.',
    },
  },
  {
    id: 'bench-workflow',
    category: 'workflows',
    categoryLabel: 'Core Workflows',
    title: 'Talent Cloud Bench & Blind Marketplace Workflow',
    subtitle: 'Immediate deployment marketplace of pre-vetted senior engineers with blind technical dossiers.',
    badge: 'Marketplace',
    badgeColor: 'blue',
    icon: <HandshakeIcon size={16} />,
    lastUpdated: 'Nov 2026',
    phases: [
      {
        phase: 'Phase 1: Automated Syndication Rules',
        badge: 'Qualification',
        color: '#2563EB',
        bg: '#EFF6FF',
        endpoint: 'GET /api/bench/talents',
        summary: 'Candidates with vettingScore >= 80% and notice period <= 15 days (Immediate Joiners) are auto-syndicated to the live public Talent Cloud Bench.',
        details: [
          'Assigned public code TW-CAND-XXXX and two-letter monogram.',
          'Seniority tier dynamically computed (Lead 8+y, Senior 5+y, Mid 3+y).',
          'Hourly billing envelope calculated ($65 - $120+/hr).',
        ],
      },
      {
        phase: 'Phase 2: Discovery & Multi-Facet Filtering',
        badge: 'Client Search',
        color: '#7C3AED',
        bg: '#F5F3FF',
        endpoint: '/bench',
        summary: 'Enterprise clients explore talent by specialty (GenAI, Cloud/DevOps, Systems), seniority tier, availability urgency, and hourly rate envelope.',
        details: [
          'Real-time substring search across skills and engineering proofs.',
          'Visual badges indicate vetted status and verified assessment scores.',
          'Location badges display Remote Global, India, or US timezone alignment.',
        ],
      },
      {
        phase: 'Phase 3: Blind Dossier Drawer Audit',
        badge: 'Competency Audit',
        color: '#059669',
        bg: '#ECFDF5',
        endpoint: 'GET /api/bench/dossier/:id',
        summary: 'Client opens the slide-over BenchDossierDrawer to audit verified production accomplishments, code audit scorecards, and requirement alignment matrices.',
        details: [
          'Candidate legal name replaced with anonymous code (TW-DEV-XX).',
          'Current and former employer names redacted to prevent bias.',
          'Salary and compensation gap notes filtered out.',
        ],
      },
      {
        phase: 'Phase 4: Interview Booking & Reservation',
        badge: 'Booking',
        color: '#D97706',
        bg: '#FFFBEB',
        endpoint: 'POST /api/bench/book-interview',
        summary: 'Enterprise buyer reserves candidate for technical interview. ThinkWires recruiter desk facilitates calendar invites and de-anonymization with mutual consent.',
        details: [
          'Generates priority notification in admin activity stream.',
          'Hiring manager specifies required panel format and technical focus.',
          'Pre-allocated bench talent is temporarily held from other bookings.',
        ],
      },
    ],
    technicalSpec: {
      endpoints: [
        { method: 'GET', path: '/api/bench', desc: 'Bench page overview & stats' },
        { method: 'GET', path: '/api/bench/talents', desc: 'Filtered list of active bench talent' },
        { method: 'GET', path: '/api/bench/dossier/:id', desc: 'Blind sanitized evaluation report' },
        { method: 'POST', path: '/api/bench/book-interview', desc: 'Client interview reservation' },
      ],
      models: ['Candidate', 'JobApplication', 'Activity'],
      security: 'Blind screening enforced via sanitizeDossierForBench() stripping all personal identifiers.',
    },
  },
  {
    id: 'ai-fallback-workflow',
    category: 'workflows',
    categoryLabel: 'Core Workflows',
    title: 'Multi-Provider AI Pipeline & Fallback Cascade',
    subtitle: 'Zero-latency, zero-downtime microservice routing with built-in 6-factor deterministic heuristic engine.',
    badge: 'AI Architecture',
    badgeColor: 'purple',
    icon: <MonitorIcon size={16} />,
    lastUpdated: 'Nov 2026',
    phases: [
      {
        phase: 'Phase 1: Task Dispatch & 10s Guard',
        badge: 'Dispatch',
        color: '#2563EB',
        bg: '#EFF6FF',
        endpoint: 'ai.service.js',
        summary: 'Node adapter serializes request payload and dispatches to Python FastAPI microservice with an explicit 10-second AbortSignal timeout to prevent hung requests.',
        details: [
          'Handles resume parsing, match scoring, dynamic quizzes, and dossiers.',
          'Validates payload structure before invoking network transport.',
          'Monitors microservice latency and error status codes.',
        ],
      },
      {
        phase: 'Phase 2: External LLM Provider Cascade',
        badge: 'LLM Routing',
        color: '#7C3AED',
        bg: '#F5F3FF',
        endpoint: 'apps/ai_services',
        summary: 'Multi-tier provider cascade: Primary is Groq (Llama-3-70b, sub-second latency); on rate-limit (429) fails over to Google Gemini 1.5; tertiary is OpenRouter.',
        details: [
          'Groq handles high-throughput low-latency inference.',
          'Gemini handles deep evaluation reports and assessment generation.',
          'OpenRouter acts as aggregated cloud gateway on quota exhaustion.',
        ],
      },
      {
        phase: 'Phase 3: Local Deterministic Engine',
        badge: 'Zero-Downtime',
        color: '#059669',
        bg: '#ECFDF5',
        endpoint: 'fallbackEvaluateCandidate()',
        summary: 'If cloud LLMs are unreachable or timed out, the built-in Node 6-factor deterministic engine executes locally with zero external network dependencies.',
        details: [
          '300+ technology keyword catalog matches skills and experience.',
          'Outputs identical JSON schema with calculated scores and fit badges.',
          'Guarantees application submission and evaluation never crashes.',
        ],
      },
      {
        phase: 'Phase 4: Schema Validation & Persistence',
        badge: 'Parity',
        color: '#D97706',
        bg: '#FFFBEB',
        endpoint: 'JobApplication & Candidate',
        summary: 'Validates schema consistency and writes evaluationReport to JobApplication and updates Candidate fitScore. Emits structured logs for telemetry.',
        details: [
          'Strict schema parity guarantees frontend modals render seamlessly.',
          'Saves evaluationReport and scorecard in MongoDB.',
          'Zero crash guarantee across both cloud and offline resilience modes.',
        ],
      },
    ],
    technicalSpec: {
      endpoints: [
        { method: 'POST', path: 'http://localhost:8000/api/screening/evaluate-candidate', desc: 'FastAPI microservice' },
        { method: 'POST', path: 'http://localhost:8000/api/parser/parse', desc: 'Resume binary extraction' },
      ],
      models: ['JobApplication', 'Candidate'],
      security: 'FastAPI microservice endpoints disable public OpenAPI /docs in production.',
    },
  },
  // --- Architecture & System Specs ---
  {
    id: 'backend-architecture',
    category: 'architecture',
    categoryLabel: 'Architecture & PRD',
    title: 'Backend Architecture & Dual-Mode Persistence',
    subtitle: 'Modular Express REST API with dual MongoDB Atlas & PostgreSQL cloud resilience and Redis revocation caching.',
    badge: 'Backend Architecture',
    badgeColor: 'blue',
    icon: <MonitorIcon size={16} />,
    lastUpdated: 'Nov 2026',
    phases: [
      {
        phase: '1. Dual-Persistence Database Architecture',
        badge: 'Database',
        color: '#2563EB',
        bg: '#EFF6FF',
        endpoint: 'db.mongo.js & db.postgres.js',
        summary: 'Primary document storage in MongoDB Atlas (candidates, applications, CMS) combined with PostgreSQL relational persistence (Sequelize) and local in-memory fallback.',
        details: [
          'Automatic failover ensures local resilience if cloud connection is interrupted.',
          'Sequelize models synchronized on startup with SSL connection pools.',
          'Health check /health reports real-time latency and database connectivity status.',
        ],
      },
      {
        phase: '2. Reverse Proxy & Rate Limiting',
        badge: 'Networking',
        color: '#7C3AED',
        bg: '#F5F3FF',
        endpoint: 'app.set("trust proxy", 1)',
        summary: 'Configured for deployment behind Render, Cloudflare, and AWS ALB reverse proxies with accurate X-Forwarded-For IP resolution.',
        details: [
          'app.set("trust proxy", 1) prevents shared-IP rate limiting collisions.',
          'express-rate-limit configured across all public, auth, and candidate routes.',
          'Suppresses redundant Forwarded header validation warnings in production logs.',
        ],
      },
      {
        phase: '3. Redis Token Revocation & Caching',
        badge: 'Caching',
        color: '#059669',
        bg: '#ECFDF5',
        endpoint: 'configs/redis.js',
        summary: 'Redis client stores revoked JWT tokens with 7-day TTL and provides caching for high-traffic public catalog endpoints.',
        details: [
          'isTokenRevoked middleware queries Redis before authorizing protected requests.',
          'In-memory Set fallback operates seamlessly during local development.',
          'Non-blocking cursor iteration via scan() eliminates single-threaded latency.',
        ],
      },
      {
        phase: '4. RESTful Route Architecture',
        badge: 'API Routing',
        color: '#D97706',
        bg: '#FFFBEB',
        endpoint: 'apps/backend/src/routes/',
        summary: 'Strictly partitioned routes: admin.route.js (RBAC ATS), candidate.route.js (Candidate Portal), auth.route.js (Authentication), and api.route.js (Public CMS).',
        details: [
          'Consistent error envelope: { success: false, error: string }.',
          'HTTP status codes: 200 (OK), 201 (Created), 400 (Bad), 401 (Auth), 403 (Forbidden), 409 (Conflict).',
          'Helmet security headers and CORS whitelisting enforced across all routes.',
        ],
      },
    ],
    technicalSpec: {
      endpoints: [
        { method: 'GET', path: '/health', desc: 'System health check & DB status' },
        { method: 'GET', path: '/api/stats', desc: 'Platform global metrics & stats' },
      ],
      models: ['UserMongo', 'Candidate', 'JobApplication', 'JobRequirement', 'Client', 'Placement', 'Activity', 'Page', 'Article'],
      security: 'trust proxy enabled, Helmet security headers, rate-limiting on public submissions.',
    },
  },
  // --- Developer & Deployment Runbooks ---
  {
    id: 'deployment-runbook',
    category: 'developer',
    categoryLabel: 'Developer & Runbooks',
    title: 'Vercel & Render Production Deployment Runbook',
    subtitle: 'Step-by-step production deployment instructions, environment variables, and SPA rewrite configurations.',
    badge: 'Deployment Guide',
    badgeColor: 'amber',
    icon: <FileTextIcon size={16} />,
    lastUpdated: 'Nov 2026',
    phases: [
      {
        phase: '1. Vercel Frontend Deployment',
        badge: 'Frontend',
        color: '#2563EB',
        bg: '#EFF6FF',
        endpoint: 'thinkwires.vercel.app',
        summary: 'Single Page Application (SPA) deployed on Vercel with clean wildcard rewrites routing all deep-links to index.html.',
        details: [
          'Root and apps/frontend/vercel.json configured with source: "/(.*)", destination: "/index.html".',
          'cleanUrls disabled to prevent 404 NOT_FOUND on direct route refreshes.',
          'VITE_API_URL points to https://thinkwires-backend.onrender.com.',
        ],
      },
      {
        phase: '2. Render Backend Deployment',
        badge: 'Backend Web Service',
        color: '#7C3AED',
        bg: '#F5F3FF',
        endpoint: 'thinkwires-backend.onrender.com',
        summary: 'Node.js Express backend deployed on Render web service with automatic Git integration on master branch pushes.',
        details: [
          'Build command: npm install in apps/backend.',
          'Start command: node src/app.js.',
          'Health check path configured to /health.',
        ],
      },
      {
        phase: '3. Environment Variable Checklist',
        badge: 'Environment Secrets',
        color: '#059669',
        bg: '#ECFDF5',
        endpoint: '.env / Cloud Dashboard',
        summary: 'Required production variables: JWT_SECRET (min 32 chars), MONGO_URI, DATABASE_URL, COOKIE_SAME_SITE=none, NODE_ENV=production.',
        details: [
          'JWT_SECRET enforced with 256-bit entropy check on server startup.',
          'COOKIE_SAME_SITE=none enables cross-origin cookie delivery between Vercel and Render.',
          'REDIS_URL optional for distributed session revocation.',
        ],
      },
      {
        phase: '4. Zero-Downtime Deployment Verification',
        badge: 'Smoke Testing',
        color: '#D97706',
        bg: '#FFFBEB',
        endpoint: 'Smoke Tests',
        summary: 'Verification checklist: 1. /health returns 200. 2. /admin/login routes cleanly. 3. Mandate approval succeeds without CSRF errors. 4. Bench renders talent cards.',
        details: [
          'Vite build compiles clean in ~2.6 seconds.',
          'Cross-origin CSRF verification supported via x-csrf-token and Bearer headers.',
          'Automatic failover verified under disconnected database conditions.',
        ],
      },
    ],
    technicalSpec: {
      endpoints: [
        { method: 'GET', path: 'https://thinkwires.vercel.app', desc: 'Production React Frontend' },
        { method: 'GET', path: 'https://thinkwires-backend.onrender.com/health', desc: 'Production Express Backend' },
      ],
      models: [],
      security: 'Strict production secrets validation: fails fast if JWT_SECRET is default or under 32 chars.',
    },
  },
];

const DocsView = () => {
  const [selectedDocId, setSelectedDocId] = useState('candidate-workflow');
  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'spec'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const activeDoc = useMemo(() => {
    return DOC_ITEMS.find((d) => d.id === selectedDocId) || DOC_ITEMS[0];
  }, [selectedDocId]);

  const filteredDocs = useMemo(() => {
    return DOC_ITEMS.filter((doc) => {
      const matchesCategory =
        selectedCategory === 'all' || doc.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.subtitle.toLowerCase().includes(q) ||
        doc.badge.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="tw-dashboard" style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          borderBottom: '1px solid var(--tw-border)',
          paddingBottom: '18px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'var(--tw-emerald-light)',
                color: 'var(--tw-emerald)',
              }}
            >
              <BookOpenIcon size={16} />
            </span>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: 'var(--tw-text-primary)',
                margin: 0,
              }}
            >
              ThinkWires Architecture & Documentation Center
            </h1>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--tw-text-secondary)',
              margin: 0,
            }}
          >
            Interactive system workflows, AI scoring specifications, database models, and developer deployment runbooks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: '600',
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'var(--tw-emerald-light)',
              color: 'var(--tw-emerald)',
              border: '1px solid rgba(0, 143, 104, 0.2)',
            }}
          >
            8 Workflows Active
          </span>
          <a
            href="https://github.com/Heykcer/thinkwires"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--tw-blue)',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--tw-border)',
              background: '#fff',
            }}
          >
            Upstream Repo <ExternalLinkIcon size={12} />
          </a>
        </div>
      </div>

      {/* Main Grid: Left Navigation Sidebar & Right Content Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Documentation Index */}
        <div
          style={{
            background: 'var(--tw-card)',
            border: '1px solid var(--tw-border)',
            borderRadius: '14px',
            padding: '16px',
            boxShadow: 'var(--tw-shadow-sm)',
          }}
        >
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--tw-bg)',
              border: '1px solid var(--tw-border)',
              borderRadius: '8px',
              padding: '8px 12px',
              marginBottom: '14px',
            }}
          >
            <SearchIcon size={14} color="var(--tw-text-muted)" />
            <input
              type="text"
              placeholder="Search docs & APIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '12px',
                width: '100%',
                color: 'var(--tw-text-primary)',
              }}
            />
          </div>

          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              marginBottom: '14px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--tw-border-light)',
            }}
          >
            {[
              { id: 'all', label: 'All' },
              { id: 'workflows', label: 'Workflows' },
              { id: 'architecture', label: 'Architecture' },
              { id: 'developer', label: 'Dev Ops' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  fontSize: '11px',
                  fontWeight: selectedCategory === cat.id ? '700' : '500',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background:
                    selectedCategory === cat.id
                      ? 'var(--tw-emerald-light)'
                      : 'transparent',
                  color:
                    selectedCategory === cat.id
                      ? 'var(--tw-emerald)'
                      : 'var(--tw-text-secondary)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Document Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filteredDocs.map((doc) => {
              const isSelected = doc.id === activeDoc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--tw-bg)' : 'transparent',
                    border: isSelected
                      ? '1px solid var(--tw-emerald)'
                      : '1px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: isSelected
                          ? 'var(--tw-emerald)'
                          : 'var(--tw-text-muted)',
                      }}
                    >
                      {doc.categoryLabel}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '1px 6px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        background:
                          doc.badgeColor === 'blue'
                            ? '#EFF6FF'
                            : doc.badgeColor === 'emerald'
                            ? '#ECFDF5'
                            : doc.badgeColor === 'purple'
                            ? '#F5F3FF'
                            : '#FFFBEB',
                        color:
                          doc.badgeColor === 'blue'
                            ? '#2563EB'
                            : doc.badgeColor === 'emerald'
                            ? '#059669'
                            : doc.badgeColor === 'purple'
                            ? '#7C3AED'
                            : '#D97706',
                      }}
                    >
                      {doc.badge}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: isSelected ? '700' : '600',
                      color: isSelected
                        ? 'var(--tw-text-primary)'
                        : 'var(--tw-text-primary)',
                      lineHeight: '1.3',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {doc.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Document Pane */}
        <div
          style={{
            background: 'var(--tw-card)',
            border: '1px solid var(--tw-border)',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: 'var(--tw-shadow-sm)',
          }}
        >
          {/* Document Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid var(--tw-border-light)',
              paddingBottom: '16px',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    color: 'var(--tw-emerald)',
                    letterSpacing: '0.5px',
                  }}
                >
                  {activeDoc.categoryLabel}
                </span>
                <span style={{ color: 'var(--tw-border)' }}>•</span>
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--tw-text-muted)',
                  }}
                >
                  Updated {activeDoc.lastUpdated}
                </span>
              </div>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'var(--tw-text-primary)',
                  margin: '0 0 4px 0',
                }}
              >
                {activeDoc.title}
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--tw-text-secondary)',
                  margin: 0,
                }}
              >
                {activeDoc.subtitle}
              </p>
            </div>

            {/* Toggle View: Visual Flowchart vs Technical Specs */}
            <div
              style={{
                display: 'flex',
                background: 'var(--tw-bg)',
                borderRadius: '8px',
                padding: '3px',
                border: '1px solid var(--tw-border)',
              }}
            >
              <button
                onClick={() => setActiveTab('visual')}
                style={{
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: activeTab === 'visual' ? '700' : '500',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'visual' ? '#fff' : 'transparent',
                  color:
                    activeTab === 'visual'
                      ? 'var(--tw-text-primary)'
                      : 'var(--tw-text-secondary)',
                  boxShadow:
                    activeTab === 'visual'
                      ? '0 1px 3px rgba(0,0,0,0.1)'
                      : 'none',
                }}
              >
                Visual Flowchart
              </button>
              <button
                onClick={() => setActiveTab('spec')}
                style={{
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: activeTab === 'spec' ? '700' : '500',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'spec' ? '#fff' : 'transparent',
                  color:
                    activeTab === 'spec'
                      ? 'var(--tw-text-primary)'
                      : 'var(--tw-text-secondary)',
                  boxShadow:
                    activeTab === 'spec'
                      ? '0 1px 3px rgba(0,0,0,0.1)'
                      : 'none',
                }}
              >
                Technical Spec & APIs
              </button>
            </div>
          </div>

          {/* TAB 1: VISUAL FLOWCHART & PHASE CARDS */}
          {activeTab === 'visual' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px',
                }}
              >
                {activeDoc.phases.map((phase, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: phase.bg || '#F8FAFC',
                      border: `1px solid ${phase.color}30`,
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: phase.color,
                            letterSpacing: '0.5px',
                          }}
                        >
                          STEP 0{idx + 1}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: '600',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: '#fff',
                            color: phase.color,
                            border: `1px solid ${phase.color}40`,
                          }}
                        >
                          {phase.badge}
                        </span>
                      </div>

                      <h4
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: 'var(--tw-text-primary)',
                          margin: '0 0 8px 0',
                          lineHeight: '1.3',
                        }}
                      >
                        {phase.phase}
                      </h4>

                      <p
                        style={{
                          fontSize: '12px',
                          color: 'var(--tw-text-secondary)',
                          lineHeight: '1.45',
                          margin: '0 0 10px 0',
                        }}
                      >
                        {phase.summary}
                      </p>

                      <div
                        style={{
                          background: '#ffffffcc',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          fontSize: '11px',
                          fontFamily: 'monospace',
                          color: 'var(--tw-text-primary)',
                          marginBottom: '10px',
                          border: '1px solid var(--tw-border-light)',
                        }}
                      >
                        {phase.endpoint}
                      </div>
                    </div>

                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: '16px',
                        fontSize: '11px',
                        color: 'var(--tw-text-secondary)',
                        lineHeight: '1.5',
                      }}
                    >
                      {phase.details.map((item, dIdx) => (
                        <li key={dIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL SPECIFICATION & APIS */}
          {activeTab === 'spec' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Endpoint Table */}
              <div>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'var(--tw-text-primary)',
                    marginBottom: '10px',
                  }}
                >
                  REST API Endpoints
                </h3>
                <div
                  style={{
                    border: '1px solid var(--tw-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '12px',
                    }}
                  >
                    <thead>
                      <tr style={{ background: 'var(--tw-bg)', textAlign: 'left' }}>
                        <th style={{ padding: '8px 12px', fontWeight: '700' }}>
                          Method
                        </th>
                        <th style={{ padding: '8px 12px', fontWeight: '700' }}>
                          Path
                        </th>
                        <th style={{ padding: '8px 12px', fontWeight: '700' }}>
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeDoc.technicalSpec.endpoints.map((ep, eIdx) => (
                        <tr
                          key={eIdx}
                          style={{
                            borderTop: '1px solid var(--tw-border-light)',
                          }}
                        >
                          <td style={{ padding: '8px 12px' }}>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background:
                                  ep.method === 'GET'
                                    ? '#EFF6FF'
                                    : ep.method === 'POST'
                                    ? '#ECFDF5'
                                    : ep.method === 'PUT'
                                    ? '#FFFBEB'
                                    : '#FEE2E2',
                                color:
                                  ep.method === 'GET'
                                    ? '#2563EB'
                                    : ep.method === 'POST'
                                    ? '#059669'
                                    : ep.method === 'PUT'
                                    ? '#D97706'
                                    : '#DC2626',
                              }}
                            >
                              {ep.method}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: '8px 12px',
                              fontFamily: 'monospace',
                              fontWeight: '600',
                            }}
                          >
                            {ep.path}
                          </td>
                          <td
                            style={{
                              padding: '8px 12px',
                              color: 'var(--tw-text-secondary)',
                            }}
                          >
                            {ep.desc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Models & Security Specs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    background: 'var(--tw-bg)',
                    borderRadius: '10px',
                    padding: '14px',
                    border: '1px solid var(--tw-border)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      marginBottom: '6px',
                    }}
                  >
                    Primary Database Models
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {activeDoc.technicalSpec.models.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          background: '#fff',
                          border: '1px solid var(--tw-border)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          color: 'var(--tw-emerald)',
                        }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--tw-bg)',
                    borderRadius: '10px',
                    padding: '14px',
                    border: '1px solid var(--tw-border)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      marginBottom: '6px',
                    }}
                  >
                    Security & Access Controls
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--tw-text-secondary)',
                      lineHeight: '1.4',
                    }}
                  >
                    {activeDoc.technicalSpec.security}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocsView;
