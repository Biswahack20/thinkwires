import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StorageService } from '../../utils/storage.adapter.js';
import fs from 'fs';
import path from 'path';

describe('StorageService (Unit Tests)', () => {
  const testDir = path.resolve(process.cwd(), 'uploads_test');

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    vi.restoreAllMocks();
  });

  describe('Filename Sanitization', () => {
    it('sanitizes directory traversal patterns', () => {
      const storage = new StorageService({ driver: 'local', localBaseDir: testDir });
      expect(storage.sanitizeFilename('../../../etc/passwd')).toBe('passwd');
      expect(storage.sanitizeFilename('..\\..\\windows\\system32\\cmd.exe')).toBe('cmd.exe');
      expect(storage.sanitizeFilename('normal-file.pdf')).toBe('normal-file.pdf');
    });

    it('generates fallback filename for empty or invalid names', () => {
      const storage = new StorageService({ driver: 'local', localBaseDir: testDir });
      expect(storage.sanitizeFilename('')).toMatch(/^file-\d+$/);
    });
  });

  describe('Local Storage Driver', () => {
    it('saves a buffer to local filesystem and returns URL path', async () => {
      const storage = new StorageService({ driver: 'local', localBaseDir: testDir });
      const buffer = Buffer.from('hello test file');
      const url = await storage.saveFile(buffer, 'test.txt', 'text/plain', 'docs');

      expect(url).toBe('/uploads/docs/test.txt');
      const filePath = path.resolve(testDir, 'docs', 'test.txt');
      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.readFileSync(filePath, 'utf-8')).toBe('hello test file');
    });

    it('returns local URL path from getSignedDownloadUrl in local mode', async () => {
      const storage = new StorageService({ driver: 'local', localBaseDir: testDir });
      const url = await storage.getSignedDownloadUrl('test.txt', 'docs');
      expect(url).toBe('/uploads/docs/test.txt');
    });

    it('deletes an existing file from local filesystem', async () => {
      const storage = new StorageService({ driver: 'local', localBaseDir: testDir });
      const buffer = Buffer.from('to be deleted');
      await storage.saveFile(buffer, 'delete_me.txt', 'text/plain', 'temp');

      const filePath = path.resolve(testDir, 'temp', 'delete_me.txt');
      expect(fs.existsSync(filePath)).toBe(true);

      const deleted = await storage.deleteFile('delete_me.txt', 'temp');
      expect(deleted).toBe(true);
      expect(fs.existsSync(filePath)).toBe(false);
    });
  });

  describe('S3 / Cloudflare R2 Driver', () => {
    const s3Config = {
      driver: 's3',
      bucket: 'my-test-bucket',
      region: 'us-east-1',
      accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
      secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    };

    it('generates AWS SigV4 presigned download URL with required parameters', async () => {
      const storage = new StorageService(s3Config);
      const signedUrl = await storage.getSignedDownloadUrl('candidate-resume.pdf', 'resumes', 300);

      expect(signedUrl).toContain('https://my-test-bucket.s3.us-east-1.amazonaws.com/resumes/candidate-resume.pdf?');
      expect(signedUrl).toContain('X-Amz-Algorithm=AWS4-HMAC-SHA256');
      expect(signedUrl).toContain('X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F');
      expect(signedUrl).toContain('X-Amz-Date=');
      expect(signedUrl).toContain('X-Amz-Expires=300');
      expect(signedUrl).toContain('X-Amz-SignedHeaders=host');
      expect(signedUrl).toContain('X-Amz-Signature=');
    });

    it('uploads file buffer to S3 using SigV4 signed PUT request', async () => {
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(''),
      });
      global.fetch = fetchSpy;

      const storage = new StorageService(s3Config);
      const buffer = Buffer.from('mock pdf content');
      const url = await storage.saveFile(buffer, 'resume.pdf', 'application/pdf', 'resumes');

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
      expect(calledUrl).toBe('https://my-test-bucket.s3.us-east-1.amazonaws.com/resumes/resume.pdf');
      expect(calledOptions.method).toBe('PUT');
      expect(calledOptions.headers['Content-Type']).toBe('application/pdf');
      expect(calledOptions.headers['Authorization']).toContain('AWS4-HMAC-SHA256 Credential=AKIAIOSFODNN7EXAMPLE/');
      expect(calledOptions.headers['x-amz-content-sha256']).toBeDefined();
      expect(url).toBe('https://my-test-bucket.s3.us-east-1.amazonaws.com/resumes/resume.pdf');
    });

    it('deletes file from S3 using SigV4 signed DELETE request', async () => {
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
      });
      global.fetch = fetchSpy;

      const storage = new StorageService(s3Config);
      const result = await storage.deleteFile('resume.pdf', 'resumes');

      expect(result).toBe(true);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
      expect(calledUrl).toBe('https://my-test-bucket.s3.us-east-1.amazonaws.com/resumes/resume.pdf');
      expect(calledOptions.method).toBe('DELETE');
      expect(calledOptions.headers['Authorization']).toContain('AWS4-HMAC-SHA256 Credential=AKIAIOSFODNN7EXAMPLE/');
    });

    it('uses custom endpoint and cdnDomain when configured', async () => {
      const customStorage = new StorageService({
        ...s3Config,
        endpoint: 'https://r2.cloudflarestorage.com',
        cdnDomain: 'cdn.thinkwires.com',
      });

      const url = customStorage.getFileUrl('resume.pdf', 'resumes');
      expect(url).toBe('https://cdn.thinkwires.com/resumes/resume.pdf');
    });
  });
});
