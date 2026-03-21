"use strict";
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
exports.TranscriptPipelineOrchestrator = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const glob = __importStar(require("glob"));
// @ts-ignore - chalk has ESM export issues
const chalk_1 = __importDefault(require("chalk"));
class TranscriptPipelineOrchestrator {
    constructor(config) {
        this.config = config;
        this.pipelineId = (0, uuid_1.v4)();
        this.sanitizer = axios_1.default.create({
            baseURL: config.sanitizerUrl,
            timeout: 60000,
        });
        this.extractor = axios_1.default.create({
            baseURL: config.extractorUrl,
            timeout: 60000,
        });
    }
    async run() {
        const result = {
            pipelineId: this.pipelineId,
            status: "success",
            startedAt: new Date().toISOString(),
            completedAt: "",
            input: {
                totalFiles: 0,
                totalSize: 0,
            },
            sanitization: {
                successful: 0,
                failed: 0,
                totalPIIRemoved: 0,
            },
            extraction: {
                successful: 0,
                failed: 0,
                totalTeachingsExtracted: 0,
            },
            errors: [],
            outputPaths: {
                sanitizedDir: path.join(this.config.outputDir, "sanitized"),
                teachingsJson: path.join(this.config.outputDir, "teachings.json"),
                teachingsMarkdown: path.join(this.config.outputDir, "teachings.md"),
                auditLog: path.join(this.config.outputDir, `pipeline-audit-${this.pipelineId}.json`),
            },
        };
        try {
            console.log(chalk_1.default.cyan(`\n🏔️  Transcript Pipeline Orchestrator [${this.pipelineId}]`));
            console.log(chalk_1.default.gray("═".repeat(60)));
            // Phase 1: Load transcripts
            console.log(chalk_1.default.blue("\n📂 Phase 1: Loading transcripts..."));
            const files = await this.loadTranscripts();
            result.input.totalFiles = files.length;
            result.input.totalSize = files.reduce((sum, f) => sum + f.content.length, 0);
            console.log(chalk_1.default.green(`✅ Loaded ${files.length} transcripts`));
            if (files.length === 0) {
                console.log(chalk_1.default.yellow("⚠️  No transcript files found. Exiting."));
                result.status = "success";
                result.completedAt = new Date().toISOString();
                return result;
            }
            // Phase 2: Sanitize transcripts
            console.log(chalk_1.default.blue("\n🔐 Phase 2: Sanitizing PII..."));
            const sanitized = await this.sanitizeTranscripts(files, result);
            console.log(chalk_1.default.green(`✅ Sanitized ${result.sanitization.successful} / ${files.length}`));
            // Phase 3: Extract teachings
            console.log(chalk_1.default.blue("\n✨ Phase 3: Extracting teachings..."));
            const teachings = await this.extractTeachings(sanitized, result);
            console.log(chalk_1.default.green(`✅ Extracted ${result.extraction.successful} teachings`));
            // Phase 4: Generate output
            console.log(chalk_1.default.blue("\n📄 Phase 4: Generating output..."));
            await this.generateOutput(teachings, result);
            console.log(chalk_1.default.green("✅ Output generated"));
            result.completedAt = new Date().toISOString();
            // Print summary
            this.printSummary(result);
            return result;
        }
        catch (error) {
            result.status = "failed";
            result.completedAt = new Date().toISOString();
            result.errors.push({
                filename: "pipeline",
                stage: "sanitization",
                error: `${error}`,
            });
            console.error(chalk_1.default.red("\n❌ Pipeline failed:"), error);
            return result;
        }
    }
    async loadTranscripts() {
        await fs.ensureDir(this.config.inputDir);
        // Support both .md and .txt files
        const pattern = path.join(this.config.inputDir, "**/*.{md,txt}");
        const files = glob.sync(pattern);
        const transcripts = [];
        for (const filepath of files) {
            try {
                const content = await fs.readFile(filepath, "utf-8");
                transcripts.push({
                    path: filepath,
                    filename: path.basename(filepath),
                    content,
                });
            }
            catch (error) {
                console.warn(chalk_1.default.yellow(`⚠️  Could not read ${filepath}:`, error));
            }
        }
        return transcripts;
    }
    async sanitizeTranscripts(files, result) {
        await fs.ensureDir(result.outputPaths.sanitizedDir);
        const sanitized = [];
        for (const file of files) {
            try {
                // Small delay to avoid rate limiting
                await this.delay(this.config.pauseMs);
                console.log(chalk_1.default.gray(`  → ${file.filename}`));
                const response = await this.sanitizer.post("/sanitize", {
                    content: file.content,
                    filename: file.filename,
                });
                const data = response.data;
                const sanitizedItem = {
                    fileId: data.fileId,
                    filename: file.filename,
                    originalPath: file.path,
                    cleanContent: data.cleanContent,
                    metadata: data.metadata,
                    piiRemoved: {
                        count: data.piiRemoved?.count || 0,
                        types: data.piiRemoved?.types || {},
                    },
                    processedAt: new Date().toISOString(),
                };
                // Save clean transcript to disk
                const cleanPath = path.join(result.outputPaths.sanitizedDir, `${sanitizedItem.fileId}.md`);
                await fs.writeFile(cleanPath, sanitizedItem.cleanContent, "utf-8");
                sanitized.push(sanitizedItem);
                result.sanitization.successful++;
                result.sanitization.totalPIIRemoved += sanitizedItem.piiRemoved.count;
                console.log(chalk_1.default.green(`    ✅ ${sanitizedItem.piiRemoved.count} PII items removed`));
            }
            catch (error) {
                result.sanitization.failed++;
                result.errors.push({
                    filename: file.filename,
                    stage: "sanitization",
                    error: `${error}`,
                });
                console.error(chalk_1.default.red(`    ❌ Error: ${error}`));
            }
        }
        return sanitized;
    }
    async extractTeachings(sanitized, result) {
        const teachings = [];
        const batchId = (0, uuid_1.v4)();
        for (const item of sanitized) {
            try {
                // Small delay to avoid rate limiting
                await this.delay(this.config.pauseMs);
                console.log(chalk_1.default.gray(`  → ${item.filename}`));
                const response = await this.extractor.post("/extract", {
                    content: item.cleanContent,
                    metadata: {
                        sourceFile: item.filename,
                        fileId: item.fileId,
                        speakers: item.metadata.speakers,
                        themes: item.metadata.themes,
                    },
                });
                const extracted = response.data.teachings || [];
                for (const teaching of extracted) {
                    const full = {
                        id: (0, uuid_1.v4)(),
                        batchId,
                        sourceFileId: item.fileId,
                        title: teaching.title || "",
                        coreIdea: teaching.coreIdea || "",
                        insights: teaching.insights || [],
                        actionSteps: teaching.actionSteps || [],
                        quotes: teaching.quotes || [],
                        caseStudies: teaching.caseStudies || [],
                        relatedTeachings: teaching.relatedTeachings || [],
                        module: teaching.module || "Uncategorized",
                        tags: teaching.tags || [],
                        processedAt: new Date().toISOString(),
                    };
                    teachings.push(full);
                }
                result.extraction.successful++;
                result.extraction.totalTeachingsExtracted += extracted.length;
                console.log(chalk_1.default.green(`    ✅ Extracted ${extracted.length} teachings`));
            }
            catch (error) {
                result.extraction.failed++;
                result.errors.push({
                    filename: item.filename,
                    stage: "extraction",
                    error: `${error}`,
                });
                console.error(chalk_1.default.red(`    ❌ Error: ${error}`));
            }
        }
        return teachings;
    }
    async generateOutput(teachings, result) {
        // Save as JSON
        await fs.writeFile(result.outputPaths.teachingsJson, JSON.stringify(teachings, null, 2), "utf-8");
        // Generate Markdown summary
        let markdown = "# Extracted Teachings\n\n" +
            `Generated: ${new Date().toISOString()}\n` +
            `Total teachings: ${teachings.length}\n\n`;
        // Group by module
        const byModule = {};
        for (const teaching of teachings) {
            if (!byModule[teaching.module]) {
                byModule[teaching.module] = [];
            }
            byModule[teaching.module].push(teaching);
        }
        for (const [module, moduleTeachings] of Object.entries(byModule)) {
            markdown += `## ${module}\n\n`;
            for (const teaching of moduleTeachings) {
                markdown += `### ${teaching.title}\n\n`;
                markdown += `**Core Idea:** ${teaching.coreIdea}\n\n`;
                if (teaching.actionSteps.length > 0) {
                    markdown += "**Action Steps:**\n";
                    for (const step of teaching.actionSteps) {
                        markdown += `- ${step}\n`;
                    }
                    markdown += "\n";
                }
                if (teaching.quotes.length > 0) {
                    markdown += "**Key Quotes:**\n";
                    for (const quote of teaching.quotes) {
                        markdown += `> ${quote}\n\n`;
                    }
                }
            }
        }
        await fs.writeFile(result.outputPaths.teachingsMarkdown, markdown, "utf-8");
        // Save audit log
        await fs.writeFile(result.outputPaths.auditLog, JSON.stringify(result, null, 2), "utf-8");
    }
    printSummary(result) {
        console.log(chalk_1.default.gray("\n" + "═".repeat(60)));
        console.log(chalk_1.default.cyan("\n📊 Pipeline Summary\n"));
        console.log(chalk_1.default.white("Input:"));
        console.log(`  Files: ${result.input.totalFiles}`);
        console.log(`  Size: ${(result.input.totalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(chalk_1.default.white("\nSanitization:"));
        console.log(`  ✅ Successful: ${result.sanitization.successful}`);
        console.log(`  ❌ Failed: ${result.sanitization.failed}`);
        console.log(`  PII Removed: ${result.sanitization.totalPIIRemoved} items`);
        console.log(chalk_1.default.white("\nExtraction:"));
        console.log(`  ✅ Successful: ${result.extraction.successful}`);
        console.log(`  ❌ Failed: ${result.extraction.failed}`);
        console.log(`  Teachings: ${result.extraction.totalTeachingsExtracted} extracted`);
        if (result.errors.length > 0) {
            console.log(chalk_1.default.yellow("\nErrors:"));
            for (const error of result.errors) {
                console.log(`  - ${error.filename}: ${error.error}`);
            }
        }
        console.log(chalk_1.default.white("\nOutput:"));
        console.log(`  📁 Sanitized: ${result.outputPaths.sanitizedDir}`);
        console.log(`  📄 Teachings (JSON): ${result.outputPaths.teachingsJson}`);
        console.log(`  📝 Teachings (Markdown): ${result.outputPaths.teachingsMarkdown}`);
        console.log(`  🔍 Audit Log: ${result.outputPaths.auditLog}`);
        console.log(chalk_1.default.gray("\n" + "═".repeat(60) + "\n"));
        if (result.status === "success") {
            console.log(chalk_1.default.green(`✅ Pipeline completed successfully\n`));
        }
        else if (result.status === "partial") {
            console.log(chalk_1.default.yellow(`⚠️  Pipeline completed with errors\n`));
        }
        else {
            console.log(chalk_1.default.red(`❌ Pipeline failed\n`));
        }
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.TranscriptPipelineOrchestrator = TranscriptPipelineOrchestrator;
//# sourceMappingURL=orchestrator.js.map