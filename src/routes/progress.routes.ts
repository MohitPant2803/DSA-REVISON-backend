import { Router } from 'express';
import { updateProgress, getMyStats, getPersonalLibrary } from '../controllers/progress.controller';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.post('/update', updateProgress);
router.get('/stats', getMyStats);
router.get('/library', getPersonalLibrary);

export default router;