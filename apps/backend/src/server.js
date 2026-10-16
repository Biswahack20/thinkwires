import app from './app.js';
import { connectDB, sequelize } from './configs/db.js';
import { connectMongoDB } from './configs/mongodb.js';
import config from './configs/dotenv.js';

const PORT = config.PORT || 5000;

const startServer = async () => {
  // Start HTTP server immediately so APIs and Vite proxy respond without blocking on DB timeouts
  const server = app.listen(PORT, () => {
    console.log(`🚀 ThinkWires API server running on http://localhost:${PORT}`);
  });

  // ── PostgreSQL (Sequelize) — Graceful non-blocking connection ───────────────
  connectDB()
    .then(async () => {
      const isDevelopment = process.env.NODE_ENV !== "production";
      const syncOptions = isDevelopment ? { alter: true } : {};
      await sequelize.sync(syncOptions);
      console.log(
        isDevelopment
          ? "✅ PostgreSQL models synced with schema auto-alter enabled (development)"
          : "✅ PostgreSQL models synced"
      );
    })
    .catch((error) => {
      console.warn("⚠️ PostgreSQL connection optional/bypassed:", error.message || error);
      console.log("ℹ️ Operating with in-memory seed dataset for API routes.");
    });

  // ── MongoDB (Mongoose) — Graceful non-blocking connection ───────────────────
  connectMongoDB()
    .then(() => {
      console.log("✅ MongoDB connected: dual-mode active persistence enabled.");
    })
    .catch((error) => {
      console.warn("⚠️ MongoDB connection optional/bypassed:", error.message || error);
      console.log("ℹ️ Operating with dual-mode in-memory store for Admin & CMS.");
    });

  return server;
};

startServer();
