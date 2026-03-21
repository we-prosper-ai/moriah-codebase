#!/usr/bin/env node

/**
 * Load sample data into Finance Friend v3 and Team Board
 * Usage: node load-sample-data.js [finance|board|all]
 */

const Database = require("better-sqlite3");
const path = require("path");
const crypto = require("crypto");

const target = process.argv[2] || "all";

const FF_DB = path.join(
  __dirname,
  "../finance-friend-v3/backend/finance-friend.db"
);
const BOARD_DB = path.join(
  __dirname,
  "../team-agent-board-backend/team_board.db"
);

// Simple password hasher (not real bcrypt, just for demo)
function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}

function loadFinanceFriend() {
  console.log("📊 Loading Finance Friend sample users...");

  try {
    const db = new Database(FF_DB);

    // Create users
    const createUser = db.prepare(`
      INSERT OR REPLACE INTO users (id, email, password_hash, name, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);

    createUser.run(
      "user-sarah",
      "sarah@example.com",
      hashPassword("password123"),
      "Sarah Chen"
    );
    createUser.run(
      "user-marcus",
      "marcus@example.com",
      hashPassword("password123"),
      "Marcus Rivera"
    );
    createUser.run(
      "user-jordan",
      "jordan@example.com",
      hashPassword("password123"),
      "Jordan Williams"
    );

    // Create transactions
    const createTxn = db.prepare(`
      INSERT OR REPLACE INTO transactions (id, user_id, date, description, amount, category, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    // Sarah's transactions
    createTxn.run("txn-001", "user-sarah", "2026-03-21", "Salary deposit", 1538, "income");
    createTxn.run("txn-002", "user-sarah", "2026-03-21", "Coffee", -5, "personal");
    createTxn.run("txn-003", "user-sarah", "2026-03-21", "Adobe Creative Cloud", -79.99, "software");
    createTxn.run("txn-004", "user-sarah", "2026-03-22", "Freelance project", 500, "income");
    createTxn.run("txn-005", "user-sarah", "2026-03-23", "Dental checkup", -150, "medical");
    createTxn.run("txn-006", "user-sarah", "2026-03-24", "Equipment: Monitor stand", -89, "equipment");
    createTxn.run("txn-007", "user-sarah", "2026-03-25", "Groceries", -95, "groceries");

    // Marcus's transactions
    createTxn.run("txn-101", "user-marcus", "2026-03-21", "Client retainer", 3000, "income");
    createTxn.run("txn-102", "user-marcus", "2026-03-22", "Subcontractor", -800, "business");
    createTxn.run("txn-103", "user-marcus", "2026-03-23", "SaaS subscriptions", -180, "software");
    createTxn.run("txn-104", "user-marcus", "2026-03-24", "Airbnb meeting", -120, "travel");
    createTxn.run("txn-105", "user-marcus", "2026-03-25", "Delta flight", -280, "travel");
    createTxn.run("txn-106", "user-marcus", "2026-03-26", "Business dinner", -85, "meals");

    // Jordan's transactions
    createTxn.run("txn-201", "user-jordan", "2026-03-21", "Salary", 1250, "income");
    createTxn.run("txn-202", "user-jordan", "2026-03-21", "Credit card payment", -500, "debt");
    createTxn.run("txn-203", "user-jordan", "2026-03-22", "Coffee", -6, "personal");
    createTxn.run("txn-204", "user-jordan", "2026-03-23", "Therapy", -150, "medical");
    createTxn.run("txn-205", "user-jordan", "2026-03-24", "Fast food", -45, "personal");

    db.close();
    console.log("✅ Finance Friend: 3 users + 18 transactions loaded");
  } catch (error) {
    console.error("❌ Finance Friend load failed:", error.message);
  }
}

function loadTeamBoard() {
  console.log("📋 Loading Team Board sample data...");

  try {
    const db = new Database(BOARD_DB);

    // Create workspace
    const createWS = db.prepare(`
      INSERT OR REPLACE INTO workspaces (id, name, owner_id, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `);
    createWS.run("ws-001", "Finance Friend v3 Launch", "user-moriah");

    // Create board
    const createBoard = db.prepare(`
      INSERT OR REPLACE INTO boards (id, workspace_id, name, description, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `);
    createBoard.run(
      "board-001",
      "ws-001",
      "Phase 2 Implementation",
      "Finance Friend v3 Phase 2 roadmap",
      "user-moriah"
    );

    // Create columns
    const createCol = db.prepare(`
      INSERT OR REPLACE INTO columns (id, board_id, name, "order", created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);
    createCol.run("col-001", "board-001", "to-do", 1);
    createCol.run("col-002", "board-001", "in-progress", 2);
    createCol.run("col-003", "board-001", "review", 3);
    createCol.run("col-004", "board-001", "done", 4);

    // Create tasks
    const createTask = db.prepare(`
      INSERT OR REPLACE INTO tasks (id, board_id, column_id, title, description, status, priority, created_by, position, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    createTask.run(
      "task-001",
      "board-001",
      "col-001",
      "Implement Coach AI endpoints",
      "Create /api/coach/chat endpoints with Claude",
      "to-do",
      "high",
      "user-moriah",
      1
    );
    createTask.run(
      "task-002",
      "board-001",
      "col-001",
      "Build Tax Classification UI",
      "React component for transaction categorization",
      "to-do",
      "high",
      "user-moriah",
      2
    );
    createTask.run(
      "task-003",
      "board-001",
      "col-002",
      "Coach system prompt tuning",
      "Match Tina's voice and tone with feedback",
      "in-progress",
      "high",
      "user-moriah",
      1
    );
    createTask.run(
      "task-004",
      "board-001",
      "col-003",
      "Frontend health check",
      "Verify all services running and responsive",
      "review",
      "medium",
      "user-moriah",
      1
    );
    createTask.run(
      "task-005",
      "board-001",
      "col-004",
      "Scaffold Phase 2 implementation plan",
      "Complete documentation with timelines",
      "done",
      "high",
      "user-moriah",
      1
    );

    db.close();
    console.log("✅ Team Board: 1 workspace + 1 board + 5 tasks loaded");
  } catch (error) {
    console.error("❌ Team Board load failed:", error.message);
  }
}

console.log("🏔️ Loading sample data...\n");

switch (target) {
  case "finance":
    loadFinanceFriend();
    break;
  case "board":
    loadTeamBoard();
    break;
  case "all":
    loadFinanceFriend();
    loadTeamBoard();
    break;
  default:
    console.error("Usage: node load-sample-data.js [finance|board|all]");
    process.exit(1);
}

console.log("\n🎉 Sample data loaded successfully!");
