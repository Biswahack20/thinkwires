# Global Job Application Flow & Recruitment Automation

## 1. Overview
The application uses a single, centralized `GlobalJobApplicationForm` component across the entire ThinkWires ecosystem. Every application entry point opens this unified form, captures exhaustive applicant details, validates resume file uploads, saves the application to MongoDB, and automatically triggers a structured recruitment notification email to HR.

## 2. All Affected Application Entry Points

| Entry Point Location | Trigger Element | Behavior & Context Passed |
|---|---|---|
| **Jobs Page (`/jobs`)** | `Apply Now` button on `JobCard` | Navigates to `/jobs/:jobId/apply` passing `jobId`, `title`, `department`, `location`, `employmentType`, and `postingDate` |
| **Job Details Modal** | `Apply for this Position` on `JobSpecModal` | Forwards selected job object directly to `GlobalJobApplicationForm` |
| **Homepage Hot Jobs (`Openings.jsx`)** | `Apply Now` on each opening card | Opens `GlobalJobApplicationForm` populated with specific job ID, title, department, location, employment type, and posting date |
| **Homepage Openings Banner** | `Upload CV / Profile` | Opens `GlobalJobApplicationForm` targeted at `General Engineering Candidate Pool` |
| **Global Navigation (`Navbar.jsx`)** | `Quick Apply` button | Opens `GlobalJobApplicationForm` for general engineering pool directly |
| **Global Call to Action (`CTA.jsx`)** | `Drop Resume / Quick Apply` | Opens `GlobalJobApplicationForm` with expedited intake metadata |
| **Services Section (`Capabilities.jsx`)** | `Schedule Scope Call` | Opens universal form configured for enterprise intake |
| **Candidate Portal (`CandidateApplicationsPage`)**| `+ Apply for More Roles` | Navigates to `/jobs` for role selection and immediate application |

## 3. Dynamic Context Auto-Population
The following properties are automatically extracted and bound to the form header and submission payload:
- **Job ID**: Normalized unique position identifier (e.g., `job-sap-01` or database ID).
- **Job Title**: Target technical position.
- **Location**: Workplace location or remote policy (e.g., `Remote`, `Bangalore / Hybrid`).
- **Employment Type**: `Permanent`, `Contract`, or `Freelancer`.
- **Posting Date**: Extracted from `job.postedDate` or defaulted to `Active Mandate`.

## 4. Complete Form Field Specification

All candidate data originates strictly from the form fields filled or confirmed by the applicant:

### Resume Section
- **Resume Upload**: File dropzone accepting `.pdf`, `.doc`, `.docx` up to 10MB. Validated on both client and server via `multer`.

### Basic Information Section
- **Last Name** (Required)
- **First Name** (Required)
- **Mobile Number** (Required)
- **Email Address** (Required, email format)
- **Application Type**: Dropdown (`Permanent`, `Contract`, `Freelancer`)
- **Notice Period**: Dropdown (`Immediate`, `15 Days`, `Serving NP`, `30 Days`, `60 Days`, `90 Days`)
- **City** (Text input)
- **State** (Text input)

### Professional Details Section
- **Total Experience in Years**: (e.g. `6.5`)
- **Relevant Experience in Years**: (e.g. `5`)
- **Current Employer**: Must be input by the candidate (e.g. `Acme Corp` or `Confidential`)
- **Current CTC**: (e.g. `₹28 LPA` or `$95,000`)
- **Expected CTC**: (e.g. `₹36 LPA` or `$120,000`)
- **Skill Set**: Comma-separated technical keywords
- **LinkedIn Link**: URL input
- **Facebook Link**: URL input (optional)
- **Candidate Note**: Textarea for domain highlights or preferences

> [!NOTE]
> Existing profile values from the candidate session may be offered as editable initial defaults, but the candidate must review and submit them. No employer or CTC data is assumed or fabricated.

## 5. Automated Recruitment Notification Email

Upon successful application storage, the backend triggers an automated email notification formatted in clean, responsive HTML tables compatible with Gmail, Outlook, Apple Mail, and standard clients.

### Email Structure:
```
Submit Candidate for - [JOB TITLE]
[LOCATION] | [EMPLOYMENT TYPE]
Posted on [POSTING DATE]

RESUME
[Uploaded Resume Filename]

BASIC INFO
Last Name: [Last Name]
First Name: [First Name]
Mobile: [Mobile Number]
Email: [Email Address]
Application Type: [Permanent / Contract / Freelancer]
Notice Period: [Immediate / 15 Days / ...]
City: [City]
State: [State]

PROFESSIONAL DETAILS
Total Experience in Years: [Years]
Relevant Experience in Years: [Years]
Current Employer: [Employer]
Current CTC: [Current CTC]
Expected CTC: [Expected CTC]
Skill Set: [Skill Set]
LinkedIn Link: [URL]
Facebook Link: [URL]
Candidate Note: [Candidate Note]
```

### Resume Attachment
If a physical resume file was uploaded with the application, it is automatically attached directly to the outgoing email message.

### SMTP & Fallback Behavior
- If `SMTP_HOST` and `SMTP_USER` environment variables are configured, the email is dispatched via standard secure SMTP.
- If SMTP credentials are absent (e.g. in local development), the email content is cleanly logged to the server console without throwing errors or breaking the candidate's application submission.
- Email failures are caught gracefully and logged, preventing duplicate application records.
