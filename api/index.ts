import express from 'express';
import { createApiRouter } from '../backend/src/routes/api.js';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const router = createApiRouter();

// Support Vercel /api/* requests
app.use('/api', router);

// Also support requests after Vercel rewrite strips /api
app.use('/', router);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

export default app;
