import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_here_change_in_production';

// Hash password
export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Extract token from header
export const extractToken = (authHeader) => {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
};

// Email validation
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Response helpers
export const successResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorResponse = (message, statusCode = 400) => {
  return {
    success: false,
    message,
    statusCode,
  };
};
