import app, { setShuttingDown } from './app.js';
import { connectDB, sequelize } from './configs/db.js';
import {
  connectMongoDB,
  connectMongoDBWithRetry,
  disconnectMongoDB,
  synchronizeIndexes,
} from './configs/mongodb.js';
import config from './configs/dotenv.js';
import { getRedisClient, closeRedis } from './configs/redis.js';
import { getJwtSecret } from './utils/auth.util.js';
import { validateBootEnvironment } from './configs/env.validator.js';

const PORT = config.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const startServer = async () => {
  // Fail fast on startup if environment schema or secrets are missing/invalid in production (DEP-02)
  if (!process.env.VITEST) {
    validateBootEnvironment();
  }

  // Fail fast on startup if JWT_SECRET is missing, insecure, or weak
  getJwtSecret();

  // In production, ensure required MongoDB connection is established with bounded retries before serving traffic (REL-01)
  if (process.env.NODE_ENV === 'production') {
    try {
      await connectMongoDBWithRetry(5, 2000);
      console.log('[MongoDB] Connected: production active persistence verified.');
      await synchronizeIndexes();
    } catch (err) {
      console.error('🚨 [FATAL] Database connection failed during production startup:', err.message);
      process.exit(1);
    }
  } else {
    // Development mode non-blocking connection
    connectMongoDB()
      .then(async () => {
        console.log('[MongoDB] Connected: dual-mode active persistence enabled.');
        await synchronizeIndexes();
      })
      .catch((error) => {
        console.warn('⚠️ [MongoDB] Initial connection notice:', error.message || error);
      });
  }

  // Start HTTP server bound to 0.0.0.0 for containerized environments (DEP-03)
  const server = app.listen(PORT, HOST, () => {
    console.log(
      `[Server] Thinkwires API server running on http://${HOST}:${PORT}`
    );
  });

  // PostgreSQL (Sequelize) - Graceful non-blocking connection
  connectDB()
    .then(async () => {
      const isDevelopment = process.env.NODE_ENV !== 'production';
      if (isDevelopment) {
        await sequelize.sync({ alter: true });
      }
    })
    .catch((error) => {
      console.warn('[PostgreSQL] Connection optional/bypassed:', error.message || error);
    });

  // Redis (Upstash / Local) - Graceful non-blocking connection
  getRedisClient()
    .catch((error) => {
      console.warn(
        '[Redis] Startup connection notice:',
        error.message || error
      );
    });

  // Graceful shutdown handling for container orchestrators (Docker, Kubernetes, Render) with active connection draining (DEP-06)
  const gracefulShutdown = (signal, exitCode = 0) => {
    console.log(`[Server] Received ${signal}. Starting graceful shutdown...`);
    setShuttingDown(true);

    if (typeof server.closeIdleConnections === 'function') {
      server.closeIdleConnections();
    }

    server.close(async () => {
      console.log('[Server] HTTP connections closed.');
      try {
        await disconnectMongoDB();
        console.log('[MongoDB] Connection closed.');
        if (sequelize) {
          await sequelize.close();
          console.log('[PostgreSQL] Connection closed.');
        }
        await closeRedis();
        console.log('[Redis] Connection closed.');
      } catch (err) {
        console.error('[Server] Error during database shutdown:', err.message);
      }
      process.exit(exitCode);
    });

    // Force exit if connections do not close in 10s
    setTimeout(() => {
      console.error('[Server] Forcing shutdown after timeout.');
      process.exit(1);
    }, 10000).unref();
  };

  // Process-level monitors for unhandled promise rejections and uncaught exceptions (SEC-EXP-05)
  process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 [Process] Unhandled Promise Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('💥 [Process] Critical Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION', 1);
  });

  // Use process.once to prevent EventEmitter memory leaks across restarts/workers (Issue #179)
  process.once('SIGTERM', () => gracefulShutdown('SIGTERM', 0));
  process.once('SIGINT', () => gracefulShutdown('SIGINT', 0));

  return server;
};

export { startServer };

startServer();
