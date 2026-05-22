import { Router } from 'express';
import {
  createSessionHandler,
  getSessionHandler,
  updateSessionIndexHandler,
  toggleSessionShuffleHandler,
  getSessionCardsSliceHandler,
} from '../controllers/sessionQueueController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.post('/start', createSessionHandler);
router.get('/:id', getSessionHandler);
router.get('/:id/slice', getSessionCardsSliceHandler);
router.put('/:id/index', updateSessionIndexHandler);
router.put('/:id/shuffle', toggleSessionShuffleHandler);

export default router;
