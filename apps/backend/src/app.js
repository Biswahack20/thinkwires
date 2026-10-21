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

// Standard middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Static uploads serving (e.g. resumes)
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Authentication & Candidate Portal Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/user', userRoutes);

// Admin & Legacy API Routes
app.use('/api/admin', adminRoutes);
app.use('/api', apiRoutes);

export default app;
