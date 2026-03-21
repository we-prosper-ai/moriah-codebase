import { TranscriptPipelineOrchestrator } from "./orchestrator";
import { OrchestrationConfig } from "./types";
// @ts-ignore - chalk has ESM export issues
import chalk from "chalk";

async function main() {
  const config: OrchestrationConfig = {
    // URLs to local services
    sanitizerUrl:
      process.env.SANITIZER_URL || "http://localhost:5001",
    extractorUrl:
      process.env.EXTRACTOR_URL || "http://localhost:5002",
    
    // Input/output directories
    inputDir: process.env.INPUT_DIR || "./data/transcripts",
    outputDir: process.env.OUTPUT_DIR || "./data/output",
    
    // Concurrency and rate limiting
    maxConcurrency: parseInt(process.env.MAX_CONCURRENCY || "1"),
    pauseMs: parseInt(process.env.PAUSE_MS || "500"), // 500ms between requests
  };

  console.log(chalk.cyan("\n🏔️  Transcript Pipeline Orchestrator\n"));
  console.log(chalk.gray("Configuration:"));
  console.log(`  Sanitizer: ${config.sanitizerUrl}`);
  console.log(`  Extractor: ${config.extractorUrl}`);
  console.log(`  Input: ${config.inputDir}`);
  console.log(`  Output: ${config.outputDir}`);
  console.log(`  Pause between requests: ${config.pauseMs}ms\n`);

  const orchestrator = new TranscriptPipelineOrchestrator(config);

  try {
    const result = await orchestrator.run();

    // Exit with appropriate code
    if (result.status === "success") {
      process.exit(0);
    } else if (result.status === "partial") {
      process.exit(1);
    } else {
      process.exit(2);
    }
  } catch (error) {
    console.error(chalk.red("Fatal error:"), error);
    process.exit(3);
  }
}

main();
