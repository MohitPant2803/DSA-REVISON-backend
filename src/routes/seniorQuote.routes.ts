import { Router, Request, Response } from 'express';
import SeniorQuote from '../models/seniorQuote.model';
import { successResponse } from '../utils/responseHandler';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

const SAMPLE_QUOTES = [
  {
    text: "DSA is not a sprint, it's a marathon. Focus on pattern matching over rote memorization.",
    author: "Abhinav Sharma",
    collegeName: "IIT Delhi",
    branch: "Computer Science",
    yearOfGraduation: 2024
  },
  {
    text: "Notice how problems are built. Dynamic Programming is just subproblem sorting. Stay consistent!",
    author: "Riya Patel",
    collegeName: "NSUT",
    branch: "Information Technology",
    yearOfGraduation: 2023
  },
  {
    text: "Don't count the problems you solve; make the problems you solve count. Solve 150 high-quality ones deeply.",
    author: "Mohit Pant",
    collegeName: "DTU",
    branch: "Electronics & Communication",
    yearOfGraduation: 2025
  },
  {
    text: "The silent hours you spend understanding the graph traversal will pay off when you least expect it.",
    author: "Sneha Reddy",
    collegeName: "BITS Pilani",
    branch: "Computer Science",
    yearOfGraduation: 2024
  },
  {
    text: "Calm minds learn faster. When you get stuck, step away, breathe, and look at the recursion tree.",
    author: "Vikram Malhotra",
    collegeName: "IIIT Hyderabad",
    branch: "Computer Science",
    yearOfGraduation: 2023
  }
];

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    let quotes = await SeniorQuote.find().lean();
    if (!quotes || quotes.length === 0) {
      try {
        // Automatically seed sample quotes into MongoDB on first database check
        const seeded = await SeniorQuote.insertMany(SAMPLE_QUOTES);
        quotes = seeded.map(q => q.toObject ? q.toObject() : q) as any;
      } catch (err) {
        console.error('Failed to auto-seed senior quotes:', err);
        quotes = SAMPLE_QUOTES as any;
      }
    }
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
