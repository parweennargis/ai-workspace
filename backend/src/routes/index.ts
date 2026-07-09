import { Router } from 'express';
import aiRoutes from './ai.routes';

const router = Router();

router.use('/api/v1/ai', aiRoutes);

export default router;