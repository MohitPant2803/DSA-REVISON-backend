import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { notFound, errorHandler } from './middleware/errorMiddleware';
import { env } from './config/env';
import { connectDB } from './config/db';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import domainRoutes from './routes/domain.routes';
import categoryRoutes from './routes/category.routes';
import adminRoutes from './routes/admin.routes';
import placardRoutes from './routes/placard.routes';
import playlistRoutes from './routes/playlist.routes';
import bookmarkRoutes from './routes/bookmark.routes';
import progressRoutes from './routes/progress.routes';
import revisionRoutes from './routes/revision.routes';
import folderRoutes from './routes/folder.routes';
import userCardStateRoutes from './routes/userCardState.routes';
import sessionQueueRoutes from './routes/sessionQueue.routes';
import reelsFeedRoutes from './routes/reelsFeed.routes';

const app: Application = express();

// Security Middlewares
app.use(helmet());

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
// Temporarily disabled for local development to prevent 429 errors from hot-reloads
// app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// ─── Serverless DB connection middleware ───────────────────────────
// Ensures MongoDB is connected before any route handler runs.
// On Vercel cold starts, the connection doesn't exist yet; this
// middleware creates it. On warm invocations, connectDB() returns
// immediately from cache.
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/placards', placardRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/revisions', revisionRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/user-card-states', userCardStateRoutes);
app.use('/api/sessions', sessionQueueRoutes);
app.use('/api/reels', reelsFeedRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;