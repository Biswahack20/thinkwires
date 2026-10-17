import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({
  path: path.join(envPath),
});

export default {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost/dbname',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/thinkwire_db',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  JWT_SECRET: process.env.JWT_SECRET,
};