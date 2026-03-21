import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import type { Teaching, ExtractionAudit } from './types';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'db', 'wisdom.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  // Ensure directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  migrate(_db);
  return _db;
}

export function closeDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}

function migrate(db: Database.Database): void {
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

export function insertTeaching(t: Teaching): void {
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

export function insertTeachings(teachings: Teaching[]): void {
  const db = getDb();
  const insertMany = db.transaction((items: Teaching[]) => {
    for (const t of items) insertTeaching(t);
  });
  insertMany(teachings);
}

export function getTeachingById(id: string): Teaching | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM teachings WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? deserializeTeaching(row) : null;
}

export function listTeachings(page: number, pageSize: number, module?: string): { teachings: Teaching[]; total: number } {
  const db = getDb();
  const offset = (page - 1) * pageSize;

  let whereClause = '';
  const params: (string | number)[] = [];

  if (module) {
    whereClause = 'WHERE module = ?';
    params.push(module);
  }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM teachings ${whereClause}`).get(...params) as { count: number }).count;
  const rows = db.prepare(`SELECT * FROM teachings ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, pageSize, offset) as Record<string, unknown>[];

  return {
    teachings: rows.map(deserializeTeaching),
    total,
  };
}

function deserializeTeaching(row: Record<string, unknown>): Teaching {
  return {
    id: row.id as string,
    title: row.title as string,
    core_concept: row.core_concept as string,
    insight: row.insight as string,
    quotes: JSON.parse(row.quotes as string),
    frameworks: JSON.parse(row.frameworks as string),
    action_steps: JSON.parse(row.action_steps as string),
    case_studies: JSON.parse(row.case_studies as string),
    module: row.module as string,
    prerequisites: JSON.parse(row.prerequisites as string),
    difficulty: row.difficulty as 'beginner' | 'intermediate' | 'advanced',
    estimated_time_to_internalize: row.estimated_time_to_internalize as string,
    next_teachings: JSON.parse(row.next_teachings as string),
    source_file_id: row.source_file_id as string,
    source_filename: row.source_filename as string,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

// ─── Audit CRUD ───────────────────────────────────────────────────────────────

export function insertAudit(audit: ExtractionAudit): void {
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

export function getAuditById(id: string): ExtractionAudit | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM extraction_audits WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!row) return null;
  return {
    id: row.id as string,
    file_id: row.file_id as string,
    filename: row.filename as string,
    model_used: row.model_used as string,
    prompt_tokens: row.prompt_tokens as number,
    completion_tokens: row.completion_tokens as number,
    teachings_extracted: row.teachings_extracted as number,
    teaching_ids: JSON.parse(row.teaching_ids as string),
    duration_ms: row.duration_ms as number,
    created_at: row.created_at as string,
    raw_prompt: row.raw_prompt as string | undefined,
    raw_response: row.raw_response as string | undefined,
  };
}

export function getAuditByFileId(fileId: string): ExtractionAudit | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM extraction_audits WHERE file_id = ? ORDER BY created_at DESC LIMIT 1').get(fileId) as Record<string, unknown> | undefined;
  if (!row) return null;
  return getAuditById(row.id as string);
}
