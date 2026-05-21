import { Router } from 'express';
import { getDomains, getDomainBySlug } from '../controllers/domain.controller';

const router = Router();

router.get('/', getDomains);
router.get('/:slug', getDomainBySlug);

export default router;