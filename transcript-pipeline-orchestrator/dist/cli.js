#!/usr/bin/env ts-node
"use strict";
/**
 * CLI for processing transcripts
 * Usage: npm run process-transcripts -- --input /path/to/transcripts --output /path/to/output
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orchestrator_1 = require("./orchestrator");
// @ts-ignore - chalk has ESM export issues
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs-extra"));
function parseArgs() {
    const args = {};
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
    const config = {
        sanitizerUrl: args["sanitizer"] || process.env.SANITIZER_URL || "http://localhost:5001",
        extractorUrl: args["extractor"] || process.env.EXTRACTOR_URL || "http://localhost:5002",
        inputDir: args["input"] || process.env.INPUT_DIR || "./data/transcripts",
        outputDir: args["output"] || process.env.OUTPUT_DIR || "./data/output",
        maxConcurrency: parseInt(args["concurrency"] || process.env.MAX_CONCURRENCY || "1"),
        pauseMs: parseInt(args["pause"] || process.env.PAUSE_MS || "500"),
    };
    // Ensure directories exist
    await fs.ensureDir(config.inputDir);
    await fs.ensureDir(config.outputDir);
    console.log(chalk_1.default.cyan("\n🏔️  Transcript Pipeline - CLI\n"));
    console.log(chalk_1.default.white("Configuration:"));
    console.log(chalk_1.default.gray("  Sanitizer:     ") + config.sanitizerUrl);
    console.log(chalk_1.default.gray("  Extractor:     ") + config.extractorUrl);
    console.log(chalk_1.default.gray("  Input Dir:     ") + config.inputDir);
    console.log(chalk_1.default.gray("  Output Dir:    ") + config.outputDir);
    console.log(chalk_1.default.gray("  Pause (ms):    ") + config.pauseMs);
    // Check if input directory has files
    const files = await fs.readdir(config.inputDir);
    const mdFiles = files.filter((f) => f.endsWith(".md") || f.endsWith(".txt"));
    if (mdFiles.length === 0) {
        console.log(chalk_1.default.yellow(`\n⚠️  No .md or .txt files found in ${config.inputDir}\n`));
        console.log(chalk_1.default.gray("Add transcript files and try again.\n"));
        process.exit(1);
    }
    console.log(chalk_1.default.cyan(`\nFound ${mdFiles.length} transcript file(s):\n`));
    for (const file of mdFiles) {
        console.log(chalk_1.default.gray(`  - ${file}`));
    }
    console.log();
    try {
        const orchestrator = new orchestrator_1.TranscriptPipelineOrchestrator(config);
        const result = await orchestrator.run();
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
        console.error(chalk_1.default.red("\nFatal error:"), error);
        process.exit(3);
    }
}
main();
//# sourceMappingURL=cli.js.map