import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import {
  getAllProjects,
  getProject,
  getFeaturedProjects,
  createProject,
  updateProject,
  deleteProject,
  bulkCreateProjects,
} from '../controllers/projectController.js';
import { validateCreateProject, validateUpdateProject, validateMongoId } from '../middleware/validateInput.js';

const router = express.Router();

// Public routes
router.get('/', getAllProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:id', validateMongoId, getProject);

// Protected routes (Admin only)
router.post('/', verifyToken, isAdmin, validateCreateProject, createProject);
router.post('/bulk', verifyToken, isAdmin, bulkCreateProjects);
router.put('/:id', verifyToken, isAdmin, validateUpdateProject, updateProject);
router.delete('/:id', verifyToken, isAdmin, validateMongoId, deleteProject);

export default router;
