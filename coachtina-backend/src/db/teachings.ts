/**
 * Teaching repository — all DB ops for teachings table
 */

import type Database from "better-sqlite3";
import type { Teaching, TeachingSyncPayload } from "../types/index.js";
import { logger } from "../services/logger.js";

function serialize(obj: unknown): string | null {
  if (obj == null) return null;
  return JSON.stringify(obj);
}

function parse<T>(str: string | null | undefined): T | undefined {
  if (!str) return undefined;
  try { return JSON.parse(str) as T; } catch { return undefined; }
}

function rowToTeaching(row: Record<string, unknown>): Teaching {
  return {
    id: row.id as string,
    theme: row.theme as string,
    title: row.title as string,
    core_teaching: row.core_teaching as string,
    key_insight: row.key_insight as string | undefined,
    quote: row.quote as string | undefined,
    action_steps: parse<string[]>(row.action_steps as string),
    case_study: parse(row.case_study as string),
    related_ids: parse<string[]>(row.related_ids as string),
    course_module: row.course_module as string | undefined,
    curriculum_ref: row.curriculum_ref as string | undefined,
    currency_tags: parse(row.currency_tags as string),
    source_file: row.source_file as string | undefined,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export function syncTeachings(
  db: Database.Database,
  payload: TeachingSyncPayload
): { inserted: number; updated: number; errors: number } {
  const upsert = db.prepare(`
    INSERT INTO teachings
      (id, theme, title, core_teaching, key_insight, quote,
       action_steps, case_study, related_ids, course_module,
       curriculum_ref, currency_tags, source_file, updated_at)
    VALUES
      (@id, @theme, @title, @core_teaching, @key_insight, @quote,
       @action_steps, @case_study, @related_ids, @course_module,
       @curriculum_ref, @currency_tags, @source_file,
       strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    ON CONFLICT(id) DO UPDATE SET
      theme          = excluded.theme,
      title          = excluded.title,
      core_teaching  = excluded.core_teaching,
      key_insight    = excluded.key_insight,
      quote          = excluded.quote,
      action_steps   = excluded.action_steps,
      case_study     = excluded.case_study,
      related_ids    = excluded.related_ids,
      course_module  = excluded.course_module,
      curriculum_ref = excluded.curriculum_ref,
      currency_tags  = excluded.currency_tags,
      source_file    = excluded.source_file,
      updated_at     = strftime('%Y-%m-%dT%H:%M:%fZ','now')
  `);

  const logSync = db.prepare(`
    INSERT INTO sync_log (source, teachings_count, status, error)
    VALUES (@source, @count, @status, @error)
  `);

  let inserted = 0;
  let updated = 0;
  let errors = 0;

  const run = db.transaction(() => {
    for (const t of payload.teachings) {
      try {
        if (!t.id || !t.theme || !t.title || !t.core_teaching) {
          logger.warn({ teaching: t }, "Skipping teaching with missing required fields");
          errors++;
          continue;
        }

        // Check if exists
        const existing = db.prepare("SELECT id FROM teachings WHERE id = ?").get(t.id);

        upsert.run({
          id: t.id,
          theme: t.theme,
          title: t.title,
          core_teaching: t.core_teaching,
          key_insight: t.key_insight ?? null,
          quote: t.quote ?? null,
          action_steps: serialize(t.action_steps),
          case_study: serialize(t.case_study),
          related_ids: serialize(t.related_ids),
          course_module: t.course_module ?? null,
          curriculum_ref: t.curriculum_ref ?? null,
          currency_tags: serialize(t.currency_tags),
          source_file: t.source_file ?? null,
        });

        existing ? updated++ : inserted++;
      } catch (err) {
        logger.error({ err, id: t.id }, "Failed to upsert teaching");
        errors++;
      }
    }
  });

  try {
    run();
    logSync.run({
      source: payload.source ?? "unknown",
      count: payload.teachings.length,
      status: errors > 0 ? "partial" : "success",
      error: errors > 0 ? `${errors} errors` : null,
    });
  } catch (err) {
    logSync.run({ source: payload.source ?? "unknown", count: 0, status: "failed", error: String(err) });
    throw err;
  }

  return { inserted, updated, errors };
}

export function getTeachings(
  db: Database.Database,
  opts: { theme?: string; module?: string; limit?: number; offset?: number }
): Teaching[] {
  let query = "SELECT * FROM teachings WHERE 1=1";
  const params: unknown[] = [];

  if (opts.theme) { query += " AND theme = ?"; params.push(opts.theme); }
  if (opts.module) { query += " AND course_module = ?"; params.push(opts.module); }
  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  params.push(opts.limit ?? 50, opts.offset ?? 0);

  const rows = db.prepare(query).all(...params) as Record<string, unknown>[];
  return rows.map(rowToTeaching);
}

export function getTeachingById(db: Database.Database, id: string): Teaching | null {
  const row = db.prepare("SELECT * FROM teachings WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  return row ? rowToTeaching(row) : null;
}

export function searchTeachings(db: Database.Database, query: string, limit = 10): Teaching[] {
  // Simple keyword search across key fields
  const like = `%${query}%`;
  const rows = db.prepare(`
    SELECT * FROM teachings
    WHERE core_teaching LIKE ?
       OR title LIKE ?
       OR theme LIKE ?
       OR key_insight LIKE ?
    ORDER BY created_at DESC
    LIMIT ?
  `).all(like, like, like, like, limit) as Record<string, unknown>[];
  return rows.map(rowToTeaching);
}

export function getTeachingsByIds(db: Database.Database, ids: string[]): Teaching[] {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => "?").join(",");
  const rows = db.prepare(`SELECT * FROM teachings WHERE id IN (${placeholders})`).all(...ids) as Record<string, unknown>[];
  return rows.map(rowToTeaching);
}

export function getRandomTeachings(db: Database.Database, limit = 5): Teaching[] {
  const rows = db.prepare("SELECT * FROM teachings ORDER BY RANDOM() LIMIT ?").all(limit) as Record<string, unknown>[];
  return rows.map(rowToTeaching);
}

export function countTeachings(db: Database.Database): number {
  const row = db.prepare("SELECT COUNT(*) as c FROM teachings").get() as { c: number };
  return row.c;
}
