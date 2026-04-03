import express from 'express';
import multer from 'multer';
import {
  getPortfolio,
  updatePortfolio,
  updateResumeLink,
  uploadProfileImage,
  getPortfolioStats,
} from '../controllers/portfolioController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

const fileFilter = (req, file, cb) => {
  // Only accept image files
  if (/^image\/(jpeg|png|gif|webp)$/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

const uploadMiddleware = upload.single('profileImage');

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
router.put('/', verifyToken, isAdmin, uploadMiddleware, updatePortfolio);

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
router.post('/upload-image', verifyToken, isAdmin, uploadMiddleware, uploadProfileImage);

/**
 * @route   GET /api/portfolio/stats
 * @desc    Get portfolio statistics
 * @access  Private (Admin only)
 */
router.get('/stats', verifyToken, isAdmin, getPortfolioStats);

export default router;
