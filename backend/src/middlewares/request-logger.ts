import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  logger.info('Incoming request', {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
  });

  next();
}