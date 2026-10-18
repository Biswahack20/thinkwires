# Frontend Troubleshooting & FAQ

## 1. Common Issues & Solutions

### Issue: "Network error connecting to ThinkWires application service" on form submission
- **Cause**: Backend API server is not running on port 5000 or proxy target is unreachable.
- **Resolution**:
  1. Check if backend is active: verify terminal running `apps/backend`.
  2. Verify `vite.config.js` proxy targets `http://localhost:5000`.
  3. Ensure cookies are enabled in the browser (`credentials: 'include'` is required).

### Issue: Duplicate application error (409 Conflict)
- **Cause**: The candidate has already submitted an application for this specific `jobId`.
- **Resolution**: The backend enforces unique candidate-job pairings. Check `/candidate/applications` to inspect existing submission status.

### Issue: Unauthenticated redirect to login
- **Cause**: Submitting an application requires candidate identity verification.
- **Resolution**: This is by design. Log in with candidate credentials or register a test account. The app retains your target job in the query redirect parameter and resumes application upon login.

### Issue: Vite build warning "Some chunks are larger than 500 kB"
- **Cause**: Dynamic visualizations and large dependencies (Three.js, Recharts, Framer Motion) are packaged into the main or admin chunks.
- **Resolution**: Normal for rich interactive suites. All admin views are code-split using `React.lazy()` to protect public page load times.

## 2. Debugging Tips
- Check Redux DevTools or inspect Redux state via console in development.
- View network requests in DevTools under the `/api/` filter to inspect HTTP request headers and response payloads.
- Run `npm run build` in `apps/frontend` to verify syntax and bundling integrity.
