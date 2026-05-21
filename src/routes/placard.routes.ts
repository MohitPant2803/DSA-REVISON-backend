import { Router } from 'express';
import { getPlacardsByCategory, getPlacardById } from '../controllers/placard.controller';

const router = Router();

// Public Routes
router.get('/category/:categoryId', getPlacardsByCategory);
router.get('/:id', getPlacardById);

export default router;