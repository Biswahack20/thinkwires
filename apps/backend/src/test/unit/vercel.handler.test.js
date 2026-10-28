import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import * as mongodbConfig from '../../configs/mongodb.js';
import * as dbConfig from '../../configs/db.js';
import handler from '../../../../../api/index.js';

describe('Vercel Serverless Handler Connection Recovery', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('attempts reconnection when mongoose.connection.readyState is 0 (disconnected)', async () => {
    const readyStateSpy = vi.spyOn(mongoose.connection, 'readyState', 'get').mockReturnValue(0);
    const connectMongoSpy = vi.spyOn(mongodbConfig, 'connectMongoDB').mockResolvedValue({});
    const connectDBSpy = vi.spyOn(dbConfig, 'connectDB').mockResolvedValue({});

    await request(handler).get('/api/health');

    expect(readyStateSpy).toHaveBeenCalled();
    expect(connectMongoSpy).toHaveBeenCalledTimes(1);
    expect(connectDBSpy).toHaveBeenCalledTimes(1);
  });

  it('bypasses reconnection when mongoose.connection.readyState is 1 (connected)', async () => {
    const readyStateSpy = vi.spyOn(mongoose.connection, 'readyState', 'get').mockReturnValue(1);
    const connectMongoSpy = vi.spyOn(mongodbConfig, 'connectMongoDB').mockResolvedValue({});
    const connectDBSpy = vi.spyOn(dbConfig, 'connectDB').mockResolvedValue({});

    await request(handler).get('/api/health');

    expect(readyStateSpy).toHaveBeenCalled();
    expect(connectMongoSpy).not.toHaveBeenCalled();
    expect(connectDBSpy).not.toHaveBeenCalled();
  });

  it('re-attempts connection on subsequent warm invocation if connection was dropped', async () => {
    const readyStateSpy = vi.spyOn(mongoose.connection, 'readyState', 'get');
    const connectMongoSpy = vi.spyOn(mongodbConfig, 'connectMongoDB').mockResolvedValue({});
    const connectDBSpy = vi.spyOn(dbConfig, 'connectDB').mockResolvedValue({});

    // First invocation: connected (readyState = 1)
    readyStateSpy.mockReturnValue(1);
    await request(handler).get('/api/health');
    expect(connectMongoSpy).not.toHaveBeenCalled();

    // Second warm invocation: connection dropped to disconnected (readyState = 0)
    readyStateSpy.mockReturnValue(0);
    await request(handler).get('/api/health');
    expect(connectMongoSpy).toHaveBeenCalledTimes(1);
    expect(connectDBSpy).toHaveBeenCalledTimes(1);
  });
});
