import { NextFunction, Request, Response } from 'express';
import { aiService } from '../services';
import { logger } from '../utils/logger';

export class AIController {
  async generate(req: Request, res: Response, next: NextFunction) {
    logger.info('Generating AI response', {requestId: req.requestId, promptLength: req.body.prompt.length});
    try {
        const { prompt } = req.body;

        const response =
        await aiService.generateText(prompt);

        return res.status(200).json({
            success: true,
            data: {
                response,
            },
        });
    } catch (error) {
        next(error);
    }
    }
}

export const aiController = new AIController();
