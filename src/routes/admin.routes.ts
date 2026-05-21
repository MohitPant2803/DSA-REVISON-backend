import { Router } from 'express';
import { createDomain, createCategory, createPlacard, updatePlacard, deletePlacard } from '../controllers/admin.controller';
import { getUsersHandler, updateUserRoleHandler } from '../controllers/userAdmin.controller';
import { getAnalytics } from '../controllers/analytics.controller';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/analytics', protect, authorize('superadmin'), getAnalytics);
router.get('/users', protect, authorize('superadmin'), getUsersHandler);
router.patch('/users/:id/role', protect, authorize('superadmin'), updateUserRoleHandler);

router.use(protect, authorize('admin', 'superadmin'));

router.post('/domain/create', createDomain);
router.post('/category/create', createCategory);

router.post('/placard/create', createPlacard);
router.put('/placard/:id', updatePlacard);
router.delete('/placard/:id', deletePlacard);

export default router;