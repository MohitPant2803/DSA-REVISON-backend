import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { handleDeltaSync, handleSyncActions } from '../controllers/sync.controller';

const router = Router();

// Endpoint to fetch changes made since a given timestamp
router.get('/', protect, handleDeltaSync);

// Endpoint to upload a batch of offline user edits
router.post('/actions', protect, handleSyncActions);

export default router;
