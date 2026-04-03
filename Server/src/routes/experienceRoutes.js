import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import {
  getAllExperience,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  getCurrentRole,
} from '../controllers/experienceController.js';
import { validateCreateExperience, validateMongoId } from '../middleware/validateInput.js';

const router = express.Router();

// Public routes
router.get('/', getAllExperience);
router.get('/current', getCurrentRole);
router.get('/:id', validateMongoId, getExperience);

// Protected routes (Admin only)
router.post('/', verifyToken, isAdmin, validateCreateExperience, createExperience);
router.put('/:id', verifyToken, isAdmin, validateMongoId, updateExperience);
router.delete('/:id', verifyToken, isAdmin, validateMongoId, deleteExperience);

export default router;
