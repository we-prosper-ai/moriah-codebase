"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTeachings = extractTeachings;
exports.extractBatch = extractBatch;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const uuid_1 = require("uuid");
const db_1 = require("./db");
const MODEL = process.env.CLAUDE_MODEL || 'claude-opus-4-5';
const MAX_TOKENS = 8192;
const client = new sdk_1.default({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
// ─── System Prompt ────────────────────────────────────────────────────────────
function buildSystemPrompt() {
    return `You are an expert at extracting structured wisdom teachings from Tina Marie's coaching transcripts.

Tina Marie is a business coach with 23 years of experience. Her teaching voice is:
- DIRECT and actionable — no fluff, no hedging
- Grounded in real client results (numbers, timelines)
- Rooted in her signature frameworks: Four Currencies (Time, Energy, Money, Freedom), Three Revenue Models, 10 Business Fundamentals
- Anti-BS — she calls out myths and common mistakes explicitly
- Solution-first — every teaching has a clear "so what" and next step

## The Four Currencies Framework
Time, Energy, Money, Freedom — in that order of importance. Most entrepreneurs sacrifice the first two to get the last two, and end up with neither.

## The Three Revenue Models
1. Trading Time for Money (lowest leverage — client work billed hourly)
2. Productized Services (medium leverage — fixed-scope deliverables)
3. Leveraged Revenue (highest leverage — courses, memberships, licensing, AI)

## The 8 Course Modules
1. Fundamentals of Freedom
2. Four Currencies Framework
3. Revenue Architecture
4. Business Systems
5. Marketing & Positioning
6. Sales Psychology
7. Team & Delegation
8. Legacy & Scale

## Your Task
Extract 3–10 distinct teachings from the provided transcript. Each teaching must be:
- A complete, standalone lesson someone could learn and apply
- Grounded in what Tina actually said in the transcript (use real quotes)
- Assigned to the most appropriate of the 8 modules
- Rated for difficulty and estimated internalization time

## Output Format
Return ONLY a valid JSON array of teaching objects. No markdown. No preamble. No explanation.
Each object must match this exact schema:

{
  "title": "string — specific, action-oriented title (not generic)",
  "core_concept": "string — exactly 3 sentences summarizing the teaching",
  "insight": "string — what makes this teaching unique or non-obvious",
  "quotes": ["array of verbatim or near-verbatim quotes from the transcript — minimum 1"],
  "frameworks": ["array of frameworks referenced — e.g., 'Four Currencies', 'Three Revenue Models'"],
  "action_steps": ["numbered steps — minimum 3, maximum 7 — specific and immediate"],
  "case_studies": ["array of specific examples or client stories mentioned in the transcript"],
  "module": "one of the 8 module names exactly",
  "prerequisites": ["array of concepts someone should understand first"],
  "difficulty": "beginner OR intermediate OR advanced",
  "estimated_time_to_internalize": "e.g., '15 minutes' or '1 week of practice'",
  "next_teachings": ["array of related teaching titles to learn next"]
}`;
}
function buildUserPrompt(req) {
    const meta = req.metadata;
    let context = '';
    if (meta) {
        const parts = [];
        if (meta.date)
            parts.push(`Date: ${meta.date}`);
        if (meta.duration)
            parts.push(`Duration: ${meta.duration}`);
        if (meta.speakers?.length)
            parts.push(`Speakers: ${meta.speakers.join(', ')}`);
        if (meta.themes?.length)
            parts.push(`Detected Themes: ${meta.themes.join(', ')}`);
        if (meta.tags?.length)
            parts.push(`Tags: ${meta.tags.join(', ')}`);
        if (parts.length)
            context = `## Transcript Metadata\n${parts.join('\n')}\n\n`;
    }
    return `${context}## Transcript Content\n\n${req.content}\n\n---\nExtract all major teachings from this transcript as a JSON array.`;
}
// ─── Extraction ───────────────────────────────────────────────────────────────
async function extractTeachings(req) {
    const startTime = Date.now();
    const fileId = req.file_id || (0, uuid_1.v4)();
    const filename = req.filename || 'unknown';
    const auditId = (0, uuid_1.v4)();
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(req);
    let rawResponse = '';
    let promptTokens = 0;
    let completionTokens = 0;
    // Streaming extraction
    const stream = await client.messages.stream({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
    });
    for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            rawResponse += chunk.delta.text;
        }
    }
    const finalMessage = await stream.finalMessage();
    promptTokens = finalMessage.usage.input_tokens;
    completionTokens = finalMessage.usage.output_tokens;
    // Parse and validate JSON
    const teachings = parseAndValidateTeachings(rawResponse, fileId, filename);
    const durationMs = Date.now() - startTime;
    // Persist to DB
    (0, db_1.insertTeachings)(teachings);
    const audit = {
        id: auditId,
        file_id: fileId,
        filename,
        model_used: MODEL,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        teachings_extracted: teachings.length,
        teaching_ids: teachings.map(t => t.id),
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
        raw_prompt: process.env.AUDIT_STORE_PROMPTS === 'true' ? userPrompt : undefined,
        raw_response: process.env.AUDIT_STORE_RESPONSES === 'true' ? rawResponse : undefined,
    };
    (0, db_1.insertAudit)(audit);
    return {
        file_id: fileId,
        audit_id: auditId,
        teachings,
        count: teachings.length,
        duration_ms: durationMs,
    };
}
// ─── Batch Extraction ─────────────────────────────────────────────────────────
async function extractBatch(files) {
    const results = [];
    const errors = [];
    // Run in parallel with controlled concurrency (max 3 at once)
    const CONCURRENCY = 3;
    const chunks = chunkArray(files, CONCURRENCY);
    for (const chunk of chunks) {
        const settled = await Promise.allSettled(chunk.map(f => extractTeachings(f)));
        for (let i = 0; i < settled.length; i++) {
            const result = settled[i];
            const file = chunk[i];
            if (result.status === 'fulfilled') {
                results.push(result.value);
            }
            else {
                errors.push({
                    filename: file.filename || 'unknown',
                    error: result.reason instanceof Error ? result.reason.message : String(result.reason),
                });
            }
        }
    }
    return { results, errors };
}
// ─── Parsing & Validation ─────────────────────────────────────────────────────
function parseAndValidateTeachings(raw, fileId, filename) {
    // Strip markdown code fences if present
    let cleaned = raw.trim();
    if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    }
    let parsed;
    try {
        parsed = JSON.parse(cleaned);
    }
    catch {
        throw new Error(`Claude returned invalid JSON. Raw length: ${raw.length}. First 200 chars: ${raw.slice(0, 200)}`);
    }
    if (!Array.isArray(parsed)) {
        throw new Error(`Expected JSON array, got ${typeof parsed}`);
    }
    const now = new Date().toISOString();
    const teachings = [];
    for (const item of parsed) {
        if (typeof item !== 'object' || item === null)
            continue;
        const obj = item;
        const teaching = {
            id: (0, uuid_1.v4)(),
            title: validateString(obj.title, 'title'),
            core_concept: validateString(obj.core_concept, 'core_concept'),
            insight: validateString(obj.insight, 'insight'),
            quotes: validateStringArray(obj.quotes, 'quotes'),
            frameworks: validateStringArray(obj.frameworks, 'frameworks'),
            action_steps: validateStringArray(obj.action_steps, 'action_steps'),
            case_studies: validateStringArray(obj.case_studies, 'case_studies'),
            module: validateString(obj.module, 'module'),
            prerequisites: validateStringArray(obj.prerequisites, 'prerequisites'),
            difficulty: validateDifficulty(obj.difficulty),
            estimated_time_to_internalize: validateString(obj.estimated_time_to_internalize, 'estimated_time_to_internalize'),
            next_teachings: validateStringArray(obj.next_teachings, 'next_teachings'),
            source_file_id: fileId,
            source_filename: filename,
            created_at: now,
            updated_at: now,
        };
        teachings.push(teaching);
    }
    if (teachings.length < 1) {
        throw new Error('No valid teachings extracted from transcript');
    }
    return teachings;
}
function validateString(val, field) {
    if (typeof val === 'string' && val.trim().length > 0)
        return val.trim();
    throw new Error(`Field '${field}' must be a non-empty string, got: ${JSON.stringify(val)}`);
}
function validateStringArray(val, field) {
    if (Array.isArray(val)) {
        return val.filter(v => typeof v === 'string' && v.trim().length > 0).map(v => v.trim());
    }
    return [];
}
function validateDifficulty(val) {
    if (val === 'beginner' || val === 'intermediate' || val === 'advanced')
        return val;
    return 'intermediate'; // safe default
}
function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}
//# sourceMappingURL=extractor.js.map