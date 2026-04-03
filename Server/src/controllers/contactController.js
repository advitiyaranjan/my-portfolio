import Contact from '../models/Contact.js';
import { sendContactFormEmail } from '../utils/emailService.js';
import { logger } from '../utils/logger.js';

/**
 * Submit contact form
 */
export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const ipAddress = req.ip;

    // Create contact record
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      ipAddress,
    });

    await contact.save();

    // Send email notification
    try {
      await sendContactFormEmail({
        name,
        email,
        phone,
        subject,
        message,
      });
    } catch (emailError) {
      logger.warn('Email notification failed but message was saved', {
        contactId: contact._id,
        error: emailError.message,
      });
      // Don't fail the request if email fails
    }

    logger.info('Contact form submitted', { contactId: contact._id, email });

    res.status(201).json({
      success: true,
      message: 'Message received! We will get back to you soon.',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
      },
    });
  } catch (error) {
    logger.error('Submit contact form error', { error: error.message });
    next(error);
  }
};

/**
 * Get all contact messages (Admin only)
 */
export const getAllMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isRead, isReplied } = req.query;

    const filter = {};
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (isReplied !== undefined) filter.isReplied = isReplied === 'true';

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Contact.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Contact.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: messages,
    });
  } catch (error) {
    logger.error('Get all messages error', { error: error.message });
    next(error);
  }
};

/**
 * Get single contact message (Admin only)
 */
export const getMessage = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Mark as read
    if (!contact.isRead) {
      contact.isRead = true;
      await contact.save();
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    logger.error('Get message error', { error: error.message });
    next(error);
  }
};

/**
 * Mark message as read (Admin only)
 */
export const markAsRead = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    logger.info('Message marked as read', { contactId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: contact,
    });
  } catch (error) {
    logger.error('Mark as read error', { error: error.message });
    next(error);
  }
};

/**
 * Mark message as replied (Admin only)
 */
export const markAsReplied = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isReplied: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    logger.info('Message marked as replied', { contactId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Message marked as replied',
      data: contact,
    });
  } catch (error) {
    logger.error('Mark as replied error', { error: error.message });
    next(error);
  }
};

/**
 * Delete contact message (Admin only)
 */
export const deleteMessage = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    logger.info('Message deleted', { contactId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    logger.error('Delete message error', { error: error.message });
    next(error);
  }
};

/**
 * Get contact statistics (Admin only)
 */
export const getContactStats = async (req, res, next) => {
  try {
    const [totalMessages, unreadMessages, repliedMessages] = await Promise.all([
      Contact.countDocuments({}),
      Contact.countDocuments({ isRead: false }),
      Contact.countDocuments({ isReplied: true }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMessages,
        unreadMessages,
        repliedMessages,
        unrepliedMessages: totalMessages - repliedMessages,
      },
    });
  } catch (error) {
    logger.error('Get contact stats error', { error: error.message });
    next(error);
  }
};
