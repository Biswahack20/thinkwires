import { describe, it, expect, vi, afterEach } from 'vitest';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app.js';
import * as mongoConfig from '../../configs/mongodb.js';

describe('Server Reliability & Fail-Closed Lifecycle (REL-01)', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  describe('Bounded Startup Retries (connectMongoDBWithRetry)', () => {
    it('retries bounded number of times and halts safely on persistent outage', async () => {
      vi.spyOn(mongoose.connection, 'readyState', 'get').mockReturnValue(0);
      const mockConnect = vi
        .spyOn(mongoose, 'connect')
        .mockRejectedValue(new Error('Connection timed out'));

      await expect(
        mongoConfig.connectMongoDBWithRetry(3, 5)
      ).rejects.toThrow(/Failed to connect to MongoDB after 3 attempts/i);

      expect(mockConnect).toHaveBeenCalledTimes(3);
    });

    it('returns active connection immediately when attempt succeeds', async () => {
      vi.spyOn(mongoose.connection, 'readyState', 'get').mockReturnValue(0);
      const mockConn = { name: 'thinkwires_test', readyState: 1 };
      vi.spyOn(mongoose, 'connect').mockResolvedValue(mockConn);

      const conn = await mongoConfig.connectMongoDBWithRetry(3, 5);
      expect(conn).toBe(mockConn);
    });
  });

  describe('Fail-Closed Database Outage Behavior in Production', () => {
    it('returns 503 Service Unavailable for consultation booking when MongoDB is down in production', async () => {
      process.env.NODE_ENV = 'production';
      vi.spyOn(mongoose.connection, 'readyState', 'get').mockReturnValue(0); // disconnected

      const res = await request(app)
        .post('/api/consultations')
        .send({
          fullName: 'Jane Architect',
          workEmail: 'jane@enterprise.com',
          phone: '+1 555 0199',
          primaryNeed: 'Staff Augmentation',
        });

      expect(res.status).toBe(503);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Database connection temporarily unavailable/i);
    });

    it('returns 503 Service Unavailable for contact message submission when MongoDB is down in production', async () => {
      process.env.NODE_ENV = 'production';
      vi.spyOn(mongoose.connection, 'readyState', 'get').mockReturnValue(0); // disconnected

      const res = await request(app)
        .post('/api/contact/message')
        .send({
          fullName: 'Enterprise Client',
          workEmail: 'client@company.com',
          subject: 'Talent Request',
          message: 'Need 5 senior engineers immediately',
        });

      expect(res.status).toBe(503);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Database connection temporarily unavailable/i);
    });
  });
});
