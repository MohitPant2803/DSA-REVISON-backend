import { Router } from 'express';
import { updateProgress, getMyStats, getPersonalLibrary, registerLoop, getFolderLoops, updateResumeState, getResumeStates, reorderLikes } from '../controllers/progress.controller';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.post('/update', updateProgress);
router.post('/loop', registerLoop);
router.get('/stats', getMyStats);
router.get('/library', getPersonalLibrary);
router.get('/folder-loops', getFolderLoops);
router.post('/resume', updateResumeState);
router.get('/resume', getResumeStates);
router.post('/reorder-likes', reorderLikes);

export default router;