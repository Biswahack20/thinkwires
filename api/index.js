import app from '../apps/backend/src/app.js';
import { connectMongoDB } from '../apps/backend/src/configs/mongodb.js';
import { connectDB } from '../apps/backend/src/configs/db.js';

let isDbConnected = false;

/**
 * Vercel Serverless Function entrypoint.
 * Automatically wraps the Express app and handles incoming requests to /api/*.
 * Persists database connections across warm lambda executions.
 */
export default async function handler(req, res) {
  if (!isDbConnected) {
    try {
      await Promise.allSettled([connectMongoDB(), connectDB()]);
      isDbConnected = true;
    } catch (err) {
      console.warn('[Vercel Serverless] DB connection notice:', err.message);
    }
  }

  return app(req, res);
}
