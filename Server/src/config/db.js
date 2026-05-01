import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const globalMongoose = globalThis;

if (!globalMongoose.__portfolioMongoose) {
  globalMongoose.__portfolioMongoose = {
    connection: null,
    promise: null,
  };
}

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    if (globalMongoose.__portfolioMongoose.connection) {
      return globalMongoose.__portfolioMongoose.connection;
    }

    if (!globalMongoose.__portfolioMongoose.promise) {
      globalMongoose.__portfolioMongoose.promise = mongoose.connect(mongoURI);
    }

    const conn = await globalMongoose.__portfolioMongoose.promise;
    globalMongoose.__portfolioMongoose.connection = conn;

    logger.info(`MongoDB Connection Successful: ${conn.connection.host}:${conn.connection.port}`);
    return conn;
  } catch (error) {
    globalMongoose.__portfolioMongoose.promise = null;
    logger.error(`MongoDB Connection Error: ${error.message}`);
    throw error; // Let caller handle the error
  }
};

// Disconnect function for testing and graceful shutdown
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB Disconnected');
  } catch (error) {
    logger.error(`MongoDB Disconnection Error: ${error.message}`);
    process.exit(1);
  }
};
