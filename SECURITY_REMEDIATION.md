# ThinkWires Security Remediation Report

**Date:** November 2026  
**Status:** Completed & Verified  
**Scope:** Full-Stack Security Hardening, Cryptographic Protections, Authentication & Authorization Controls

---

## Executive Summary

A comprehensive application security audit and remediation was conducted across the ThinkWires repository. Critical vulnerabilities spanning remote file disclosure, stored cross-site scripting (XSS), fail-open role authorization, hardcoded seed credentials, JWT secret domain confusion, and public infrastructure exposure were identified, fixed, and verified with automated regression tests.

---

## 1. Vulnerability Matrix & Remediation Summary

| ID | Vulnerability | Severity | Target Components | Remediation Status |
|---|---|---|---|---|
| **SEC-01** | Arbitrary Local File Access via AI Resume Parser | Critical (CVSS 9.3) | `apps/ai_services/app/api/v1/resume.py`<br>`apps/ai_services/app/services/resume_parser.py` | **Fixed & Tested** |
| **SEC-02** | Hardcoded Superadmin Fallback Credentials & Demo Seeding | Critical (CVSS 9.1) | `apps/backend/src/seeds/seedDemoData.js`<br>`apps/backend/src/controllers/admin.controller.js` | **Fixed & Tested** |
| **SEC-03** | Stored XSS in Printable Candidate Dossier HTML | High (CVSS 8.2) | `CandidateEvaluationModal.jsx`<br>`CandidateDossierModal.jsx`<br>`BenchDossierDrawer.jsx` | **Fixed & Tested** |
| **SEC-04** | Role-Based Authorization Fail-Open Defense | High (CVSS 8.1) | `apps/backend/src/middlewares/auth.middleware.js` | **Fixed & Tested** |
| **SEC-05** | Public Infrastructure Telemetry Exposure | Medium (CVSS 5.3) | `apps/backend/src/routes/health.route.js`<br>`apps/backend/src/app.js` | **Fixed & Tested** |
| **SEC-06** | JWT Secret Naming Mismatch & Domain Separation | Medium (CVSS 6.5) | `apps/backend/src/configs/dotenv.js`<br>`apps/backend/src/utils/auth.util.js` | **Fixed & Tested** |
| **SEC-07** | Ephemeral File Retention & Directory Traversal in Uploads | Medium (CVSS 5.8) | `apps/backend/src/utils/storage.adapter.js`<br>`candidatePortal.controller.js` | **Fixed & Tested** |
| **SEC-08** | Insecure Container Exposure & Missing Isolation | Medium (CVSS 5.5) | `docker-compose.yml`<br>`apps/ai_services/Dockerfile` | **Fixed & Tested** |

---

## 2. Detailed Technical Remediations

### 2.1 SEC-01: Arbitrary File Access in AI Resume Parser
- **Root Cause:** The FastAPI resume parsing endpoint accepted a caller-supplied `file_path` string and invoked `open(file_path, "rb")` directly on the host/container filesystem, permitting directory traversal (`../../etc/passwd`) or arbitrary local file disclosure.
- **Remediation Implemented:**
  1. Removed `file_path` from request schema entirely.
  2. The endpoint now strictly accepts uploaded `UploadFile = File(...)` bytes or raw text.
  3. Enforced magic byte file signature validation (PDF `%PDF-` and DOCX `PK\x03\x04`).
  4. Enforced strict 10MB maximum upload limit (`MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024`).
  5. Implemented service-to-service authentication middleware (`verify_service_auth`) requiring `X-API-Key` or `Authorization: Bearer <token>` matching `AI_SERVICE_API_KEY`.
  6. Truncated raw text returned in responses to 1,000 sanitized characters to prevent data leakage.
  7. Added `/healthz` liveness probe endpoint without authentication for container orchestrator health checks.

### 2.2 SEC-02: Hardcoded Superadmin Credentials & Demo Seeding
- **Root Cause:** Development seeds previously contained hardcoded fallback admin passwords and emails (`Thinkwires@2026`, `superadmin@thinkwires.com`). Running seeds without environment variables would create known accounts in production.
- **Remediation Implemented:**
  1. Completely removed hardcoded administrator email and password fallbacks from `seedDemoData.js` and `adminSeedData.json`.
  2. Mandated explicit `INITIAL_SUPERADMIN_EMAIL` and `INITIAL_SUPERADMIN_PASSWORD`.
  3. Enforced strong password policy: minimum 16 characters, uppercase, lowercase, numbers, special symbols, and blocked dictionary/demo substrings.
  4. Seed execution is strictly idempotent and never overwrites existing administrators.
  5. In production (`NODE_ENV === 'production'`), demo seeding is rejected unless `ALLOW_PRODUCTION_SEED=true` is explicitly provided.
  6. Updated `.env.example` with safe placeholders and instructions.

### 2.3 SEC-03: Stored XSS in Candidate Dossier Printing
- **Root Cause:** Candidate-supplied fields (name, skills, company, notes) were concatenated into raw HTML strings and written to popup print windows via `document.write()`.
- **Remediation Implemented:**
  1. Created centralized utility `apps/frontend/src/utils/printSanitizer.js`:
     - `escapeHtml(str)` encodes `&`, `<`, `>`, `"`, and `'`.
     - `sanitizeUrl(url)` validates against `http:`, `https:`, and relative URLs while blocking `javascript:` and `data:` schemes.
     - `PRINT_CSP_META` provides a strict Content Security Policy (`default-src 'none'; style-src 'unsafe-inline'; img-src data:;`).
  2. Applied escaping to all dynamic interpolation in `CandidateEvaluationModal.jsx`, `CandidateDossierModal.jsx`, and `BenchDossierDrawer.jsx`.
  3. Injected strict CSP meta tags into all printable HTML headers.

### 2.4 SEC-04: Role-Based Authorization Fail-Closed Defense
- **Root Cause:** The `requireRole()` middleware previously defaulted missing roles to `superadmin`. Furthermore, if MongoDB disconnected in production, token verification fell back to JWT claims without checking revocation or active status.
- **Remediation Implemented:**
  1. `requireRole(...allowedRoles)` explicitly validates that `req.user` and `req.user.role` exist, returning HTTP 401 if missing.
  2. Validates that the user's role is in the authorized role list, returning HTTP 403 if unauthorized.
  3. In `auth.middleware.js`: If MongoDB is disconnected in production (`readyState !== 1`), immediately fail closed with HTTP 503 and `Retry-After: 5` header, preventing unauthorized access by deactivated users.

### 2.5 SEC-05: Public Infrastructure Telemetry Exposure
- **Root Cause:** The `/api/health` endpoint exposed internal host architecture, memory metrics, process uptime, Redis status, and database connection state to unauthenticated internet callers.
- **Remediation Implemented:**
  1. Enforced `isAuthorizedDiagnosticRequest(req)` gate: public `/api/health` requests return only minimal status (`status`, `service`, `version`, `timestamp`).
  2. Detailed telemetry (memory, database status, system uptime, architecture breakdown) is strictly limited to authenticated operators (`Authorization: Bearer <adminToken>`, Admin cookie, or `x-monitoring-key`).
  3. Maintained lightweight `/healthz` for process liveness and `/ready` for orchestrator traffic readiness.

### 2.6 SEC-06: JWT Domain Separation & Secret Security
- **Root Cause:** Inconsistent variable naming (`JWT_ADMIN_SECRET` vs `ADMIN_JWT_SECRET`) led to fallback to a shared `JWT_SECRET`, allowing cross-domain token reuse.
- **Remediation Implemented:**
  1. Standardized variable names across `.env.example`, `dotenv.js`, and `auth.util.js`: `JWT_ADMIN_SECRET` and `JWT_CANDIDATE_SECRET`.
  2. In production, distinct 256-bit secrets are strictly enforced; falling back to a single shared secret is rejected with a fatal boot error.
  3. Candidates cannot use tokens on admin endpoints, and administrators cannot use tokens on candidate portal routes.

### 2.7 SEC-07: Cloud Storage Adapter & Disk File Lifecycle
- **Root Cause:** Temporary multer file uploads were retained indefinitely on container disks, and file persistence was bound to ephemeral container filesystems.
- **Remediation Implemented:**
  1. Upgraded `apps/backend/src/utils/storage.adapter.js`:
     - Built-in AWS SigV4 signer supporting AWS S3, Cloudflare R2, MinIO, and GCS with zero external dependencies.
     - Added `getSignedDownloadUrl()` generating pre-signed GET URLs with configurable expiration.
     - Added SigV4 PUT and DELETE operations.
     - Filename sanitization protecting against directory traversal.
  2. Implemented mandatory file cleanup in `candidatePortal.controller.js`:
     - Uploaded files are cleaned up in `finally` blocks on both success and error paths.
     - Auto-fill resume parsing strictly cleans up temporary files immediately upon extraction.

### 2.8 SEC-08: Docker and Container Hardening
- **Root Cause:** Database and cache ports were exposed on `0.0.0.0` in `docker-compose.yml`, and containers ran as root.
- **Remediation Implemented:**
  1. Bound host port bindings for PostgreSQL, MongoDB, and Redis strictly to `127.0.0.1`.
  2. Configured internal `thinkwires-net` bridge network for service-to-service communication.
  3. Added multi-stage `Dockerfile` for `apps/ai_services` running as unprivileged user `aiapp` (UID 10001).
  4. Configured health check probes on all services.

---

## 3. Regression Testing & Verification

All security fixes are validated by dedicated automated unit and integration tests:
- `apps/backend/src/test/unit/superadmin.security.test.js` (13 tests)
- `apps/backend/src/test/unit/auth.middleware.test.js` (22 tests)
- `apps/backend/src/test/unit/jwt.domain.separation.test.js` (4 tests)
- `apps/backend/src/test/unit/health.telemetry.security.test.js` (11 tests)
- `apps/backend/src/test/unit/storage.adapter.test.js` (9 tests)
- `apps/frontend/src/test/unit/printSanitizer.test.js` (7 tests)
- `apps/ai_services/tests/integration/test_resume_api.py`
