import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { notFound, errorHandler } from './middleware/errorMiddleware';
import { env } from './config/env';
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

const app: Application = express();

// Security Middlewares
app.use(helmet());

const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow mobile apps (no origin) or explicitly allowed web domains
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

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
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;