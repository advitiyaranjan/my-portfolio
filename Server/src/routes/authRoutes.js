import express from 'express';
import { verifyToken, isAdmin, checkLoginAttempts } from '../middleware/auth.js';
import {
  login,
  registerAdmin,
  getCurrentUser,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import { validateLogin, validateAdminRegister } from '../middleware/validateInput.js';

const router = express.Router();

// Public routes
router.post('/login', checkLoginAttempts, validateLogin, login);
router.post('/register', validateAdminRegister, registerAdmin);

// Protected routes (Admin only)
router.get('/me', verifyToken, isAdmin, getCurrentUser);
router.put('/profile', verifyToken, isAdmin, updateProfile);
router.put('/change-password', verifyToken, isAdmin, changePassword);

export default router;
