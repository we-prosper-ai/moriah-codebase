#!/usr/bin/env ts-node

/**
 * CLI for processing transcripts
 * Usage: npm run process-transcripts -- --input /path/to/transcripts --output /path/to/output
 */

import { TranscriptPipelineOrchestrator } from "./orchestrator";
import { OrchestrationConfig } from "./types";
// @ts-ignore - chalk has ESM export issues
import chalk from "chalk";
import * as fs from "fs-extra";
import * as path from "path";

function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = process.argv[i + 1];
      if (value && !value.startsWith("--")) {
        args[key] = value;
        i++;
      }
    }
  }
  return args;
}

async function main() {
  const args = parseArgs();

  const config: OrchestrationConfig = {
    sanitizerUrl:
      args["sanitizer"] || process.env.SANITIZER_URL || "http://localhost:5001",
    extractorUrl:
      args["extractor"] || process.env.EXTRACTOR_URL || "http://localhost:5002",
    inputDir: args["input"] || process.env.INPUT_DIR || "./data/transcripts",
    outputDir: args["output"] || process.env.OUTPUT_DIR || "./data/output",
    maxConcurrency: parseInt(
      args["concurrency"] || process.env.MAX_CONCURRENCY || "1"
    ),
    pauseMs: parseInt(args["pause"] || process.env.PAUSE_MS || "500"),
  };

  // Ensure directories exist
  await fs.ensureDir(config.inputDir);
  await fs.ensureDir(config.outputDir);

  console.log(chalk.cyan("\n🏔️  Transcript Pipeline - CLI\n"));
  console.log(chalk.white("Configuration:"));
  console.log(
    chalk.gray("  Sanitizer:     ") + config.sanitizerUrl
  );
  console.log(chalk.gray("  Extractor:     ") + config.extractorUrl);
  console.log(chalk.gray("  Input Dir:     ") + config.inputDir);
  console.log(chalk.gray("  Output Dir:    ") + config.outputDir);
  console.log(
    chalk.gray("  Pause (ms):    ") + config.pauseMs
  );

  // Check if input directory has files
  const files = await fs.readdir(config.inputDir);
  const mdFiles = files.filter((f) => f.endsWith(".md") || f.endsWith(".txt"));

  if (mdFiles.length === 0) {
    console.log(
      chalk.yellow(
        `\n⚠️  No .md or .txt files found in ${config.inputDir}\n`
      )
    );
    console.log(chalk.gray("Add transcript files and try again.\n"));
    process.exit(1);
  }

  console.log(
    chalk.cyan(`\nFound ${mdFiles.length} transcript file(s):\n`)
  );
  for (const file of mdFiles) {
    console.log(chalk.gray(`  - ${file}`));
  }
  console.log();

  try {
    const orchestrator = new TranscriptPipelineOrchestrator(config);
    const result = await orchestrator.run();

    if (result.status === "success") {
      process.exit(0);
    } else if (result.status === "partial") {
      process.exit(1);
    } else {
      process.exit(2);
    }
  } catch (error) {
    console.error(chalk.red("\nFatal error:"), error);
    process.exit(3);
  }
}

main();
