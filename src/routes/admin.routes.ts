import { Router } from 'express';
import { getUsersHandler, updateUserRoleHandler } from '../controllers/userAdmin.controller';
import { getAnalytics } from '../controllers/analytics.controller';
import { sendPushNotificationHandler } from '../controllers/pushNotification.controller';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/analytics', protect, authorize('superadmin'), getAnalytics);
router.get('/users', protect, authorize('superadmin'), getUsersHandler);
router.patch('/users/:id/role', protect, authorize('superadmin'), updateUserRoleHandler);

router.use(protect, authorize('admin', 'superadmin'));

router.post('/send-push', sendPushNotificationHandler);

export default router;