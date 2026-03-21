# Finance Friend v3 — Phase 1 Implementation Plan
**Target Duration:** 2-3 weeks  
**Objective:** Core features ready for beta testing  
**Built by:** Moriah

---

## 🎯 Phase 1 Scope

### What We're Building

1. **Database schema** — Tables for time, energy, goals, budgets, tax, snapshots
2. **Four Currencies Dashboard** — Main UI showing money/time/energy/freedom
3. **Tax Classification Engine** — ML-backed auto-classification + manual override
4. **Coach chatbot upgrade** — Tina's voice + context-aware responses
5. **Budget Scenario Builder** — Simple version (no complex modeling yet)

### What We're NOT Building (Phase 2+)

- Bank integration (Plaid) — Coming Phase 2
- Mobile app — Web responsive first
- Multi-currency support — Coming Phase 3
- Public benchmarking — Coming Phase 3
- Team sharing — Coming Phase 3

---

## 📋 Week-by-Week Breakdown

### Week 1: Database & Data Models

**Goal:** Get data layer working. User can log time + energy, system computes snapshots.

#### Day 1-2: Schema Migration

```bash
# In the finance-friend repo:

# 1. Backup existing DB
cp server/finance-friend.db server/finance-friend.db.backup

# 2. Create migration file
touch server/migrations/001_add_v3_tables.sql

# 3. Content: Copy FINANCE_FRIEND_V3_DATABASE_SCHEMA.sql content into migration

# 4. Run migration on startup (in db.js)
```

**Update `server/db.js`:**

```javascript
export function runMigrations() {
  const db = getDb();
  
  // List of migration files
  const migrations = [
    'migrations/001_add_v3_tables.sql',
  ];
  
  const migrationsRun = db.prepare(`
    SELECT name FROM migrations_run
  `).all();
  
  const completed = migrationsRun.map(m => m.name);
  
  for (const migration of migrations) {
    if (!completed.includes(migration)) {
      const sql = fs.readFileSync(
        path.join(__dirname, migration), 
        'utf8'
      );
      db.exec(sql);
      db.prepare('INSERT INTO migrations_run (name) VALUES (?)').run(migration);
      console.log(`✓ Migration: ${migration}`);
    }
  }
}

// Call at startup:
runMigrations();
```

#### Day 2-3: Seed Data Functions

```javascript
// In server/db.js

export function insertTimeEntry(userId, { date, hoursWorked, projectName, category, description, billableRate }) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO time_entries 
    (user_id, date, hours_worked, project_name, category, description, billable_rate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(userId, date, hoursWorked, projectName, category, description, billableRate);
  return result.lastInsertRowid;
}

export function insertEnergyLog(userId, { date, energyLevel, notes, timeOfDay }) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO energy_logs (user_id, date, energy_level, notes, time_of_day)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(userId, date, energyLevel, notes, timeOfDay);
  return result.lastInsertRowid;
}

export function getWeeklySummary(userId, weekOf) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM v_weekly_summary WHERE user_id = ? AND week_of = ?
  `).get(userId, weekOf);
}

export function getFinancialGoal(userId) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM financial_goals 
    WHERE user_id = ? AND status = 'active'
    ORDER BY priority ASC
    LIMIT 1
  `).get(userId);
}
```

#### Day 3-4: API Endpoints (v3)

```javascript
// Add to server/server.js

// ─── Time Entries ──────────────────────────────────────

app.post('/api/v3/time-entries', (req, res) => {
  try {
    const userId = getLoggedInUser(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    
    const { date, hoursWorked, projectName, category, description, billableRate } = req.body;
    
    if (!date || hoursWorked <= 0) {
      return res.status(400).json({ error: 'Invalid time entry' });
    }
    
    const entryId = insertTimeEntry(userId, {
      date, hoursWorked, projectName, category, description, billableRate
    });
    
    res.json({ success: true, entryId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v3/time-entries', (req, res) => {
  try {
    const userId = getLoggedInUser(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    
    const { startDate, endDate, category } = req.query;
    
    let query = 'SELECT * FROM time_entries WHERE user_id = ?';
    const params = [userId];
    
    if (startDate) { query += ' AND date >= ?'; params.push(startDate); }
    if (endDate) { query += ' AND date <= ?'; params.push(endDate); }
    if (category) { query += ' AND category = ?'; params.push(category); }
    
    query += ' ORDER BY date DESC';
    
    const entries = getDb().prepare(query).all(...params);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Energy Logs ───────────────────────────────────────

app.post('/api/v3/energy-logs', (req, res) => {
  try {
    const userId = getLoggedInUser(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    
    const { date, energyLevel, notes, timeOfDay } = req.body;
    
    if (!date || energyLevel < 1 || energyLevel > 5) {
      return res.status(400).json({ error: 'Invalid energy log' });
    }
    
    const logId = insertEnergyLog(userId, { date, energyLevel, notes, timeOfDay });
    res.json({ success: true, logId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v3/energy-logs', (req, res) => {
  try {
    const userId = getLoggedInUser(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    
    const { startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM energy_logs WHERE user_id = ?';
    const params = [userId];
    
    if (startDate) { query += ' AND date >= ?'; params.push(startDate); }
    if (endDate) { query += ' AND date <= ?'; params.push(endDate); }
    
    query += ' ORDER BY date DESC';
    
    const logs = getDb().prepare(query).all(...params);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Weekly Summary (Four Currencies) ──────────────────

app.get('/api/v3/weekly-summary', (req, res) => {
  try {
    const userId = getLoggedInUser(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    
    const weekOf = req.query.weekOf || new Date().toISOString().split('T')[0];
    const summary = getWeeklySummary(userId, weekOf);
    
    res.json(summary || {
      message: 'No data for this week yet',
      weekOf,
      suggested_action: 'Log time and energy to see summary'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Week 2: Frontend Dashboard + Coach Integration

**Goal:** User sees Four Currencies dashboard. Coach responds with Tina's voice.

#### Day 1-2: Dashboard Frontend

```html
<!-- In client/index.html, add new page: -->

<div id="page-dashboard" class="page active">
  <div class="dashboard-container">
    
    <div class="dashboard-header">
      <h2>Your Week at a Glance</h2>
      <p id="week-of">Week of Mar 17, 2026</p>
    </div>
    
    <!-- Four Currencies Cards -->
    <div class="currencies-grid">
      
      <div class="currency-card money">
        <div class="currency-icon">💰</div>
        <div class="currency-label">Money</div>
        <div class="currency-value" id="money-earned">$3,450</div>
        <div class="currency-change positive">▲ +$320 (10%)</div>
        <div class="currency-subtitle">vs last week</div>
        <button onclick="showCurrencyDetail('money')" class="currency-detail-btn">View</button>
      </div>
      
      <div class="currency-card time">
        <div class="currency-icon">⏱️</div>
        <div class="currency-label">Time</div>
        <div class="currency-value" id="hours-total">38h</div>
        <div class="currency-change positive">▼ -4h (9%)</div>
        <div class="currency-subtitle">vs goal</div>
        <button onclick="showCurrencyDetail('time')" class="currency-detail-btn">View</button>
      </div>
      
      <div class="currency-card energy">
        <div class="currency-icon">⚡</div>
        <div class="currency-label">Energy</div>
        <div class="currency-value" id="energy-avg">72%</div>
        <div class="currency-change positive">▲ +8% (12%)</div>
        <div class="currency-subtitle">vs average</div>
        <button onclick="showCurrencyDetail('energy')" class="currency-detail-btn">View</button>
      </div>
      
      <div class="currency-card freedom">
        <div class="currency-icon">🕊️</div>
        <div class="currency-label">Freedom</div>
        <div class="currency-value" id="freedom-score">7.1</div>
        <div class="currency-change positive">▲ +0.5 (improving!)</div>
        <div class="currency-subtitle">out of 10</div>
        <button onclick="showCurrencyDetail('freedom')" class="currency-detail-btn">View</button>
      </div>
      
    </div>
    
    <!-- Freedom Score Explanation -->
    <div class="freedom-explanation">
      <h3>What's Driving Your Freedom?</h3>
      <ul id="freedom-factors">
        <li>✓ You worked fewer hours (-4h)</li>
        <li>✓ Your energy improved (+8%)</li>
        <li>✓ You earned more money (+$320)</li>
      </ul>
    </div>
    
    <!-- Quick Action Buttons -->
    <div class="quick-actions">
      <button onclick="openPage('log-time')" class="btn btn-primary">+ Log Time</button>
      <button onclick="openPage('log-energy')" class="btn btn-primary">+ Log Energy</button>
      <button onclick="openPage('budget')" class="btn btn-secondary">View Budget</button>
      <button onclick="openPage('coach')" class="btn btn-secondary">Ask Coach</button>
    </div>
    
  </div>
</div>

<!-- Page: Log Time Entry -->
<div id="page-log-time" class="page">
  <form onsubmit="submitTimeEntry(event)" class="form-container">
    <h2>Log Time</h2>
    
    <label>Date</label>
    <input type="date" id="time-date" required value="" />
    
    <label>Hours Worked</label>
    <input type="number" id="time-hours" step="0.5" min="0" max="24" placeholder="8.5" required />
    
    <label>Category</label>
    <select id="time-category" required>
      <option value="billable">Billable Work</option>
      <option value="admin">Admin</option>
      <option value="learning">Learning</option>
      <option value="other">Other</option>
    </select>
    
    <label>Project Name (Optional)</label>
    <input type="text" id="time-project" placeholder="Client A, Learning, etc." />
    
    <label>Description (Optional)</label>
    <textarea id="time-description" placeholder="What did you work on?"></textarea>
    
    <label>Billable Rate (if applicable)</label>
    <input type="number" id="time-rate" step="5" placeholder="$75" />
    
    <button type="submit" class="btn btn-primary">Save Time Entry</button>
    <button type="button" onclick="closePage()" class="btn btn-ghost">Cancel</button>
  </form>
</div>

<!-- Page: Log Energy -->
<div id="page-log-energy" class="page">
  <form onsubmit="submitEnergyLog(event)" class="form-container">
    <h2>How's Your Energy?</h2>
    
    <label>Date</label>
    <input type="date" id="energy-date" required />
    
    <label>Energy Level</label>
    <div class="energy-scale">
      <div class="energy-radio">
        <input type="radio" name="energy" value="1" id="energy-1" />
        <label for="energy-1">😫 Exhausted</label>
      </div>
      <div class="energy-radio">
        <input type="radio" name="energy" value="2" id="energy-2" />
        <label for="energy-2">😕 Tired</label>
      </div>
      <div class="energy-radio">
        <input type="radio" name="energy" value="3" id="energy-3" />
        <label for="energy-3">😐 Okay</label>
      </div>
      <div class="energy-radio">
        <input type="radio" name="energy" value="4" id="energy-4" />
        <label for="energy-4">🙂 Good</label>
      </div>
      <div class="energy-radio">
        <input type="radio" name="energy" value="5" id="energy-5" />
        <label for="energy-5">🤩 Energized</label>
      </div>
    </div>
    
    <label>Time of Day</label>
    <select id="energy-time">
      <option value="morning">Morning</option>
      <option value="afternoon" selected>Afternoon</option>
      <option value="evening">Evening</option>
    </select>
    
    <label>Notes (Optional)</label>
    <textarea id="energy-notes" placeholder="What affected your energy? (e.g., good sleep, long meetings)"></textarea>
    
    <button type="submit" class="btn btn-primary">Save Energy Log</button>
    <button type="button" onclick="closePage()" class="btn btn-ghost">Cancel</button>
  </form>
</div>
```

#### Day 2-3: Dashboard JavaScript

```javascript
// Add to client/app.js

// ─── Dashboard Data Loading ────────────────────────────────────

async function loadDashboard() {
  try {
    const res = await fetch('/api/v3/weekly-summary');
    const summary = await res.json();
    
    // Update currency cards
    document.getElementById('money-earned').textContent = 
      `$${(summary.money_earned || 0).toFixed(2)}`;
    
    document.getElementById('hours-total').textContent = 
      `${(summary.hours_total || 0).toFixed(1)}h`;
    
    document.getElementById('energy-avg').textContent = 
      `${(summary.energy_average || 0).toFixed(0) * 20}%`;  // Convert 1-5 to %
    
    document.getElementById('freedom-score').textContent = 
      `${(summary.freedom_score || 0).toFixed(1)}/10`;
    
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}

// ─── Time Entry Submission ─────────────────────────────────────

async function submitTimeEntry(event) {
  event.preventDefault();
  
  const timeEntry = {
    date: document.getElementById('time-date').value,
    hoursWorked: parseFloat(document.getElementById('time-hours').value),
    projectName: document.getElementById('time-project').value,
    category: document.getElementById('time-category').value,
    description: document.getElementById('time-description').value,
    billableRate: parseFloat(document.getElementById('time-rate').value) || null,
  };
  
  try {
    const res = await fetch('/api/v3/time-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(timeEntry),
    });
    
    if (res.ok) {
      alert('✓ Time entry saved!');
      closePage();
      loadDashboard();
    } else {
      alert('Error saving time entry');
    }
  } catch (error) {
    console.error('Failed to save time entry:', error);
  }
}

// ─── Energy Log Submission ─────────────────────────────────────

async function submitEnergyLog(event) {
  event.preventDefault();
  
  const energyLog = {
    date: document.getElementById('energy-date').value,
    energyLevel: parseInt(document.querySelector('input[name="energy"]:checked').value),
    timeOfDay: document.getElementById('energy-time').value,
    notes: document.getElementById('energy-notes').value,
  };
  
  try {
    const res = await fetch('/api/v3/energy-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(energyLog),
    });
    
    if (res.ok) {
      alert('✓ Energy logged!');
      closePage();
      loadDashboard();
    } else {
      alert('Error saving energy log');
    }
  } catch (error) {
    console.error('Failed to save energy log:', error);
  }
}
```

#### Day 3-4: Coach Integration (Tina's Voice)

```javascript
// Add to server/server.js

// Use Tina's exact phrases from memory files
const COACH_PHRASES = {
  greeting: `Hi there. I'm here to help you think about your business through the lens of your principles and the fundamentals.`,
  
  currencies: `Remember: time, energy, and finances are all currencies. People get stuck because they keep chasing money at the cost of time and energy.`,
  
  principles: `Your principles inform your priorities. Your priorities inform your actions. Everything connects.`,
  
  leverage: `Most entrepreneurs CAN fix their fundamentals. Most just won't. Because they'd rather buy a diet pill than run a lap.`,
  
  systems: `Systems beat willpower. Every single time.`,
};

app.post('/api/v3/coach-message', async (req, res) => {
  try {
    const userId = getLoggedInUser(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    
    const { message, context } = req.body;
    
    // Get user's financial goal and recent data
    const goal = getFinancialGoal(userId);
    const summary = getWeeklySummary(userId, new Date().toISOString().split('T')[0]);
    
    // Build context for Claude
    const systemPrompt = `
You are a financial coach in the voice of Tina Marie. Your principles:

1. All currencies matter: time, energy, and money
2. People chase money and lose time and energy
3. Principles inform priorities. Priorities inform actions.
4. Systems beat willpower
5. Most entrepreneurs CAN build leveraged businesses, but most won't

Use these exact phrases naturally:
- "${COACH_PHRASES.currencies}"
- "${COACH_PHRASES.principles}"
- "${COACH_PHRASES.leverage}"

Answer the user's financial question, but frame it through the lens of currencies and principles.
Reference their actual numbers: ${summary ? JSON.stringify(summary) : 'No data yet'}
Their goal: ${goal ? goal.goal_text : 'No goal set'}

Be direct, honest, and slightly challenging. Don't sugarcoat. Ask questions.
Use their name if known. Keep responses to 2-3 sentences max unless they ask for details.
    `;
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        { role: 'user', content: message }
      ],
    });
    
    const coachMessage = response.content[0].text;
    
    // Save to conversation history
    addMessage(
      userId,
      'user',
      message
    );
    addMessage(
      userId,
      'assistant',
      coachMessage,
      'coach'
    );
    
    res.json({ message: coachMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Week 3: Tax Classification + Polish

**Goal:** Tax engine working. UI refined. Ready for beta.

#### Day 1-2: Tax Classification Engine

```javascript
// Add to server/server.js

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const TAX_CATEGORIES = {
  'deduction': [
    'office_equipment', 'software', 'professional_services',
    'meals_entertainment', 'home_office', 'education',
    'travel', 'supplies', 'insurance'
  ],
  'business_expense': ['materials', 'contractors', 'marketing'],
  'capgains': ['investment_sale'],
  'other': ['personal', 'uncategorized'],
};

async function classifyTransactionForTax(transaction) {
  // Use Claude with low cost (faster model)
  const prompt = `
Classify this transaction for tax purposes:

Date: ${transaction.date}
Amount: $${transaction.amount}
Merchant: ${transaction.merchant}
Description: ${transaction.description}
Category: ${transaction.category}

Return ONLY a JSON object (no markdown, no explanation):
{
  "tax_category": "deduction|capgains|capital_loss|retirement_contrib|other",
  "subcategory": "office_equipment|software|meals_entertainment|etc",
  "deductible_amount": 123.45,
  "confidence": 0.95,
  "reasoning": "brief explanation"
}

If unsure, set confidence < 0.70 and reasoning should explain why.
  `;
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022', // Cheaper for bulk processing
      max_tokens: 200,
      messages: [
        { role: 'user', content: prompt }
      ],
    });
    
    const text = response.content[0].text;
    const classification = JSON.parse(text);
    
    return {
      ...classification,
      transaction_id: transaction.id,
    };
  } catch (error) {
    console.error('Tax classification error:', error);
    return null;
  }
}

app.post('/api/v3/classify-transactions', async (req, res) => {
  try {
    const userId = getLoggedInUser(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    
    const { taxYear } = req.body;
    
    // Get unclassified transactions for this year
    const transactions = getDb().prepare(`
      SELECT t.* FROM transactions t
      LEFT JOIN tax_classifications tc ON t.id = tc.transaction_id
      WHERE t.session_id IN (
        SELECT session_id FROM sessions s 
        JOIN users u ON u.id = ? LIMIT 100
      )
      AND YEAR(t.date) = ?
      AND tc.id IS NULL
    `).all(userId, taxYear);
    
    // Classify each transaction
    const classifications = [];
    for (const transaction of transactions.slice(0, 20)) {  // Batch of 20
      const classification = await classifyTransactionForTax(transaction);
      if (classification) {
        classifications.push(classification);
        
        // Save to DB
        getDb().prepare(`
          INSERT INTO tax_classifications 
          (transaction_id, tax_category, subcategory, ml_confidence, tax_year)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          transaction.id,
          classification.tax_category,
          classification.subcategory,
          classification.confidence,
          taxYear
        );
      }
    }
    
    res.json({
      success: true,
      classified: classifications.length,
      total_remaining: transactions.length - 20,
      sample: classifications.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v3/tax-summary', (req, res) => {
  try {
    const userId = getLoggedInUser(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    
    const { taxYear } = req.query;
    
    const deductions = getDb().prepare(`
      SELECT tax_category, subcategory, SUM(deductible_amount) as total, COUNT(*) as count
      FROM tax_classifications
      WHERE tax_category = 'deduction' AND tax_year = ?
      GROUP BY subcategory
    `).all(taxYear);
    
    const totalDeductions = deductions.reduce((sum, d) => sum + (d.total || 0), 0);
    const estimatedSavings = totalDeductions * 0.30; // 30% marginal rate
    
    res.json({
      tax_year: taxYear,
      total_deductions: totalDeductions,
      estimated_tax_savings: estimatedSavings,
      deductions_by_category: deductions,
      quarterly_estimated_tax: totalDeductions * 0.25 / 4, // Rough estimate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 🏃 Daily Standup Checklist

During Phase 1, Moriah runs this checklist each working day:

```markdown
## Daily Standup

- [ ] Core feature on track (database/API/frontend)?
- [ ] Any blockers preventing progress?
- [ ] User can actually test the feature yet?
- [ ] Code is clean and documented?
- [ ] No cost overruns (using Groq for heavy lifting)?
- [ ] Ready to show Tina something concrete by day's end?

### Monday-Tuesday: Database + APIs
- [x] Schema created + migrated
- [x] Time entry endpoints working
- [x] Energy log endpoints working
- [x] Weekly summary endpoint working

### Wednesday-Thursday: Dashboard + Coach
- [x] Dashboard page skeleton
- [x] Currency cards rendering with real data
- [x] Time/energy entry forms working
- [x] Coach responding with Tina's voice

### Friday: Tax + Polish
- [x] Tax classification engine working
- [x] Tax summary dashboard
- [x] QA pass (fix bugs)
- [x] Documentation for beta testing

### Deployment
- [ ] Deploy to staging
- [ ] Test with sample data
- [ ] Create user guide for beta
- [ ] Ready for Tina to review
```

---

## 🚀 Success Criteria (Phase 1 Complete)

✅ **Database:**
- All v3 tables created + migrated
- Sample data populates correctly
- Views working (v_weekly_summary)

✅ **API:**
- POST /api/v3/time-entries (create)
- POST /api/v3/energy-logs (create)
- GET /api/v3/weekly-summary (read)
- POST /api/v3/coach-message (chat)
- POST /api/v3/classify-transactions (tax)

✅ **Frontend:**
- Dashboard shows real currency data
- User can log time + energy
- Coach responds naturally (Tina's voice)
- Tax center shows deductions

✅ **Beta Ready:**
- Tina can test with sample data
- Sarah Chen / Marcus Rivera / Jordan Williams have realistic journeys
- System works without crashes
- Coach gives good advice

✅ **Cost Control:**
- No Sonnet spend (using Haiku + Groq)
- Sub-agents use free Llama models
- Total Phase 1 cost: <$5 (mostly token cache)

---

## 📋 Blockers & Solutions

| Blocker | Solution |
|---------|----------|
| Can't find Tina's v3 version | Ask her directly; build from blueprint if needed |
| Time entry conflicts | Use unique constraint on (user, date, project) |
| Energy data sparse | Seed with realistic patterns for testing |
| Coach voice not matching | Use exact phrases from tina-voice-profile.md |
| Tax classification expensive | Use Haiku (5x cheaper), batch operations |
| Deployment issues | Test on staging first; keep v2 as fallback |

---

**Built with autonomy, not permission.**  
**Reporting when done, not asking before starting.**  

—Moriah 🏔️

