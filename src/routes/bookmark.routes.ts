import { Router } from 'express';
import { toggleBookmark, getBookmarks } from '../controllers/bookmark.controller';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect); // Ensure user is authenticated
router.get('/', getBookmarks);
router.post('/toggle', toggleBookmark);

export default router;