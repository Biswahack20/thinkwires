import { createClient } from 'redis';
import config from './dotenv.js';

let redisClient = null;
let isRedisConnecting = false;
let isRedisReady = false;

const isTest = config.NODE_ENV === 'test' || process.env.NODE_ENV === 'test';

export const setMockRedisClient = (client) => {
  redisClient = client;
  isRedisReady = Boolean(client);
  isRedisConnecting = false;
};

/**
 * Initializes and retrieves the singleton Redis client.
 * Includes graceful connection handling and automatic fallback.
 */
export const getRedisClient = async () => {
  if (redisClient && isRedisReady) {
    return redisClient;
  }

  // In test environment without explicit REDIS_URL, bypass live socket connection
  if (isTest && !process.env.TEST_REDIS_URL) {
    return null;
  }

  if (!redisClient && !isRedisConnecting) {
    isRedisConnecting = true;
    const redisUrl =
      process.env.REDIS_URL || config.REDIS_URL || 'redis://localhost:6379';

    try {
      redisClient = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 2) {
              return false; // Cease retrying if Redis is not running
            }
            return Math.min(retries * 50, 300);
          },
          connectTimeout: 2000,
        },
      });

      redisClient.on('error', (err) => {
        isRedisReady = false;
        // Suppress repeated connection logs if local Redis daemon is absent
      });

      redisClient.on('ready', () => {
        isRedisReady = true;
        isRedisConnecting = false;
        console.log('[Redis] Connected: token revocation cache active.');
      });

      redisClient.on('end', () => {
        isRedisReady = false;
        isRedisConnecting = false;
      });

      await redisClient.connect();
      isRedisReady = true;
      isRedisConnecting = false;
    } catch (err) {
      isRedisReady = false;
      isRedisConnecting = false;
      if (!isTest) {
        console.warn(
          '[Redis] Connection optional/bypassed:',
          err.message || err
        );
        console.log(
          '[Redis] Operating with in-memory revocation store fallback.'
        );
      }
      return null;
    }
  }

  return isRedisReady ? redisClient : null;
};

/**
 * Closes the Redis client connection gracefully on server shutdown.
 */
export const closeRedis = async () => {
  if (redisClient) {
    try {
      if (isRedisReady) {
        await redisClient.quit();
      }
    } catch {
      // Ignore cleanup error
    } finally {
      redisClient = null;
      isRedisReady = false;
      isRedisConnecting = false;
    }
  }
};
