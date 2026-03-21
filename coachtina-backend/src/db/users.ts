/**
 * User repository
 */

import type Database from "better-sqlite3";
import type { User, CurrenciesBaseline } from "../types/index.js";

function parse<T>(str: string | null | undefined): T | undefined {
  if (!str) return undefined;
  try { return JSON.parse(str) as T; } catch { return undefined; }
}

function rowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    external_id: row.external_id as string | undefined,
    name: row.name as string | undefined,
    email: row.email as string | undefined,
    plan: (row.plan as User["plan"]) || "free",
    currencies_baseline: parse<CurrenciesBaseline>(row.currencies_baseline as string),
    created_at: row.created_at as string,
    last_active_at: row.last_active_at as string | undefined,
  };
}

export function upsertUser(
  db: Database.Database,
  data: { id?: string; external_id?: string; name?: string; email?: string; plan?: string; currencies_baseline?: CurrenciesBaseline }
): User {
  const existing = data.id
    ? (db.prepare("SELECT * FROM users WHERE id = ?").get(data.id) as Record<string, unknown> | undefined)
    : data.email
    ? (db.prepare("SELECT * FROM users WHERE email = ?").get(data.email) as Record<string, unknown> | undefined)
    : undefined;

  if (existing) {
    db.prepare(`
      UPDATE users SET
        name = COALESCE(@name, name),
        email = COALESCE(@email, email),
        plan = COALESCE(@plan, plan),
        currencies_baseline = COALESCE(@currencies_baseline, currencies_baseline),
        last_active_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
      WHERE id = @id
    `).run({
      id: existing.id,
      name: data.name ?? null,
      email: data.email ?? null,
      plan: data.plan ?? null,
      currencies_baseline: data.currencies_baseline ? JSON.stringify(data.currencies_baseline) : null,
    });
    return rowToUser(db.prepare("SELECT * FROM users WHERE id = ?").get(existing.id) as Record<string, unknown>);
  }

  // Create new user
  const id = data.id ?? crypto.randomUUID().replace(/-/g, "").substring(0, 16);
  db.prepare(`
    INSERT INTO users (id, external_id, name, email, plan, currencies_baseline)
    VALUES (@id, @external_id, @name, @email, @plan, @currencies_baseline)
  `).run({
    id,
    external_id: data.external_id ?? null,
    name: data.name ?? null,
    email: data.email ?? null,
    plan: data.plan ?? "free",
    currencies_baseline: data.currencies_baseline ? JSON.stringify(data.currencies_baseline) : null,
  });

  return rowToUser(db.prepare("SELECT * FROM users WHERE id = ?").get(id) as Record<string, unknown>);
}

export function getUserById(db: Database.Database, id: string): User | null {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  return row ? rowToUser(row) : null;
}

export function touchUser(db: Database.Database, userId: string): void {
  db.prepare("UPDATE users SET last_active_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?").run(userId);
}
