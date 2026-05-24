import { Router, Request, Response } from 'express';
import SeniorQuote from '../models/seniorQuote.model';
import { successResponse } from '../utils/responseHandler';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const quotes = await SeniorQuote.find().lean();
    successResponse(res, 200, 'Quotes fetched successfully', quotes);
  })
);

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { text, author, collegeName, branch, yearOfGraduation } = req.body;
    if (!text || !author || !collegeName || !branch || !yearOfGraduation) {
      res.status(400).json({ success: false, message: 'All fields (text, author, collegeName, branch, yearOfGraduation) are required.' });
      return;
    }
    const newQuote = await SeniorQuote.create({
      text,
      author,
      collegeName,
      branch,
      yearOfGraduation,
    });
    successResponse(res, 201, 'Senior quote added successfully', newQuote);
  })
);

export default router;
