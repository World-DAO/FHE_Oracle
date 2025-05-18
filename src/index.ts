import dotenv from 'dotenv';
dotenv.config();

import './api/server';
import { logger } from './utils/logger';

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

logger.info('FHEVM Computation Service started');