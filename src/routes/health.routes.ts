import { Router, Request, Response } from 'express';
import { successResponse } from '../utils/responseHandler';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  successResponse(res, 200, 'Server running');
});

export default router;