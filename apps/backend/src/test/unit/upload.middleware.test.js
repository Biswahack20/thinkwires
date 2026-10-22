import { describe, it, expect, vi } from 'vitest';
import { resumeUpload } from '../../middlewares/upload.middleware.js';

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

  it('rejects HTML or script files disguised with application/octet-stream MIME type', () => {
    const fileFilter = resumeUpload.fileFilter;
    const disguisedFiles = [
      { originalname: 'exploit.html', mimetype: 'application/octet-stream' },
      { originalname: 'vector.svg', mimetype: 'application/octet-stream' },
      { originalname: 'malware.exe', mimetype: 'application/octet-stream' },
    ];

    disguisedFiles.forEach((file) => {
      const callback = vi.fn();
      fileFilter({}, file, callback);
      expect(callback).toHaveBeenCalled();
      const [error, accepted] = callback.mock.calls[0];
      expect(error).toBeInstanceOf(Error);
      expect(accepted).toBe(false);
    });
  });

  it('rejects PDF file when sent with invalid non-PDF MIME type', () => {
    const fileFilter = resumeUpload.fileFilter;
    const callback = vi.fn();
    fileFilter({}, { originalname: 'test.pdf', mimetype: 'text/html' }, callback);
    expect(callback).toHaveBeenCalled();
    const [error, accepted] = callback.mock.calls[0];
    expect(error).toBeInstanceOf(Error);
    expect(accepted).toBe(false);
  });
});
