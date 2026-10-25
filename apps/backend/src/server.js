import app from './app.js';
import { connectDB, sequelize } from './configs/db.js';
import { connectMongoDB, disconnectMongoDB } from './configs/mongodb.js';
import config from './configs/dotenv.js';

const PORT = config.PORT || 5000;

const startServer = async () => {
  // Start HTTP server immediately so APIs and Vite proxy respond without blocking on DB timeouts
  const server = app.listen(PORT, () => {
    console.log(
      `[Server] Thinkwires API server running on http://localhost:${PORT}`
    );
  });

  // PostgreSQL (Sequelize) - Graceful non-blocking connection
  connectDB()
    .then(async () => {
      const isDevelopment = process.env.NODE_ENV !== 'production';
      const syncOptions = isDevelopment ? { alter: true } : {};
      await sequelize.sync(syncOptions);
      console.log(
        isDevelopment
          ? '[PostgreSQL] Models synced with schema auto-alter enabled (development)'
          : '[PostgreSQL] Models synced'
      );
    })
    .catch((error) => {
      console.warn(
        '[PostgreSQL] Connection optional/bypassed:',
        error.message || error
      );
      console.log(
        '[PostgreSQL] Operating with in-memory seed dataset for API routes.'
      );
    });

  // MongoDB (Mongoose) - Graceful non-blocking connection
  connectMongoDB()
    .then(() => {
      console.log('[MongoDB] Connected: dual-mode active persistence enabled.');
    })
    .catch((error) => {
      console.warn(
        '[MongoDB] Connection optional/bypassed:',
        error.message || error
      );
      console.log(
        '[MongoDB] Operating with dual-mode in-memory store for Admin & CMS.'
      );
    });

  // Graceful shutdown handling for container orchestrators (Docker, Kubernetes, Render)
  const gracefulShutdown = (signal) => {
    console.log(`[Server] Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      console.log('[Server] HTTP connections closed.');
      try {
        await disconnectMongoDB();
        console.log('[MongoDB] Connection closed.');
        if (sequelize) {
          await sequelize.close();
          console.log('[PostgreSQL] Connection closed.');
        }
      } catch (err) {
        console.error('[Server] Error during database shutdown:', err.message);
      }
      process.exit(0);
    });

    // Force exit if connections do not close in 10s
    setTimeout(() => {
      console.error('[Server] Forcing shutdown after timeout.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  return server;
};

startServer();

