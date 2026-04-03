import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  getPortfolio,
  updatePortfolio,
  updateResumeLink,
  uploadProfileImage,
  getPortfolioStats,
} from '../controllers/portfolioController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Only accept image files
  if (/^image\/(jpeg|png|gif|webp)$/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

/**
 * @route   GET /api/portfolio
 * @desc    Get portfolio information
 * @access  Public
 */
router.get('/', getPortfolio);

/**
 * @route   PUT /api/portfolio
 * @desc    Update portfolio information
 * @access  Private (Admin only)
 */
router.put('/', verifyToken, isAdmin, upload.single('profileImage'), updatePortfolio);

/**
 * @route   PUT /api/portfolio/resume
 * @desc    Update resume link
 * @access  Private (Admin only)
 */
router.put('/resume', verifyToken, isAdmin, updateResumeLink);

/**
 * @route   POST /api/portfolio/upload-image
 * @desc    Upload profile image
 * @access  Private (Admin only)
 */
router.post('/upload-image', verifyToken, isAdmin, upload.single('profileImage'), uploadProfileImage);

/**
 * @route   GET /api/portfolio/stats
 * @desc    Get portfolio statistics
 * @access  Private (Admin only)
 */
router.get('/stats', verifyToken, isAdmin, getPortfolioStats);

export default router;
