import { Router } from 'express';
import {
  getUserPreferencesHandler,
  updateUserPreferencesHandler,
  getSessionSliceHandler,
  updateSessionIndexHandler,
  regenerateSessionQueueHandler,
} from '../controllers/reelsFeedController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Secure all reels feed routes with authentication middleware
router.use(protect);

router.route('/preferences')
  .get(getUserPreferencesHandler)
  .put(updateUserPreferencesHandler);

router.route('/feed')
  .get(getSessionSliceHandler);

router.route('/feed/index')
  .put(updateSessionIndexHandler);

router.route('/feed/regenerate')
  .post(regenerateSessionQueueHandler);

export default router;
