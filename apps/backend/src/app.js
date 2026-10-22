import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/api.route.js';
import adminRoutes from './routes/admin.route.js';
import authRoutes from './routes/auth.route.js';
import candidateRoutes from './routes/candidate.route.js';
import userRoutes from './routes/user.route.js';

import path from 'path';

const app = express();

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
app.use(express.json());
app.use(cookieParser());

// Static uploads serving (e.g. resumes)
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

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
