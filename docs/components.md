# Components Architecture & Shared Library

## 1. Shared & Common Components (`src/components/common/`)

### `GlobalJobApplicationForm.jsx`
- **Location**: `src/components/common/GlobalJobApplicationForm.jsx`
- **Purpose**: The single universal job application form used across the entire application.
- **Props**:
  - `isOpen`: `boolean` - Controls modal visibility.
  - `onClose`: `() => void` - Callback executed when the user closes or cancels the modal.
  - `jobData`: `Object|string` - Dynamic context including `jobId`, `title`, `department`, `location`, and `employmentType`.
- **Features**:
  - Auto-fills candidate fields from authenticated Redux store (`user.name`, `user.email`, `user.phone`, `user.experience`, `user.technicalSkills`, `user.resumeUrl`).
  - Native file upload box with drag-and-drop feedback + direct CV/portfolio URL input fallback.
  - Built-in prevention of duplicate submissions (detects HTTP 409 responses and provides deep link to existing application).
  - Clean error banners and auto-redirect upon success to `/candidate/applications`.

### `ApplyModal.jsx`
- **Location**: `src/components/common/ApplyModal.jsx`
- **Purpose**: Backwards-compatible wrapper that forwards legacy props (`roleTitle`, `isOpen`, `onClose`) directly to `GlobalJobApplicationForm`.

### `Navbar.jsx`
- **Location**: `src/components/common/Navbar.jsx`
- **Purpose**: Global responsive top navigation bar. Includes region indicator, navigation links, Services dropdown, theme switcher, Portal link, and Quick Apply trigger.

### `Footer.jsx`
- **Location**: `src/components/common/Footer.jsx`
- **Purpose**: Global footer displaying service offerings, legal compliance links, SOC 2 / ISO assurances, and copyright.

### `ProtectedRoute.jsx`
- **Location**: `src/components/common/ProtectedRoute.jsx`
- **Purpose**: Route wrapper that blocks unauthenticated access to candidate portal routes, redirecting unauthenticated users to `/login?redirect=...`.

## 2. Domain-Specific Component Modules

### Home Components (`src/components/HomeComponents/`)
- `NewHero.jsx`: Motion-enhanced hero slider featuring mouse spotlight tracking, 3D tilt, and dynamic job previews.
- `Openings.jsx`: Hot positions showcase with category tabs, spec inspection, and direct Apply Now buttons connecting to the global application form.
- `Capabilities.jsx`: Grid detailing HR & staffing services.

### Jobs Components (`src/components/JobsComponents/`)
- `FeaturedPositions.jsx`: Grid container rendering list of active openings.
- `JobCard.jsx`: Individual job listing card displaying role title, company badge, salary/rate tag, location, and action buttons (`Apply Now` and `View Job Spec`).
- `JobSpecModal.jsx`: Detailed job specification dialog showing full requirements, qualifications, and role perks with an "Apply for this Position" action.
- `JobSearch.jsx`: Sticky filter bar supporting text query, department, work mode, and experience filters.
- `TalentBench.jsx`: Fast-track resume intake section for candidates with unlisted skillsets.
