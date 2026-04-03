import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import { logger } from '../utils/logger.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get resume directory
const resumeDir = path.join(__dirname, '../uploads/resumes');

// Ensure directory exists when writable; skip on serverless filesystems
let resumeDirAvailable = false;
try {
  if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
  }
  resumeDirAvailable = true;
} catch (error) {
  logger.warn(`Resume directory unavailable: ${error.message}`);
}

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeDir);
  },
  filename: (req, file, cb) => {
    // Save with custom name or original name
    const filename = req.body.filename || 'advitiya-ranjan';
    cb(null, `${filename}.pdf`);
  },
});

const fileFilter = (req, file, cb) => {
  // Only accept PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

const uploadResumeMiddleware = (req, res, next) => {
  if (!resumeDirAvailable) {
    return res.status(503).json({
      success: false,
      message: 'Resume uploads are unavailable in this environment',
    });
  }

  return upload.single('resume')(req, res, next);
};

/**
 * @route   GET /api/resumes/download/:filename
 * @desc    Download resume PDF
 * @access  Public
 */
router.get('/download/:filename', (req, res) => {
  try {
    if (!resumeDirAvailable) {
      return res.status(404).json({
        success: false,
        message: 'Resume storage is unavailable',
      });
    }

    const filename = req.params.filename;
    
    // Security: Only allow safe filenames (alphanumeric, hyphens, underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(filename)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename format',
      });
    }

    const filepath = path.join(resumeDir, `${filename}.pdf`);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      logger.warn(`Resume requested but not found: ${filename}`);
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);

    // Stream the file
    const stream = fs.createReadStream(filepath);
    stream.pipe(res);

    logger.info(`Resume downloaded: ${filename}`);
  } catch (error) {
    logger.error(`Resume download error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error downloading resume',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/resumes/upload
 * @desc    Upload a resume PDF
 * @access  Public (you can add auth later)
 */
router.post('/upload', uploadResumeMiddleware, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const filename = req.body.filename || 'advitiya-ranjan';

    logger.info(`Resume uploaded: ${filename}`);

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      file: {
        name: filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: `/api/resumes/download/${filename}`,
      },
    });
  } catch (error) {
    logger.error(`Resume upload error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error uploading resume',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/resumes/list
 * @desc    List all available resumes
 * @access  Public
 */
router.get('/list', (req, res) => {
  try {
    if (!fs.existsSync(resumeDir)) {
      return res.json({
        success: true,
        resumes: [],
      });
    }

    const files = fs.readdirSync(resumeDir);
    const resumes = files.filter(file => file.endsWith('.pdf')).map(file => ({
      name: file.replace('.pdf', ''),
      filename: file,
      path: `/api/resumes/download/${file.replace('.pdf', '')}`,
    }));

    res.json({
      success: true,
      resumes,
    });
  } catch (error) {
    logger.error(`Resume list error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching resumes',
      error: error.message,
    });
  }
});

export default router;
