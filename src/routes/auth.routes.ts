import { Router } from 'express';
import { googleLogin, getMe, updatePushToken, deleteAccount } from '../controllers/auth.controller';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/push-token', protect, updatePushToken);
router.delete('/delete-account', protect, deleteAccount);

export default router;