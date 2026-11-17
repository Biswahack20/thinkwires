import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * AWS SigV4 Signing Helpers for S3 and S3-compatible APIs (Cloudflare R2, MinIO, AWS S3)
 */
function hmacSha256(key, data) {
  return crypto.createHmac('sha256', key).update(data).digest();
}

function sha256Hex(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function getSigningKey(secretKey, dateStamp, region, service = 's3') {
  const kDate = hmacSha256(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmacSha256(kDate, region);
  const kService = hmacSha256(kRegion, service);
  return hmacSha256(kService, 'aws4_request');
}

/**
 * Pluggable Storage Service (DEP-01, DEP-STA-01)
 * Decouples file persistence from ephemeral container storage.
 * Supports S3-compatible cloud object storage (AWS S3, Cloudflare R2, MinIO, GCS)
 * and local directory storage for development and testing.
 */
export class StorageService {
  constructor(options = {}) {
    this.driver =
      options.driver ||
      process.env.STORAGE_DRIVER ||
      (process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID ? 's3' : 'local');

    this.bucket = options.bucket || process.env.S3_BUCKET || 'thinkwires-storage';
    this.region = options.region || process.env.S3_REGION || 'us-east-1';
    this.cdnDomain = options.cdnDomain || process.env.CDN_DOMAIN || '';
    this.endpoint = options.endpoint || process.env.S3_ENDPOINT || '';
    this.accessKeyId = options.accessKeyId || process.env.S3_ACCESS_KEY_ID || '';
    this.secretAccessKey = options.secretAccessKey || process.env.S3_SECRET_ACCESS_KEY || '';

    this.localBaseDir =
      options.localBaseDir ||
      (process.env.VERCEL
        ? path.resolve('/tmp', 'uploads')
        : path.resolve(process.cwd(), 'uploads'));
  }

  /**
   * Sanitizes filename against directory traversal attacks.
   */
  sanitizeFilename(filename) {
    const safe = path.basename(filename || '').replace(/[^a-zA-Z0-9_.-]/g, '_');
    return safe || `file-${Date.now()}`;
  }

  /**
   * Resolves local absolute path for a folder and file.
   */
  resolveLocalPath(folder, filename) {
    const safeFolder = path.basename(folder || 'resumes');
    const safeFile = this.sanitizeFilename(filename);
    const targetDir = path.resolve(this.localBaseDir, safeFolder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    return path.resolve(targetDir, safeFile);
  }

  /**
   * Resolves S3 / R2 URL parts (host, path, fullUrl)
   */
  getS3ResourceUrl(folder, filename) {
    const safeFolder = path.basename(folder || 'resumes');
    const safeName = this.sanitizeFilename(filename);
    const objectKey = `${safeFolder}/${safeName}`;

    if (this.endpoint) {
      const cleanEndpoint = this.endpoint.replace(/\/+$/, '');
      const parsed = new URL(cleanEndpoint);
      // Path-style S3 endpoint (e.g. MinIO or R2)
      const canonicalPath = `/${this.bucket}/${objectKey}`;
      const fullUrl = `${cleanEndpoint}${canonicalPath}`;
      return { host: parsed.host, canonicalPath, fullUrl, objectKey };
    }

    // AWS S3 virtual-hosted style
    const host = `${this.bucket}.s3.${this.region}.amazonaws.com`;
    const canonicalPath = `/${objectKey}`;
    const fullUrl = `https://${host}${canonicalPath}`;
    return { host, canonicalPath, fullUrl, objectKey };
  }

  /**
   * Persists a file buffer into object storage or local disk.
   *
   * @param {Buffer} fileBuffer The file data buffer
   * @param {string} filename The target filename
   * @param {string} mimeType The file MIME type
   * @param {string} folder Target folder or bucket prefix
   * @returns {Promise<string>} Public or relative URL path
   */
  async saveFile(fileBuffer, filename, mimeType = 'application/octet-stream', folder = 'resumes') {
    const safeName = this.sanitizeFilename(filename);

    if (this.driver === 's3') {
      const { host, canonicalPath, fullUrl, objectKey } = this.getS3ResourceUrl(folder, safeName);

      if (this.accessKeyId && this.secretAccessKey) {
        const now = new Date();
        const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
        const dateStamp = amzDate.slice(0, 8);
        const payloadHash = sha256Hex(fileBuffer);

        const canonicalHeaders = `content-type:${mimeType}\nhost:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
        const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';

        const canonicalRequest = `PUT\n${canonicalPath}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
        const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${dateStamp}/${this.region}/s3/aws4_request\n${sha256Hex(canonicalRequest)}`;

        const signingKey = getSigningKey(this.secretAccessKey, dateStamp, this.region, 's3');
        const signature = hmacSha256(signingKey, stringToSign).toString('hex');
        const authHeader = `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${dateStamp}/${this.region}/s3/aws4_request, SignedHeaders=${signedHeaders}, Signature=${signature}`;

        const response = await fetch(fullUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': mimeType,
            'Host': host,
            'x-amz-date': amzDate,
            'x-amz-content-sha256': payloadHash,
            'Authorization': authHeader,
          },
          body: fileBuffer,
        });

        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          throw new Error(`S3 upload failed with status ${response.status}: ${errText}`);
        }
      }

      if (this.cdnDomain) {
        return `https://${this.cdnDomain}/${objectKey}`;
      }
      return fullUrl;
    }

    // Default: Local persistent or /tmp directory
    const filePath = this.resolveLocalPath(folder, safeName);
    await fs.promises.writeFile(filePath, fileBuffer);
    return `/uploads/${folder}/${safeName}`;
  }

  /**
   * Generates a pre-signed GET URL for secure file downloads.
   *
   * @param {string} filename The target filename
   * @param {string} folder Target folder or bucket prefix
   * @param {number} expiresInSeconds URL expiration time in seconds (default: 900)
   * @returns {Promise<string>}
   */
  async getSignedDownloadUrl(filename, folder = 'resumes', expiresInSeconds = 900) {
    const safeName = this.sanitizeFilename(filename);

    if (this.driver === 's3' && this.accessKeyId && this.secretAccessKey) {
      const { host, canonicalPath, fullUrl } = this.getS3ResourceUrl(folder, safeName);
      const now = new Date();
      const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
      const dateStamp = amzDate.slice(0, 8);

      const credentialScope = `${dateStamp}/${this.region}/s3/aws4_request`;
      const queryParams = [
        `X-Amz-Algorithm=AWS4-HMAC-SHA256`,
        `X-Amz-Credential=${encodeURIComponent(`${this.accessKeyId}/${credentialScope}`)}`,
        `X-Amz-Date=${amzDate}`,
        `X-Amz-Expires=${expiresInSeconds}`,
        `X-Amz-SignedHeaders=host`,
      ].sort().join('&');

      const canonicalHeaders = `host:${host}\n`;
      const signedHeaders = 'host';
      const canonicalRequest = `GET\n${canonicalPath}\n${queryParams}\n${canonicalHeaders}\n${signedHeaders}\nUNSIGNED-PAYLOAD`;
      const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${sha256Hex(canonicalRequest)}`;

      const signingKey = getSigningKey(this.secretAccessKey, dateStamp, this.region, 's3');
      const signature = hmacSha256(signingKey, stringToSign).toString('hex');

      return `${fullUrl}?${queryParams}&X-Amz-Signature=${signature}`;
    }

    if (this.cdnDomain) {
      return `https://${this.cdnDomain}/${folder}/${safeName}`;
    }
    return `/uploads/${folder}/${safeName}`;
  }

  /**
   * Returns a readable stream for a stored file.
   */
  async getFileStream(filename, folder = 'resumes') {
    const safeName = this.sanitizeFilename(filename);

    if (this.driver === 's3') {
      const signedUrl = await this.getSignedDownloadUrl(safeName, folder, 300);
      const response = await fetch(signedUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file from S3: status ${response.status}`);
      }
      return response.body;
    }

    const filePath = this.resolveLocalPath(folder, safeName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File '${safeName}' not found in storage.`);
    }
    return fs.createReadStream(filePath);
  }

  /**
   * Deletes a file from storage.
   */
  async deleteFile(filename, folder = 'resumes') {
    const safeName = this.sanitizeFilename(filename);

    if (this.driver === 's3') {
      if (this.accessKeyId && this.secretAccessKey) {
        const { host, canonicalPath, fullUrl } = this.getS3ResourceUrl(folder, safeName);
        const now = new Date();
        const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
        const dateStamp = amzDate.slice(0, 8);
        const payloadHash = sha256Hex('');

        const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
        const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

        const canonicalRequest = `DELETE\n${canonicalPath}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
        const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${dateStamp}/${this.region}/s3/aws4_request\n${sha256Hex(canonicalRequest)}`;

        const signingKey = getSigningKey(this.secretAccessKey, dateStamp, this.region, 's3');
        const signature = hmacSha256(signingKey, stringToSign).toString('hex');
        const authHeader = `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${dateStamp}/${this.region}/s3/aws4_request, SignedHeaders=${signedHeaders}, Signature=${signature}`;

        await fetch(fullUrl, {
          method: 'DELETE',
          headers: {
            'Host': host,
            'x-amz-date': amzDate,
            'x-amz-content-sha256': payloadHash,
            'Authorization': authHeader,
          },
        }).catch((err) => console.warn('[Storage] S3 deletion warning:', err.message));
      }
      return true;
    }

    const filePath = this.resolveLocalPath(folder, safeName);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }

  /**
   * Returns public URL for a stored file.
   */
  getFileUrl(filename, folder = 'resumes') {
    const safeName = this.sanitizeFilename(filename);
    if (this.driver === 's3') {
      if (this.cdnDomain) return `https://${this.cdnDomain}/${folder}/${safeName}`;
      const { fullUrl } = this.getS3ResourceUrl(folder, safeName);
      return fullUrl;
    }
    return `/uploads/${folder}/${safeName}`;
  }
}

export const storageService = new StorageService();
export default storageService;
