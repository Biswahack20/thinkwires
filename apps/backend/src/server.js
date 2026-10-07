import app from './app.js';
import { connectDB, sequelize } from './configs/db.js';
import config from './configs/dotenv.js';

const PORT = config.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const isDevelopment = process.env.NODE_ENV !== "production";
    const syncOptions = isDevelopment ? { alter: true } : {};

    await sequelize.sync(syncOptions);

    console.log(
      isDevelopment
        ? "✅ Database models synced with schema auto-alter enabled (development)"
        : "✅ Database models synced"
    );
  } catch (error) {
    console.warn("⚠️ Database connection optional/bypassed:", error.message || error);
    console.log("ℹ️ Operating with in-memory seed dataset for API routes.");
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
