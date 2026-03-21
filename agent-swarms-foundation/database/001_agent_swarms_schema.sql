-- Agent Swarms Foundation Schema
-- Persistent state for multi-agent coordination system
-- Created: March 21, 2026

-- ==============================================================================
-- TEAMS & AGENTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS agent_teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,           -- "content", "technical", "sales"
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agents (
  id SERIAL PRIMARY KEY,
  team_id INT NOT NULL REFERENCES agent_teams(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,                  -- "video_production", "copywriting"
  display_name VARCHAR(100),
  specialization TEXT,                        -- What this agent specializes in
  system_prompt TEXT,                         -- Full system prompt (critical)
  workspace_path VARCHAR(255) NOT NULL,       -- /agent-workspaces/{team}/{agent}
  memory_file VARCHAR(255),                   -- Where memory.md lives
  status VARCHAR(20) DEFAULT 'idle',          -- "idle", "working", "blocked"
  last_active TIMESTAMP,
  total_jobs_completed INT DEFAULT 0,
  quality_score FLOAT DEFAULT 0.0,            -- 0.0 to 1.0 based on Tina feedback
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, name)
);

CREATE INDEX idx_agents_team ON agents(team_id);
CREATE INDEX idx_agents_status ON agents(status);

-- ==============================================================================
-- JOB QUEUE & EXECUTION
-- ==============================================================================

CREATE TABLE IF NOT EXISTS agent_jobs (
  id SERIAL PRIMARY KEY,
  team_id INT NOT NULL REFERENCES agent_teams(id),
  agent_id INT REFERENCES agents(id),         -- NULL = unassigned
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,                          -- What's needed to start
  success_criteria TEXT,                      -- How to measure done
  status VARCHAR(20) DEFAULT 'pending',       -- pending, in_progress, blocked, complete, failed
  priority INT DEFAULT 5,                     -- 1-10, higher = more urgent
  assigned_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  estimated_hours FLOAT,
  actual_hours FLOAT,
  output_location VARCHAR(255),               -- Where results are saved
  output_summary TEXT,                        -- Agent's work summary
  depends_on INT[],                           -- Array of job IDs this depends on
  blocked_reason TEXT,                        -- Why is this blocked?
  blocked_since TIMESTAMP,
  tina_feedback TEXT,                         -- Tina's feedback on completed work
  tina_rating INT,                            -- 1-10 quality rating
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100)                     -- Who created this job (Tina, other agent)
);

CREATE INDEX idx_jobs_team ON agent_jobs(team_id);
CREATE INDEX idx_jobs_agent ON agent_jobs(agent_id);
CREATE INDEX idx_jobs_status ON agent_jobs(status);
CREATE INDEX idx_jobs_priority ON agent_jobs(priority DESC);

-- ==============================================================================
-- AGENT COMMUNICATIONS & HANDOFFS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS agent_messages (
  id SERIAL PRIMARY KEY,
  from_agent VARCHAR(50) NOT NULL,            -- Agent name (might not be in DB yet)
  to_agent VARCHAR(50),                       -- NULL = broadcast to team
  to_team VARCHAR(50),                        -- Can address whole team
  message TEXT NOT NULL,
  message_type VARCHAR(20),                   -- "handoff", "request", "update", "escalation", "status"
  job_id INT REFERENCES agent_jobs(id),
  status_code VARCHAR(20),                    -- "ready", "blocked", "waiting", "complete"
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);

CREATE INDEX idx_messages_to_agent ON agent_messages(to_agent);
CREATE INDEX idx_messages_to_team ON agent_messages(to_team);
CREATE INDEX idx_messages_job ON agent_messages(job_id);

-- ==============================================================================
-- AGENT WORKSPACES & MEMORY
-- ==============================================================================

CREATE TABLE IF NOT EXISTS agent_workspaces (
  id SERIAL PRIMARY KEY,
  agent_id INT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  workspace_path VARCHAR(255) NOT NULL UNIQUE,
  memory_location VARCHAR(255),               -- /agent-workspaces/{team}/{agent}/memory.md
  templates_location VARCHAR(255),            -- Where templates live
  past_work_location VARCHAR(255),            -- Where archive of jobs lives
  last_cleaned TIMESTAMP,
  disk_usage_mb INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agent_memory_entries (
  id SERIAL PRIMARY KEY,
  agent_id INT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  entry_type VARCHAR(50),                     -- "lesson_learned", "example", "pattern", "blocker"
  content TEXT NOT NULL,
  job_id INT REFERENCES agent_jobs(id),      -- Which job generated this insight
  priority INT DEFAULT 5,                     -- 1-10, higher = more important
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(agent_id, job_id, entry_type)
);

-- ==============================================================================
-- PERFORMANCE & LEARNING
-- ==============================================================================

CREATE TABLE IF NOT EXISTS agent_performance (
  id SERIAL PRIMARY KEY,
  agent_id INT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  metric_name VARCHAR(100),                   -- "jobs_completed", "avg_quality", "time_accuracy"
  metric_value FLOAT,
  period_date DATE,                           -- For tracking trends
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agent_feedback_log (
  id SERIAL PRIMARY KEY,
  job_id INT NOT NULL REFERENCES agent_jobs(id) ON DELETE CASCADE,
  agent_id INT NOT NULL REFERENCES agents(id),
  feedback_from VARCHAR(100),                 -- "tina", "other_agent", "system"
  feedback_text TEXT,
  rating INT,                                 -- 1-10
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- TEAM DASHBOARDS & REPORTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS team_status_snapshots (
  id SERIAL PRIMARY KEY,
  team_id INT NOT NULL REFERENCES agent_teams(id),
  snapshot_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_jobs INT,
  pending_jobs INT,
  in_progress_jobs INT,
  blocked_jobs INT,
  completed_jobs INT,
  avg_quality_score FLOAT,
  total_output_summary TEXT,                  -- JSON summary of outputs
  data JSONB                                  -- Full snapshot as JSON for flexibility
);

CREATE INDEX idx_team_snapshots_time ON team_status_snapshots(snapshot_time DESC);

-- ==============================================================================
-- AUDIT TRAIL
-- ==============================================================================

CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50),                     -- "job_created", "job_started", "job_complete", "feedback", "blocker"
  resource_type VARCHAR(50),                  -- "job", "agent", "message"
  resource_id INT,
  actor VARCHAR(100),                         -- Who triggered this (Tina, agent name, system)
  actor_type VARCHAR(20),                     -- "human", "agent", "system"
  details JSONB,                              -- Full event details
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_resource ON audit_log(resource_type, resource_id);
CREATE INDEX idx_audit_actor ON audit_log(actor);

-- ==============================================================================
-- SEED DATA: Default Teams
-- ==============================================================================

INSERT INTO agent_teams (name, description) VALUES
  ('content', 'Content creation: video, graphics, copywriting, course structure'),
  ('technical', 'Backend, frontend, mobile, DevOps, integrations'),
  ('sales', 'Copywriting, marketing, customer success, revenue')
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- VIEWS FOR DASHBOARD
-- ==============================================================================

CREATE OR REPLACE VIEW v_agent_status AS
SELECT 
  a.id,
  a.name,
  t.name as team,
  a.status,
  COUNT(CASE WHEN j.status = 'in_progress' THEN 1 END) as jobs_in_progress,
  COUNT(CASE WHEN j.status = 'blocked' THEN 1 END) as jobs_blocked,
  COUNT(CASE WHEN j.status = 'pending' THEN 1 END) as jobs_pending,
  a.quality_score,
  a.total_jobs_completed,
  a.last_active
FROM agents a
LEFT JOIN agent_teams t ON a.team_id = t.id
LEFT JOIN agent_jobs j ON a.id = j.agent_id AND j.status IN ('in_progress', 'blocked', 'pending')
GROUP BY a.id, a.name, t.name, a.status, a.quality_score, a.total_jobs_completed, a.last_active;

CREATE OR REPLACE VIEW v_team_health AS
SELECT 
  t.id,
  t.name,
  COUNT(DISTINCT a.id) as num_agents,
  COUNT(CASE WHEN j.status = 'complete' THEN 1 END) as completed_jobs,
  COUNT(CASE WHEN j.status = 'blocked' THEN 1 END) as blocked_jobs,
  AVG(a.quality_score) as avg_quality,
  MAX(j.updated_at) as last_activity
FROM agent_teams t
LEFT JOIN agents a ON t.id = a.team_id
LEFT JOIN agent_jobs j ON t.id = j.team_id
GROUP BY t.id, t.name;

CREATE OR REPLACE VIEW v_job_dependencies AS
SELECT 
  j.id,
  j.title,
  j.status,
  unnest(j.depends_on) as depends_on_id
FROM agent_jobs j
WHERE j.depends_on IS NOT NULL AND array_length(j.depends_on, 1) > 0;

-- ==============================================================================
-- FUNCTIONS FOR COORDINATION
-- ==============================================================================

CREATE OR REPLACE FUNCTION get_next_job_for_agent(agent_name VARCHAR)
RETURNS TABLE(job_id INT, title VARCHAR, description TEXT, requirements TEXT) AS $$
SELECT 
  j.id,
  j.title,
  j.description,
  j.requirements
FROM agent_jobs j
JOIN agents a ON j.agent_id = a.id
WHERE a.name = agent_name
  AND j.status = 'pending'
  AND (j.depends_on IS NULL OR 
       NOT EXISTS (
         SELECT 1 FROM agent_jobs dep 
         WHERE dep.id = ANY(j.depends_on) AND dep.status != 'complete'
       ))
ORDER BY j.priority DESC, j.created_at ASC
LIMIT 1;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION complete_job(
  job_id INT,
  output_location VARCHAR,
  output_summary TEXT,
  actual_hours_spent FLOAT
) RETURNS BOOLEAN AS $$
UPDATE agent_jobs
SET 
  status = 'complete',
  completed_at = CURRENT_TIMESTAMP,
  output_location = complete_job.output_location,
  output_summary = complete_job.output_summary,
  actual_hours = complete_job.actual_hours_spent,
  updated_at = CURRENT_TIMESTAMP
WHERE id = job_id;

SELECT TRUE;
$$ LANGUAGE SQL;

-- ==============================================================================
-- CREATED SUCCESSFULLY
-- ==============================================================================

-- Schema ready for agent swarms coordination
-- Next: Populate teams, create initial agents, seed system prompts
