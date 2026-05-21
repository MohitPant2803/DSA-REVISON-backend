import { Router } from 'express';
import { getCategoriesByDomain, getCategoryBySlug } from '../controllers/category.controller';

const router = Router();

// Using specific paths to avoid route parameter collision
router.get('/domain/:domainId', getCategoriesByDomain);
router.get('/:slug', getCategoryBySlug);

export default router;