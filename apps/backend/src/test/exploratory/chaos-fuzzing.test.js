import { describe, it, expect } from 'vitest';
import { api } from '../test-helper.js';

describe('Exploratory & Chaos Fuzzing Tests', () => {
  describe('Malformed & Corrupted Payload Fuzzing', () => {
    it('handles syntactically malformed JSON body with 400 Bad Request without crashing', async () => {
      const res = await api
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{ "email": "broken_json", "password": ');

      expect(res.status).toBe(400);
    });

    it('handles empty body with application/json header gracefully', async () => {
      const res = await api
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('');

      expect([400, 429]).toContain(res.status);
    });

    it('safely handles deeply nested objects without recursion or stack overflow', async () => {
      let nested = { leaf: 'value' };
      for (let i = 0; i < 50; i++) {
        nested = { child: nested };
      }

      const res = await api.post('/api/auth/register').send({
        name: 'Nested Tester',
        email: 'nested@thinkwires.com',
        password: 'Password12345!',
        meta: nested,
      });

      // Server survives and handles the payload safely
      expect([201, 400, 409, 429]).toContain(res.status);
    });
  });

  describe('Path Traversal & Random Input Fuzzing', () => {
    it('rejects directory traversal payloads in URL paths', async () => {
      const traversalPaths = [
        '/api/../../../../etc/passwd',
        '/api/..%2f..%2f..%2fetc%2fpasswd',
        '/api/windows/system32/cmd.exe',
      ];

      for (const traversalPath of traversalPaths) {
        const res = await api.get(traversalPath);
        expect([400, 403, 404]).toContain(res.status);
      }
    });

    it('safely handles null byte injections in query strings and paths', async () => {
      const res = await api.get('/api/health?probe=%00nullbyte');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
    });

    it('handles unexpected HTTP verbs without unhandled exceptions', async () => {
      // PROPFIND, SEARCH, or custom methods
      const res = await api.patch('/api/health');

      expect([404, 405]).toContain(res.status);
    });
  });
});
