import User from '../models/User.js';
import { generateToken, verifyToken, recordFailedLogin, clearLoginAttempts } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

/**
 * Admin Login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      recordFailedLogin(email, req);
      logger.warn('Login attempt with non-existent email', { email });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      recordFailedLogin(email, req);
      logger.warn('Login attempt with wrong password', { email });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      recordFailedLogin(email, req);
      logger.warn('Login attempt with inactive user', { email });
      return res.status(401).json({
        success: false,
        message: 'Account is inactive',
      });
    }

    // Clear failed attempts on successful login
    clearLoginAttempts(email, req);

    // Generate token
    const token = generateToken(user._id);

    logger.info('User logged in successfully', { email });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Login error', { error: error.message });
    next(error);
  }
};

/**
 * Register Admin (First time only)
 */
export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      logger.warn('Registration attempt with existing email', { email });
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: 'admin',
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    logger.info('New admin registered', { email });

    res.status(201).json({
      success: true,
      message: 'Admin registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Registration error', { error: error.message });
    next(error);
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    logger.error('Get current user error', { error: error.message });
    next(error);
  }
};

/**
 * Update Admin Profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    logger.info('Profile updated', { userId: req.userId });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Update profile error', { error: error.message });
    next(error);
  }
};

/**
 * Change password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isPasswordCorrect = await user.matchPassword(currentPassword);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info('Password changed', { userId: req.userId });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    logger.error('Change password error', { error: error.message });
    next(error);
  }
};
