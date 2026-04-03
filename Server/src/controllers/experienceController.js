import Experience from '../models/Experience.js';
import { logger } from '../utils/logger.js';

/**
 * Get all experience
 */
export const getAllExperience = async (req, res, next) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, startDate: -1 });

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    logger.error('Get all experience error', { error: error.message });
    next(error);
  }
};

/**
 * Get single experience
 */
export const getExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    res.status(200).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    logger.error('Get experience error', { error: error.message });
    next(error);
  }
};

/**
 * Create experience (Admin only)
 */
export const createExperience = async (req, res, next) => {
  try {
    const { title, company, location, description, startDate, endDate, isCurrentRole, technologies, order, gradient, color } = req.body;

    const experience = new Experience({
      title,
      company,
      location,
      description,
      startDate,
      endDate,
      isCurrentRole,
      technologies,
      order,
      gradient,
      color,
    });

    await experience.save();

    logger.info('Experience created', { experienceId: experience._id, title, company });

    res.status(201).json({
      success: true,
      message: 'Experience created successfully',
      data: experience,
    });
  } catch (error) {
    logger.error('Create experience error', { error: error.message });
    next(error);
  }
};

/**
 * Update experience (Admin only)
 */
export const updateExperience = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const experience = await Experience.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    logger.info('Experience updated', { experienceId: id });

    res.status(200).json({
      success: true,
      message: 'Experience updated successfully',
      data: experience,
    });
  } catch (error) {
    logger.error('Update experience error', { error: error.message });
    next(error);
  }
};

/**
 * Delete experience (Admin only)
 */
export const deleteExperience = async (req, res, next) => {
  try {
    const { id } = req.params;

    const experience = await Experience.findByIdAndDelete(id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    logger.info('Experience deleted', { experienceId: id });

    res.status(200).json({
      success: true,
      message: 'Experience deleted successfully',
    });
  } catch (error) {
    logger.error('Delete experience error', { error: error.message });
    next(error);
  }
};

/**
 * Get current role
 */
export const getCurrentRole = async (req, res, next) => {
  try {
    const currentRole = await Experience.findOne({ isCurrentRole: true });

    if (!currentRole) {
      return res.status(404).json({
        success: false,
        message: 'No current role found',
      });
    }

    res.status(200).json({
      success: true,
      data: currentRole,
    });
  } catch (error) {
    logger.error('Get current role error', { error: error.message });
    next(error);
  }
};
