# State Management & Application Data Flow

## 1. Store Configuration (`src/store/index.js`)

ThinkWires utilizes Redux Toolkit with a domain-driven slice architecture:

```javascript
export const store = configureStore({
  reducer: {
    auth: authReducer,
    home: homeReducer,
    about: aboutReducer,
    blog: blogReducer,
    contact: contactReducer,
    industries: industriesReducer,
    bench: benchReducer,
    payroll: payrollReducer,
    eor: eorReducer,
    staffAugmentation: staffAugmentationReducer,
    permanentStaffing: permanentStaffingReducer,
    findTalent: findTalentReducer,
    candidatePortal: candidatePortalReducer,
  },
});
```

## 2. Redux Slices Overview

| Slice | Key State Attributes | Purpose |
|---|---|---|
| **`auth`** | `user`, `isAuthenticated`, `isInitializing`, `loading`, `error` | Candidate authentication, HttpOnly cookie restoration, profile updates |
| **`home`** | `openings`, `capabilities`, `stats`, `status`, `errors` | Core jobs data catalog, search filters, hero stats |
| **`candidatePortal`** | `data`, `status`, `timesheetStatus`, `incognitoActive` | Candidate pipeline stages, interview cards, timesheets |
| **`bench`** | `benchEngineers`, `filters`, `status` | Available engineering bench talent |
| **`blog`** | `posts`, `categories`, `activePost` | Engineering articles and CMS blog items |

## 3. Data Flow Patterns
1. **Async Fetching with Thunks**: Slices use `createAsyncThunk` for network requests with standard lifecycle states (`pending`, `fulfilled`, `rejected`).
2. **Resilient Fallbacks**: If the backend server is temporarily unavailable during local work or offline mode, slices like `homeSlice` and `candidatePortalSlice` return curated fallback datasets rather than failing with blank screens.
3. **Local Component State**: Ephemeral UI states (modal open/close toggles, hover states, filter inputs) remain inside component state (`useState`) to avoid unnecessary global store churn.
