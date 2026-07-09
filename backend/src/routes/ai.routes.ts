import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';
import { validate } from '../middlewares/validate';
import { generateTextSchema } from '../types/ai.types';

const router = Router();

router.post(
  '/generate',
  validate(generateTextSchema),
  aiController.generate.bind(aiController)
);

export default router;