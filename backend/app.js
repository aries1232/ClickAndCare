import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { corsOptions } from './config/cors.js';
import adminRouter from './routes/adminRoute.js';
import userRouter from './routes/userRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import chatRouter from './routes/chatRoute.js';
import debugRouter from './routes/debugRoute.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';

const app = express();

app.use(compression());
app.use(express.json());
app.use(cors(corsOptions));

// API routes
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/chat', chatRouter);

// Dev-only routes (data-wipers, chat debug dumps). Kept off in production.
if (!isProd) {
  app.use('/api/debug', debugRouter);
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'API Working', timestamp: new Date().toISOString() });
});

// Production static serving
if (isProd) {
  app.use(express.static(join(__dirname, '../frontend/dist')));
  app.use('/admin', express.static(join(__dirname, '../admin/dist')));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/admin')) {
      res.sendFile(join(__dirname, '../admin/dist/index.html'));
    } else {
      res.sendFile(join(__dirname, '../frontend/dist/index.html'));
    }
  });
} else {
  app.get('/', (req, res) => res.send('API Working - Development Mode'));
}

// 404 for unmatched /api/* routes + centralized error handling (must be last).
app.use('/api', notFound);
app.use(errorHandler);

export default app;
