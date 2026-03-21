import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import * as path from 'path';
import * as fs from 'fs';
import { getDb, closeDb } from './db';
import routes from './routes';
import type { ErrorResponse } from './types';

const PORT = parseInt(process.env.PORT || '4002', 10);

// ─── Ensure data dirs ─────────────────────────────────────────────────────────
const DATA_DIRS = [
  path.join(__dirname, '..', 'data', 'input'),
  path.join(__dirname, '..', 'data', 'db'),
  path.join(__dirname, '..', 'data', 'audit'),
];
for (const dir of DATA_DIRS) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ─── Init DB ──────────────────────────────────────────────────────────────────
getDb();

// ─── App ──────────────────────────────────────────────────────────────────────
const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/', routes);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  const err: ErrorResponse = { error: 'Not found', timestamp: new Date().toISOString() };
  res.status(404).json(err);
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.message);
  const body: ErrorResponse = {
    error: 'Internal server error',
    details: err.message,
    timestamp: new Date().toISOString(),
  };
  res.status(500).json(body);
});

// ─── Start ────────────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`\n✅ Wisdom Extractor running on http://localhost:${PORT}`);
  console.log(`📋 GET  http://localhost:${PORT}/health`);
  console.log(`🧠 POST http://localhost:${PORT}/extract`);
  console.log(`📦 POST http://localhost:${PORT}/extract-batch`);
  console.log(`📚 GET  http://localhost:${PORT}/teachings`);
  console.log(`📖 GET  http://localhost:${PORT}/teachings/:id`);
  console.log(`🔍 GET  http://localhost:${PORT}/audit/:id`);
  console.log(`🔄 POST http://localhost:${PORT}/teachings/sync\n`);
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('[shutdown] SIGTERM received');
  server.close(() => {
    closeDb();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[shutdown] SIGINT received');
  server.close(() => {
    closeDb();
    process.exit(0);
  });
});

export default app;
