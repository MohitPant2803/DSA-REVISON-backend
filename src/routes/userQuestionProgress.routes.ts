import { Router } from 'express';
import { updateUserQuestionProgressHandler } from '../controllers/userQuestionProgress.controller';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.post('/personal', updateUserQuestionProgressHandler);

export default router;
