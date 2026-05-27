import { Router } from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { handleDeltaSync, handleSyncActions } from '../controllers/sync.controller';
import { forceFullResync } from '../controllers/syncSafety.controller';

const router = Router();

// Endpoint to fetch changes made since a given timestamp
router.get('/', protect, handleDeltaSync);

// Endpoint to upload a batch of offline user edits
router.post('/actions', protect, handleSyncActions);

// Emergency administrative endpoint to force full resync
router.post('/safety/force-full-resync', protect, authorize('admin', 'superadmin'), forceFullResync);

export default router;
