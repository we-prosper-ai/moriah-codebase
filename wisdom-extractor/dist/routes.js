"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const extractor_1 = require("./extractor");
const db_1 = require("./db");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
// ─── Health ───────────────────────────────────────────────────────────────────
router.get('/health', (_req, res) => {
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
router.post('/extract', upload.single('file'), async (req, res, next) => {
    try {
        let content;
        let filename;
        let fileId;
        let metadata;
        if (req.file) {
            // File upload
            content = req.file.buffer.toString('utf-8');
            filename = req.file.originalname;
            fileId = req.body.file_id || (0, uuid_1.v4)();
            try {
                metadata = JSON.parse(req.body.metadata || '{}');
            }
            catch {
                metadata = {};
            }
        }
        else {
            // JSON body
            const body = req.body;
            if (!body.content || typeof body.content !== 'string') {
                const err = { error: 'Missing required field: content', timestamp: new Date().toISOString() };
                res.status(400).json(err);
                return;
            }
            content = body.content;
            filename = body.filename;
            fileId = body.file_id;
            metadata = body.metadata;
        }
        const result = await (0, extractor_1.extractTeachings)({ content, filename, file_id: fileId, metadata });
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
});
// ─── POST /extract-batch ──────────────────────────────────────────────────────
// Body: { files: [{ content, filename, file_id, metadata }, ...] }
router.post('/extract-batch', async (req, res, next) => {
    try {
        const body = req.body;
        if (!Array.isArray(body.files) || body.files.length === 0) {
            const err = { error: 'Missing required field: files (array)', timestamp: new Date().toISOString() };
            res.status(400).json(err);
            return;
        }
        const files = body.files;
        // Validate all files have content
        for (let i = 0; i < files.length; i++) {
            if (!files[i].content || typeof files[i].content !== 'string') {
                const err = { error: `files[${i}].content is required`, timestamp: new Date().toISOString() };
                res.status(400).json(err);
                return;
            }
        }
        const batchId = (0, uuid_1.v4)();
        const processedAt = new Date().toISOString();
        const { results, errors } = await (0, extractor_1.extractBatch)(files);
        const response = {
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
    }
    catch (err) {
        next(err);
    }
});
// ─── GET /teachings ───────────────────────────────────────────────────────────
// Query params: page, page_size, module
router.get('/teachings', (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const pageSize = Math.min(100, Math.max(1, parseInt(req.query.page_size || '20', 10)));
        const module = req.query.module;
        const { teachings, total } = (0, db_1.listTeachings)(page, pageSize, module);
        res.json({
            teachings,
            total,
            page,
            page_size: pageSize,
            total_pages: Math.ceil(total / pageSize),
        });
    }
    catch (err) {
        next(err);
    }
});
// ─── GET /teachings/:id ───────────────────────────────────────────────────────
router.get('/teachings/:id', (req, res, next) => {
    try {
        const teaching = (0, db_1.getTeachingById)(req.params.id);
        if (!teaching) {
            const err = { error: 'Teaching not found', timestamp: new Date().toISOString() };
            res.status(404).json(err);
            return;
        }
        res.json(teaching);
    }
    catch (err) {
        next(err);
    }
});
// ─── GET /audit/:id ───────────────────────────────────────────────────────────
// Supports both audit ID and file_id lookup
router.get('/audit/:id', (req, res, next) => {
    try {
        // Try direct audit ID first, then file_id
        let audit = (0, db_1.getAuditById)(req.params.id);
        if (!audit)
            audit = (0, db_1.getAuditByFileId)(req.params.id);
        if (!audit) {
            const err = { error: 'Audit record not found', timestamp: new Date().toISOString() };
            res.status(404).json(err);
            return;
        }
        res.json(audit);
    }
    catch (err) {
        next(err);
    }
});
// ─── POST /teachings/sync ─────────────────────────────────────────────────────
// Sync teachings to CoachTinaMarie (or another downstream service)
router.post('/teachings/sync', async (req, res, next) => {
    try {
        const body = req.body;
        const targetUrl = body.target_url || process.env.COACHTINA_URL;
        if (!targetUrl) {
            const err = {
                error: 'target_url required in body or COACHTINA_URL env var',
                timestamp: new Date().toISOString(),
            };
            res.status(400).json(err);
            return;
        }
        const page = 1;
        const pageSize = 100;
        const { teachings } = (0, db_1.listTeachings)(page, pageSize);
        // Fire-and-forget POST to CoachTinaMarie
        const payload = JSON.stringify({ teachings });
        const url = new URL(targetUrl);
        const httpModule = url.protocol === 'https:' ? await Promise.resolve().then(() => __importStar(require('https'))) : await Promise.resolve().then(() => __importStar(require('http')));
        const postReq = httpModule.request({
            hostname: url.hostname,
            port: url.port || (url.protocol === 'https:' ? 443 : 80),
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
            },
        }, (postRes) => {
            console.log(`[sync] CoachTinaMarie responded: ${postRes.statusCode}`);
        });
        postReq.on('error', (e) => console.error('[sync] Error:', e.message));
        postReq.write(payload);
        postReq.end();
        res.json({
            synced: teachings.length,
            failed: 0,
            teachings,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=routes.js.map