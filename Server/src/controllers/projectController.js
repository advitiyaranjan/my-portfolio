import Project from '../models/Project.js';
import { logger } from '../utils/logger.js';

/**
 * Get all projects
 */
export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    logger.error('Get all projects error', { error: error.message });
    next(error);
  }
};

/**
 * Get single project
 */
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    logger.error('Get project error', { error: error.message });
    next(error);
  }
};

/**
 * Get featured projects
 */
export const getFeaturedProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    logger.error('Get featured projects error', { error: error.message });
    next(error);
  }
};

/**
 * Create project (Admin only)
 */
export const createProject = async (req, res, next) => {
  try {
    const { title, description, techStack, imageUrl, imageAlt, githubLink, liveLink, featured, order } = req.body;

    const project = new Project({
      title,
      description,
      techStack,
      imageUrl,
      imageAlt,
      githubLink,
      liveLink,
      featured,
      order,
    });

    await project.save();

    logger.info('Project created', { projectId: project._id, title });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    logger.error('Create project error', { error: error.message });
    next(error);
  }
};

/**
 * Update project (Admin only)
 */
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    logger.info('Project updated', { projectId: id });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    logger.error('Update project error', { error: error.message });
    next(error);
  }
};

/**
 * Delete project (Admin only)
 */
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    logger.info('Project deleted', { projectId: id });

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    logger.error('Delete project error', { error: error.message });
    next(error);
  }
};

/**
 * Upload multiple projects (for bulk operations)
 */
export const bulkCreateProjects = async (req, res, next) => {
  try {
    const { projects } = req.body;

    if (!Array.isArray(projects) || projects.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Projects array is required and must not be empty',
      });
    }

    const createdProjects = await Project.insertMany(projects);

    logger.info('Bulk projects created', { count: createdProjects.length });

    res.status(201).json({
      success: true,
      message: `${createdProjects.length} projects created successfully`,
      data: createdProjects,
    });
  } catch (error) {
    logger.error('Bulk create projects error', { error: error.message });
    next(error);
  }
};
