import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';
import { validate } from '../middlewares/validate';
import { sendMessageBodySchema, sendMessageParamsSchema } from '../types/chat.types';

const router = Router();

router.post(
  '/:sessionId/message',
  validate(sendMessageParamsSchema, 'params'),
  validate(sendMessageBodySchema, 'body'),
  chatController.sendMessage.bind(chatController)
);

export default router;
