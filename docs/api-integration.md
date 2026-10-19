# API Integration & Backend Data Contracts

## 1. Vite Proxy Configuration
In local development, the Vite dev server forwards all `/api/*` traffic to the backend server:

```javascript
// apps/frontend/vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

## 2. API Endpoints Reference

### Candidate Application APIs
- **POST `/api/candidate/apply`**
  - **Auth Required**: Yes (`requireCandidateAuth` cookie session)
  - **Content-Type**: `multipart/form-data` or `application/json`
  - **Parameters / Form Fields**:
    - `jobId`: string (Job Identifier)
    - `jobTitle`: string (Job Title)
    - `department`: string (e.g. `Enterprise ERP`)
    - `location`: string (e.g. `Remote`)
    - `employmentType`: `Permanent` | `Contract` | `Freelancer`
    - `postingDate`: string (e.g. `Oct 18, 2026`)
    - `resume`: Binary file (`.pdf`, `.doc`, `.docx` up to 10MB)
    - `lastName`: string (Candidate's Last Name)
    - `firstName`: string (Candidate's First Name)
    - `mobileNumber`: string (Phone number)
    - `email`: string (Email address)
    - `applicationType`: `Permanent` | `Contract` | `Freelancer`
    - `noticePeriod`: `Immediate` | `15 Days` | `Serving NP` | `30 Days` | `60 Days` | `90 Days`
    - `city`: string (City)
    - `state`: string (State)
    - `totalExperienceYears`: string (e.g. `6.5`)
    - `relevantExperienceYears`: string (e.g. `5`)
    - `currentEmployer`: string (Must come from candidate input, e.g. `Acme Corp`)
    - `currentCTC`: string (Must come from candidate input, e.g. `₹28 LPA`)
    - `expectedCTC`: string (e.g. `₹36 LPA`)
    - `skillSet`: string (Comma-separated technical keywords)
    - `linkedInLink`: string (LinkedIn Profile URL)
    - `facebookLink`: string (Optional Facebook Profile URL)
    - `candidateNote`: string (Candidate statement or highlights)
  - **Success Response (`201 Created`)**:
    ```json
    {
      "success": true,
      "message": "Application submitted successfully for Principal Architect!",
      "application": { ... }
    }
    ```
  - **Duplicate Application Error (`409 Conflict`)**:
    ```json
    {
      "success": false,
      "error": "You have already applied for \"Principal Architect\". Your application is currently under review."
    }
    ```

### Authentication APIs
- **GET `/api/auth/me`**: Verifies cookie session and returns candidate profile.
- **POST `/api/auth/login`**: Authenticates credentials and sets HttpOnly JWT cookie.
- **POST `/api/auth/register`**: Registers a new candidate profile and sets session cookie.
- **POST `/api/auth/logout`**: Clears authentication cookies.

### Openings & Discovery APIs
- **GET `/api/openings`**: Returns curated active job openings. Accepts filters: `q`, `location`, `experience`, `workMode`, `jobMode`, `noticePeriod`, `department`, `sort`.
  - Fallback: If the backend is unreachable or offline, the client seamlessly utilizes the local fallback catalog defined in `homeSlice.js`.

### Candidate Portal APIs
- **GET `/api/candidate/applications`**: Retrieves all applications submitted by the logged-in candidate.
- **GET `/api/candidate/dashboard`**: Returns live pipeline stages, upcoming interviews, and retainer metrics.
- **PUT `/api/candidate/profile`**: Updates candidate phone, experience, expected CTC, skills, and resume link.
