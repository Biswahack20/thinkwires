import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * High-performance Structured Pino Logger for Thinkwires Backend
 * - In development: uses pino-pretty for clean, human-readable colorized console logs
 * - In production: uses high-speed structured JSON logs with ISO timestamps
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  base: {
    service: 'thinkwires-backend',
    env: process.env.NODE_ENV || 'development',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss.l',
          ignore: 'pid,hostname,service,env',
        },
      }
    : undefined,
});

export default logger;
