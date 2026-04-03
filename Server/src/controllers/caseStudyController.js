import CaseStudy from '../models/CaseStudy.js';
import { logger } from '../utils/logger.js';

/**
 * Get all case studies
 */
export const getAllCaseStudies = async (req, res, next) => {
  try {
    const caseStudies = await CaseStudy.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: caseStudies.length,
      data: caseStudies,
    });
  } catch (error) {
    logger.error('Get all case studies error', { error: error.message });
    next(error);
  }
};

/**
 * Get single case study
 */
export const getCaseStudy = async (req, res, next) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found',
      });
    }

    res.status(200).json({
      success: true,
      data: caseStudy,
    });
  } catch (error) {
    logger.error('Get case study error', { error: error.message });
    next(error);
  }
};

/**
 * Create case study (Admin only)
 */
export const createCaseStudy = async (req, res, next) => {
  try {
    const { title, description, imageUrl, challenge, solution, results, technologies, link, order } = req.body;

    const caseStudy = new CaseStudy({
      title,
      description,
      imageUrl,
      challenge,
      solution,
      results,
      technologies,
      link,
      order,
    });

    await caseStudy.save();

    logger.info('Case study created', { caseStudyId: caseStudy._id, title });

    res.status(201).json({
      success: true,
      message: 'Case study created successfully',
      data: caseStudy,
    });
  } catch (error) {
    logger.error('Create case study error', { error: error.message });
    next(error);
  }
};

/**
 * Update case study (Admin only)
 */
export const updateCaseStudy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const caseStudy = await CaseStudy.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found',
      });
    }

    logger.info('Case study updated', { caseStudyId: id });

    res.status(200).json({
      success: true,
      message: 'Case study updated successfully',
      data: caseStudy,
    });
  } catch (error) {
    logger.error('Update case study error', { error: error.message });
    next(error);
  }
};

/**
 * Delete case study (Admin only)
 */
export const deleteCaseStudy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const caseStudy = await CaseStudy.findByIdAndDelete(id);

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found',
      });
    }

    logger.info('Case study deleted', { caseStudyId: id });

    res.status(200).json({
      success: true,
      message: 'Case study deleted successfully',
    });
  } catch (error) {
    logger.error('Delete case study error', { error: error.message });
    next(error);
  }
};
