import mongoose from 'mongoose';
import config from './dotenv.js';

let isReconnecting = false;
let reconnectTimer = null;
let listenersAttached = false;
let cachedConnectionPromise = null;
let isExplicitDisconnect = false;

const isProduction = config.NODE_ENV === 'production';
const isServerless = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
);
const isLocalMongo =
  !config.MONGODB_URI ||
  config.MONGODB_URI.includes('localhost') ||
  config.MONGODB_URI.includes('127.0.0.1') ||
  config.MONGODB_URI.includes('::1');

const MONGO_OPTIONS = {
  maxPoolSize: isServerless ? 5 : (isLocalMongo ? 5 : 10),
  minPoolSize: isServerless || isLocalMongo ? 0 : 2,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: isServerless ? 3000 : (isLocalMongo ? 5000 : 15000),
  heartbeatFrequencyMS: 10000,
  maxIdleTimeMS: 30000,
  family: 4,
  autoIndex: !isProduction,
};

const setupConnectionListeners = () => {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on('connected', () => {
    isReconnecting = false;
    isExplicitDisconnect = false;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    const target = isLocalMongo ? 'Local MongoDB / Compass' : 'MongoDB Atlas / Cloud';
    console.log(`[MongoDB] Connected: ${mongoose.connection.host} (${target})`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[MongoDB] Connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    if (isExplicitDisconnect) return;
    console.warn('[MongoDB] Connection lost. Scheduling auto-reconnect...');
    if (!isServerless) {
      scheduleReconnect();
    }
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[MongoDB] Reconnected successfully.');
    isReconnecting = false;
  });
};

const scheduleReconnect = () => {
  if (
    isReconnecting ||
    mongoose.connection.readyState === 1 ||
    mongoose.connection.readyState === 2
  ) {
    return;
  }
  isReconnecting = true;
  reconnectTimer = setTimeout(async () => {
    try {
      console.log('[MongoDB] Attempting reconnection to MongoDB Atlas...');
      await mongoose.connect(config.MONGODB_URI, MONGO_OPTIONS);
    } catch (err) {
      console.error(`[MongoDB] Reconnect attempt failed: ${err.message}`);
      isReconnecting = false;
      scheduleReconnect();
    }
  }, 5000);
};

export const connectMongoDB = async () => {
  setupConnectionListeners();

  isExplicitDisconnect = false;

  // Short-circuit if connection or in-flight handshake exists (prevents connection thrashing in serverless environments)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (cachedConnectionPromise) {
    return cachedConnectionPromise;
  }

  try {
    cachedConnectionPromise = mongoose.connect(config.MONGODB_URI, MONGO_OPTIONS);
    const conn = await cachedConnectionPromise;
    cachedConnectionPromise = null;
    return conn;
  } catch (error) {
    cachedConnectionPromise = null;
    console.error(`[MongoDB] Initial connection failed: ${error.message}`);
    if (!isServerless) {
      scheduleReconnect();
    }
    throw error;
  }
};

export const connectMongoDBWithRetry = async (maxRetries = 5, delayMs = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[MongoDB] Attempting connection (${attempt}/${maxRetries})...`);
      const conn = await connectMongoDB();
      return conn;
    } catch (err) {
      console.warn(`[MongoDB] Connection attempt ${attempt} failed: ${err.message}`);
      if (attempt === maxRetries) {
        throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts: ${err.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

export const disconnectMongoDB = async () => {
  isExplicitDisconnect = true;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  isReconnecting = false;
  cachedConnectionPromise = null;
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

/**
 * Synchronize compound ESR and partial unique indexes across all registered Mongoose models
 */
export const synchronizeIndexes = async () => {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const models = Object.values(mongoose.models);
    for (const model of models) {
      if (model && typeof model.createIndexes === 'function') {
        // Safe, non-destructive index creation (DB-01): creates schema indexes without dropping migration indexes
        await model.createIndexes();
      }
    }
    console.log('[MongoDB] Production compound indexes synchronized successfully.');
  } catch (err) {
    console.warn('[MongoDB] Index synchronization notice:', err.message);
  }
};

/**
 * Database Architecture Declaration (Issue #186)
 * MongoDB (Mongoose) is formally designated as the CANONICAL PRIMARY DOCUMENT STORE
 * (Source of Truth) for all core business entities.
 */
export const DATABASE_ARCHITECTURE = {
  PRIMARY_SOURCE_OF_TRUTH: 'MongoDB (Mongoose)',
  ROLE: 'Canonical Primary Document Store (ATS, Admin, CMS, Applications)',
};

export default mongoose;
