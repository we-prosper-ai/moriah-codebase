import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extractTeachings, extractBatch } from './extractor';
import { getTeachingById, listTeachings, getAuditById, getAuditByFileId } from './db';
import type { ErrorResponse, BatchExtractResponse } from './types';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ─── Health ───────────────────────────────────────────────────────────────────

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'wisdom-extractor',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    model: process.env.CLAUDE_MODEL || 'claude-opus-4-5',
  });
});

// ─── POST /extract ────────────────────────────────────────────────────────────
// Body: { content: string, filename?: string, file_id?: string, metadata?: {...} }
// OR: multipart form with file upload

router.post('/extract', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    let content: string;
    let filename: string | undefined;
    let fileId: string | undefined;
    let metadata: object | undefined;

    if (req.file) {
      // File upload
      content = req.file.buffer.toString('utf-8');
      filename = req.file.originalname;
      fileId = (req.body.file_id as string) || uuidv4();
      try { metadata = JSON.parse(req.body.metadata as string || '{}'); } catch { metadata = {}; }
    } else {
      // JSON body
      const body = req.body as Record<string, unknown>;
      if (!body.content || typeof body.content !== 'string') {
        const err: ErrorResponse = { error: 'Missing required field: content', timestamp: new Date().toISOString() };
        res.status(400).json(err);
        return;
      }
      content = body.content as string;
      filename = body.filename as string | undefined;
      fileId = body.file_id as string | undefined;
      metadata = body.metadata as object | undefined;
    }

    const result = await extractTeachings({ content, filename, file_id: fileId, metadata });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// ─── POST /extract-batch ──────────────────────────────────────────────────────
// Body: { files: [{ content, filename, file_id, metadata }, ...] }

router.post('/extract-batch', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as Record<string, unknown>;

    if (!Array.isArray(body.files) || body.files.length === 0) {
      const err: ErrorResponse = { error: 'Missing required field: files (array)', timestamp: new Date().toISOString() };
      res.status(400).json(err);
      return;
    }

    const files = body.files as Array<{ content: string; filename?: string; file_id?: string; metadata?: object }>;

    // Validate all files have content
    for (let i = 0; i < files.length; i++) {
      if (!files[i].content || typeof files[i].content !== 'string') {
        const err: ErrorResponse = { error: `files[${i}].content is required`, timestamp: new Date().toISOString() };
        res.status(400).json(err);
        return;
      }
    }

    const batchId = uuidv4();
    const processedAt = new Date().toISOString();

    const { results, errors } = await extractBatch(files);

    const response: BatchExtractResponse = {
      batch_id: batchId,
      processed_at: processedAt,
      results,
      errors,
      summary: {
        total: files.length,
        succeeded: results.length,
        failed: errors.length,
        total_teachings: results.reduce((sum, r) => sum + r.count, 0),
      },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

// ─── GET /teachings ───────────────────────────────────────────────────────────
// Query params: page, page_size, module

router.get('/teachings', (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt((req.query.page_size as string) || '20', 10)));
    const module = req.query.module as string | undefined;

    const { teachings, total } = listTeachings(page, pageSize, module);

    res.json({
      teachings,
      total,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /teachings/:id ───────────────────────────────────────────────────────

router.get('/teachings/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const teaching = getTeachingById(req.params.id);
    if (!teaching) {
      const err: ErrorResponse = { error: 'Teaching not found', timestamp: new Date().toISOString() };
      res.status(404).json(err);
      return;
    }
    res.json(teaching);
  } catch (err) {
    next(err);
  }
});

// ─── GET /audit/:id ───────────────────────────────────────────────────────────
// Supports both audit ID and file_id lookup

router.get('/audit/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Try direct audit ID first, then file_id
    let audit = getAuditById(req.params.id);
    if (!audit) audit = getAuditByFileId(req.params.id);

    if (!audit) {
      const err: ErrorResponse = { error: 'Audit record not found', timestamp: new Date().toISOString() };
      res.status(404).json(err);
      return;
    }
    res.json(audit);
  } catch (err) {
    next(err);
  }
});

// ─── POST /teachings/sync ─────────────────────────────────────────────────────
// Sync teachings to CoachTinaMarie (or another downstream service)

router.post('/teachings/sync', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as Record<string, unknown>;
    const targetUrl = (body.target_url as string) || process.env.COACHTINA_URL;

    if (!targetUrl) {
      const err: ErrorResponse = {
        error: 'target_url required in body or COACHTINA_URL env var',
        timestamp: new Date().toISOString(),
      };
      res.status(400).json(err);
      return;
    }

    const page = 1;
    const pageSize = 100;
    const { teachings } = listTeachings(page, pageSize);

    // Fire-and-forget POST to CoachTinaMarie
    const payload = JSON.stringify({ teachings });
    const url = new URL(targetUrl);

    const httpModule = url.protocol === 'https:' ? await import('https') : await import('http');

    const postReq = httpModule.request(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (postRes) => {
        console.log(`[sync] CoachTinaMarie responded: ${postRes.statusCode}`);
      }
    );

    postReq.on('error', (e) => console.error('[sync] Error:', e.message));
    postReq.write(payload);
    postReq.end();

    res.json({
      synced: teachings.length,
      failed: 0,
      teachings,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
