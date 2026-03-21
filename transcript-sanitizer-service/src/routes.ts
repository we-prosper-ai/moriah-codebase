import { Router, Request, Response } from 'express';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { sanitizeTranscript } from './sanitizer';
import { getAuditRecord, listAuditRecords } from './audit-store';
import { BatchSanitizeResult, ErrorResponse } from './types';

const router = Router();

// Multer config: store in memory for processing
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.md', '.txt', '.markdown'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .md, .txt, and .markdown files are accepted'));
    }
  },
});

// ─── POST /sanitize ───────────────────────────────────────────────────────────
router.post('/sanitize', upload.single('file'), (req: Request, res: Response) => {
  try {
    let content: string;
    let filename: string;

    if (req.file) {
      // File upload
      content = req.file.buffer.toString('utf-8');
      filename = req.file.originalname;
    } else if (req.body?.content) {
      // Raw text in JSON body
      content = req.body.content as string;
      filename = (req.body.filename as string) || 'inline-input.md';
    } else {
      const err: ErrorResponse = {
        error: 'No content provided',
        details: 'Send a file via multipart/form-data (field: "file") or JSON body with "content" field',
        timestamp: new Date().toISOString(),
      };
      res.status(400).json(err);
      return;
    }

    if (!content.trim()) {
      const err: ErrorResponse = {
        error: 'Empty content',
        details: 'The provided file or content is empty',
        timestamp: new Date().toISOString(),
      };
      res.status(400).json(err);
      return;
    }

    const result = sanitizeTranscript(content, filename);
    res.status(200).json(result);
  } catch (error) {
    const err: ErrorResponse = {
      error: 'Sanitization failed',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    };
    res.status(500).json(err);
  }
});

// ─── POST /sanitize-batch ─────────────────────────────────────────────────────
router.post('/sanitize-batch', upload.array('files', 20), (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      const err: ErrorResponse = {
        error: 'No files provided',
        details: 'Send files via multipart/form-data (field: "files")',
        timestamp: new Date().toISOString(),
      };
      res.status(400).json(err);
      return;
    }

    const batchId = uuidv4();
    const results: BatchSanitizeResult['results'] = [];
    const errors: BatchSanitizeResult['errors'] = [];

    for (const file of files) {
      try {
        const content = file.buffer.toString('utf-8');
        if (!content.trim()) {
          errors.push({ filename: file.originalname, error: 'Empty file' });
          continue;
        }
        const result = sanitizeTranscript(content, file.originalname);
        results.push(result);
      } catch (e) {
        errors.push({
          filename: file.originalname,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    const batchResult: BatchSanitizeResult = {
      batchId,
      processedAt: new Date().toISOString(),
      results,
      errors,
      summary: {
        total: files.length,
        succeeded: results.length,
        failed: errors.length,
      },
    };

    res.status(200).json(batchResult);
  } catch (error) {
    const err: ErrorResponse = {
      error: 'Batch sanitization failed',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    };
    res.status(500).json(err);
  }
});

// ─── GET /audit/:fileId ───────────────────────────────────────────────────────
router.get('/audit/:fileId', (req: Request, res: Response) => {
  const { fileId } = req.params;

  if (!fileId || !/^[0-9a-f-]{36}$/.test(fileId)) {
    const err: ErrorResponse = {
      error: 'Invalid fileId',
      details: 'fileId must be a valid UUID',
      timestamp: new Date().toISOString(),
    };
    res.status(400).json(err);
    return;
  }

  const record = getAuditRecord(fileId);
  if (!record) {
    const err: ErrorResponse = {
      error: 'Audit record not found',
      details: `No audit record found for fileId: ${fileId}`,
      timestamp: new Date().toISOString(),
    };
    res.status(404).json(err);
    return;
  }

  res.status(200).json(record);
});

// ─── GET /audit ───────────────────────────────────────────────────────────────
router.get('/audit', (_req: Request, res: Response) => {
  const records = listAuditRecords();
  res.status(200).json({
    total: records.length,
    fileIds: records,
  });
});

// ─── GET /health ──────────────────────────────────────────────────────────────
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'transcript-sanitizer',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

export default router;
