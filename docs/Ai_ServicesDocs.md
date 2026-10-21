# ThinkWires AI Services Architecture and API Documentation (Ai_ServicesDocs.md)

This document is the authoritative architectural and API reference for the **ThinkWires AI Microservice** housed in `apps/ai_services`. It outlines the service topology, resume extraction pipeline, ATS fit scoring engine, automated screening test generation and grading system, and modular codebase layout.

---

## 1. Executive Summary and Design Philosophy

The ThinkWires AI Microservice is a high-throughput, asynchronous **FastAPI** service operating on port `8000`. It decouples heavy compute, ML/NLP document processing, ATS candidate scoring, and automated technical screening evaluation from the primary Express.js API gateway.

```
┌────────────────────────────────────────────────────────┐
│             React 19 Frontend (Port 5173)              │
│  - Resume Upload & Form Auto-Population                │
│  - Proctored Screening Assessment Modal (10 Questions) │
│  - Candidate Dashboard & Active Bench Scorecards       │
└───────────────────────────┬────────────────────────────┘
                            │ (HTTP / JSON / Cookies)
                            ▼
┌────────────────────────────────────────────────────────┐
│         Express 5 API Gateway (Port 5000)              │
│  - Candidate Authentication & Profile Persistence      │
│  - Job Application Management & Resume Storage         │
│  - Dual Database: MongoDB Atlas & PostgreSQL           │
└───────────────────────────┬────────────────────────────┘
                            │ (Internal HTTP Service Calls)
                            ▼
┌────────────────────────────────────────────────────────┐
│         FastAPI AI Microservice (Port 8000)            │
│  - Resume PDF, Text & Link Annotation Parsing Engine   │
│  - Weighted ATS Candidate Match Scorer (PRD 4.3)       │
│  - 10-Question Dynamic Assessment Generator            │
│  - Automated MCQ, Scenario & Practical Code Grader     │
│  - OpenAI GPT-4o-mini Integration + Heuristic Fallback │
└────────────────────────────────────────────────────────┘
```

### Core Design Principles

1. **Dual-Engine Resilience (Zero-Failure Execution)**:
   - **Primary Engine**: When an `OPENAI_API_KEY` is present, the service leverages `gpt-4o-mini` with structured JSON output modes for nuanced natural language extraction and situational appraisal.
   - **Heuristic Rule Engine**: If the OpenAI API key is unset or external API quotas fail, the service executes deterministic, regex-based, rule-governed NLP extraction, mathematical ATS formula calculations, and programmatic test grading. The platform never crashes or stalls candidate applications.
2. **Deep Document Extraction**:
   - Parses both text layers and embedded PDF annotations (`/Annot`, `/URI`) to discover hyperlinks for LinkedIn, GitHub, and portfolio websites even if display text is abbreviated.
3. **Clean Modular Architecture**:
   - Fully decoupled into **Schemas** (Pydantic DTOs), **Services** (Domain Logic & Parsers), and **API Routers** (HTTP Controllers).
4. **Monorepo Compatibility**:
   - The root `main.py` delegates directly to `app.main:app`. Monorepo orchestration scripts (`turbo dev`, `npm run dev`) and standard Uvicorn execution work without special configurations.

---

## 2. Directory and Modular Layout

The microservice codebase is organized within `apps/ai_services`:

```
apps/ai_services/
├── main.py                       # Root entrypoint (`from app.main import app`) for uvicorn
├── package.json                  # Turbo dev & test scripts
├── requirements.txt              # Production Python dependencies in clean UTF-8
├── .env / .env.example           # Runtime environment variables
│
├── app/                          # Modular Application Package
│   ├── __init__.py               # Package metadata and version definition
│   ├── config.py                 # Centralized Settings (Pydantic / env loader, CORS, logging)
│   ├── main.py                   # Application factory (`create_app()`), CORS, router registration
│   │
│   ├── api/                      # Routing & HTTP Layer
│   │   ├── __init__.py           # Exports central api_router
│   │   ├── router.py             # Mounts and aggregates v1 sub-routers
│   │   └── v1/                   # Versioned Endpoints
│   │       ├── __init__.py       # Exports v1 routers
│   │       ├── health.py         # GET / and GET /health
│   │       ├── resume.py         # POST /api/resume/parse & POST /api/resume/match-score
│   │       └── screening.py      # POST /api/screening/generate-test & evaluate-test
│   │
│   ├── schemas/                  # Pydantic Request & Response Data Transfer Objects (DTOs)
│   │   ├── __init__.py           # Re-exports all schemas
│   │   ├── resume.py             # ParsedResumeResponse, ResumeMatchRequest, ResumeMatchResponse
│   │   └── screening.py          # GenerateAssessmentRequest, AssessmentTest, MCQQuestion,
│   │                             # ScenarioQuestion, PracticalQuestion, EvaluateAssessmentRequest
│   │
│   └── services/                 # Domain Business Logic, ML & Extraction Engines
│       ├── __init__.py           # Re-exports core services
│       ├── resume_parser.py      # pypdf stream extraction + annotation link parser + heuristic & LLM parser
│       ├── match_scorer.py       # PRD Section 4.3 ATS weighted scoring & badge determination
│       ├── test_generator.py     # 10-Question assessment suite generator (7 MCQs, 2 Scenarios, 1 Code)
│       └── test_evaluator.py     # Automated test evaluation, scoring rubrics, and gatekeeper decisions
│
└── tests/                        # Automated Pytest Suite
    ├── __init__.py
    ├── test_api.py               # FastAPI TestClient endpoint integration tests
    ├── test_resume_parser.py     # Resume extraction and heuristic parser unit tests
    ├── test_match_scorer.py      # ATS match scoring algorithm tests
    └── test_screening.py         # Test generation and rubric grading evaluation tests
```

---

## 3. Configuration and Environment Variables

Settings are centralized in `app/config.py` and loaded via `python-dotenv`:

| Environment Variable | Default Value | Description |
| --- | --- | --- |
| `HOST` | `0.0.0.0` | Network interface binding for Uvicorn |
| `PORT` | `8000` | Port on which the AI microservice listens |
| `DEBUG` | `false` | Enables verbose debug logging and auto-reloading |
| `OPENAI_API_KEY` | `""` | OpenAI API Secret Key for GPT-4o-mini invocation |
| `OPENAI_MODEL` | `gpt-4o-mini` | Targeted LLM model for structured parsing |

### CORS Configuration
Cross-Origin Resource Sharing is enabled by default to allow communication between:
- Express Backend Gateway: `http://localhost:5000`
- React Frontend Dev Server: `http://localhost:5173`

---

## 4. Core Services and Domain Engines

### A. Resume Parser Engine (`app/services/resume_parser.py`)

Processes resumes submitted via raw PDF binary files, plain text snippets, or server file paths.

1. **PDF Text Stream & Annotation Link Extraction**:
   - Utilizes `pypdf.PdfReader` to extract byte streams across all document pages into clean text buffers.
   - Inspects page `/Annots` objects to extract embedded hyperlink URIs (`/URI`) for LinkedIn profiles, GitHub accounts, and external personal portfolios.
2. **Heuristic Rule Engine**:
   - **Name Extraction**: Analyzes initial document lines, excluding keywords like *resume*, *curriculum*, or *email*.
   - **Contact Identification**: Regex patterns identify candidate emails and international telephone numbers.
   - **Skills Taxonomy**: Matches candidate text against 50+ enterprise technology keywords (e.g. `Kubernetes`, `Terraform`, `React`, `FastAPI`, `Go`, `PostgreSQL`, `Kafka`, `Docker`).
   - **Experience & Role Extraction**: Parses duration patterns (e.g., `8+ years`, `5 yrs experience`) and standard engineering seniority titles.
3. **OpenAI Structured Extraction**: When configured, dispatches text to `gpt-4o-mini` with a strict JSON schema enforcement prompt (`response_format={"type": "json_object"}`).

---

### B. ATS Match Scorer Engine (`app/services/match_scorer.py`)

Calculates a weighted compatibility score between a candidate profile and a job requisition according to **PRD Section 4.3**:

$$\text{FitScore} = (S_{\text{tech}} \times 0.40) + (S_{\text{exp}} \times 0.30) + (S_{\text{depth}} \times 0.20) + (S_{\text{role}} \times 0.10)$$

Where:
- $S_{\text{tech}}$: Ratio of candidate matched skills against mandatory job requirements (40%).
- $S_{\text{exp}}$: Ratio of candidate verified years of experience against position threshold (30%).
- $S_{\text{depth}}$: Seniority depth, staff/lead architectural tenure, and certifications (20%).
- $S_{\text{role}}$: Contextual job title alignment and location/rate overlap (10%).

#### Categorization and Badges:

| Score Range | Category | Badge Label | Operational Action |
| --- | --- | --- | --- |
| **80% - 100%** | `green` | **Top Match** | Expedited fast-track to technical screening and bench profile highlight |
| **60% - 79%** | `yellow` | **Moderate Match** | Recommended for screening with targeted deep-dive on missing skills |
| **< 60%** | `gray` | **Below Threshold** | Flagged for recruiter review or candidate skill upskilling |

---

### C. Screening Assessment Generator (`app/services/test_generator.py`)

Generates a proctored, 10-question technical evaluation dynamically crafted to evaluate candidate skills against job requirements:

- **7 Multiple Choice Questions (MCQs)** (10 points each): Evaluates fundamental principles, caching mechanics, concurrency, connection pooling, and web security.
- **2 Architecture Scenarios** (15 points each): High-concurrency failure modes, database bottleneck mitigation, and vector search trade-offs.
- **1 Practical Code Exercise** (20 points): Hands-on implementation problem (e.g., building a High-Throughput Task Batcher with promise resolution and timeout flushing).
- **Total Points**: 120 points | **Default Time Limit**: 20 minutes | **Passing Threshold**: 75%.

---

### D. Automated Test Evaluator (`app/services/test_evaluator.py`)

Grades candidate submissions and renders admission gatekeeper decisions:
1. **MCQs**: Graded deterministically against pre-calculated answer keys. Includes comprehensive explanations for candidate feedback.
2. **Scenarios**: Evaluated based on technical depth, trade-off analysis, and targeted architectural keywords.
3. **Practical Code**: Evaluated against async resolution, promise handling, queue management, and closure state integrity.
4. **Gatekeeper Determination**:
   - Score >= 75% -> `Accepted - Screened` (Candidate verified for Active Bench placement).
   - Score < 75% -> `Filtered - Below Threshold` (Application saved with completed status).

---

## 5. Complete REST API Reference

### 1. Health and Discovery Endpoints

#### `GET /`
Returns service status, operational mode, and endpoint directory.

**Response (`200 OK`)**:
```json
{
  "status": "online",
  "service": "ThinkWires AI Microservice",
  "version": "1.0.0",
  "openai_configured": false,
  "endpoints": [
    "POST /api/resume/parse",
    "POST /api/resume/match-score",
    "POST /api/screening/generate-test",
    "POST /api/screening/evaluate-test"
  ]
}
```

#### `GET /health`
Liveness probe for container orchestrators.

**Response (`200 OK`)**:
```json
{
  "status": "healthy"
}
```

---

### 2. Resume Parsing (`POST /api/resume/parse`)

Extracts candidate contact details, skills, experience, summary, and links. Accepts `multipart/form-data` file upload, raw text, or a server file path.

**Request Parameters**:
- `file`: (Optional) PDF, DOCX, or TXT file upload.
- `raw_text`: (Optional) Plain text representation of resume.
- `file_path`: (Optional) Path on server filesystem.

**Response (`200 OK`)**:
```json
{
  "success": true,
  "raw_text": "Alex Rivera, alex@example.com...",
  "candidate_name": "Alex Rivera",
  "first_name": "Alex",
  "last_name": "Rivera",
  "email": "alex@example.com",
  "phone": "+1-555-0199",
  "location": "Remote",
  "headline": "Senior Software Engineer | Kubernetes, Terraform, AWS",
  "current_role": "Senior Software Engineer",
  "total_experience_years": 7.0,
  "skills": ["Kubernetes", "Terraform", "AWS", "Go"],
  "skill_set": "Kubernetes, Terraform, AWS, Go",
  "linkedin_url": "https://linkedin.com/in/alexrivera",
  "github_url": "https://github.com/alexrivera",
  "portfolio_url": "https://alexrivera.dev",
  "summary": "Accomplished Senior Software Engineer with over 7 years of hands-on expertise building resilient applications using Kubernetes, Terraform, AWS, Go."
}
```

---

### 3. ATS Match Scoring (`POST /api/resume/match-score`)

Computes candidate match score against a specific job requisition.

**Request Body (`application/json`)**:
```json
{
  "job_title": "Lead Cloud Infrastructure & Platform Architect",
  "department": "Cloud & DevOps",
  "required_skills": ["Kubernetes", "Terraform", "AWS", "Go"],
  "candidate_skills": ["Kubernetes", "Terraform", "AWS", "Docker", "Go"],
  "experience_required": 5.0,
  "resume_text": "Senior Lead Architect with 7 years of experience in Kubernetes, Terraform, AWS, and Go."
}
```

**Response (`200 OK`)**:
```json
{
  "success": true,
  "fit_score": 94,
  "fit_badge": "Top Match",
  "category": "green",
  "skills_match_score": 100,
  "experience_match_score": 100,
  "matched_skills": ["Kubernetes", "Terraform", "AWS", "Go"],
  "missing_skills": [],
  "strengths": [
    "Strong proficiency verified in key mandate skills: Kubernetes, Terraform, AWS",
    "Demonstrated 7 years technical experience aligned with Lead Cloud Infrastructure & Platform Architect requirements."
  ],
  "growth_areas": [
    "Demonstrate end-to-end production architectural leadership."
  ],
  "recommendation": "High candidate affinity for Lead Cloud Infrastructure & Platform Architect. Fast-track for technical screening."
}
```

---

### 4. Generate Screening Test (`POST /api/screening/generate-test`)

Dynamically generates a 10-question evaluation tailored to the job requirements and candidate skills.

---

### 5. Evaluate Screening Test (`POST /api/screening/evaluate-test`)

Scores candidate answers, returns detailed feedback, and outputs gatekeeper admission decisions.

---

## 6. Express Gateway Integration Guide

The Express gateway communicates with the AI microservice via `apps/backend/src/services/ai.service.js`:

```javascript
import aiService from './services/ai.service.js';

// 1. Parse Resume Buffer
const parsedResume = await aiService.parseResume(fileBuffer, 'resume.pdf');

// 2. Calculate Fit Score on Submission
const matchScore = await aiService.calculateMatchScore(
  { skills: parsedResume.skills, resumeText: parsedResume.summary },
  { jobTitle: 'Lead Cloud Architect', department: 'Cloud & DevOps', requiredSkills: ['Kubernetes', 'AWS'] }
);

// 3. Generate Screening Test
const assessment = await aiService.generateAssessment(
  { jobId: 'JOB-901', jobTitle: 'Lead Cloud Architect', requiredSkills: ['Kubernetes', 'AWS'] },
  { name: 'Alex Rivera', skills: ['Kubernetes', 'AWS'] }
);

// 4. Evaluate Test Submission
const evaluation = await aiService.evaluateAssessment(assessment, candidateAnswers);
```

---

## 7. Automated Testing & Quality Assurance

The microservice includes automated unit and integration tests under `apps/ai_services/tests`:

```bash
# From the workspace root via npm
npm --prefix apps/ai_services test

# Or directly using the virtual environment
cd apps/ai_services
.\venv\Scripts\pytest -v tests
```

---

## 8. Operational and Deployment Runbook

### Starting Development Server

```bash
cd apps/ai_services
.\venv\Scripts\uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- Local Interactive Swagger Documentation: `http://localhost:8000/docs`
- Interactive ReDoc Documentation: `http://localhost:8000/redoc`
- OpenAPI Specification: `http://localhost:8000/openapi.json`
