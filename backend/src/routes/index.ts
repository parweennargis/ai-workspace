import { Router } from 'express';
import aiRoutes from './ai.routes';
import chatRoutes from './chat.routes';

const router = Router();

router.use('/api/v1/ai', aiRoutes);
router.use('/api/v1/chat', chatRoutes);

export default router;