export interface PIIMatch {
  type: PIIType;
  original: string;
  replacement: string;
  position: number;
  length: number;
}

export type PIIType =
  | 'SSN'
  | 'CREDIT_CARD'
  | 'PHONE'
  | 'EMAIL'
  | 'IP_ADDRESS'
  | 'ZIP_CODE'
  | 'ADDRESS'
  | 'DATE_OF_BIRTH';

export interface Speaker {
  name: string;
  lineCount: number;
  wordCount: number;
}

export interface TranscriptMetadata {
  fileId: string;
  originalFilename: string;
  processedAt: string;
  transcriptDate: string | null;
  duration: string | null;
  speakers: Speaker[];
  themes: string[];
  tags: string[];
  wordCount: number;
  lineCount: number;
  piiRemovedCount: number;
  piiTypes: Record<string, number>;
}

export interface AuditRecord {
  fileId: string;
  originalFilename: string;
  processedAt: string;
  piiMatches: PIIMatch[];
  summary: {
    total: number;
    byType: Record<string, number>;
  };
}

export interface SanitizeResult {
  fileId: string;
  cleanContent: string;
  metadata: TranscriptMetadata;
  auditId: string;
}

export interface BatchSanitizeResult {
  batchId: string;
  processedAt: string;
  results: SanitizeResult[];
  errors: Array<{ filename: string; error: string }>;
  summary: {
    total: number;
    succeeded: number;
    failed: number;
  };
}

export interface ErrorResponse {
  error: string;
  details?: string;
  timestamp: string;
}
