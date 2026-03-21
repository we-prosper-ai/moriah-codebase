/**
 * CoachTinaMarie — Database Schema
 *
 * Tables:
 *   teachings         — wisdom extracted from Tina's transcripts
 *   users             — coach subscribers
 *   coaching_sessions — individual coaching conversations
 *   session_turns     — each message in a session
 *   user_progress     — per-module completion tracking
 *   topic_exposure    — which topics a user has encountered
 */

import Database from "better-sqlite3";
import { logger } from "../services/logger.js";

export function initializeDatabase(dbPath: string): Database.Database {
  const db = new Database(dbPath);

  // Performance settings
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("synchronous = NORMAL");

  db.exec(`
    -- ──────────────────────────────────────────────────────────────
    -- TEACHINGS — extracted wisdom from Tina's transcripts
    -- ──────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS teachings (
      id              TEXT PRIMARY KEY,
      theme           TEXT NOT NULL,
      title           TEXT NOT NULL,
      core_teaching   TEXT NOT NULL,
      key_insight     TEXT,
      quote           TEXT,
      action_steps    TEXT,        -- JSON array of strings
      case_study      TEXT,        -- JSON object
      related_ids     TEXT,        -- JSON array of teaching ids
      course_module   TEXT,
      curriculum_ref  TEXT,        -- e.g. "Module 1 / Lesson 1.1"
      currency_tags   TEXT,        -- JSON array: ["money","time","energy","freedom"]
      source_file     TEXT,
      created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE INDEX IF NOT EXISTS idx_teachings_theme ON teachings(theme);
    CREATE INDEX IF NOT EXISTS idx_teachings_module ON teachings(course_module);

    -- ──────────────────────────────────────────────────────────────
    -- USERS
    -- ──────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS users (
      id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
      external_id     TEXT UNIQUE,          -- e.g. Stripe customer ID
      name            TEXT,
      email           TEXT UNIQUE,
      plan            TEXT NOT NULL DEFAULT 'free',  -- free | monthly | annual
      currencies_baseline TEXT,             -- JSON: {money,time,energy,freedom} self-rated 1-10
      created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      last_active_at  TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_external ON users(external_id);

    -- ──────────────────────────────────────────────────────────────
    -- COACHING SESSIONS
    -- ──────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS coaching_sessions (
      id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(12)))),
      user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      phase           TEXT NOT NULL DEFAULT 'probe',  -- probe|diagnose|advise|deepen
      topic           TEXT,
      identified_fundamentals TEXT,  -- JSON array
      turn_count      INTEGER NOT NULL DEFAULT 0,
      status          TEXT NOT NULL DEFAULT 'active',  -- active|completed|abandoned
      started_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      ended_at        TEXT,
      metadata        TEXT          -- JSON for future use
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user ON coaching_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_status ON coaching_sessions(status);

    -- ──────────────────────────────────────────────────────────────
    -- SESSION TURNS — every message in every session
    -- ──────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS session_turns (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id      TEXT NOT NULL REFERENCES coaching_sessions(id) ON DELETE CASCADE,
      role            TEXT NOT NULL CHECK(role IN ('user','assistant')),
      content         TEXT NOT NULL,
      phase           TEXT,
      teaching_ids    TEXT,   -- JSON array of teaching IDs used in this response
      tokens_used     INTEGER,
      created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE INDEX IF NOT EXISTS idx_turns_session ON session_turns(session_id);

    -- ──────────────────────────────────────────────────────────────
    -- USER PROGRESS — module/lesson completion
    -- ──────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS user_progress (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      module_id       TEXT NOT NULL,   -- e.g. "module-1"
      lesson_id       TEXT,            -- e.g. "lesson-1-1"
      status          TEXT NOT NULL DEFAULT 'not_started',  -- not_started|in_progress|completed
      score           INTEGER,         -- optional workbook score 0-100
      notes           TEXT,
      completed_at    TEXT,
      updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      UNIQUE(user_id, module_id, lesson_id)
    );

    CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);

    -- ──────────────────────────────────────────────────────────────
    -- TOPIC EXPOSURE — what topics a user has discussed in coaching
    -- ──────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS topic_exposure (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      teaching_id     TEXT NOT NULL REFERENCES teachings(id),
      exposure_count  INTEGER NOT NULL DEFAULT 1,
      last_exposed_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      UNIQUE(user_id, teaching_id)
    );

    CREATE INDEX IF NOT EXISTS idx_exposure_user ON topic_exposure(user_id);

    -- ──────────────────────────────────────────────────────────────
    -- SYNC LOG — audit trail for teachings sync operations
    -- ──────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS sync_log (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      source          TEXT,
      teachings_count INTEGER,
      status          TEXT,
      error           TEXT,
      synced_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
  `);

  logger.info({ dbPath }, "Database initialized");
  return db;
}
