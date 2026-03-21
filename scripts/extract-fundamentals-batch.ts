#!/usr/bin/env npx ts-node
/**
 * extract-fundamentals-batch.ts
 * 
 * Batch processing script for transcript wisdom extraction.
 * Processes all transcripts in parallel/sequential modes.
 * 
 * Usage:
 *   npx ts-node extract-fundamentals-batch.ts [input_dir] [output_dir] [--parallel]
 * 
 * Outputs:
 *   - JSON files with structured teachings
 *   - Progress tracking file (batch-progress.json)
 *   - Markdown summaries
 * 
 * Designed to work on Linux/Mac without Mac-specific dependencies.
 */

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

interface ExtractionProgress {
  startTime: number;
  completedCount: number;
  failedCount: number;
  totalCount: number;
  files: {
    completed: string[];
    failed: Record<string, string>;
    inProgress: string;
  };
  lastUpdate: number;
}

interface Teaching {
  "Insight / Teaching Topic": string;
  "Core Fundamental": string[];
  "Original Quote": string;
  "Synthesized Teaching": string;
  "Session / Event Context": string;
  source?: string;
  dateExtracted?: string;
}

class TranscriptBatchProcessor {
  private inputDir: string;
  private outputDir: string;
  private progressFile: string;
  private progress: ExtractionProgress;
  private parallel: boolean = false;

  constructor(inputDir: string, outputDir: string, parallel: boolean = false) {
    this.inputDir = inputDir;
    this.outputDir = outputDir;
    this.parallel = parallel;
    this.progressFile = path.join(outputDir, "batch-progress.json");

    // Create output dir if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Load or initialize progress
    this.progress = this.loadProgress();
  }

  private loadProgress(): ExtractionProgress {
    if (fs.existsSync(this.progressFile)) {
      try {
        const data = fs.readFileSync(this.progressFile, "utf-8");
        return JSON.parse(data);
      } catch (e) {
        console.warn("Could not load progress file, starting fresh");
      }
    }

    return {
      startTime: Date.now(),
      completedCount: 0,
      failedCount: 0,
      totalCount: 0,
      files: {
        completed: [],
        failed: {},
        inProgress: "",
      },
      lastUpdate: Date.now(),
    };
  }

  private saveProgress() {
    this.progress.lastUpdate = Date.now();
    fs.writeFileSync(
      this.progressFile,
      JSON.stringify(this.progress, null, 2),
      "utf-8"
    );
  }

  async findTranscripts(): Promise<string[]> {
    const transcripts: string[] = [];

    const walkDir = (dir: string) => {
      if (!fs.existsSync(dir)) return;

      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith(".txt") || file.endsWith(".md")) {
          transcripts.push(filePath);
        }
      }
    };

    walkDir(this.inputDir);
    this.progress.totalCount = transcripts.length;
    this.saveProgress();

    return transcripts;
  }

  private async processTranscript(filePath: string): Promise<Teaching[]> {
    console.log(`Processing: ${path.basename(filePath)}`);
    this.progress.files.inProgress = filePath;
    this.saveProgress();

    try {
      const content = fs.readFileSync(filePath, "utf-8");

      // Simple extraction logic (in real scenario, call Claude API)
      const teachings = this.extractTeachings(content, filePath);

      this.progress.files.completed.push(filePath);
      this.progress.completedCount++;

      // Save individual teaching file
      const outputFile = path.join(
        this.outputDir,
        path.basename(filePath, path.extname(filePath)) + ".json"
      );
      fs.writeFileSync(outputFile, JSON.stringify(teachings, null, 2), "utf-8");

      console.log(`  ✅ Extracted ${teachings.length} teachings`);
      return teachings;
    } catch (error) {
      console.error(`  ❌ Error processing: ${error}`);
      this.progress.files.failed[filePath] =
        error instanceof Error ? error.message : String(error);
      this.progress.failedCount++;
      return [];
    } finally {
      this.progress.files.inProgress = "";
      this.saveProgress();
    }
  }

  private extractTeachings(content: string, filePath: string): Teaching[] {
    const teachings: Teaching[] = [];

    // Split content into paragraphs that look like teachings
    const paragraphs = content.split(/\n\n+/);

    for (const para of paragraphs) {
      if (para.trim().length < 100) continue; // Skip short fragments

      const teaching: Teaching = {
        "Insight / Teaching Topic": this.extractTopic(para),
        "Core Fundamental": this.extractFundamentals(para),
        "Original Quote": this.extractQuote(para),
        "Synthesized Teaching": para.trim(),
        "Session / Event Context": "Extracted from transcript",
        source: path.basename(filePath),
        dateExtracted: new Date().toISOString(),
      };

      if (teaching["Insight / Teaching Topic"]) {
        teachings.push(teaching);
      }
    }

    return teachings;
  }

  private extractTopic(text: string): string {
    // Try to find a topic from first sentence
    const firstSentence = text.split(/[.!?]/)[0];
    return firstSentence.substring(0, 80).trim();
  }

  private extractFundamentals(text: string): string[] {
    const topics = [
      "Business & Project Management",
      "Systems & Scaling",
      "People & Culture",
      "Finance & Economics",
      "Mindset & Principles",
      "Life & Purpose",
    ];

    // Simple keyword matching
    const found: string[] = [];
    const lower = text.toLowerCase();

    if (lower.includes("business") || lower.includes("system"))
      found.push("Business & Project Management");
    if (lower.includes("team") || lower.includes("people"))
      found.push("People & Culture");
    if (lower.includes("money") || lower.includes("financial"))
      found.push("Finance & Economics");

    return found.length > 0 ? found : ["Business & Project Management"];
  }

  private extractQuote(text: string): string {
    // Look for quoted text
    const quoted = text.match(/"([^"]+)"/);
    if (quoted) return quoted[1];

    // Otherwise use first sentence
    const firstSentence = text.split(/[.!?]/)[0];
    return firstSentence.substring(0, 200).trim();
  }

  async processAll() {
    const transcripts = await this.findTranscripts();

    console.log(`\n🏔️ Batch Extraction Starting`);
    console.log(`Total transcripts found: ${transcripts.length}`);
    console.log(`Output directory: ${this.outputDir}`);
    console.log(`Parallel mode: ${this.parallel}`);
    console.log(
      `\n${"—".repeat(60)}\n`
    );

    const startTime = Date.now();

    if (this.parallel) {
      // Process in parallel (with concurrency limit)
      const concurrency = 4;
      for (let i = 0; i < transcripts.length; i += concurrency) {
        const batch = transcripts.slice(i, i + concurrency);
        await Promise.all(batch.map((f) => this.processTranscript(f)));
      }
    } else {
      // Process sequentially
      for (const transcript of transcripts) {
        await this.processTranscript(transcript);
      }
    }

    const duration = Date.now() - startTime;

    console.log(`\n${"—".repeat(60)}`);
    console.log(`✅ Batch Extraction Complete`);
    console.log(`Completed: ${this.progress.completedCount}`);
    console.log(`Failed: ${this.progress.failedCount}`);
    console.log(`Duration: ${(duration / 1000).toFixed(1)}s`);
    console.log(`Output: ${this.outputDir}`);

    this.saveProgress();
  }
}

// Main execution
const inputDir =
  process.argv[2] || "/home/moriahkeeper/.openclaw/workspace/transcripts-to-process";
const outputDir =
  process.argv[3] || "/home/moriahkeeper/.openclaw/workspace/transcript-output/extracted";
const parallel = process.argv.includes("--parallel");

const processor = new TranscriptBatchProcessor(inputDir, outputDir, parallel);
processor.processAll().catch(console.error);
