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
exports.getDb = getDb;
exports.closeDb = closeDb;
exports.insertTeaching = insertTeaching;
exports.insertTeachings = insertTeachings;
exports.getTeachingById = getTeachingById;
exports.listTeachings = listTeachings;
exports.insertAudit = insertAudit;
exports.getAuditById = getAuditById;
exports.getAuditByFileId = getAuditByFileId;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'db', 'wisdom.db');
let _db = null;
function getDb() {
    if (_db)
        return _db;
    // Ensure directory exists
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
    _db = new better_sqlite3_1.default(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    migrate(_db);
    return _db;
}
function closeDb() {
    if (_db) {
        _db.close();
        _db = null;
    }
}
function migrate(db) {
    db.exec(`
    CREATE TABLE IF NOT EXISTS teachings (
      id                          TEXT PRIMARY KEY,
      title                       TEXT NOT NULL,
      core_concept                TEXT NOT NULL,
      insight                     TEXT NOT NULL,
      quotes                      TEXT NOT NULL DEFAULT '[]',
      frameworks                  TEXT NOT NULL DEFAULT '[]',
      action_steps                TEXT NOT NULL DEFAULT '[]',
      case_studies                TEXT NOT NULL DEFAULT '[]',
      module                      TEXT NOT NULL,
      prerequisites               TEXT NOT NULL DEFAULT '[]',
      difficulty                  TEXT NOT NULL CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')),
      estimated_time_to_internalize TEXT NOT NULL DEFAULT '10 minutes',
      next_teachings              TEXT NOT NULL DEFAULT '[]',
      source_file_id              TEXT NOT NULL,
      source_filename             TEXT NOT NULL DEFAULT '',
      created_at                  TEXT NOT NULL,
      updated_at                  TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_teachings_module ON teachings(module);
    CREATE INDEX IF NOT EXISTS idx_teachings_difficulty ON teachings(difficulty);
    CREATE INDEX IF NOT EXISTS idx_teachings_source_file ON teachings(source_file_id);
    CREATE INDEX IF NOT EXISTS idx_teachings_created_at ON teachings(created_at);

    CREATE TABLE IF NOT EXISTS extraction_audits (
      id                    TEXT PRIMARY KEY,
      file_id               TEXT NOT NULL,
      filename              TEXT NOT NULL DEFAULT '',
      model_used            TEXT NOT NULL,
      prompt_tokens         INTEGER NOT NULL DEFAULT 0,
      completion_tokens     INTEGER NOT NULL DEFAULT 0,
      teachings_extracted   INTEGER NOT NULL DEFAULT 0,
      teaching_ids          TEXT NOT NULL DEFAULT '[]',
      duration_ms           INTEGER NOT NULL DEFAULT 0,
      raw_prompt            TEXT,
      raw_response          TEXT,
      created_at            TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_audits_file_id ON extraction_audits(file_id);
    CREATE INDEX IF NOT EXISTS idx_audits_created_at ON extraction_audits(created_at);
  `);
}
// ─── Teaching CRUD ────────────────────────────────────────────────────────────
function insertTeaching(t) {
    const db = getDb();
    const stmt = db.prepare(`
    INSERT OR REPLACE INTO teachings (
      id, title, core_concept, insight, quotes, frameworks,
      action_steps, case_studies, module, prerequisites, difficulty,
      estimated_time_to_internalize, next_teachings,
      source_file_id, source_filename, created_at, updated_at
    ) VALUES (
      @id, @title, @core_concept, @insight, @quotes, @frameworks,
      @action_steps, @case_studies, @module, @prerequisites, @difficulty,
      @estimated_time_to_internalize, @next_teachings,
      @source_file_id, @source_filename, @created_at, @updated_at
    )
  `);
    stmt.run({
        ...t,
        quotes: JSON.stringify(t.quotes),
        frameworks: JSON.stringify(t.frameworks),
        action_steps: JSON.stringify(t.action_steps),
        case_studies: JSON.stringify(t.case_studies),
        prerequisites: JSON.stringify(t.prerequisites),
        next_teachings: JSON.stringify(t.next_teachings),
    });
}
function insertTeachings(teachings) {
    const db = getDb();
    const insertMany = db.transaction((items) => {
        for (const t of items)
            insertTeaching(t);
    });
    insertMany(teachings);
}
function getTeachingById(id) {
    const db = getDb();
    const row = db.prepare('SELECT * FROM teachings WHERE id = ?').get(id);
    return row ? deserializeTeaching(row) : null;
}
function listTeachings(page, pageSize, module) {
    const db = getDb();
    const offset = (page - 1) * pageSize;
    let whereClause = '';
    const params = [];
    if (module) {
        whereClause = 'WHERE module = ?';
        params.push(module);
    }
    const total = db.prepare(`SELECT COUNT(*) as count FROM teachings ${whereClause}`).get(...params).count;
    const rows = db.prepare(`SELECT * FROM teachings ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, pageSize, offset);
    return {
        teachings: rows.map(deserializeTeaching),
        total,
    };
}
function deserializeTeaching(row) {
    return {
        id: row.id,
        title: row.title,
        core_concept: row.core_concept,
        insight: row.insight,
        quotes: JSON.parse(row.quotes),
        frameworks: JSON.parse(row.frameworks),
        action_steps: JSON.parse(row.action_steps),
        case_studies: JSON.parse(row.case_studies),
        module: row.module,
        prerequisites: JSON.parse(row.prerequisites),
        difficulty: row.difficulty,
        estimated_time_to_internalize: row.estimated_time_to_internalize,
        next_teachings: JSON.parse(row.next_teachings),
        source_file_id: row.source_file_id,
        source_filename: row.source_filename,
        created_at: row.created_at,
        updated_at: row.updated_at,
    };
}
// ─── Audit CRUD ───────────────────────────────────────────────────────────────
function insertAudit(audit) {
    const db = getDb();
    db.prepare(`
    INSERT INTO extraction_audits (
      id, file_id, filename, model_used, prompt_tokens, completion_tokens,
      teachings_extracted, teaching_ids, duration_ms, raw_prompt, raw_response, created_at
    ) VALUES (
      @id, @file_id, @filename, @model_used, @prompt_tokens, @completion_tokens,
      @teachings_extracted, @teaching_ids, @duration_ms, @raw_prompt, @raw_response, @created_at
    )
  `).run({
        ...audit,
        teaching_ids: JSON.stringify(audit.teaching_ids),
        raw_prompt: audit.raw_prompt ?? null,
        raw_response: audit.raw_response ?? null,
    });
}
function getAuditById(id) {
    const db = getDb();
    const row = db.prepare('SELECT * FROM extraction_audits WHERE id = ?').get(id);
    if (!row)
        return null;
    return {
        id: row.id,
        file_id: row.file_id,
        filename: row.filename,
        model_used: row.model_used,
        prompt_tokens: row.prompt_tokens,
        completion_tokens: row.completion_tokens,
        teachings_extracted: row.teachings_extracted,
        teaching_ids: JSON.parse(row.teaching_ids),
        duration_ms: row.duration_ms,
        created_at: row.created_at,
        raw_prompt: row.raw_prompt,
        raw_response: row.raw_response,
    };
}
function getAuditByFileId(fileId) {
    const db = getDb();
    const row = db.prepare('SELECT * FROM extraction_audits WHERE file_id = ? ORDER BY created_at DESC LIMIT 1').get(fileId);
    if (!row)
        return null;
    return getAuditById(row.id);
}
//# sourceMappingURL=db.js.map