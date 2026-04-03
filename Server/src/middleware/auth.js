import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

// In-memory store for login attempts (consider using Redis for production)
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

/**
 * Check login attempts to prevent brute force attacks
 */
export const checkLoginAttempts = (req, res, next) => {
  try {
    const { email } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;
    const key = `${email}:${clientIp}`;

    if (!loginAttempts.has(key)) {
      loginAttempts.set(key, { attempts: 0, firstAttempt: Date.now() });
    }

    const record = loginAttempts.get(key);
    const now = Date.now();

    // Reset if lock time has passed
    if (now - record.firstAttempt > LOCK_TIME) {
      loginAttempts.set(key, { attempts: 0, firstAttempt: now });
      return next();
    }

    // Check if locked
    if (record.attempts >= MAX_LOGIN_ATTEMPTS) {
      const timeRemaining = Math.ceil((LOCK_TIME - (now - record.firstAttempt)) / 60000);
      logger.warn('Login attempt blocked - too many failed attempts', { email, clientIp, timeRemaining });
      return res.status(429).json({
        success: false,
        message: `Too many login attempts. Please try again in ${timeRemaining} minutes.`,
      });
    }

    next();
  } catch (error) {
    logger.error('Login attempt check failed', { error: error.message });
    next(); // Allow request to proceed on error
  }
};

/**
 * Record failed login attempt
 */
export const recordFailedLogin = (email, req) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  const key = `${email}:${clientIp}`;

  if (loginAttempts.has(key)) {
    const record = loginAttempts.get(key);
    record.attempts += 1;
  }
};

/**
 * Clear login attempts on successful login
 */
export const clearLoginAttempts = (email, req) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  const key = `${email}:${clientIp}`;
  loginAttempts.delete(key);
};

/**
 * Verify JWT token and attach user to request
 */
export const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization required.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id;

    next();
  } catch (error) {
    logger.error('Token verification failed', { error: error.message });

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }

    res.status(401).json({
      success: false,
      message: 'Token verification failed.',
    });
  }
};

/**
 * Verify user is admin
 */
export const isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }
  } catch (error) {
    logger.error('Admin check failed', { error: error.message });
    res.status(403).json({
      success: false,
      message: 'Access denied.',
    });
  }
};

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      req.userId = decoded.id;
    }

    next();
  } catch (error) {
    // Token exists but invalid - still proceed
    logger.debug('Optional auth token invalid', { error: error.message });
    next();
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (userId, expiresIn = process.env.JWT_EXPIRE) => {
  return jwt.sign(
    { id: userId, role: 'admin', iat: Date.now() },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};
