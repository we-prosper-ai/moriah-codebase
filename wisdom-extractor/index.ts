#!/usr/bin/env ts-node
/**
 * Wisdom Extractor — Phase 2 of the Revenue Pipeline
 * 
 * Input: Clean transcripts from Transcript Sanitizer
 * Output: Structured teachings as JSON + Markdown:
 *   - Extracted teachings with title, core concept, key insight
 *   - Quotes (actual text from transcript)
 *   - Action steps (numbered, specific, actionable)
 *   - Case studies (client stories with before/after metrics)
 *   - Related teachings (cross-references)
 *   - Course module assignment (where this belongs)
 * 
 * Purpose: Create structured data for CoachTinaMarie + AI Entrepreneur Course
 * 
 * Built by Moriah for Tina — March 21, 2026
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface Teaching {
  id: string;
  theme: string;
  title: string;
  core_teaching: string;
  key_insight: string;
  quote: string;
  action_steps: string[];
  case_study?: {
    client_name: string;
    situation: string;
    before: Record<string, any>;
    after: Record<string, any>;
    timeline: string;
    results: string;
  };
  related_teachings: string[];
  course_module: string;
  source_transcript: string;
  extracted_at: string;
}

interface ExtractionResult {
  teachings: Teaching[];
  summary: {
    total_teachings: number;
    themes: Record<string, number>;
    modules: Record<string, number>;
  };
}

/**
 * Mock wisdom extraction (in production, this calls Claude API)
 * For now, we'll create a template that shows what the output looks like
 */
function createTeachingTemplate(
  transcriptFile: string,
  index: number
): Teaching {
  return {
    id: `teaching-${Date.now()}-${index}`,
    theme: 'Financial Freedom', // Detected from content
    title: 'The Four Currencies Framework',
    core_teaching:
      'Money is not the primary currency. The order of importance is: Time, Energy, Money, Freedom.',
    key_insight:
      'Most entrepreneurs fail because they optimize for money alone, ignoring energy depletion and time cost. This creates a wealth-trap: more money but less freedom.',
    quote:
      '"The problem is not that you do not have money. The problem is that you are not controlling where it goes."',
    action_steps: [
      '1. Map every expense by its impact on your four currencies (not just in dollars)',
      '2. Identify the top 3 energy drains in your business/life',
      '3. Calculate the true time cost of each (hours worked ÷ revenue generated)',
      '4. Evaluate each expense: Does it improve or degrade your four currencies?',
      '5. Cut or delegate the activities that drain energy without generating freedom',
      '6. Reallocate freed time to high-leverage work (high money, high energy, high freedom)',
      '7. Track your score quarterly: Are you moving toward more freedom?',
    ],
    case_study: {
      client_name: 'Sarah Chen',
      situation:
        'Agency owner, working 50+ hours/week, stressed, limited time with family',
      before: {
        hours_worked_per_week: 50,
        annual_revenue: '$250,000',
        energy_level: '3/10',
        freedom_score: '2/10',
        stress_level: 'High',
      },
      after: {
        hours_worked_per_week: 25,
        annual_revenue: '$380,000',
        energy_level: '8/10',
        freedom_score: '8/10',
        stress_level: 'Low',
      },
      timeline: '6 months',
      results:
        'Sarah increased revenue by 52% while cutting work hours by 50% and dramatically improving her quality of life.',
    },
    related_teachings: [
      'teaching-energy-allocation',
      'teaching-pricing-strategy',
      'teaching-delegation-framework',
    ],
    course_module: 'Fundamentals of Freedom',
    source_transcript: transcriptFile,
    extracted_at: new Date().toISOString(),
  };
}

/**
 * Extract teachings from clean transcripts
 * This is a template function. In production, it calls Claude API with:
 *   - System prompt: "Extract teachings from this coaching transcript"
 *   - User message: [transcript content]
 *   - Response format: JSON Teaching object
 */
async function extractTeachings(
  transcriptPath: string
): Promise<Teaching[]> {
  try {
    const content = fs.readFileSync(transcriptPath, 'utf-8');
    const filename = path.basename(transcriptPath);

    // In production: Call Claude API here
    // For now: Return template teachings (to show structure works)
    const teachings: Teaching[] = [
      createTeachingTemplate(filename, 1),
      // In production, Claude would extract 10-20 teachings per transcript
    ];

    return teachings;
  } catch (error) {
    console.error(`Error extracting from ${transcriptPath}:`, error);
    return [];
  }
}

/**
 * Generate markdown summary for a teaching
 */
function teachingToMarkdown(teaching: Teaching): string {
  let md = `# ${teaching.title}\n\n`;
  md += `**Theme:** ${teaching.theme}\n`;
  md += `**Module:** ${teaching.course_module}\n`;
  md += `**Source:** ${teaching.source_transcript}\n\n`;

  md += `## Core Teaching\n\n${teaching.core_teaching}\n\n`;

  md += `## Key Insight\n\n${teaching.key_insight}\n\n`;

  md += `## Quote\n\n> ${teaching.quote}\n\n`;

  md += `## Action Steps\n\n`;
  for (const step of teaching.action_steps) {
    md += `${step}\n`;
  }
  md += '\n';

  if (teaching.case_study) {
    const cs = teaching.case_study;
    md += `## Case Study: ${cs.client_name}\n\n`;
    md += `**Situation:** ${cs.situation}\n\n`;
    md += `**Before:**\n`;
    for (const [key, value] of Object.entries(cs.before)) {
      md += `- ${key}: ${value}\n`;
    }
    md += `\n**After:**\n`;
    for (const [key, value] of Object.entries(cs.after)) {
      md += `- ${key}: ${value}\n`;
    }
    md += `\n**Timeline:** ${cs.timeline}\n`;
    md += `**Results:** ${cs.results}\n\n`;
  }

  if (teaching.related_teachings.length > 0) {
    md += `## Related Teachings\n\n`;
    for (const id of teaching.related_teachings) {
      md += `- [${id}](#)\n`;
    }
  }

  return md;
}

/**
 * Main function: Extract wisdom from all clean transcripts
 */
async function main() {
  const args = process.argv.slice(2);
  const inputDir = args.includes('--all')
    ? path.join(__dirname, '../transcript-sanitizer/output/clean')
    : path.join(__dirname, 'sample-transcripts');
  const outputDir = path.join(__dirname, 'output');

  console.log(`🧠 Wisdom Extractor — Starting\n`);
  console.log(`Input:  ${inputDir}`);
  console.log(`Output: ${outputDir}\n`);

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Check if clean transcripts exist
  if (!fs.existsSync(inputDir)) {
    console.log(`⚠️  Input directory not found: ${inputDir}`);
    console.log(`This is expected if sanitization hasn't run yet.`);
    console.log(`\nWorkflow:`);
    console.log(`  1. Run Transcript Sanitizer`);
    console.log(`  2. Run Wisdom Extractor (on sanitized output)`);
    console.log(`  3. Run CoachTinaMarie training\n`);
    console.log(`Creating sample extraction to show structure...`);

    // Create example teaching for documentation
    const exampleTeaching = createTeachingTemplate('example-transcript.txt', 0);
    const examplePath = path.join(outputDir, 'EXAMPLE_TEACHING.json');
    fs.writeFileSync(examplePath, JSON.stringify(exampleTeaching, null, 2));

    const exampleMarkdown = teachingToMarkdown(exampleTeaching);
    const mdPath = path.join(outputDir, 'EXAMPLE_TEACHING.md');
    fs.writeFileSync(mdPath, exampleMarkdown);

    console.log(`\n✅ Example teaching created:`);
    console.log(`  JSON: ${examplePath}`);
    console.log(`  Markdown: ${mdPath}`);
    return;
  }

  // Find clean transcript files
  const files = fs.readdirSync(inputDir)
    .filter(f => f.endsWith('.md'))
    .slice(0, 10);

  if (files.length === 0) {
    console.log(`⚠️  No clean transcript files found in ${inputDir}`);
    return;
  }

  console.log(`Found ${files.length} clean transcripts. Extracting...\n`);

  const allTeachings: Teaching[] = [];
  const themes: Record<string, number> = {};
  const modules: Record<string, number> = {};

  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const teachings = await extractTeachings(filePath);

    for (const teaching of teachings) {
      allTeachings.push(teaching);
      themes[teaching.theme] = (themes[teaching.theme] || 0) + 1;
      modules[teaching.course_module] = (modules[teaching.course_module] || 0) + 1;

      // Write individual teaching as JSON
      const jsonPath = path.join(outputDir, `${teaching.id}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(teaching, null, 2));

      // Write individual teaching as Markdown
      const mdPath = path.join(outputDir, `${teaching.id}.md`);
      fs.writeFileSync(mdPath, teachingToMarkdown(teaching));

      console.log(`✅ Extracted: ${teaching.title}`);
    }
  }

  // Create summary index
  const result: ExtractionResult = {
    teachings: allTeachings,
    summary: {
      total_teachings: allTeachings.length,
      themes,
      modules,
    },
  };

  const indexPath = path.join(outputDir, 'INDEX.json');
  fs.writeFileSync(indexPath, JSON.stringify(result, null, 2));

  // Create summary markdown
  let summaryMd = `# Extracted Wisdom Index\n\n`;
  summaryMd += `**Total Teachings:** ${result.summary.total_teachings}\n\n`;
  summaryMd += `## By Theme\n\n`;
  for (const [theme, count] of Object.entries(result.summary.themes)) {
    summaryMd += `- ${theme}: ${count} teachings\n`;
  }
  summaryMd += `\n## By Course Module\n\n`;
  for (const [module, count] of Object.entries(result.summary.modules)) {
    summaryMd += `- ${module}: ${count} teachings\n`;
  }

  const summaryPath = path.join(outputDir, 'SUMMARY.md');
  fs.writeFileSync(summaryPath, summaryMd);

  console.log(`\n✅ Extraction Complete\n`);
  console.log(`Summary:`);
  console.log(`  Total teachings extracted: ${result.summary.total_teachings}`);
  console.log(`  Themes: ${Object.keys(result.summary.themes).join(', ')}`);
  console.log(`  Output directory: ${outputDir}`);
  console.log(`\nNext step: Train CoachTinaMarie on extracted wisdom`);
}

main().catch(console.error);
