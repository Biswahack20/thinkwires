import { describe, it, expect } from 'vitest';
import app from '../../app.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Express trust proxy & Rate-Limit Configuration (Issue #193)', () => {
  it('verifies Express trust proxy is configured to trust first hop (1)', () => {
    // app.get('trust proxy') returns 1 when app.set('trust proxy', 1) is called
    // or a function that resolves the proxy hop
    const trustProxy = app.get('trust proxy');
    expect(trustProxy).toBeTruthy();
    if (typeof trustProxy === 'function') {
      // In Express, setting a number wraps it into a hop-counting function
      expect(trustProxy('127.0.0.1', 0)).toBe(true);
    } else {
      expect(trustProxy).toBe(1);
    }
  });

  it('verifies all backend rate limiters suppress proxy header collision warnings', () => {
    const routesDir = path.resolve(__dirname, '../../routes');
    const routeFiles = fs.readdirSync(routesDir).filter((f) => f.endsWith('.js'));

    for (const file of routeFiles) {
      const content = fs.readFileSync(path.join(routesDir, file), 'utf8');
      if (content.includes('rateLimit(')) {
        expect(content).toContain('validate:');
        expect(content).toContain('xForwardedForHeader: false');
        expect(content).toContain('forwardedHeader: false');
      }
    }
  });
});

