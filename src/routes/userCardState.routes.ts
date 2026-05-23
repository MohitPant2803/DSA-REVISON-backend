import { Router } from 'express';
import {
  incrementRevisionHandler,
  toggleWatchLaterHandler,
  markViewedHandler,
  getLikedCardsHandler,
  getWatchLaterCardsHandler,
  getUserCardStateHandler,
} from '../controllers/userCardStateController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.post('/like', incrementRevisionHandler);
router.post('/revision/increment', incrementRevisionHandler);
router.post('/watch-later', toggleWatchLaterHandler);
router.post('/viewed', markViewedHandler);
router.get('/liked', getLikedCardsHandler);
router.get('/watch-later', getWatchLaterCardsHandler);
router.get('/state/:cardId', getUserCardStateHandler);

export default router;
