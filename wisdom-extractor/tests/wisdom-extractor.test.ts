/**
 * Wisdom Extractor — Test Suite
 * 20+ tests covering: DB layer, validation, routes (with mocked Claude), parsing, edge cases
 */

import request from 'supertest';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// ─── Test DB setup (in-memory) ────────────────────────────────────────────────
const TEST_DB_PATH = path.join(__dirname, '..', 'data', 'db', `test-${Date.now()}.db`);
process.env.DB_PATH = TEST_DB_PATH;
process.env.ANTHROPIC_API_KEY = 'test-key-not-used';
process.env.PORT = '0'; // random port

// ─── Mock Anthropic SDK ───────────────────────────────────────────────────────
const SAMPLE_TEACHINGS = [
  {
    title: 'Trading Time for Money Is a Dead End',
    core_concept: 'When you trade time for money, your income is always capped by your hours. There are only 24 hours in a day, and you cannot clone yourself. The only way out is to stop selling time and start selling results, systems, or access.',
    insight: 'Most coaches think they are building a business when they are actually building a very stressful job. The distinction matters because the exit strategy is completely different.',
    quotes: ['You are not building a business. You are building a prison with a nicer desk.'],
    frameworks: ['Four Currencies', 'Three Revenue Models'],
    action_steps: [
      '1. Calculate your true hourly rate including all unpaid admin time',
      '2. Identify your three highest-leverage income activities',
      '3. List every task you did this week that you could productize',
      '4. Design one productized offer that delivers your best result without your real-time presence',
      '5. Set a date to retire one hourly client and replace them with one productized client',
    ],
    case_studies: ['Sarah went from $8k/month working 60 hours to $22k/month working 20 hours in 4 months by converting 3 retainer clients to a group program.'],
    module: 'Revenue Architecture',
    prerequisites: ['Understanding the Four Currencies'],
    difficulty: 'beginner',
    estimated_time_to_internalize: '2 weeks of implementation',
    next_teachings: ['Productizing Your Expertise', 'The Leverage Stack'],
  },
  {
    title: 'The Four Currencies — Why Money Is Last',
    core_concept: 'There are four currencies that matter: Time, Energy, Money, and Freedom. Most entrepreneurs optimize for money and sacrifice the first three. This is backwards.',
    insight: 'You can recover from losing money. You cannot recover lost time or burned energy.',
    quotes: ['Money is the least important of the four. Which is ironic because it is the only one we measure.'],
    frameworks: ['Four Currencies'],
    action_steps: [
      '1. Score yourself 1-10 on each of the four currencies today',
      '2. Identify which currency is most depleted',
      '3. List three things that drain that currency most',
      '4. Cut or delegate one of those this week',
    ],
    case_studies: ['Client burned out at $400k/year. Rebuilt to $200k/year but rated her life 9/10 instead of 2/10.'],
    module: 'Four Currencies Framework',
    prerequisites: [],
    difficulty: 'beginner',
    estimated_time_to_internalize: '1 week of reflection',
    next_teachings: ['Revenue Architecture', 'Delegation Framework'],
  },
  {
    title: 'Systems Beat Hustle Every Time',
    core_concept: 'A system runs without you. Hustle stops the moment you stop. Building systems is the only way to create a business that you own rather than one that owns you.',
    insight: 'The goal is not to work less. The goal is to build something that works whether you show up or not.',
    quotes: ['If your business cannot survive you taking a two-week vacation, you do not own a business.'],
    frameworks: ['Three Revenue Models', 'Four Currencies'],
    action_steps: [
      '1. Document every repeating task you do manually',
      '2. Identify the top 3 by time cost',
      '3. Build a checklist or template for each',
      '4. Hire or delegate one this month',
    ],
    case_studies: [],
    module: 'Business Systems',
    prerequisites: ['Four Currencies Framework'],
    difficulty: 'intermediate',
    estimated_time_to_internalize: '30 days of implementation',
    next_teachings: ['Team & Delegation', 'Scaling Without Burnout'],
  },
];

// Mock the extractor module to bypass real Claude calls
jest.mock('../src/extractor', () => {
  const original = jest.requireActual('../src/extractor');
  return {
    ...original,
    extractTeachings: jest.fn().mockImplementation(async (req: { file_id?: string; filename?: string }) => {
      const { v4: uuidv4 } = require('uuid');
      const { insertTeachings, insertAudit } = require('../src/db');

      const fileId = req.file_id || uuidv4();
      const auditId = uuidv4();
      const now = new Date().toISOString();

      const teachings = SAMPLE_TEACHINGS.map(t => ({
        ...t,
        id: uuidv4(),
        source_file_id: fileId,
        source_filename: req.filename || 'test.md',
        created_at: now,
        updated_at: now,
      }));

      insertTeachings(teachings);
      insertAudit({
        id: auditId,
        file_id: fileId,
        filename: req.filename || 'test.md',
        model_used: 'claude-opus-4-5',
        prompt_tokens: 1500,
        completion_tokens: 800,
        teachings_extracted: teachings.length,
        teaching_ids: teachings.map((t: { id: string }) => t.id),
        duration_ms: 1200,
        created_at: now,
      });

      return { file_id: fileId, audit_id: auditId, teachings, count: teachings.length, duration_ms: 1200 };
    }),
    extractBatch: jest.fn().mockImplementation(async (files: Array<{ file_id?: string; filename?: string; content?: string }>) => {
      const { extractTeachings } = require('../src/extractor');
      const results = [];
      const errors = [];
      for (const f of files) {
        try {
          results.push(await extractTeachings(f));
        } catch (e) {
          errors.push({ filename: f.filename || 'unknown', error: String(e) });
        }
      }
      return { results, errors };
    }),
  };
});

// Import app AFTER mocking
import app from '../src/index';
import { getDb, closeDb, getTeachingById, listTeachings, getAuditById } from '../src/db';

const SAMPLE_TRANSCRIPT = `
# Financial Freedom Coaching Session

## Session Details
- Date: 2026-03-21
- Duration: 45 minutes
- Speakers: Tina Marie, Client

---

Tina: You are not building a business. You are building a prison with a nicer desk.
Client: That really hits. I've been working 60+ hours a week for three years.
Tina: When you trade time for money, your income is always capped by your hours.
There are only 24 hours in a day, and you cannot clone yourself.
The only way out is to stop selling time and start selling results, systems, or access.
Client: So what's the first step?
Tina: Calculate your true hourly rate. Include all the unpaid hours. Admin, prep, follow-up. All of it.
Then ask yourself: is this worth it?
`;

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Wisdom Extractor Service', () => {
  afterAll(() => {
    closeDb();
    // Cleanup test DB
    try { fs.unlinkSync(TEST_DB_PATH); } catch {}
  });

  // ── 1. Health check ──────────────────────────────────────────────────────────
  describe('GET /health', () => {
    test('1. returns 200 with service info', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('wisdom-extractor');
      expect(res.body.version).toBe('1.0.0');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  // ── 2. POST /extract ─────────────────────────────────────────────────────────
  describe('POST /extract', () => {
    test('2. extracts teachings from JSON body', async () => {
      const res = await request(app)
        .post('/extract')
        .send({ content: SAMPLE_TRANSCRIPT, filename: 'test-session.md' });

      expect(res.status).toBe(200);
      expect(res.body.teachings).toBeInstanceOf(Array);
      expect(res.body.count).toBeGreaterThanOrEqual(3);
      expect(res.body.file_id).toBeDefined();
      expect(res.body.audit_id).toBeDefined();
    });

    test('3. each teaching has required fields', async () => {
      const res = await request(app)
        .post('/extract')
        .send({ content: SAMPLE_TRANSCRIPT });

      expect(res.status).toBe(200);
      for (const t of res.body.teachings) {
        expect(typeof t.id).toBe('string');
        expect(typeof t.title).toBe('string');
        expect(typeof t.core_concept).toBe('string');
        expect(typeof t.insight).toBe('string');
        expect(Array.isArray(t.quotes)).toBe(true);
        expect(Array.isArray(t.frameworks)).toBe(true);
        expect(Array.isArray(t.action_steps)).toBe(true);
        expect(Array.isArray(t.case_studies)).toBe(true);
        expect(typeof t.module).toBe('string');
        expect(Array.isArray(t.prerequisites)).toBe(true);
        expect(['beginner', 'intermediate', 'advanced']).toContain(t.difficulty);
        expect(typeof t.estimated_time_to_internalize).toBe('string');
        expect(Array.isArray(t.next_teachings)).toBe(true);
      }
    });

    test('4. returns 400 when content is missing', async () => {
      const res = await request(app)
        .post('/extract')
        .send({ filename: 'test.md' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    test('5. returns 400 when content is empty string', async () => {
      const res = await request(app)
        .post('/extract')
        .send({ content: '' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    test('6. accepts optional metadata', async () => {
      const res = await request(app)
        .post('/extract')
        .send({
          content: SAMPLE_TRANSCRIPT,
          filename: 'session-001.md',
          metadata: {
            speakers: ['Tina Marie', 'Client'],
            themes: ['Revenue', 'Freedom'],
            date: '2026-03-21',
            duration: '45 minutes',
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.count).toBeGreaterThanOrEqual(3);
    });

    test('7. response includes duration_ms', async () => {
      const res = await request(app)
        .post('/extract')
        .send({ content: SAMPLE_TRANSCRIPT });

      expect(res.status).toBe(200);
      expect(typeof res.body.duration_ms).toBe('number');
    });
  });

  // ── 3. POST /extract-batch ───────────────────────────────────────────────────
  describe('POST /extract-batch', () => {
    test('8. extracts from multiple files', async () => {
      const res = await request(app)
        .post('/extract-batch')
        .send({
          files: [
            { content: SAMPLE_TRANSCRIPT, filename: 'session-001.md' },
            { content: SAMPLE_TRANSCRIPT + '\nExtra content', filename: 'session-002.md' },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.results).toHaveLength(2);
      expect(res.body.summary.total).toBe(2);
      expect(res.body.summary.succeeded).toBe(2);
      expect(res.body.summary.total_teachings).toBeGreaterThan(0);
    });

    test('9. returns 400 when files array is missing', async () => {
      const res = await request(app)
        .post('/extract-batch')
        .send({ content: SAMPLE_TRANSCRIPT });

      expect(res.status).toBe(400);
    });

    test('10. returns 400 when files array is empty', async () => {
      const res = await request(app)
        .post('/extract-batch')
        .send({ files: [] });

      expect(res.status).toBe(400);
    });

    test('11. batch response includes batch_id and processed_at', async () => {
      const res = await request(app)
        .post('/extract-batch')
        .send({ files: [{ content: SAMPLE_TRANSCRIPT }] });

      expect(res.status).toBe(200);
      expect(res.body.batch_id).toBeDefined();
      expect(res.body.processed_at).toBeDefined();
    });
  });

  // ── 4. GET /teachings ────────────────────────────────────────────────────────
  describe('GET /teachings', () => {
    let extractedFileId: string;

    beforeAll(async () => {
      // Seed some teachings
      const res = await request(app)
        .post('/extract')
        .send({ content: SAMPLE_TRANSCRIPT, filename: 'seed.md' });
      extractedFileId = res.body.file_id;
    });

    test('12. returns paginated teachings', async () => {
      const res = await request(app).get('/teachings');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.teachings)).toBe(true);
      expect(typeof res.body.total).toBe('number');
      expect(typeof res.body.page).toBe('number');
      expect(typeof res.body.page_size).toBe('number');
      expect(typeof res.body.total_pages).toBe('number');
    });

    test('13. pagination works with page and page_size params', async () => {
      const res = await request(app).get('/teachings?page=1&page_size=2');

      expect(res.status).toBe(200);
      expect(res.body.teachings.length).toBeLessThanOrEqual(2);
      expect(res.body.page).toBe(1);
      expect(res.body.page_size).toBe(2);
    });

    test('14. can filter by module', async () => {
      const res = await request(app).get('/teachings?module=Revenue Architecture');

      expect(res.status).toBe(200);
      for (const t of res.body.teachings) {
        expect(t.module).toBe('Revenue Architecture');
      }
    });

    test('15. returns empty array for non-existent module', async () => {
      const res = await request(app).get('/teachings?module=NonExistentModule');

      expect(res.status).toBe(200);
      expect(res.body.teachings).toHaveLength(0);
      expect(res.body.total).toBe(0);
    });
  });

  // ── 5. GET /teachings/:id ────────────────────────────────────────────────────
  describe('GET /teachings/:id', () => {
    let teachingId: string;

    beforeAll(async () => {
      const res = await request(app)
        .post('/extract')
        .send({ content: SAMPLE_TRANSCRIPT });
      teachingId = res.body.teachings[0].id;
    });

    test('16. retrieves single teaching by ID', async () => {
      const res = await request(app).get(`/teachings/${teachingId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(teachingId);
      expect(typeof res.body.title).toBe('string');
    });

    test('17. returns 404 for unknown teaching ID', async () => {
      const res = await request(app).get(`/teachings/${uuidv4()}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
    });
  });

  // ── 6. GET /audit/:id ────────────────────────────────────────────────────────
  describe('GET /audit/:id', () => {
    let auditId: string;
    let fileId: string;

    beforeAll(async () => {
      const res = await request(app)
        .post('/extract')
        .send({ content: SAMPLE_TRANSCRIPT, filename: 'audit-test.md' });
      auditId = res.body.audit_id;
      fileId = res.body.file_id;
    });

    test('18. retrieves audit by audit ID', async () => {
      const res = await request(app).get(`/audit/${auditId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(auditId);
      expect(res.body.model_used).toBeDefined();
      expect(typeof res.body.teachings_extracted).toBe('number');
      expect(typeof res.body.duration_ms).toBe('number');
      expect(Array.isArray(res.body.teaching_ids)).toBe(true);
    });

    test('19. retrieves audit by file ID', async () => {
      const res = await request(app).get(`/audit/${fileId}`);

      expect(res.status).toBe(200);
      expect(res.body.file_id).toBe(fileId);
    });

    test('20. returns 404 for unknown audit ID', async () => {
      const res = await request(app).get(`/audit/${uuidv4()}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
    });
  });

  // ── 7. Database layer ────────────────────────────────────────────────────────
  describe('Database layer', () => {
    test('21. teachings persist across listTeachings calls', async () => {
      await request(app)
        .post('/extract')
        .send({ content: SAMPLE_TRANSCRIPT, filename: 'persist-test.md' });

      const { teachings, total } = listTeachings(1, 100);
      expect(teachings.length).toBeGreaterThan(0);
      expect(total).toBeGreaterThan(0);
    });

    test('22. getTeachingById returns null for unknown ID', () => {
      const result = getTeachingById('nonexistent-id-99999');
      expect(result).toBeNull();
    });

    test('23. getAuditById returns null for unknown ID', () => {
      const result = getAuditById('nonexistent-audit-id');
      expect(result).toBeNull();
    });
  });

  // ── 8. 404 handler ───────────────────────────────────────────────────────────
  describe('404 and error handling', () => {
    test('24. returns 404 for unknown routes', async () => {
      const res = await request(app).get('/totally-unknown-route-xyz');
      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
    });

    test('25. POST /teachings/sync returns 400 without target URL', async () => {
      // No COACHTINA_URL set in test env
      delete process.env.COACHTINA_URL;
      const res = await request(app).post('/teachings/sync').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('target_url');
    });
  });
});
