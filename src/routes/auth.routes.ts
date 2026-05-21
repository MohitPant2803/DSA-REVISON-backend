import { Router } from 'express';
import { googleLogin, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/google', googleLogin);
router.get('/me', protect, getMe);

export default router;