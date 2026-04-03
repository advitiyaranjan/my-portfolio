import Skill from '../models/Skill.js';
import { logger } from '../utils/logger.js';

/**
 * Get all skills
 */
export const getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    logger.error('Get all skills error', { error: error.message });
    next(error);
  }
};

/**
 * Get single skill category
 */
export const getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill category not found',
      });
    }

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    logger.error('Get skill error', { error: error.message });
    next(error);
  }
};

/**
 * Create skill category (Admin only)
 */
export const createSkill = async (req, res, next) => {
  try {
    const { category, skills, order } = req.body;

    const skillCategory = new Skill({
      category,
      skills,
      order,
    });

    await skillCategory.save();

    logger.info('Skill category created', { skillId: skillCategory._id, category });

    res.status(201).json({
      success: true,
      message: 'Skill category created successfully',
      data: skillCategory,
    });
  } catch (error) {
    logger.error('Create skill error', { error: error.message });
    next(error);
  }
};

/**
 * Update skill category (Admin only)
 */
export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const skill = await Skill.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill category not found',
      });
    }

    logger.info('Skill category updated', { skillId: id });

    res.status(200).json({
      success: true,
      message: 'Skill category updated successfully',
      data: skill,
    });
  } catch (error) {
    logger.error('Update skill error', { error: error.message });
    next(error);
  }
};

/**
 * Delete skill category (Admin only)
 */
export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill category not found',
      });
    }

    logger.info('Skill category deleted', { skillId: id });

    res.status(200).json({
      success: true,
      message: 'Skill category deleted successfully',
    });
  } catch (error) {
    logger.error('Delete skill error', { error: error.message });
    next(error);
  }
};

/**
 * Add skill to category (Admin only)
 */
export const addSkillToCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, proficiency, yearsOfExperience } = req.body;

    const skill = await Skill.findByIdAndUpdate(
      id,
      {
        $push: {
          skills: {
            name,
            proficiency,
            yearsOfExperience,
          },
        },
      },
      { new: true }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill category not found',
      });
    }

    logger.info('Skill added to category', { skillId: id, skillName: name });

    res.status(200).json({
      success: true,
      message: 'Skill added successfully',
      data: skill,
    });
  } catch (error) {
    logger.error('Add skill error', { error: error.message });
    next(error);
  }
};

/**
 * Remove skill from category (Admin only)
 */
export const removeSkillFromCategory = async (req, res, next) => {
  try {
    const { id, skillId } = req.params;

    const skill = await Skill.findByIdAndUpdate(
      id,
      {
        $pull: {
          skills: { _id: skillId },
        },
      },
      { new: true }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill category not found',
      });
    }

    logger.info('Skill removed from category', { categoryId: id, skillId });

    res.status(200).json({
      success: true,
      message: 'Skill removed successfully',
      data: skill,
    });
  } catch (error) {
    logger.error('Remove skill error', { error: error.message });
    next(error);
  }
};
