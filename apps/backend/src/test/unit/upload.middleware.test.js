import { describe, it, expect, vi } from 'vitest';
import { resumeUpload, avatarUpload } from '../../middlewares/upload.middleware.js';

describe('Upload Middleware (Unit Tests)', () => {
  it('has file filter configured for resumes', () => {
    expect(resumeUpload).toBeDefined();
    expect(typeof resumeUpload.single).toBe('function');
  });

  it('accepts allowed resume file extensions (.pdf, .doc, .docx)', () => {
    const fileFilter = resumeUpload.fileFilter;
    const allowedFiles = [
      { originalname: 'alex_resume.pdf', mimetype: 'application/pdf' },
      {
        originalname: 'alex_cv.docx',
        mimetype:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
      { originalname: 'old_resume.doc', mimetype: 'application/msword' },
    ];

    allowedFiles.forEach((file) => {
      const callback = vi.fn();
      fileFilter({}, file, callback);
      expect(callback).toHaveBeenCalledWith(null, true);
    });
  });

  it('rejects disallowed file types (.exe, .sh, .svg, .php)', () => {
    const fileFilter = resumeUpload.fileFilter;
    const maliciousFiles = [
      { originalname: 'exploit.exe', mimetype: 'application/x-msdownload' },
      { originalname: 'script.sh', mimetype: 'text/x-shellscript' },
      { originalname: 'xss_vector.svg', mimetype: 'image/svg+xml' },
      { originalname: 'shell.php', mimetype: 'application/x-httpd-php' },
    ];

    maliciousFiles.forEach((file) => {
      const callback = vi.fn();
      fileFilter({}, file, callback);
      expect(callback).toHaveBeenCalled();
      const [error, accepted] = callback.mock.calls[0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toMatch(
        /Only PDF, DOC, and DOCX files are allowed/i
      );
      expect(accepted).toBe(false);
    });
  });

  describe('Avatar Upload Security (Issue #176)', () => {
    it('has file filter configured for avatars', () => {
      expect(avatarUpload).toBeDefined();
      expect(typeof avatarUpload.single).toBe('function');
    });

    it('accepts allowed image formats with valid MIME types (.jpg, .jpeg, .png, .webp)', () => {
      const fileFilter = avatarUpload.fileFilter;
      const validImages = [
        { originalname: 'profile.jpg', mimetype: 'image/jpeg' },
        { originalname: 'photo.jpeg', mimetype: 'image/jpeg' },
        { originalname: 'headshot.png', mimetype: 'image/png' },
        { originalname: 'picture.webp', mimetype: 'image/webp' },
      ];

      validImages.forEach((file) => {
        const callback = vi.fn();
        fileFilter({}, file, callback);
        expect(callback).toHaveBeenCalledWith(null, true);
      });
    });

    it('rejects disallowed file extensions (.pdf, .exe, .sh, .txt)', () => {
      const fileFilter = avatarUpload.fileFilter;
      const invalidFiles = [
        { originalname: 'resume.pdf', mimetype: 'application/pdf' },
        { originalname: 'script.sh', mimetype: 'text/x-shellscript' },
        { originalname: 'notes.txt', mimetype: 'text/plain' },
      ];

      invalidFiles.forEach((file) => {
        const callback = vi.fn();
        fileFilter({}, file, callback);
        expect(callback).toHaveBeenCalled();
        const [error, accepted] = callback.mock.calls[0];
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/Only JPG, JPEG, PNG, and WebP are permitted/i);
        expect(accepted).toBe(false);
      });
    });

    it('rejects dangerous double-extension files disguised as images', () => {
      const fileFilter = avatarUpload.fileFilter;
      const doubleExtFiles = [
        { originalname: 'exploit.php.png', mimetype: 'image/png' },
        { originalname: 'payload.html.jpg', mimetype: 'image/jpeg' },
        { originalname: 'xss.svg.png', mimetype: 'image/png' },
        { originalname: 'malware.exe.webp', mimetype: 'image/webp' },
      ];

      doubleExtFiles.forEach((file) => {
        const callback = vi.fn();
        fileFilter({}, file, callback);
        expect(callback).toHaveBeenCalled();
        const [error, accepted] = callback.mock.calls[0];
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/Potentially unsafe file format detected/i);
        expect(accepted).toBe(false);
      });
    });

    it('rejects mismatched MIME types (e.g. .png with text/html MIME)', () => {
      const fileFilter = avatarUpload.fileFilter;
      const mismatchedFiles = [
        { originalname: 'fake.png', mimetype: 'text/html' },
        { originalname: 'payload.jpg', mimetype: 'application/javascript' },
      ];

      mismatchedFiles.forEach((file) => {
        const callback = vi.fn();
        fileFilter({}, file, callback);
        expect(callback).toHaveBeenCalled();
        const [error, accepted] = callback.mock.calls[0];
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/MIME type does not match/i);
        expect(accepted).toBe(false);
      });
    });
  });
});
