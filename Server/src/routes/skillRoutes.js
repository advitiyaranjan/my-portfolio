import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import {
  getAllSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  addSkillToCategory,
  removeSkillFromCategory,
} from '../controllers/skillController.js';
import { validateCreateSkill, validateMongoId } from '../middleware/validateInput.js';

const router = express.Router();

// Public routes
router.get('/', getAllSkills);
router.get('/:id', validateMongoId, getSkill);

// Protected routes (Admin only)
router.post('/', verifyToken, isAdmin, validateCreateSkill, createSkill);
router.put('/:id', verifyToken, isAdmin, validateMongoId, updateSkill);
router.delete('/:id', verifyToken, isAdmin, validateMongoId, deleteSkill);

// Skills management
router.post('/:id/skills', verifyToken, isAdmin, validateMongoId, addSkillToCategory);
router.delete('/:id/skills/:skillId', verifyToken, isAdmin, validateMongoId, removeSkillFromCategory);

export default router;
