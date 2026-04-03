import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import {
  getAllCaseStudies,
  getCaseStudy,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} from '../controllers/caseStudyController.js';
import { validateCreateCaseStudy, validateMongoId } from '../middleware/validateInput.js';

const router = express.Router();

// Public routes
router.get('/', getAllCaseStudies);
router.get('/:id', validateMongoId, getCaseStudy);

// Protected routes (Admin only)
router.post('/', verifyToken, isAdmin, validateCreateCaseStudy, createCaseStudy);
router.put('/:id', verifyToken, isAdmin, validateMongoId, updateCaseStudy);
router.delete('/:id', verifyToken, isAdmin, validateMongoId, deleteCaseStudy);

export default router;
