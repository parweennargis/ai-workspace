import { NextFunction, Request, Response } from 'express';
import { chatService } from '../services';
import { SendMessageBody, SendMessageParams } from '../types/chat.types';

export class ChatController {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params as unknown as SendMessageParams;
      const { userId, content } = req.body as SendMessageBody;

      const result = await chatService.sendMessage({ sessionId, userId, content });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const chatController = new ChatController();
