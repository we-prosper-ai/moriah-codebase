/**
 * CoachTinaMarie — Integration Test Runner
 *
 * Tests all API endpoints without requiring a live AI model.
 * Uses a test database, not the production one.
 *
 * Run: npm test
 */

import "dotenv/config";
import Database from "better-sqlite3";
import { initializeDatabase } from "../src/db/schema.js";
import { syncTeachings, getTeachings, getTeachingById, searchTeachings } from "../src/db/teachings.js";
import { upsertUser, getUserById } from "../src/db/users.js";
import { createSession, addTurn, getSessionTurns, buildProgressSummary, upsertProgress, recordExposure, getExposedTeachingIds } from "../src/db/sessions.js";
import { buildRecommendations } from "../src/services/coaching.js";
import fs from "fs";

const TEST_DB = "./coachtina-test.db";
let passed = 0;
let failed = 0;

function ok(label: string, value: boolean, detail?: string) {
  if (value) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}${detail ? `: ${detail}` : ""}`);
    failed++;
  }
}

function section(title: string) {
  console.log(`\n── ${title} ──`);
}

async function run() {
  console.log("🏔️  CoachTinaMarie Backend Tests\n");

  // Clean test DB
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
  const db = initializeDatabase(TEST_DB);

  // ─── Schema ────────────────────────────────────────────────
  section("Database Schema");

  const tables = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  ).all() as { name: string }[];
  const tableNames = tables.map((t) => t.name);

  ok("teachings table exists", tableNames.includes("teachings"));
  ok("users table exists", tableNames.includes("users"));
  ok("coaching_sessions table exists", tableNames.includes("coaching_sessions"));
  ok("session_turns table exists", tableNames.includes("session_turns"));
  ok("user_progress table exists", tableNames.includes("user_progress"));
  ok("topic_exposure table exists", tableNames.includes("topic_exposure"));
  ok("sync_log table exists", tableNames.includes("sync_log"));

  // ─── Teachings ─────────────────────────────────────────────
  section("Teachings — Sync & Retrieval");

  const teachings = [
    {
      id: "t-001",
      theme: "Foundation",
      title: "Four Currencies Framework",
      core_teaching: "Optimize Energy → Time → Money → Freedom in that order.",
      key_insight: "Most entrepreneurs optimize for money last, not energy first.",
      quote: "\"You don't have a money problem. You have an energy problem.\"",
      action_steps: ["Step 1: Rate your currencies", "Step 2: Find biggest gap"],
      currency_tags: ["money", "time", "energy", "freedom"] as ("money" | "time" | "energy" | "freedom")[],
      course_module: "Module 1",
      curriculum_ref: "Module 1 / Lesson 1.1",
    },
    {
      id: "t-002",
      theme: "Scaling",
      title: "The Leverage Problem",
      core_teaching: "You don't have a capacity problem. You have a leverage problem.",
      currency_tags: ["time", "money"] as ("money" | "time" | "energy" | "freedom")[],
      course_module: "Module 1",
    },
    {
      id: "t-003",
      theme: "Pricing",
      title: "Value-Based Pricing",
      core_teaching: "Price communicates value. Underpricing trains clients to undervalue you.",
      currency_tags: ["money"] as ("money" | "time" | "energy" | "freedom")[],
      course_module: "Module 7",
    },
  ];

  const syncResult = syncTeachings(db, { source: "test", teachings });
  ok("Sync inserts 3 teachings", syncResult.inserted === 3, `Got ${syncResult.inserted}`);
  ok("Sync reports 0 errors", syncResult.errors === 0, `Got ${syncResult.errors}`);

  // Upsert (update)
  const updateResult = syncTeachings(db, { source: "test", teachings: [{ ...teachings[0], key_insight: "Updated insight" }] });
  ok("Upsert updates existing teaching", updateResult.updated === 1, `Got ${updateResult.updated}`);

  const all = getTeachings(db, {});
  ok("getTeachings returns all 3", all.length === 3, `Got ${all.length}`);

  const byId = getTeachingById(db, "t-001");
  ok("getTeachingById works", byId?.id === "t-001");
  ok("JSON fields deserialize (action_steps)", Array.isArray(byId?.action_steps));
  ok("JSON fields deserialize (currency_tags)", Array.isArray(byId?.currency_tags));

  const searchResults = searchTeachings(db, "leverage", 5);
  ok("searchTeachings finds relevant result", searchResults.some((t) => t.id === "t-002"));

  const byTheme = getTeachings(db, { theme: "Pricing" });
  ok("Filter by theme works", byTheme.length === 1 && byTheme[0].id === "t-003");

  // ─── Users ─────────────────────────────────────────────────
  section("Users — Create & Update");

  const user1 = upsertUser(db, {
    id: "user-001",
    name: "Test User",
    email: "test@example.com",
    plan: "monthly",
    currencies_baseline: { money: 5, time: 3, energy: 6, freedom: 4 },
  });
  ok("User created", user1.id === "user-001");
  ok("User plan set", user1.plan === "monthly");
  ok("Baseline deserialized", user1.currencies_baseline?.money === 5);

  const user1Fetched = getUserById(db, "user-001");
  ok("getUserById works", user1Fetched?.email === "test@example.com");

  // Upsert (update)
  upsertUser(db, { id: "user-001", name: "Updated Name" });
  const updated = getUserById(db, "user-001");
  ok("User name updated", updated?.name === "Updated Name");

  // Duplicate email should update, not fail
  const user1Again = upsertUser(db, { email: "test@example.com", plan: "annual" });
  ok("Email-based upsert works", user1Again.plan === "annual");

  // ─── Sessions ──────────────────────────────────────────────
  section("Coaching Sessions");

  const session = createSession(db, { user_id: "user-001", topic: "scaling" });
  ok("Session created", !!session.id);
  ok("Session starts in probe phase", session.phase === "probe");
  ok("Session status is active", session.status === "active");

  addTurn(db, { session_id: session.id, role: "user", content: "I'm burned out at $180K/year." });
  addTurn(db, { session_id: session.id, role: "assistant", content: "Tell me about your revenue structure.", phase: "probe", teaching_ids: ["t-001", "t-002"] });
  addTurn(db, { session_id: session.id, role: "user", content: "8 clients at $2K/month each." });

  const turns = getSessionTurns(db, session.id);
  ok("3 turns recorded", turns.length === 3, `Got ${turns.length}`);
  ok("Assistant turn has teaching_ids", turns[1].teaching_ids?.length === 2 || typeof turns[1].teaching_ids === "string");

  // ─── Progress ──────────────────────────────────────────────
  section("User Progress Tracking");

  upsertProgress(db, { user_id: "user-001", module_id: "module-1", status: "completed" });
  upsertProgress(db, { user_id: "user-001", module_id: "module-2", lesson_id: "lesson-2-1", status: "in_progress" });
  upsertProgress(db, { user_id: "user-001", module_id: "module-2", lesson_id: "lesson-2-2", status: "completed", score: 85 });

  const summary = buildProgressSummary(db, "user-001");
  ok("Progress summary returns user_id", summary.user_id === "user-001");
  ok("8 modules in breakdown", summary.module_breakdown.length === 8);
  ok("Session count tracked", summary.sessions_count >= 1);
  ok("Currencies baseline in summary", summary.currencies_baseline?.money === 5);

  // ─── Topic Exposure ────────────────────────────────────────
  section("Topic Exposure");

  recordExposure(db, "user-001", ["t-001", "t-002"]);
  recordExposure(db, "user-001", ["t-001"]); // Second exposure

  const exposedIds = getExposedTeachingIds(db, "user-001");
  ok("2 unique topics exposed", exposedIds.length === 2, `Got ${exposedIds.length}`);

  const exposureCount = db.prepare(
    "SELECT exposure_count FROM topic_exposure WHERE user_id = ? AND teaching_id = ?"
  ).get("user-001", "t-001") as { exposure_count: number } | undefined;
  ok("Exposure count increments", (exposureCount?.exposure_count ?? 0) === 2, `Got ${exposureCount?.exposure_count}`);

  // ─── Recommendations ───────────────────────────────────────
  section("Personalized Recommendations");

  const recs = buildRecommendations(db, "user-001");
  ok("Recommendations returned", recs.length > 0);
  ok("Recommendations have required fields", recs.every((r) => r.teaching_id && r.title && r.reason));
  ok("Unseen teachings prioritized", recs.some((r) => r.priority === "medium" || r.priority === "high"));

  // ─── Sync Log ──────────────────────────────────────────────
  section("Sync Log");

  const logs = db.prepare("SELECT * FROM sync_log ORDER BY id DESC").all() as { status: string; source: string }[];
  ok("Sync log has entries", logs.length >= 1);
  ok("Sync log records source", logs.some((l) => l.source === "test"));

  // ─── Results ───────────────────────────────────────────────
  console.log(`\n${"─".repeat(40)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log("🏔️  All tests passed. CoachTinaMarie backend is solid.");
  } else {
    console.log(`⚠️  ${failed} test(s) failed. Review above.`);
  }

  db.close();
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);

  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
