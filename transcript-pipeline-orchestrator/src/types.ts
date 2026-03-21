export interface TranscriptFile {
  path: string;
  filename: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface SanitizedTranscript {
  fileId: string;
  filename: string;
  originalPath: string;
  cleanContent: string;
  metadata: {
    date?: string;
    speakers: string[];
    themes: string[];
    duration?: string;
  };
  piiRemoved: {
    count: number;
    types: Record<string, number>;
  };
  processedAt: string;
}

export interface ExtractedTeaching {
  id: string;
  batchId: string;
  sourceFileId: string;
  title: string;
  coreIdea: string;
  insights: string[];
  actionSteps: string[];
  quotes: string[];
  caseStudies: string[];
  relatedTeachings: string[];
  module: string;
  tags: string[];
  processedAt: string;
}

export interface PipelineResult {
  pipelineId: string;
  status: "success" | "partial" | "failed";
  startedAt: string;
  completedAt: string;
  
  input: {
    totalFiles: number;
    totalSize: number;
  };
  
  sanitization: {
    successful: number;
    failed: number;
    totalPIIRemoved: number;
  };
  
  extraction: {
    successful: number;
    failed: number;
    totalTeachingsExtracted: number;
  };
  
  errors: Array<{
    filename: string;
    stage: "sanitization" | "extraction";
    error: string;
  }>;
  
  outputPaths: {
    sanitizedDir: string;
    teachingsJson: string;
    teachingsMarkdown: string;
    auditLog: string;
  };
}

export interface OrchestrationConfig {
  sanitizerUrl: string;
  extractorUrl: string;
  inputDir: string;
  outputDir: string;
  maxConcurrency: number;
  pauseMs: number; // Between requests to avoid rate limits
}
