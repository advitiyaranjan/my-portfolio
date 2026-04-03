import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import {
  getAllAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../controllers/leadershipController.js';
import { validateMongoId } from '../middleware/validateInput.js';

const router = express.Router();

// Public routes
router.get('/', getAllAchievements);
router.get('/:id', validateMongoId, getAchievement);

// Protected routes (Admin only)
router.post('/', verifyToken, isAdmin, createAchievement);
router.put('/:id', verifyToken, isAdmin, validateMongoId, updateAchievement);
router.delete('/:id', verifyToken, isAdmin, validateMongoId, deleteAchievement);

export default router;
