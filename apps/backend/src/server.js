import app from './app.js';
import { connectDB, sequelize } from './configs/db.js';
import { connectMongoDB } from './configs/mongodb.js';
import config from './configs/dotenv.js';

const PORT = config.PORT || 5000;

const startServer = async () => {
  // ── PostgreSQL (Sequelize) ──────────────────────────────────────────────────
  try {
    await connectDB();

    const isDevelopment = process.env.NODE_ENV !== "production";
    const syncOptions = isDevelopment ? { alter: true } : {};

    await sequelize.sync(syncOptions);

    console.log(
      isDevelopment
        ? "✅ PostgreSQL models synced with schema auto-alter enabled (development)"
        : "✅ PostgreSQL models synced"
    );
  } catch (error) {
    console.warn("⚠️ PostgreSQL connection optional/bypassed:", error.message || error);
    console.log("ℹ️ Operating with in-memory seed dataset for API routes.");
  }

  // ── MongoDB (Mongoose) ──────────────────────────────────────────────────────
  try {
    await connectMongoDB();
  } catch (error) {
    console.warn("⚠️ MongoDB connection optional/bypassed:", error.message || error);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();

