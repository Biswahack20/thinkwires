import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.route.js';

const app = express();

//Standard middleware
app.use(cors());
app.use(express.json());


// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// API Routes
app.use('/api', apiRoutes);

export default app;
