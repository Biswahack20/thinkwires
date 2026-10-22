import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import { securityHeaders } from './middlewares/securityHeaders.middleware.js';
import apiRoutes from './routes/api.route.js';
import adminRoutes from './routes/admin.route.js';
import authRoutes from './routes/auth.route.js';
import candidateRoutes from './routes/candidate.route.js';
import userRoutes from './routes/user.route.js';

const app = express();

// Modern HTTP security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
app.use(securityHeaders);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:3000',
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL.trim());
}
if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(',').forEach((o) => {
    if (o.trim()) allowedOrigins.push(o.trim());
  });
}

// Standard middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, or same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy rejection: Origin ${origin} is not permitted.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
  })
);
// Enforce reasonable JSON body limit (1MB) to protect against memory exhaustion attacks
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Static uploads serving (e.g. resumes) with sandbox and nosniff protection
app.use(
  '/uploads',
  express.static(path.resolve(process.cwd(), 'uploads'), {
    setHeaders: (res, filePath) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
      if (
        filePath.endsWith('.html') ||
        filePath.endsWith('.svg') ||
        filePath.endsWith('.htm') ||
        filePath.endsWith('.exe')
      ) {
        res.setHeader('Content-Disposition', 'attachment');
      }
    },
  })
);

// ================= HEALTH CHECK =================
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.get('/api/health', (req, res) => {
  res
    .status(200)
    .json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Authentication & Candidate Portal Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/user', userRoutes);

// Admin & Legacy API Routes
app.use('/api/admin', adminRoutes);
app.use('/api', apiRoutes);

export default app;
