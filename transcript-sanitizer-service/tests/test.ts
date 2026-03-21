import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';

const BASE_URL = 'http://localhost:4001';

function httpRequest(
  method: string,
  path: string,
  body?: string,
  contentType?: string
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const options: http.RequestOptions = {
      hostname: 'localhost',
      port: 4001,
      path,
      method,
      headers: contentType
        ? { 'Content-Type': contentType, 'Content-Length': Buffer.byteLength(body || '') }
        : {},
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode || 0, body: data }));
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function multipartRequest(
  path: string,
  fileName: string,
  fileContent: string
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const boundary = `----FormBoundary${Date.now()}`;
    const header = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: text/markdown\r\n\r\n`;
    const footer = `\r\n--${boundary}--\r\n`;
    const body = Buffer.concat([
      Buffer.from(header),
      Buffer.from(fileContent, 'utf-8'),
      Buffer.from(footer),
    ]);

    const options: http.RequestOptions = {
      hostname: 'localhost',
      port: 4001,
      path,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode || 0, body: data }));
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 TRANSCRIPT SANITIZER - TEST SUITE\n');
  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, detail?: string) {
    if (condition) {
      console.log(`  ✅ ${name}`);
      passed++;
    } else {
      console.log(`  ❌ ${name}${detail ? `: ${detail}` : ''}`);
      failed++;
    }
  }

  // ── Test 1: Health check ──────────────────────────────────────────────────
  console.log('1️⃣  Health Check');
  try {
    const res = await httpRequest('GET', '/health');
    const body = JSON.parse(res.body);
    assert('Returns 200', res.status === 200);
    assert('Status is ok', body.status === 'ok');
    assert('Service name present', body.service === 'transcript-sanitizer');
  } catch (e) {
    console.log(`  ❌ Health check failed: ${e}`);
    failed++;
  }

  // ── Test 2: Sanitize via JSON body ────────────────────────────────────────
  console.log('\n2️⃣  POST /sanitize (JSON body)');
  const testContent = `# Test Transcript
Date: March 21, 2024

Speaker One: My email is test@example.com and phone is 555-123-4567.
Speaker Two: My SSN is 123-45-6789 and I live at 999 Oak Avenue.
Speaker One: Let's talk about our marketing strategy and business growth.
Speaker Two: We need a webinar plan and better lead generation.`;

  let fileId = '';
  try {
    const payload = JSON.stringify({ content: testContent, filename: 'test.md' });
    const res = await httpRequest('POST', '/sanitize', payload, 'application/json');
    const body = JSON.parse(res.body);
    assert('Returns 200', res.status === 200);
    assert('Has fileId', typeof body.fileId === 'string' && body.fileId.length > 0);
    assert('Has cleanContent', typeof body.cleanContent === 'string');
    assert('Email redacted', !body.cleanContent.includes('test@example.com'));
    assert('Phone redacted', !body.cleanContent.includes('555-123-4567'));
    assert('SSN redacted', !body.cleanContent.includes('123-45-6789'));
    assert('Has metadata', body.metadata !== undefined);
    assert('Has speakers', Array.isArray(body.metadata.speakers));
    assert('Has tags', Array.isArray(body.metadata.tags));
    assert('PII count > 0', body.metadata.piiRemovedCount > 0);
    fileId = body.fileId;
    console.log(`     PII removed: ${body.metadata.piiRemovedCount} items`);
    console.log(`     Tags: ${body.metadata.tags.join(', ')}`);
    console.log(`     Speakers: ${body.metadata.speakers.map((s: any) => s.name).join(', ')}`);
  } catch (e) {
    console.log(`  ❌ Sanitize JSON test failed: ${e}`);
    failed++;
  }

  // ── Test 3: Audit record ──────────────────────────────────────────────────
  console.log('\n3️⃣  GET /audit/:fileId');
  if (fileId) {
    try {
      const res = await httpRequest('GET', `/audit/${fileId}`);
      const body = JSON.parse(res.body);
      assert('Returns 200', res.status === 200);
      assert('Has piiMatches', Array.isArray(body.piiMatches));
      assert('Has summary', body.summary !== undefined);
      assert('Has byType', typeof body.summary.byType === 'object');
      assert('Matches contain type field', body.piiMatches.length === 0 || body.piiMatches[0].type !== undefined);
      console.log(`     Audit items: ${body.piiMatches.length}`);
      console.log(`     By type: ${JSON.stringify(body.summary.byType)}`);
    } catch (e) {
      console.log(`  ❌ Audit test failed: ${e}`);
      failed++;
    }
  }

  // ── Test 4: Sanitize sample transcript file ───────────────────────────────
  console.log('\n4️⃣  POST /sanitize (sample transcript file)');
  const samplePath = path.join(__dirname, '..', 'data', 'input', 'sample-transcript.md');
  if (fs.existsSync(samplePath)) {
    try {
      const sampleContent = fs.readFileSync(samplePath, 'utf-8');
      const payload = JSON.stringify({ content: sampleContent, filename: 'sample-transcript.md' });
      const res = await httpRequest('POST', '/sanitize', payload, 'application/json');
      const body = JSON.parse(res.body);
      assert('Returns 200', res.status === 200);
      assert('SSN removed', !body.cleanContent.includes('456-78-9012'));
      assert('Credit card removed', !body.cleanContent.includes('4532015112830366'));
      assert('Email removed', !body.cleanContent.includes('sarah.johnson@gmail.com'));
      assert('Phone removed', !body.cleanContent.includes('555-234-5678'));
      assert('IP removed', !body.cleanContent.includes('192.168.1.45'));
      assert('DOB removed', !body.cleanContent.includes('03/15/1985') && !body.cleanContent.toLowerCase().includes('03/15/1985'));
      assert('Business content preserved', body.cleanContent.includes('marketing'));
      assert('Speakers detected', body.metadata.speakers.length > 0);
      console.log(`     PII removed: ${body.metadata.piiRemovedCount} items`);
      console.log(`     Themes: ${body.metadata.themes.join(', ')}`);
      console.log(`     Speakers: ${body.metadata.speakers.map((s: any) => s.name).join(', ')}`);
    } catch (e) {
      console.log(`  ❌ Sample file test failed: ${e}`);
      failed++;
    }
  } else {
    console.log('  ⚠️  Sample transcript not found, skipping');
  }

  // ── Test 5: 404 for nonexistent audit ─────────────────────────────────────
  console.log('\n5️⃣  GET /audit/:fileId (not found)');
  try {
    const res = await httpRequest('GET', '/audit/00000000-0000-0000-0000-000000000000');
    assert('Returns 404', res.status === 404);
  } catch (e) {
    console.log(`  ❌ 404 test failed: ${e}`);
    failed++;
  }

  // ── Test 6: Empty content rejection ───────────────────────────────────────
  console.log('\n6️⃣  POST /sanitize (empty content)');
  try {
    const payload = JSON.stringify({ content: '', filename: 'empty.md' });
    const res = await httpRequest('POST', '/sanitize', payload, 'application/json');
    assert('Returns 400', res.status === 400);
  } catch (e) {
    console.log(`  ❌ Empty content test failed: ${e}`);
    failed++;
  }

  // ── Test 7: List audit records ─────────────────────────────────────────────
  console.log('\n7️⃣  GET /audit (list all)');
  try {
    const res = await httpRequest('GET', '/audit');
    const body = JSON.parse(res.body);
    assert('Returns 200', res.status === 200);
    assert('Has total', typeof body.total === 'number');
    assert('Has fileIds array', Array.isArray(body.fileIds));
    console.log(`     Total audit records: ${body.total}`);
  } catch (e) {
    console.log(`  ❌ List audit test failed: ${e}`);
    failed++;
  }

  // ── Results ───────────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}  Total: ${passed + failed}`);
  console.log(`${'─'.repeat(50)}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner crashed:', err);
  process.exit(1);
});
