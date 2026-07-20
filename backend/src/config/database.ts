import mongoose from 'mongoose';
import { env } from './index';
import {logger} from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    logger.info('MongoDB connected successfully', {
      host: mongoose.connection.host,
      database: mongoose.connection.name,
    });

    registerDatabaseEvents();
  } catch (error) {
    logger.error('Failed to connect to MongoDB', {
      error: error instanceof Error ? error.message : error,
    });

    process.exit(1);
  }
};

const registerDatabaseEvents = (): void => {
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });

  mongoose.connection.on('error', (error) => {
    logger.error('MongoDB connection error', {
      error: error.message,
    });
  });

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
};

const gracefulShutdown = async (): Promise<void> => {
  try {
    await mongoose.connection.close();

    logger.info('MongoDB connection closed gracefully');

    process.exit(0);
  } catch (error) {
    logger.error('Error while closing MongoDB connection', {
      error: error instanceof Error ? error.message : error,
    });

    process.exit(1);
  }
};