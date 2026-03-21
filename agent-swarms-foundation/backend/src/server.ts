import express, { Express, Request, Response } from 'express';
import { Pool, PoolClient } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3888;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'antigravity',
  user: process.env.DB_USER || 'moriah',
  password: process.env.DB_PASSWORD || '',
});

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==============================================================================
// HEALTH & STATUS
// ==============================================================================

app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      timestamp: result.rows[0].now,
      system: 'agent-swarms-foundation',
      version: '1.0.0-alpha',
      phase: 'Phase 1: Foundation'
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: String(error) });
  }
});

// ==============================================================================
// AGENT ENDPOINTS
// ==============================================================================

// Get agent info
app.get('/api/agents/:name', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const result = await pool.query(
      `SELECT a.*, t.name as team_name 
       FROM agents a 
       JOIN agent_teams t ON a.team_id = t.id 
       WHERE a.name = $1`,
      [name]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Get agent's assigned jobs
app.get('/api/agents/:name/jobs', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const result = await pool.query(
      `SELECT j.* FROM agent_jobs j
       JOIN agents a ON j.agent_id = a.id
       WHERE a.name = $1
       ORDER BY j.priority DESC, j.created_at ASC`,
      [name]
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Get next available job for agent
app.get('/api/agents/:name/next-job', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const result = await pool.query(
      'SELECT * FROM get_next_job_for_agent($1)',
      [name]
    );
    
    if (result.rows.length === 0) {
      return res.json({ message: 'No jobs available', job: null });
    }
    
    res.json({ job: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Start working on a job
app.post('/api/agents/:name/jobs/:job_id/start', async (req: Request, res: Response) => {
  try {
    const { name, job_id } = req.params;
    
    // Verify agent owns this job
    const agentCheck = await pool.query(
      `SELECT a.id FROM agents a WHERE a.name = $1`,
      [name]
    );
    
    if (agentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const agentId = agentCheck.rows[0].id;
    
    // Update job status
    const result = await pool.query(
      `UPDATE agent_jobs 
       SET status = 'in_progress', started_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND agent_id = $2
       RETURNING *`,
      [job_id, agentId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found or not assigned to agent' });
    }
    
    res.json({ status: 'started', job: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Mark job as blocked
app.post('/api/agents/:name/jobs/:job_id/block', async (req: Request, res: Response) => {
  try {
    const { name, job_id } = req.params;
    const { reason } = req.body;
    
    const result = await pool.query(
      `UPDATE agent_jobs 
       SET status = 'blocked', 
           blocked_reason = $3, 
           blocked_since = NOW(),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [job_id, name, reason]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json({ status: 'blocked', job: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Complete a job
app.post('/api/agents/:name/jobs/:job_id/complete', async (req: Request, res: Response) => {
  try {
    const { name, job_id } = req.params;
    const { output_location, output_summary, actual_hours } = req.body;
    
    const result = await pool.query(
      `UPDATE agent_jobs 
       SET status = 'complete',
           completed_at = NOW(),
           output_location = $3,
           output_summary = $4,
           actual_hours = $5,
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [job_id, name, output_location, output_summary, actual_hours]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json({ status: 'completed', job: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ==============================================================================
// JOB QUEUE ENDPOINTS
// ==============================================================================

// List all jobs (Tina's dashboard)
app.get('/api/jobs', async (req: Request, res: Response) => {
  try {
    const { status, team, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT j.*, t.name as team_name FROM agent_jobs j JOIN agent_teams t ON j.team_id = t.id WHERE 1=1';
    const params: any[] = [];
    
    if (status) {
      query += ` AND j.status = $${params.length + 1}`;
      params.push(status);
    }
    
    if (team) {
      query += ` AND t.name = $${params.length + 1}`;
      params.push(team);
    }
    
    query += ` ORDER BY j.priority DESC, j.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Get single job
app.get('/api/jobs/:job_id', async (req: Request, res: Response) => {
  try {
    const { job_id } = req.params;
    const result = await pool.query(
      `SELECT j.*, t.name as team_name 
       FROM agent_jobs j 
       JOIN agent_teams t ON j.team_id = t.id 
       WHERE j.id = $1`,
      [job_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Create new job (for Tina)
app.post('/api/jobs', async (req: Request, res: Response) => {
  try {
    const { team, agent, title, description, requirements, success_criteria, priority = 5, estimated_hours } = req.body;
    
    // Get team ID
    const teamResult = await pool.query(
      'SELECT id FROM agent_teams WHERE name = $1',
      [team]
    );
    
    if (teamResult.rows.length === 0) {
      return res.status(400).json({ error: 'Team not found' });
    }
    
    const teamId = teamResult.rows[0].id;
    
    // Get agent ID if specified
    let agentId = null;
    if (agent) {
      const agentResult = await pool.query(
        'SELECT id FROM agents WHERE name = $1 AND team_id = $2',
        [agent, teamId]
      );
      if (agentResult.rows.length > 0) {
        agentId = agentResult.rows[0].id;
      }
    }
    
    const result = await pool.query(
      `INSERT INTO agent_jobs (team_id, agent_id, title, description, requirements, success_criteria, priority, estimated_hours, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'tina')
       RETURNING *`,
      [teamId, agentId, title, description, requirements, success_criteria, priority, estimated_hours]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ==============================================================================
// TEAM STATUS ENDPOINTS
// ==============================================================================

// Get team status
app.get('/api/teams/:team/status', async (req: Request, res: Response) => {
  try {
    const { team } = req.params;
    const result = await pool.query(
      'SELECT * FROM v_team_health WHERE name = $1',
      [team]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Get team job summary
app.get('/api/teams/:team/jobs', async (req: Request, res: Response) => {
  try {
    const { team } = req.params;
    const result = await pool.query(
      `SELECT j.* FROM agent_jobs j
       JOIN agent_teams t ON j.team_id = t.id
       WHERE t.name = $1
       ORDER BY j.priority DESC, j.created_at DESC`,
      [team]
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ==============================================================================
// ERROR HANDLING
// ==============================================================================

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ==============================================================================
// START SERVER
// ==============================================================================

app.listen(PORT, () => {
  console.log(`🏔️ Agent Swarms Foundation Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Job Queue: http://localhost:${PORT}/api/jobs`);
  console.log(`Teams: http://localhost:${PORT}/api/teams`);
});

export default app;
