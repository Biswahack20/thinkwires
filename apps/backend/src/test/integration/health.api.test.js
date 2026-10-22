import { describe, it, expect } from 'vitest';
import { api } from '../test-helper.js';

describe('Health & Server Lifecycle API (Integration Tests)', () => {
  it('GET / responds with 200 and running status', async () => {
    const res = await api.get('/');

    expect(res.status).toBe(200);
    expect(res.text).toContain('API is running...');
  });

  it('GET /api/health responds with 200, healthy status, and ISO timestamp', async () => {
    const res = await api.get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.timestamp).toBeDefined();
    expect(new Date(res.body.timestamp).toString()).not.toBe('Invalid Date');
  });

  it('GET /api/non-existent-endpoint responds with 404', async () => {
    const res = await api.get('/api/completely-unknown-route');

    expect(res.status).toBe(404);
  });
});
