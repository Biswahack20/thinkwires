import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/api.route.js';
import adminRoutes from './routes/admin.route.js';
import authRoutes from './routes/auth.route.js';
import candidateRoutes from './routes/candidate.route.js';

const app = express();

// Standard middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Authentication & Candidate Portal Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidate', candidateRoutes);

// Admin & Legacy API Routes
app.use('/api/admin', adminRoutes);
app.use('/api', apiRoutes);

export default app;
