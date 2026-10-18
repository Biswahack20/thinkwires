# Development Guide for Engineers

## 1. Local Development Workflows

### Available Commands
From repository root (`thinkwires/`):
- `npm run dev`: Starts all turbo workspace services (backend & frontend).
- `npm run build`: Executes production builds across all packages.
- `npm run lint`: Runs ESLint across workspaces.

From frontend directory (`thinkwires/apps/frontend/`):
- `npm run dev`: Starts Vite dev server with Hot Module Replacement (`http://localhost:5173`).
- `npm run build`: Compiles production bundle with Rollup.
- `npm run lint`: Verifies ESLint rules and React hooks.
- `npm run preview`: Previews the compiled `dist/` directory locally.

## 2. Adding a New Page
1. Create your component in `src/pages/<PageName>.jsx`.
2. Wrap your page content in standard layout components (`Navbar` and `Footer`).
3. Add route definition in `src/App.jsx`:
   ```jsx
   import NewPage from './pages/NewPage';
   // Inside <Routes>:
   <Route path="/new-path" element={<NewPage />} />
   ```
4. If the page requires candidate authentication, wrap it in `<ProtectedRoute>`.

## 3. Adding a New Job Application Entry Point
Whenever you add a new page or section containing an `Apply` button, **do not build a custom application form**.

### Approach A: Using the Global Modal Component
```jsx
import React, { useState } from 'react';
import GlobalJobApplicationForm from '../common/GlobalJobApplicationForm';

const MyCustomSection = ({ currentJob }) => {
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsApplyOpen(true)} className="btn-primary">
        Apply for Position
      </button>

      <GlobalJobApplicationForm
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        jobData={currentJob} // e.g. { jobId: '123', title: 'Site Reliability Engineer', ... }
      />
    </div>
  );
};
```

### Approach B: Direct URL Navigation
```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
const targetUrl = `/jobs/${job.id}/apply?title=${encodeURIComponent(job.title)}&department=${encodeURIComponent(job.department)}`;
navigate(targetUrl);
```

Both patterns automatically preserve selected role attributes, respect candidate auth sessions, and invoke the verified backend submission endpoint.
