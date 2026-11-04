import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Vercel SPA Routing Configuration (Issue #195)', () => {
  const rootVercelPath = path.resolve(__dirname, '../../../../../vercel.json');
  const frontendVercelPath = path.resolve(__dirname, '../../../vercel.json');

  it('verifies root vercel.json does not contain cleanUrls: true', () => {
    const raw = fs.readFileSync(rootVercelPath, 'utf8');
    const config = JSON.parse(raw);

    expect(config.cleanUrls).toBeUndefined();
  });

  it('verifies root vercel.json routes all SPA paths to /index.html', () => {
    const raw = fs.readFileSync(rootVercelPath, 'utf8');
    const config = JSON.parse(raw);

    expect(Array.isArray(config.rewrites)).toBe(true);
    const spaRewrite = config.rewrites.find(
      (r) => r.source === '/(.*)' && r.destination === '/index.html'
    );
    expect(spaRewrite).toBeDefined();
  });

  it('verifies apps/frontend/vercel.json does not contain cleanUrls: true', () => {
    const raw = fs.readFileSync(frontendVercelPath, 'utf8');
    const config = JSON.parse(raw);

    expect(config.cleanUrls).toBeUndefined();
  });

  it('verifies apps/frontend/vercel.json routes all SPA paths to /index.html', () => {
    const raw = fs.readFileSync(frontendVercelPath, 'utf8');
    const config = JSON.parse(raw);

    expect(Array.isArray(config.rewrites)).toBe(true);
    const spaRewrite = config.rewrites.find(
      (r) => r.source === '/(.*)' && r.destination === '/index.html'
    );
    expect(spaRewrite).toBeDefined();
  });
});

