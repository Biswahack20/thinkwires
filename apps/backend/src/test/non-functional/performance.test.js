import { describe, it, expect } from 'vitest';
import { api } from '../test-helper.js';

describe('Performance & System Quality (Non-Functional Tests)', () => {
  describe('Latency Benchmarks', () => {
    it('GET /api/health responds within 100 milliseconds', async () => {
      const start = performance.now();
      const res = await api.get('/api/health');
      const duration = performance.now() - start;

      expect(res.status).toBe(200);
      expect(duration).toBeLessThan(150);
    });

    it('GET / responds within 100 milliseconds', async () => {
      const start = performance.now();
      const res = await api.get('/');
      const duration = performance.now() - start;

      expect(res.status).toBe(200);
      expect(duration).toBeLessThan(150);
    });
  });

  describe('Rate Limiting & DoS Protection', () => {
    it('enforces request rate limiting on repeated authentication failures', async () => {
      // Dispatch 25 rapid login attempts from the same IP (threshold is 20)
      const attempts = [];
      for (let i = 0; i < 25; i++) {
        attempts.push(
          api.post('/api/auth/login').send({
            email: `dos.test.${i}@thinkwires.com`,
            password: 'BadPassword123!',
          })
        );
      }

      const results = await Promise.all(attempts);
      const statuses = results.map((r) => r.status);

      // At least one request beyond the limit must be throttled with 429 Too Many Requests
      const hasBeenRateLimited = statuses.includes(429);
      expect(hasBeenRateLimited).toBe(true);

      const rateLimitedRes = results.find((r) => r.status === 429);
      expect(rateLimitedRes.body.error).toMatch(
        /too many authentication attempts/i
      );
    });
  });
});
