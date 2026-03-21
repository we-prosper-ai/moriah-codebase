/**
 * Session + progress repository
 */

import type Database from "better-sqlite3";
import type {
  CoachingSession,
  CoachingPhase,
  SessionTurn,
  UserProgress,
  ProgressSummary,
  ModuleProgress,
} from "../types/index.js";

function parse<T>(str: string | null | undefined): T | undefined {
  if (!str) return undefined;
  try { return JSON.parse(str) as T; } catch { return undefined; }
}

function rowToSession(row: Record<string, unknown>): CoachingSession {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    phase: row.phase as CoachingPhase,
    topic: row.topic as string | undefined,
    identified_fundamentals: parse<string[]>(row.identified_fundamentals as string),
    turn_count: row.turn_count as number,
    status: row.status as CoachingSession["status"],
    started_at: row.started_at as string,
    ended_at: row.ended_at as string | undefined,
  };
}

export function createSession(
  db: Database.Database,
  data: { user_id: string; topic?: string }
): CoachingSession {
  const id = crypto.randomUUID().replace(/-/g, "").substring(0, 24);
  db.prepare(`
    INSERT INTO coaching_sessions (id, user_id, topic)
    VALUES (@id, @user_id, @topic)
  `).run({ id, user_id: data.user_id, topic: data.topic ?? null });

  return rowToSession(db.prepare("SELECT * FROM coaching_sessions WHERE id = ?").get(id) as Record<string, unknown>);
}

export function getSessionById(db: Database.Database, id: string): CoachingSession | null {
  const row = db.prepare("SELECT * FROM coaching_sessions WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  return row ? rowToSession(row) : null;
}

export function updateSessionPhase(
  db: Database.Database,
  sessionId: string,
  phase: CoachingPhase,
  fundamentals?: string[]
): void {
  db.prepare(`
    UPDATE coaching_sessions SET
      phase = @phase,
      identified_fundamentals = COALESCE(@fundamentals, identified_fundamentals)
    WHERE id = @id
  `).run({
    id: sessionId,
    phase,
    fundamentals: fundamentals ? JSON.stringify(fundamentals) : null,
  });
}

export function incrementSessionTurns(db: Database.Database, sessionId: string): void {
  db.prepare("UPDATE coaching_sessions SET turn_count = turn_count + 1 WHERE id = ?").run(sessionId);
}

export function closeSession(db: Database.Database, sessionId: string): void {
  db.prepare(`
    UPDATE coaching_sessions SET
      status = 'completed',
      ended_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
    WHERE id = ?
  `).run(sessionId);
}

export function addTurn(
  db: Database.Database,
  data: {
    session_id: string;
    role: "user" | "assistant";
    content: string;
    phase?: string;
    teaching_ids?: string[];
    tokens_used?: number;
  }
): SessionTurn {
  const result = db.prepare(`
    INSERT INTO session_turns (session_id, role, content, phase, teaching_ids, tokens_used)
    VALUES (@session_id, @role, @content, @phase, @teaching_ids, @tokens_used)
  `).run({
    session_id: data.session_id,
    role: data.role,
    content: data.content,
    phase: data.phase ?? null,
    teaching_ids: data.teaching_ids ? JSON.stringify(data.teaching_ids) : null,
    tokens_used: data.tokens_used ?? null,
  });

  return db.prepare("SELECT * FROM session_turns WHERE id = ?").get(result.lastInsertRowid) as SessionTurn;
}

export function getSessionTurns(db: Database.Database, sessionId: string): SessionTurn[] {
  return db.prepare("SELECT * FROM session_turns WHERE session_id = ? ORDER BY id ASC").all(sessionId) as SessionTurn[];
}

export function getUserSessions(
  db: Database.Database,
  userId: string,
  limit = 10
): CoachingSession[] {
  const rows = db.prepare(`
    SELECT * FROM coaching_sessions
    WHERE user_id = ?
    ORDER BY started_at DESC
    LIMIT ?
  `).all(userId, limit) as Record<string, unknown>[];
  return rows.map(rowToSession);
}

// ─── Progress ─────────────────────────────────────────────

export function upsertProgress(
  db: Database.Database,
  data: {
    user_id: string;
    module_id: string;
    lesson_id?: string;
    status: UserProgress["status"];
    score?: number;
    notes?: string;
  }
): void {
  db.prepare(`
    INSERT INTO user_progress (user_id, module_id, lesson_id, status, score, notes, completed_at)
    VALUES (@user_id, @module_id, @lesson_id, @status, @score, @notes,
            CASE WHEN @status = 'completed' THEN strftime('%Y-%m-%dT%H:%M:%fZ','now') ELSE NULL END)
    ON CONFLICT(user_id, module_id, lesson_id) DO UPDATE SET
      status = excluded.status,
      score = COALESCE(excluded.score, score),
      notes = COALESCE(excluded.notes, notes),
      completed_at = CASE WHEN excluded.status = 'completed' AND completed_at IS NULL
                          THEN strftime('%Y-%m-%dT%H:%M:%fZ','now')
                          ELSE completed_at END,
      updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
  `).run({
    user_id: data.user_id,
    module_id: data.module_id,
    lesson_id: data.lesson_id ?? null,
    status: data.status,
    score: data.score ?? null,
    notes: data.notes ?? null,
  });
}

// ─── Topic Exposure ──────────────────────────────────────────

export function recordExposure(db: Database.Database, userId: string, teachingIds: string[]): void {
  const upsert = db.prepare(`
    INSERT INTO topic_exposure (user_id, teaching_id, exposure_count, last_exposed_at)
    VALUES (@user_id, @teaching_id, 1, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    ON CONFLICT(user_id, teaching_id) DO UPDATE SET
      exposure_count = exposure_count + 1,
      last_exposed_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
  `);

  const run = db.transaction(() => {
    for (const tid of teachingIds) {
      try {
        upsert.run({ user_id: userId, teaching_id: tid });
      } catch { /* skip missing teaching refs */ }
    }
  });
  run();
}

export function getExposedTeachingIds(db: Database.Database, userId: string): string[] {
  const rows = db.prepare("SELECT teaching_id FROM topic_exposure WHERE user_id = ?").all(userId) as { teaching_id: string }[];
  return rows.map((r) => r.teaching_id);
}

// ─── Progress Summary ────────────────────────────────────────

const CURRICULUM_MODULES = [
  { id: "module-1", name: "Foundation", lessons: 3 },
  { id: "module-2", name: "Diagnosis", lessons: 3 },
  { id: "module-3", name: "Design", lessons: 3 },
  { id: "module-4", name: "Execution", lessons: 3 },
  { id: "module-5", name: "Scale", lessons: 3 },
  { id: "module-6", name: "The Four Currencies at Scale", lessons: 4 },
  { id: "module-7", name: "Optimize", lessons: 3 },
  { id: "module-8", name: "The Vision", lessons: 3 },
];

export function buildProgressSummary(db: Database.Database, userId: string): ProgressSummary {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as Record<string, unknown> | undefined;

  const sessionCount = (db.prepare("SELECT COUNT(*) as c FROM coaching_sessions WHERE user_id = ?").get(userId) as { c: number }).c;
  const topicsCount = (db.prepare("SELECT COUNT(*) as c FROM topic_exposure WHERE user_id = ?").get(userId) as { c: number }).c;

  const recentSessionRows = db.prepare(`
    SELECT id, status, phase, topic, turn_count, started_at, ended_at
    FROM coaching_sessions WHERE user_id = ? ORDER BY started_at DESC LIMIT 5
  `).all(userId) as Record<string, unknown>[];

  const progressRows = db.prepare("SELECT * FROM user_progress WHERE user_id = ?").all(userId) as UserProgress[];

  const moduleBreakdown: ModuleProgress[] = CURRICULUM_MODULES.map((mod) => {
    const moduleRows = progressRows.filter((p) => p.module_id === mod.id);
    const completedLessons = moduleRows.filter((p) => p.status === "completed" && p.lesson_id).length;
    const moduleStatus = moduleRows.find((p) => !p.lesson_id);
    const status = moduleStatus?.status ?? (completedLessons === mod.lessons ? "completed" : completedLessons > 0 ? "in_progress" : "not_started");

    return {
      module_id: mod.id,
      module_name: mod.name,
      status,
      lessons_completed: completedLessons,
      lessons_total: mod.lessons,
    };
  });

  const modulesCompleted = moduleBreakdown.filter((m) => m.status === "completed").length;

  return {
    user_id: userId,
    modules_completed: modulesCompleted,
    modules_total: CURRICULUM_MODULES.length,
    sessions_count: sessionCount,
    topics_explored: topicsCount,
    currencies_baseline: user?.currencies_baseline ? JSON.parse(user.currencies_baseline as string) : undefined,
    module_breakdown: moduleBreakdown,
    recent_sessions: recentSessionRows.map((r) => ({
      id: r.id as string,
      status: r.status as CoachingSession["status"],
      phase: r.phase as CoachingPhase,
      topic: r.topic as string | undefined,
      turn_count: r.turn_count as number,
      started_at: r.started_at as string,
      ended_at: r.ended_at as string | undefined,
    })),
  };
}
