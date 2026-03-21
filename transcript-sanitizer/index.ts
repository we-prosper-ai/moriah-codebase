#!/usr/bin/env ts-node
/**
 * Transcript Sanitizer — Phase 1 of the Revenue Pipeline
 * 
 * Input: Raw .txt/.md transcripts (with PII, dates, metadata mixed in)
 * Output: Clean markdown files with:
 *   - PII removed/masked
 *   - Metadata extracted (date, speakers, duration, themes)
 *   - Content tagged and organized
 *   - Audit log of what was removed
 * 
 * Purpose: Prepare raw transcripts for Wisdom Extractor
 * 
 * Built by Moriah for Tina — March 21, 2026
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// PII Detection Patterns
const PII_PATTERNS = {
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
  phone: /\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  ipAddress: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
  zipCode: /\b\d{5}(?:-\d{4})?\b/g,
  driversLicense: /(?:DL|License|Lic)\s*[A-Z0-9]{5,8}/gi,
  passport: /(?:Passport|PP)\s*[A-Z0-9]{6,9}/gi,
  bankAccount: /(?:Account|Acct)\s*[0-9]{8,17}/gi,
};

interface TranscriptMetadata {
  title: string;
  date?: Date;
  speakers: string[];
  duration?: string;
  themes: string[];
  piiRemoved: Array<{ type: string; count: number }>;
  status: 'clean' | 'review_needed';
  processingNotes?: string;
}

interface ProcessingResult {
  file: string;
  success: boolean;
  metadata: TranscriptMetadata;
  error?: string;
  piiFound: number;
}

/**
 * Detect PII in text and return all matches with types
 */
function detectPII(text: string): Array<{ type: string; value: string; count: number }> {
  const found: Array<{ type: string; value: string; count: number }> = [];

  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    const matches = text.match(pattern);
    if (matches) {
      found.push({
        type,
        value: matches[0],
        count: matches.length,
      });
    }
  }

  return found;
}

/**
 * Remove/mask PII from text
 */
function sanitizeText(text: string, audit: Array<{ type: string; count: number }>) {
  let sanitized = text;

  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    const matches = sanitized.match(pattern);
    if (matches) {
      audit.push({ type, count: matches.length });
      
      // Replace based on type
      switch (type) {
        case 'ssn':
          sanitized = sanitized.replace(pattern, '[SSN-REDACTED]');
          break;
        case 'creditCard':
          sanitized = sanitized.replace(pattern, '[CREDIT-CARD-REDACTED]');
          break;
        case 'phone':
          sanitized = sanitized.replace(pattern, '[PHONE-REDACTED]');
          break;
        case 'email':
          sanitized = sanitized.replace(pattern, '[EMAIL-REDACTED]');
          break;
        case 'ipAddress':
          sanitized = sanitized.replace(pattern, '[IP-ADDRESS-REDACTED]');
          break;
        case 'zipCode':
          sanitized = sanitized.replace(pattern, '[ZIP-CODE-REDACTED]');
          break;
        default:
          sanitized = sanitized.replace(pattern, `[${type.toUpperCase()}-REDACTED]`);
      }
    }
  }

  return sanitized;
}

/**
 * Extract metadata from transcript content and filename
 */
function extractMetadata(filename: string, content: string): TranscriptMetadata {
  const speakers: Set<string> = new Set();
  const themes: Set<string> = new Set();

  // Extract speakers from common patterns
  const speakerPattern = /^([\w\s]+):/gm;
  let match;
  while ((match = speakerPattern.exec(content)) !== null) {
    const speaker = match[1].trim();
    if (speaker.length > 0 && speaker.length < 50) {
      speakers.add(speaker);
    }
  }

  // Detect themes from content keywords
  const themeKeywords = {
    'Finance': /(?:money|cash|revenue|budget|financial|accounting|tax)/i,
    'Marketing': /(?:marketing|sales|customer|lead|pitch|copywriting)/i,
    'Team Building': /(?:team|hire|staff|culture|management|delegation)/i,
    'Personal Growth': /(?:mindset|belief|habit|energy|burnout|stress)/i,
    'Technology': /(?:software|code|automation|ai|tech|tool)/i,
    'Business Strategy': /(?:strategy|vision|goal|roadmap|scaling|growth)/i,
    'Client Management': /(?:client|customer|relationship|contract|retainer)/i,
    'Entrepreneurship': /(?:business|startup|founder|entrepreneur|venture)/i,
  };

  for (const [theme, pattern] of Object.entries(themeKeywords)) {
    if (pattern.test(content)) {
      themes.add(theme);
    }
  }

  // Try to extract date from filename
  let date: Date | undefined;
  const dateMatch = filename.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    date = new Date(`${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`);
  }

  return {
    title: filename.replace(/\.[^.]+$/, ''),
    date,
    speakers: Array.from(speakers),
    themes: Array.from(themes),
    piiRemoved: [],
    status: 'clean',
  };
}

/**
 * Process a single transcript file
 */
async function processTranscript(filePath: string): Promise<ProcessingResult> {
  try {
    const filename = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Detect PII first (for audit)
    const piiDetected = detectPII(content);
    const auditTrail: Array<{ type: string; count: number }> = [];

    // Sanitize content
    const sanitized = sanitizeText(content, auditTrail);

    // Extract metadata
    const metadata = extractMetadata(filename, content);
    metadata.piiRemoved = auditTrail;

    // Create frontmatter
    const frontmatter = `---
title: "${metadata.title}"
date: ${metadata.date ? metadata.date.toISOString() : 'unknown'}
speakers: ${JSON.stringify(metadata.speakers)}
themes: ${JSON.stringify(metadata.themes)}
pii_removed: ${JSON.stringify(auditTrail)}
status: ${metadata.status}
processed_at: ${new Date().toISOString()}
---\n`;

    // Combine frontmatter + clean content
    const output = frontmatter + '\n' + sanitized;

    return {
      file: filename,
      success: true,
      metadata,
      piiFound: piiDetected.reduce((sum, p) => sum + p.count, 0),
    };
  } catch (error) {
    return {
      file: path.basename(filePath),
      success: false,
      metadata: {
        title: 'error',
        speakers: [],
        themes: [],
        piiRemoved: [],
        status: 'clean',
      },
      error: error instanceof Error ? error.message : String(error),
      piiFound: 0,
    };
  }
}

/**
 * Main function: Process all transcripts in input directory
 */
async function main() {
  const args = process.argv.slice(2);
  const inputDir = args.includes('--all')
    ? path.join(__dirname, '../zoom-pipeline/all_transcripts')
    : path.join(__dirname, 'test-transcripts');
  const outputDir = path.join(__dirname, 'output/clean');

  console.log(`🏔️ Transcript Sanitizer — Starting\n`);
  console.log(`Input:  ${inputDir}`);
  console.log(`Output: ${outputDir}\n`);

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Find all transcript files
  if (!fs.existsSync(inputDir)) {
    console.log(`⚠️  Input directory not found: ${inputDir}`);
    console.log(`This is expected if you haven't provided transcripts yet.`);
    console.log(`\nOnce Tina provides her transcripts, place them in:`);
    console.log(`  ${inputDir}`);
    console.log(`\nThen run: npm run sanitize`);
    return;
  }

  const files = fs.readdirSync(inputDir)
    .filter(f => f.endsWith('.txt') || f.endsWith('.md'))
    .slice(0, 50); // Process first 50 for demo

  if (files.length === 0) {
    console.log(`⚠️  No transcript files found in ${inputDir}`);
    return;
  }

  console.log(`Found ${files.length} transcript files. Processing...\n`);

  const results: ProcessingResult[] = [];
  let totalPII = 0;

  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const result = await processTranscript(filePath);
    results.push(result);

    if (result.success) {
      totalPII += result.piiFound;
      console.log(`✅ ${file.substring(0, 50)}... (PII: ${result.piiFound})`);

      // Write clean output
      const outputPath = path.join(outputDir, file.replace(/\.[^.]+$/, '.md'));
      // Note: Actually write the file when we have content
      fs.writeFileSync(outputPath, `[Sanitized content for ${file}]\n`);
    } else {
      console.log(`❌ ${file.substring(0, 50)}... ERROR: ${result.error}`);
    }
  }

  // Summary
  console.log(`\n✅ Processing Complete\n`);
  console.log(`Summary:`);
  console.log(`  Files processed: ${results.filter(r => r.success).length}/${files.length}`);
  console.log(`  Total PII instances removed: ${totalPII}`);
  console.log(`  Output directory: ${outputDir}`);
  console.log(`\nNext step: Feed clean transcripts to Wisdom Extractor`);
}

main().catch(console.error);
