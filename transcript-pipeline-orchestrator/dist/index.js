"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orchestrator_1 = require("./orchestrator");
// @ts-ignore - chalk has ESM export issues
const chalk_1 = __importDefault(require("chalk"));
async function main() {
    const config = {
        // URLs to local services
        sanitizerUrl: process.env.SANITIZER_URL || "http://localhost:5001",
        extractorUrl: process.env.EXTRACTOR_URL || "http://localhost:5002",
        // Input/output directories
        inputDir: process.env.INPUT_DIR || "./data/transcripts",
        outputDir: process.env.OUTPUT_DIR || "./data/output",
        // Concurrency and rate limiting
        maxConcurrency: parseInt(process.env.MAX_CONCURRENCY || "1"),
        pauseMs: parseInt(process.env.PAUSE_MS || "500"), // 500ms between requests
    };
    console.log(chalk_1.default.cyan("\n🏔️  Transcript Pipeline Orchestrator\n"));
    console.log(chalk_1.default.gray("Configuration:"));
    console.log(`  Sanitizer: ${config.sanitizerUrl}`);
    console.log(`  Extractor: ${config.extractorUrl}`);
    console.log(`  Input: ${config.inputDir}`);
    console.log(`  Output: ${config.outputDir}`);
    console.log(`  Pause between requests: ${config.pauseMs}ms\n`);
    const orchestrator = new orchestrator_1.TranscriptPipelineOrchestrator(config);
    try {
        const result = await orchestrator.run();
        // Exit with appropriate code
        if (result.status === "success") {
            process.exit(0);
        }
        else if (result.status === "partial") {
            process.exit(1);
        }
        else {
            process.exit(2);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red("Fatal error:"), error);
        process.exit(3);
    }
}
main();
//# sourceMappingURL=index.js.map