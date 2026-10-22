import mongoose from 'mongoose';
import config from './dotenv.js';

let isReconnecting = false;
let reconnectTimer = null;
let listenersAttached = false;

const MONGO_OPTIONS = {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 15000,
  heartbeatFrequencyMS: 10000,
  maxIdleTimeMS: 30000,
  family: 4,
};

const setupConnectionListeners = () => {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on('connected', () => {
    isReconnecting = false;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    console.log(`[MongoDB] Connected: ${mongoose.connection.host}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[MongoDB] Connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Connection lost. Scheduling auto-reconnect...');
    scheduleReconnect();
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
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, MONGO_OPTIONS);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Initial connection failed: ${error.message}`);
    scheduleReconnect();
    throw error;
  }
};

export default mongoose;
