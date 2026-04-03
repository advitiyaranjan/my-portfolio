import Portfolio from '../models/Portfolio.js';
import { logger } from '../utils/logger.js';

/**
 * Get portfolio information
 */
export const getPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();

    // If no portfolio exists, create default one
    if (!portfolio) {
      portfolio = new Portfolio();
      await portfolio.save();
    }

    // Increment view count
    portfolio.viewCount += 1;
    await portfolio.save();

    logger.info('Portfolio retrieved', { 
      socialLinks: portfolio.socialLinks,
      twitter: portfolio.socialLinks?.twitter,
    });

    res.json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    logger.error('Get portfolio error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio',
      error: error.message,
    });
  }
};

/**
 * Update portfolio information (Admin only)
 */
export const updatePortfolio = async (req, res) => {
  try {
    const { fullName, title, bio, aboutDescription, email, phone, resumeLink, socialLinks, location, headline, stats } = req.body;

    logger.info('Update portfolio request received', { 
      fullName, 
      socialLinks,
      hasTwitter: !!socialLinks?.twitter,
      stats,
    });

    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      portfolio = new Portfolio();
    }

    // Update fields if provided
    if (fullName) portfolio.fullName = fullName;
    if (title) portfolio.title = title;
    if (bio) portfolio.bio = bio;
    if (aboutDescription) portfolio.aboutDescription = aboutDescription;
    if (email) portfolio.email = email;
    if (phone) portfolio.phone = phone;
    if (resumeLink) portfolio.resumeLink = resumeLink;
    if (location) portfolio.location = location;
    if (headline) portfolio.headline = headline;

    // Update statistics if provided
    if (stats) {
      portfolio.stats = {
        projectsCompleted: stats.projectsCompleted || portfolio.stats?.projectsCompleted || 50,
        yearsExperience: stats.yearsExperience || portfolio.stats?.yearsExperience || 5,
        usersImpacted: stats.usersImpacted || portfolio.stats?.usersImpacted || 100,
        technologiesCount: stats.technologiesCount || portfolio.stats?.technologiesCount || 15,
      };
      logger.info('Statistics updated', { stats: portfolio.stats });
    }

    // Update social links
    if (socialLinks) {
      logger.info('Updating social links', { 
        newLinks: socialLinks,
        existingLinks: portfolio.socialLinks 
      });
      portfolio.socialLinks = {
        ...portfolio.socialLinks,
        ...socialLinks,
      };
      logger.info('Social links after merge', { socialLinks: portfolio.socialLinks });
    }

    // Update profile image if file was uploaded
    if (req.file) {
      portfolio.profileImage = `/api/uploads/images/${req.file.filename}`;
    }

    await portfolio.save();

    logger.info('Portfolio updated successfully', { 
      socialLinks: portfolio.socialLinks,
      twitter: portfolio.socialLinks?.twitter,
      stats: portfolio.stats,
    });

    res.json({
      success: true,
      message: 'Portfolio updated successfully',
      data: portfolio,
    });
  } catch (error) {
    logger.error('Update portfolio error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error updating portfolio',
      error: error.message,
    });
  }
};

/**
 * Update resume link (Admin only)
 */
export const updateResumeLink = async (req, res) => {
  try {
    const { resumeLink } = req.body;

    if (!resumeLink) {
      return res.status(400).json({
        success: false,
        message: 'Resume link is required',
      });
    }

    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      portfolio = new Portfolio();
    }

    portfolio.resumeLink = resumeLink;
    await portfolio.save();

    logger.info('Resume link updated');

    res.json({
      success: true,
      message: 'Resume link updated successfully',
      data: portfolio,
    });
  } catch (error) {
    logger.error('Update resume link error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error updating resume link',
      error: error.message,
    });
  }
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded',
      });
    }

    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      portfolio = new Portfolio();
    }

    portfolio.profileImage = `/api/uploads/images/${req.file.filename}`;
    await portfolio.save();

    logger.info('Profile image uploaded');

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        imageUrl: portfolio.profileImage,
      },
    });
  } catch (error) {
    logger.error('Profile image upload error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error uploading profile image',
      error: error.message,
    });
  }
};

/**
 * Get portfolio stats (Admin only)
 */
export const getPortfolioStats = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();

    if (!portfolio) {
      return res.json({
        success: true,
        stats: {
          viewCount: 0,
          lastUpdated: new Date(),
        },
      });
    }

    res.json({
      success: true,
      stats: {
        viewCount: portfolio.viewCount,
        lastUpdated: portfolio.lastUpdated,
        updatedAt: portfolio.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Get portfolio stats error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio stats',
      error: error.message,
    });
  }
};
