import { body, validationResult, param } from 'express-validator';
import { logger } from '../utils/logger.js';

/**
 * Validation middleware to check and return errors
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation failed', { errors: errors.array() });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// =====================
// Contact Form Validation
// =====================

export const validateContactForm = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Please provide a valid phone number'),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Subject must be less than 100 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters'),
  validateRequest,
];

// =====================
// Project Validation
// =====================

export const validateCreateProject = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('techStack')
    .isArray({ min: 1 })
    .withMessage('Tech stack must contain at least one technology'),
  body('imageUrl')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required')
    .isURL()
    .withMessage('Please provide a valid image URL'),
  body('imageAlt')
    .optional()
    .trim(),
  body('githubLink')
    .optional()
    .trim()
    .matches(/^https?:\/\/(www\.)?github\.com/)
    .withMessage('Please provide a valid GitHub URL'),
  body('liveLink')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a positive number'),
  validateRequest,
];

export const validateUpdateProject = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
  ...validateCreateProject.slice(0, -1), // Exclude validateRequest
  validateRequest,
];

// =====================
// Auth Validation
// =====================

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validateRequest,
];

export const validateAdminRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validateRequest,
];

// =====================
// Skills Validation
// =====================

export const validateCreateSkill = [
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('skills')
    .isArray({ min: 1 })
    .withMessage('Skills array must contain at least one skill'),
  body('skills.*.name')
    .trim()
    .notEmpty()
    .withMessage('Skill name is required'),
  body('skills.*.proficiency')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid proficiency level'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a positive number'),
  validateRequest,
];

// =====================
// Experience Validation
// =====================

export const validateCreateExperience = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Invalid start date format'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format'),
  body('position')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a positive number'),
  validateRequest,
];

// =====================
// Case Study Validation
// =====================

export const validateCreateCaseStudy = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('imageUrl')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required')
    .isURL()
    .withMessage('Please provide a valid image URL'),
  validateRequest,
];

// =====================
// ID Validation
// =====================

export const validateMongoId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  validateRequest,
];
