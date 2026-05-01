import express from 'express';
import multer from 'multer';
import { logger } from '../utils/logger.js';
import ResumeAsset from '../models/ResumeAsset.js';

const router = express.Router();

const fileFilter = (req, file, cb) => {
  // Only accept PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

const uploadResumeMiddleware = upload.single('resume');

/**
 * @route   GET /api/resumes/download/:filename
 * @desc    Download resume PDF
 * @access  Public
 */
router.get('/download/:filename', (req, res) => {
  (async () => {
    try {
    const filename = req.params.filename;
    
    // Security: Only allow safe filenames (alphanumeric, hyphens, underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(filename)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename format',
      });
    }

    const resume = await ResumeAsset.findOne({ filename });

    if (!resume) {
      logger.warn(`Resume requested but not found: ${filename}`);
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', resume.mimeType || 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);

    res.send(resume.data);

    logger.info(`Resume downloaded: ${filename}`);
    } catch (error) {
      logger.error(`Resume download error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Error downloading resume',
        error: error.message,
      });
    }
  })();
});

/**
 * @route   POST /api/resumes/upload
 * @desc    Upload a resume PDF
 * @access  Public (you can add auth later)
 */
router.post('/upload', uploadResumeMiddleware, (req, res) => {
  (async () => {
    try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const filename = req.body.filename || 'advitiya-ranjan';

    await ResumeAsset.findOneAndUpdate(
      { filename },
      {
        filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

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
  })();
});

/**
 * @route   GET /api/resumes/list
 * @desc    List all available resumes
 * @access  Public
 */
router.get('/list', (req, res) => {
  (async () => {
    try {
      const storedResumes = await ResumeAsset.find({}, { filename: 1, originalName: 1, size: 1 }).sort({ updatedAt: -1 });
      const resumes = storedResumes.map((resume) => ({
        name: resume.filename,
        filename: `${resume.filename}.pdf`,
        originalName: resume.originalName,
        size: resume.size,
        path: `/api/resumes/download/${resume.filename}`,
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
  })();
});

export default router;
