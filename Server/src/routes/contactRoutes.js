import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import {
  submitContactForm,
  getAllMessages,
  getMessage,
  markAsRead,
  markAsReplied,
  deleteMessage,
  getContactStats,
} from '../controllers/contactController.js';
import { validateContactForm, validateMongoId } from '../middleware/validateInput.js';

const router = express.Router();

// Public route
router.post('/', validateContactForm, submitContactForm);

// Protected routes (Admin only)
router.get('/', verifyToken, isAdmin, getAllMessages);
router.get('/stats', verifyToken, isAdmin, getContactStats);
router.get('/:id', verifyToken, isAdmin, validateMongoId, getMessage);
router.put('/:id/read', verifyToken, isAdmin, validateMongoId, markAsRead);
router.put('/:id/replied', verifyToken, isAdmin, validateMongoId, markAsReplied);
router.delete('/:id', verifyToken, isAdmin, validateMongoId, deleteMessage);

export default router;
