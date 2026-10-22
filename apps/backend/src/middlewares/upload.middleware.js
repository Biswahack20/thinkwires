import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the resume upload directory exists
const uploadDir = path.resolve(process.cwd(), 'uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedOriginalName = file.originalname.replace(
      /[^a-zA-Z0-9.-]/g,
      '_'
    );
    const ext = path.extname(sanitizedOriginalName).toLowerCase() || '.pdf';
    const baseName = path.basename(sanitizedOriginalName, ext).substring(0, 50);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

// Strict Extension-to-MIME mapping
const ALLOWED_EXT_MIME_MAP = {
  '.pdf': ['application/pdf'],
  '.doc': ['application/msword'],
  '.docx': [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream', // Permitted only for .docx where browsers send generic octet-stream
  ],
};

// File filter strictly requiring extension AND corresponding MIME type match
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const validMimes = ALLOWED_EXT_MIME_MAP[ext];

  // Disallow any extension not explicitly mapped (e.g. .html, .svg, .exe, .js, .php)
  if (!validMimes) {
    return cb(
      new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'),
      false
    );
  }

  // Strictly require MIME type to be valid for this specific extension
  if (!validMimes.includes(file.mimetype.toLowerCase())) {
    return cb(
      new Error(`MIME type '${file.mimetype}' is not permitted for extension '${ext}'.`),
      false
    );
  }

  cb(null, true);
};

export const resumeUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter,
});
