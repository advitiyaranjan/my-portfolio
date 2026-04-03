import LeadershipAchievement from '../models/LeadershipAchievement.js';
import { logger } from '../utils/logger.js';

/**
 * Get all leadership achievements
 */
export const getAllAchievements = async (req, res, next) => {
  try {
    const achievements = await LeadershipAchievement.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements,
    });
  } catch (error) {
    logger.error('Get all achievements error', { error: error.message });
    next(error);
  }
};

/**
 * Get single achievement
 */
export const getAchievement = async (req, res, next) => {
  try {
    const achievement = await LeadershipAchievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    res.status(200).json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    logger.error('Get achievement error', { error: error.message });
    next(error);
  }
};

/**
 * Create achievement (Admin only)
 */
export const createAchievement = async (req, res, next) => {
  try {
    const achievement = await LeadershipAchievement.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: achievement,
    });
  } catch (error) {
    logger.error('Create achievement error', { error: error.message });
    next(error);
  }
};

/**
 * Update achievement (Admin only)
 */
export const updateAchievement = async (req, res, next) => {
  try {
    const achievement = await LeadershipAchievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement,
    });
  } catch (error) {
    logger.error('Update achievement error', { error: error.message });
    next(error);
  }
};

/**
 * Delete achievement (Admin only)
 */
export const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await LeadershipAchievement.findByIdAndDelete(
      req.params.id
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully',
    });
  } catch (error) {
    logger.error('Delete achievement error', { error: error.message });
    next(error);
  }
};
