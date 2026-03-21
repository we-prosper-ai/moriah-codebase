import axios, { AxiosInstance } from "axios";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs-extra";
import * as path from "path";
import * as glob from "glob";
// @ts-ignore - chalk has ESM export issues
import chalk from "chalk";
import {
  TranscriptFile,
  SanitizedTranscript,
  ExtractedTeaching,
  PipelineResult,
  OrchestrationConfig,
} from "./types";

export class TranscriptPipelineOrchestrator {
  private sanitizer: AxiosInstance;
  private extractor: AxiosInstance;
  private config: OrchestrationConfig;
  private pipelineId: string;

  constructor(config: OrchestrationConfig) {
    this.config = config;
    this.pipelineId = uuidv4();

    this.sanitizer = axios.create({
      baseURL: config.sanitizerUrl,
      timeout: 60000,
    });

    this.extractor = axios.create({
      baseURL: config.extractorUrl,
      timeout: 60000,
    });
  }

  async run(): Promise<PipelineResult> {
    const result: PipelineResult = {
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
        auditLog: path.join(
          this.config.outputDir,
          `pipeline-audit-${this.pipelineId}.json`
        ),
      },
    };

    try {
      console.log(
        chalk.cyan(`\n🏔️  Transcript Pipeline Orchestrator [${this.pipelineId}]`)
      );
      console.log(chalk.gray("═".repeat(60)));

      // Phase 1: Load transcripts
      console.log(chalk.blue("\n📂 Phase 1: Loading transcripts..."));
      const files = await this.loadTranscripts();
      result.input.totalFiles = files.length;
      result.input.totalSize = files.reduce((sum, f) => sum + f.content.length, 0);
      console.log(chalk.green(`✅ Loaded ${files.length} transcripts`));

      if (files.length === 0) {
        console.log(chalk.yellow("⚠️  No transcript files found. Exiting."));
        result.status = "success";
        result.completedAt = new Date().toISOString();
        return result;
      }

      // Phase 2: Sanitize transcripts
      console.log(chalk.blue("\n🔐 Phase 2: Sanitizing PII..."));
      const sanitized = await this.sanitizeTranscripts(files, result);
      console.log(
        chalk.green(
          `✅ Sanitized ${result.sanitization.successful} / ${files.length}`
        )
      );

      // Phase 3: Extract teachings
      console.log(chalk.blue("\n✨ Phase 3: Extracting teachings..."));
      const teachings = await this.extractTeachings(sanitized, result);
      console.log(
        chalk.green(
          `✅ Extracted ${result.extraction.successful} teachings`
        )
      );

      // Phase 4: Generate output
      console.log(chalk.blue("\n📄 Phase 4: Generating output..."));
      await this.generateOutput(teachings, result);
      console.log(chalk.green("✅ Output generated"));

      result.completedAt = new Date().toISOString();

      // Print summary
      this.printSummary(result);

      return result;
    } catch (error) {
      result.status = "failed";
      result.completedAt = new Date().toISOString();
      result.errors.push({
        filename: "pipeline",
        stage: "sanitization",
        error: `${error}`,
      });

      console.error(chalk.red("\n❌ Pipeline failed:"), error);
      return result;
    }
  }

  private async loadTranscripts(): Promise<TranscriptFile[]> {
    await fs.ensureDir(this.config.inputDir);

    // Support both .md and .txt files
    const pattern = path.join(this.config.inputDir, "**/*.{md,txt}");
    const files = glob.sync(pattern);

    const transcripts: TranscriptFile[] = [];

    for (const filepath of files) {
      try {
        const content = await fs.readFile(filepath, "utf-8");
        transcripts.push({
          path: filepath,
          filename: path.basename(filepath),
          content,
        });
      } catch (error) {
        console.warn(chalk.yellow(`⚠️  Could not read ${filepath}:`, error));
      }
    }

    return transcripts;
  }

  private async sanitizeTranscripts(
    files: TranscriptFile[],
    result: PipelineResult
  ): Promise<SanitizedTranscript[]> {
    await fs.ensureDir(result.outputPaths.sanitizedDir);

    const sanitized: SanitizedTranscript[] = [];

    for (const file of files) {
      try {
        // Small delay to avoid rate limiting
        await this.delay(this.config.pauseMs);

        console.log(chalk.gray(`  → ${file.filename}`));

        const response = await this.sanitizer.post("/sanitize", {
          content: file.content,
          filename: file.filename,
        });

        const data = response.data;

        const sanitizedItem: SanitizedTranscript = {
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
        const cleanPath = path.join(
          result.outputPaths.sanitizedDir,
          `${sanitizedItem.fileId}.md`
        );
        await fs.writeFile(cleanPath, sanitizedItem.cleanContent, "utf-8");

        sanitized.push(sanitizedItem);
        result.sanitization.successful++;
        result.sanitization.totalPIIRemoved += sanitizedItem.piiRemoved.count;

        console.log(
          chalk.green(
            `    ✅ ${sanitizedItem.piiRemoved.count} PII items removed`
          )
        );
      } catch (error) {
        result.sanitization.failed++;
        result.errors.push({
          filename: file.filename,
          stage: "sanitization",
          error: `${error}`,
        });
        console.error(chalk.red(`    ❌ Error: ${error}`));
      }
    }

    return sanitized;
  }

  private async extractTeachings(
    sanitized: SanitizedTranscript[],
    result: PipelineResult
  ): Promise<ExtractedTeaching[]> {
    const teachings: ExtractedTeaching[] = [];
    const batchId = uuidv4();

    for (const item of sanitized) {
      try {
        // Small delay to avoid rate limiting
        await this.delay(this.config.pauseMs);

        console.log(chalk.gray(`  → ${item.filename}`));

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
          const full: ExtractedTeaching = {
            id: uuidv4(),
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
        console.log(
          chalk.green(`    ✅ Extracted ${extracted.length} teachings`)
        );
      } catch (error) {
        result.extraction.failed++;
        result.errors.push({
          filename: item.filename,
          stage: "extraction",
          error: `${error}`,
        });
        console.error(chalk.red(`    ❌ Error: ${error}`));
      }
    }

    return teachings;
  }

  private async generateOutput(
    teachings: ExtractedTeaching[],
    result: PipelineResult
  ): Promise<void> {
    // Save as JSON
    await fs.writeFile(
      result.outputPaths.teachingsJson,
      JSON.stringify(teachings, null, 2),
      "utf-8"
    );

    // Generate Markdown summary
    let markdown =
      "# Extracted Teachings\n\n" +
      `Generated: ${new Date().toISOString()}\n` +
      `Total teachings: ${teachings.length}\n\n`;

    // Group by module
    const byModule: Record<string, ExtractedTeaching[]> = {};
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
    await fs.writeFile(
      result.outputPaths.auditLog,
      JSON.stringify(result, null, 2),
      "utf-8"
    );
  }

  private printSummary(result: PipelineResult): void {
    console.log(chalk.gray("\n" + "═".repeat(60)));
    console.log(chalk.cyan("\n📊 Pipeline Summary\n"));

    console.log(chalk.white("Input:"));
    console.log(`  Files: ${result.input.totalFiles}`);
    console.log(
      `  Size: ${(result.input.totalSize / 1024 / 1024).toFixed(2)} MB`
    );

    console.log(chalk.white("\nSanitization:"));
    console.log(`  ✅ Successful: ${result.sanitization.successful}`);
    console.log(`  ❌ Failed: ${result.sanitization.failed}`);
    console.log(`  PII Removed: ${result.sanitization.totalPIIRemoved} items`);

    console.log(chalk.white("\nExtraction:"));
    console.log(`  ✅ Successful: ${result.extraction.successful}`);
    console.log(`  ❌ Failed: ${result.extraction.failed}`);
    console.log(
      `  Teachings: ${result.extraction.totalTeachingsExtracted} extracted`
    );

    if (result.errors.length > 0) {
      console.log(chalk.yellow("\nErrors:"));
      for (const error of result.errors) {
        console.log(`  - ${error.filename}: ${error.error}`);
      }
    }

    console.log(chalk.white("\nOutput:"));
    console.log(`  📁 Sanitized: ${result.outputPaths.sanitizedDir}`);
    console.log(`  📄 Teachings (JSON): ${result.outputPaths.teachingsJson}`);
    console.log(
      `  📝 Teachings (Markdown): ${result.outputPaths.teachingsMarkdown}`
    );
    console.log(`  🔍 Audit Log: ${result.outputPaths.auditLog}`);

    console.log(chalk.gray("\n" + "═".repeat(60) + "\n"));

    if (result.status === "success") {
      console.log(chalk.green(`✅ Pipeline completed successfully\n`));
    } else if (result.status === "partial") {
      console.log(chalk.yellow(`⚠️  Pipeline completed with errors\n`));
    } else {
      console.log(chalk.red(`❌ Pipeline failed\n`));
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
