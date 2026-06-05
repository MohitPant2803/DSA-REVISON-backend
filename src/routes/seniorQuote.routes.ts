import { Router, Request, Response } from 'express';
import { STATIC_SENIOR_QUOTES } from '../config/quotes';
import { successResponse } from '../utils/responseHandler';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    successResponse(res, 200, 'Quotes fetched successfully', STATIC_SENIOR_QUOTES);
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
    // Return a mocked success response to fully disconnect from MongoDB collection writes
    const mockedQuote = {
      _id: "mocked-quote-" + Date.now(),
      text,
      author,
      collegeName,
      branch,
      yearOfGraduation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    successResponse(res, 201, 'Senior quote added successfully (mocked)', mockedQuote);
  })
);

export default router;
