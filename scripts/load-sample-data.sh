#!/bin/bash

# Load sample data into Finance Friend v3 and Team Board
# Usage: ./scripts/load-sample-data.sh [finance|board|all]

set -e

TARGET=${1:-all}
FF_DB="/home/moriahkeeper/.openclaw/workspace/finance-friend-v3/backend/finance-friend.db"
BOARD_DB="/home/moriahkeeper/.openclaw/workspace/team-agent-board-backend/team_board.db"

echo "🏔️ Loading sample data..."

load_finance_friend() {
  echo "📊 Loading Finance Friend sample users..."
  
  # Create test users with realistic data
  sqlite3 "$FF_DB" <<EOF
-- Users
INSERT OR REPLACE INTO users (id, email, password_hash, name, created_at) VALUES
('user-sarah', 'sarah@example.com', '\$2b\$10\$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tvQe', 'Sarah Chen', datetime('now')),
('user-marcus', 'marcus@example.com', '\$2b\$10\$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tvQe', 'Marcus Rivera', datetime('now')),
('user-jordan', 'jordan@example.com', '\$2b\$10\$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tvQe', 'Jordan Williams', datetime('now'));

-- Sample transactions (Sarah's week)
INSERT OR REPLACE INTO transactions (id, user_id, date, description, amount, category, created_at) VALUES
('txn-001', 'user-sarah', '2026-03-21', 'Salary deposit', 1538, 'income', datetime('now')),
('txn-002', 'user-sarah', '2026-03-21', 'Coffee', -5, 'personal', datetime('now')),
('txn-003', 'user-sarah', '2026-03-21', 'Adobe Creative Cloud', -79.99, 'software', datetime('now')),
('txn-004', 'user-sarah', '2026-03-22', 'Freelance project', 500, 'income', datetime('now')),
('txn-005', 'user-sarah', '2026-03-23', 'Dental checkup', -150, 'medical', datetime('now')),
('txn-006', 'user-sarah', '2026-03-24', 'Equipment: Monitor stand', -89, 'equipment', datetime('now')),
('txn-007', 'user-sarah', '2026-03-25', 'Groceries', -95, 'groceries', datetime('now'));

-- Sample transactions (Marcus's week - complex)
INSERT OR REPLACE INTO transactions (id, user_id, date, description, amount, category, created_at) VALUES
('txn-101', 'user-marcus', '2026-03-21', 'Client retainer', 3000, 'income', datetime('now')),
('txn-102', 'user-marcus', '2026-03-22', 'Subcontractor', -800, 'business', datetime('now')),
('txn-103', 'user-marcus', '2026-03-23', 'SaaS subscriptions', -180, 'software', datetime('now')),
('txn-104', 'user-marcus', '2026-03-24', 'Airbnb meeting', -120, 'travel', datetime('now')),
('txn-105', 'user-marcus', '2026-03-25', 'Delta flight', -280, 'travel', datetime('now')),
('txn-106', 'user-marcus', '2026-03-26', 'Business dinner', -85, 'meals', datetime('now'));
EOF

  echo "✅ Finance Friend: 3 users + 13 transactions loaded"
}

load_team_board() {
  echo "📋 Loading Team Board sample workspace..."
  
  sqlite3 "$BOARD_DB" <<EOF
-- Workspace
INSERT OR REPLACE INTO workspaces (id, name, owner_id, created_at) VALUES
('ws-001', 'Finance Friend v3 Launch', 'user-moriah', datetime('now'));

-- Board with default columns
INSERT OR REPLACE INTO boards (id, workspace_id, name, description, created_by, created_at) VALUES
('board-001', 'ws-001', 'Phase 2 Implementation', 'Finance Friend v3 Phase 2 roadmap', 'user-moriah', datetime('now'));

-- Columns (created automatically by backend, but insert for completeness)
INSERT OR REPLACE INTO columns (id, board_id, name, "order", created_at) VALUES
('col-001', 'board-001', 'to-do', 1, datetime('now')),
('col-002', 'board-001', 'in-progress', 2, datetime('now')),
('col-003', 'board-001', 'review', 3, datetime('now')),
('col-004', 'board-001', 'done', 4, datetime('now'));

-- Sample tasks
INSERT OR REPLACE INTO tasks (id, board_id, column_id, title, description, status, priority, created_by, created_at, updated_at, position) VALUES
('task-001', 'board-001', 'col-001', 'Implement Coach AI endpoints', 'Create /api/coach/chat endpoints', 'to-do', 'high', 'user-moriah', datetime('now'), datetime('now'), 1),
('task-002', 'board-001', 'col-001', 'Build Tax Classification UI', 'React component for categories', 'to-do', 'high', 'user-moriah', datetime('now'), datetime('now'), 2),
('task-003', 'board-001', 'col-002', 'Coach system prompt tuning', 'Match Tinas voice and tone', 'in-progress', 'high', 'user-moriah', datetime('now'), datetime('now'), 1),
('task-004', 'board-001', 'col-003', 'Frontend health check', 'Verify all services running', 'review', 'medium', 'user-moriah', datetime('now'), datetime('now'), 1),
('task-005', 'board-001', 'col-004', 'Scaffold Phase 2 plan', 'Complete documentation', 'done', 'high', 'user-moriah', datetime('now'), datetime('now'), 1);
EOF

  echo "✅ Team Board: 1 workspace + 1 board + 5 tasks loaded"
}

case $TARGET in
  finance)
    load_finance_friend
    ;;
  board)
    load_team_board
    ;;
  all)
    load_finance_friend
    load_team_board
    ;;
  *)
    echo "Usage: $0 [finance|board|all]"
    exit 1
    ;;
esac

echo "🎉 Sample data loaded successfully!"
