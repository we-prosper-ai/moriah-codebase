import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { ensureAuditDir } from './audit-store';
import * as path from 'path';
import * as fs from 'fs';

const PORT = process.env.PORT || 4001;
const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Ensure data directories exist ───────────────────────────────────────────
const dataDirs = [
  path.join(__dirname, '..', 'data', 'input'),
  path.join(__dirname, '..', 'data', 'output'),
  path.join(__dirname, '..', 'data', 'audit'),
];
for (const dir of dataDirs) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
ensureAuditDir();

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/', routes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not found',
    timestamp: new Date().toISOString(),
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message,
    timestamp: new Date().toISOString(),
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Transcript Sanitizer running on http://localhost:${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/health`);
  console.log(`🔒 POST   http://localhost:${PORT}/sanitize`);
  console.log(`📦 POST   http://localhost:${PORT}/sanitize-batch`);
  console.log(`🔍 GET    http://localhost:${PORT}/audit/:fileId`);
});

export default app;
