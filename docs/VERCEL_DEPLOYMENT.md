# Vercel Deployment Guide for Thinkwires

This guide provides step-by-step instructions to deploy the Thinkwires platform on **Vercel**.

---

## Architecture Overview

```
                                      ┌───────────────────────────────────────────┐
                                      │           Vercel Global Edge CDN          │
                                      └─────────────────────┬─────────────────────┘
                                                            │
                            ┌───────────────────────────────┴───────────────────────────────┐
                            │                                                               │
                            ▼                                                               ▼
             Static Frontend Assets (/assets/*)                             API Requests (/api/*)
             apps/frontend/dist (SPA Routing)                               api/index.js (Serverless Express)
                            │                                                               │
                            │                                               ┌───────────────┴───────────────┐
                            │                                               ▼                               ▼
                            ▼                                         MongoDB Atlas                  Neon PostgreSQL
                   Browser / Client Cache                               (Mongoose)                     (Sequelize)
```

Thinkwires is designed with relative API routes (`/api/...`), so all API calls and authentication cookies remain **same-origin**, eliminating cross-site cookie and CORS issues.

---

## Deployment Option 1: Full Monorepo on Vercel (Frontend + Serverless API)

*Best for: 1-click deployment without needing an external Node.js server.*

### Step 1: Push Code to GitHub / GitLab / Bitbucket
Ensure all latest files (including `vercel.json` and `api/index.js`) are committed and pushed to your Git repository.

### Step 2: Import Project in Vercel
1. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your `thinkwires` repository.
3. In the configuration screen:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave default repository root)
   - **Build Command**: `npm run build:frontend` (configured automatically via `vercel.json`)
   - **Output Directory**: `apps/frontend/dist` (configured automatically via `vercel.json`)

### Step 3: Configure Environment Variables in Vercel
Go to **Project Settings → Environment Variables** and add:

| Key | Example Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Enables production optimizations and cookie security |
| `JWT_SECRET` | `your_secure_random_string_min_32_chars` | Used to sign JWT candidate & admin session cookies |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/thinkwire_db` | MongoDB Atlas database URI |
| `DATABASE_URL` | `postgresql://user:pass@ep-xyz.neon.tech/thinkwire_db?sslmode=require` | PostgreSQL database URI (e.g. Neon Serverless) |
| `OPENAI_API_KEY` | `sk-...` | Optional: OpenAI key for LLM assessment generator |
| `OPENAI_MODEL` | `gpt-4o-mini` | Optional: Model name |
| `COOKIE_SAME_SITE` | `lax` | Cookie SameSite attribute |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` | Comma-separated list of exact trusted frontend URLs for CORS and CSRF |

### Step 4: Click Deploy
Vercel will:
1. Install monorepo workspace dependencies.
2. Build the Vite frontend into `apps/frontend/dist`.
3. Package `api/index.js` into an AWS Lambda / Vercel Serverless Function.
4. Deploy the application to a `*.vercel.app` domain.

---

## Deployment Option 2: Frontend on Vercel + Backend on External Host (Render / Railway / VPS)

*Best for: High-throughput workloads requiring persistent background tasks or the Python FastAPI microservice.*

### Step 1: Deploy Backend & AI Services
Deploy the backend on Render, Railway, Fly.io, or an Ubuntu VPS (e.g., `https://api.yourdomain.com` or `https://thinkwires-backend.onrender.com`).

### Step 2: Configure Proxy Rewrites in `vercel.json`
Edit [vercel.json](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/vercel.json) (or [apps/frontend/vercel.json](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/apps/frontend/vercel.json)):

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://thinkwires-backend.onrender.com/api/:path*"
    },
    {
      "source": "/uploads/:path*",
      "destination": "https://thinkwires-backend.onrender.com/uploads/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

> **Why this is powerful**: The frontend still calls `/api/...` locally on its Vercel domain. Vercel transparently proxies the requests to your backend server. This completely bypasses third-party cookie restrictions in Safari and Chrome.

---

## Verifying the Deployment

1. **SPA Routing**:
   Visit your Vercel URL directly on a sub-route, e.g.:
   - `https://your-project.vercel.app/candidate/profile`
   - `https://your-project.vercel.app/jobs`
   - `https://your-project.vercel.app/candidate/dashboard`
   Ensure the page loads directly without 404s.

2. **API Health Check**:
   Visit:
   - `https://your-project.vercel.app/api/health`
   You should see:
   ```json
   {
     "status": "healthy",
     "service": "Thinkwires Enterprise Core Backend",
     "version": "1.0.0",
     "environment": "production",
     "databases": {
       "mongodb": "connected",
       "postgresql": "connected"
     }
   }
   ```

3. **Candidate Profile & Resume Parsing**:
   - Log in or register a candidate account at `/login` or `/register`.
   - Go to `/candidate/profile`.
   - Upload a test resume to verify instant auto-fill and profile persistence.

---

## Troubleshooting Common Vercel Issues

### Issue 1: "Cannot GET /candidate/profile" (404 on refresh)
- **Cause**: Client-side routing not redirected to `index.html`.
- **Solution**: Ensure [vercel.json](file:///c:/Users/Tanjil%20Alam/Desktop/Thinkwires/thinkwires/vercel.json) contains `"source": "/(.*)", "destination": "/index.html"` as the last rewrite rule.

### Issue 2: MongoDB connection timeout on Serverless
- **Cause**: MongoDB Atlas IP Whitelist blocks Vercel serverless IPs.
- **Solution**: In MongoDB Atlas → **Network Access**, add `0.0.0.0/0` (Allow access from anywhere). Serverless functions run on dynamic IP ranges.

### Issue 3: PostgreSQL SSL Mode Warning
- **Cause**: Neon or cloud Postgres requires SSL.
- **Solution**: Append `?sslmode=require` or `?sslmode=verify-full` to `DATABASE_URL`.
