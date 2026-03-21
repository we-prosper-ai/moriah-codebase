-- Finance Friend v3 Database Schema Extensions
-- Builds on top of existing v2 schema (users, sessions, statements, transactions, conversations)
-- Run these migrations to extend the database for v3 features

-- ═══════════════════════════════════════════════════════════════════════════════
-- Time Tracking
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS time_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
  
  date DATE NOT NULL,
  hours_worked REAL NOT NULL,        -- e.g., 8.5 for 8.5 hours
  minutes_worked INTEGER,             -- Alternative: store minutes for precision
  
  project_name TEXT,                 -- e.g., "Client A", "Admin", "Learning"
  category TEXT NOT NULL,             -- 'billable', 'admin', 'learning', 'other'
  description TEXT,                  -- Optional notes
  
  billable_rate REAL,                -- Hourly rate for this entry (if billable)
  revenue_generated REAL,            -- = hours_worked * billable_rate (if billable)
  
  tags TEXT,                         -- JSON array of tags (for searching)
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, date, project_name),
  CHECK(hours_worked > 0 AND hours_worked <= 24),
  CHECK(category IN ('billable', 'admin', 'learning', 'other'))
);

CREATE INDEX idx_time_entries_user_date ON time_entries(user_id, date DESC);
CREATE INDEX idx_time_entries_category ON time_entries(user_id, category);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Energy Tracking
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS energy_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
  
  date DATE NOT NULL,
  energy_level INTEGER NOT NULL,    -- 1-5 scale (1=exhausted, 5=energized)
  
  notes TEXT,                        -- Optional: what affected energy?
                                     -- e.g., "Long meeting + no break"
  
  factors TEXT,                      -- JSON array of factors
                                     -- e.g., ["meetings", "no_exercise", "good_sleep"]
  
  time_of_day TEXT,                 -- 'morning', 'afternoon', 'evening'
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, date, time_of_day),
  CHECK(energy_level >= 1 AND energy_level <= 5),
  CHECK(time_of_day IN ('morning', 'afternoon', 'evening'))
);

CREATE INDEX idx_energy_logs_user_date ON energy_logs(user_id, date DESC);
CREATE INDEX idx_energy_logs_level ON energy_logs(user_id, energy_level);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Financial Goals
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS financial_goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  goal_text TEXT NOT NULL,           -- e.g., "Earn $5K/mo in 40h/week"
  
  target_money REAL,                 -- Monthly income goal
  target_hours REAL,                 -- Hours per week
  target_energy INTEGER,             -- 1-10 scale
  target_freedom INTEGER,            -- 1-10 scale
  
  principles TEXT,                   -- JSON array of principles
                                     -- e.g., ["systems", "leverage", "health"]
  
  priority INTEGER DEFAULT 0,        -- 1=primary goal, 2=secondary, etc.
  status TEXT NOT NULL DEFAULT 'active',  -- 'active', 'achieved', 'abandoned', 'paused'
  
  progress_percentage INTEGER DEFAULT 0, -- 0-100%
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CHECK(status IN ('active', 'achieved', 'abandoned', 'paused')),
  CHECK(progress_percentage >= 0 AND progress_percentage <= 100)
);

CREATE INDEX idx_financial_goals_user_status ON financial_goals(user_id, status);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Budget Plans (Scenarios)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS budget_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  financial_goal_id INTEGER REFERENCES financial_goals(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,                -- e.g., "Hire support + raise prices"
  description TEXT,
  
  -- Target metrics
  target_money REAL,
  target_hours REAL,
  target_energy INTEGER,
  target_freedom INTEGER,
  
  -- Current baseline (for comparison)
  baseline_money REAL,
  baseline_hours REAL,
  baseline_energy INTEGER,
  baseline_freedom INTEGER,
  
  -- Tradeoffs & analysis
  tradeoff_analysis TEXT,            -- Rich markdown/text explanation
  
  -- Execution
  status TEXT DEFAULT 'draft',       -- 'draft', 'active', 'completed', 'abandoned'
  selected_at TIMESTAMP,             -- When user committed to this plan
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CHECK(status IN ('draft', 'active', 'completed', 'abandoned'))
);

CREATE INDEX idx_budget_plans_user_status ON budget_plans(user_id, status);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Budget Scenarios (Alternate scenarios under a plan)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS budget_scenarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  budget_plan_id INTEGER NOT NULL REFERENCES budget_plans(id) ON DELETE CASCADE,
  
  scenario_name TEXT NOT NULL,       -- e.g., "Option A: Raise prices"
  scenario_description TEXT,
  
  -- Projected metrics
  projected_money REAL,
  projected_hours REAL,
  projected_energy INTEGER,
  projected_freedom INTEGER,
  
  -- Tradeoff analysis
  tradeoff_summary TEXT,             -- Brief explanation (1-2 sentences)
  tradeoff_analysis TEXT,            -- Full explanation with ROI, risks
  
  -- Feasibility scoring
  feasibility_score INTEGER,         -- 1-10 scale
  impact_score INTEGER,              -- 1-10 scale (how much it improves freedom)
  overall_score INTEGER,             -- 1-10 (feasibility + impact)
  
  success_probability INTEGER,       -- Estimated % chance of success
  
  -- Risk assessment
  risks TEXT,                        -- JSON array of potential risks
  
  sort_order INTEGER DEFAULT 0,      -- Display order
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(budget_plan_id, scenario_name),
  CHECK(feasibility_score >= 1 AND feasibility_score <= 10),
  CHECK(impact_score >= 1 AND impact_score <= 10),
  CHECK(overall_score >= 1 AND overall_score <= 10),
  CHECK(success_probability >= 0 AND success_probability <= 100)
);

CREATE INDEX idx_budget_scenarios_plan ON budget_scenarios(budget_plan_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Tax Classifications
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS tax_classifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id INTEGER NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  
  tax_category TEXT NOT NULL,        -- 'deduction', 'capgains', 'capital_loss',
                                     -- 'retirement_contrib', 'quarterly_est', 'other'
  
  subcategory TEXT,                  -- e.g., 'office_equipment', 'software', 'meals'
  
  deductible_amount REAL,            -- If partial deduction
  
  ml_confidence REAL,                -- 0-1 scale: AI's confidence in this classification
  user_confirmed BOOLEAN DEFAULT FALSE,
  user_notes TEXT,
  
  tax_year INTEGER,                  -- Year this applies to
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(transaction_id, tax_category),
  CHECK(ml_confidence >= 0 AND ml_confidence <= 1),
  CHECK(tax_year >= 2020)
);

CREATE INDEX idx_tax_classifications_user ON tax_classifications(transaction_id);
CREATE INDEX idx_tax_classifications_category ON tax_classifications(tax_category);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Four Currencies Dashboard Snapshots
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS currency_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  snapshot_date DATE NOT NULL,       -- Week of, month of, etc.
  period_type TEXT NOT NULL,         -- 'daily', 'weekly', 'monthly'
  
  -- Money metrics
  money_earned REAL,
  money_spent REAL,
  money_invested REAL,
  
  -- Time metrics
  hours_billable REAL,
  hours_admin REAL,
  hours_learning REAL,
  hours_total REAL,
  
  -- Energy metrics
  energy_average REAL,               -- 1-5 scale average
  energy_min REAL,
  energy_max REAL,
  
  -- Freedom score
  freedom_score REAL,                -- 1-10 scale
  freedom_components TEXT,           -- JSON breakdown
  
  -- Correlations & insights
  insights TEXT,                     -- JSON array of AI-generated insights
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, snapshot_date, period_type)
);

CREATE INDEX idx_currency_snapshots_user_date ON currency_snapshots(user_id, snapshot_date DESC);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Bank Reconciliation Tracking
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS bank_reconciliations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  statement_id INTEGER NOT NULL REFERENCES statements(id) ON DELETE CASCADE,
  
  reconciled_date TIMESTAMP,
  balance_matched BOOLEAN,
  bank_balance REAL,
  calculated_balance REAL,
  discrepancy_amount REAL,
  
  notes TEXT,
  status TEXT DEFAULT 'pending',     -- 'pending', 'in_progress', 'complete', 'error'
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CHECK(status IN ('pending', 'in_progress', 'complete', 'error'))
);

CREATE INDEX idx_bank_reconciliations_user ON bank_reconciliations(user_id, reconciled_date DESC);

-- ═══════════════════════════════════════════════════════════════════════════════
-- User Preferences & Settings
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Display preferences
  currency_symbol TEXT DEFAULT '$',
  theme TEXT DEFAULT 'light',        -- 'light', 'dark', 'auto'
  
  -- Financial preferences
  tax_year_start_month INTEGER DEFAULT 1, -- 1-12
  billable_rate REAL,
  
  -- Communication
  coaching_frequency TEXT,           -- 'daily', 'weekly', 'bi-weekly', 'monthly'
  insights_enabled BOOLEAN DEFAULT TRUE,
  
  -- Privacy
  share_anonymized_data BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Pragmatic View: Weekly Four Currencies Summary (for dashboard)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE VIEW v_weekly_summary AS
SELECT
  u.id as user_id,
  DATE(strftime('%Y-%m-%d', 'now', 'start of week', '-1 day')) as week_of,
  
  -- Money (from transactions this week)
  COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as money_earned,
  COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as money_spent,
  
  -- Time (from time_entries this week)
  COALESCE(SUM(CASE WHEN te.category = 'billable' THEN te.hours_worked ELSE 0 END), 0) as hours_billable,
  COALESCE(SUM(te.hours_worked), 0) as hours_total,
  
  -- Energy (from energy_logs this week)
  COALESCE(AVG(CASE WHEN el.date >= DATE('now', 'start of week', '-1 day') THEN el.energy_level ELSE NULL END), 3) as energy_average,
  
  -- Freedom (calculated)
  CASE
    WHEN COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) > 0 THEN 5
    ELSE 3
  END as freedom_score
  
FROM users u
LEFT JOIN transactions t ON u.id = t.session_id AND DATE(t.date) >= DATE('now', 'start of week', '-1 day')
LEFT JOIN time_entries te ON u.id = te.user_id AND DATE(te.date) >= DATE('now', 'start of week', '-1 day')
LEFT JOIN energy_logs el ON u.id = el.user_id AND DATE(el.date) >= DATE('now', 'start of week', '-1 day')
GROUP BY u.id;

-- ═══════════════════════════════════════════════════════════════════════════════
-- Data Validation & Trigger Examples
-- ═══════════════════════════════════════════════════════════════════════════════

-- Auto-update budget_plan.updated_at
CREATE TRIGGER update_budget_plan_timestamp
AFTER UPDATE ON budget_plans
FOR EACH ROW
BEGIN
  UPDATE budget_plans SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Auto-calculate revenue_generated on time_entries
CREATE TRIGGER calculate_time_entry_revenue
BEFORE INSERT ON time_entries
FOR EACH ROW
BEGIN
  UPDATE time_entries
  SET revenue_generated = CASE
    WHEN NEW.category = 'billable' AND NEW.billable_rate > 0
    THEN NEW.hours_worked * NEW.billable_rate
    ELSE 0
  END
  WHERE id = NEW.id;
END;

