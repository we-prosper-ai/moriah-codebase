import { v4 as uuidv4 } from 'uuid';
import { detectAndRedactPII, countPIIByType } from './pii-detector';
import { buildMetadata } from './metadata-extractor';
import { saveAuditRecord, saveCleanOutput, saveMetadata } from './audit-store';
import { AuditRecord, SanitizeResult, TranscriptMetadata } from './types';

export function sanitizeTranscript(
  content: string,
  originalFilename: string
): SanitizeResult {
  const fileId = uuidv4();
  const processedAt = new Date().toISOString();

  // Step 1: Detect and redact PII
  const { cleanText, matches } = detectAndRedactPII(content);

  // Step 2: Count PII by type
  const piiTypes = countPIIByType(matches);
  const piiTotal = matches.length;

  // Step 3: Build metadata from clean text
  const metadataPartial = buildMetadata(fileId, originalFilename, cleanText, piiTotal, piiTypes);
  const metadata: TranscriptMetadata = {
    fileId,
    originalFilename,
    processedAt,
    ...metadataPartial,
  };

  // Step 4: Build audit record
  const auditRecord: AuditRecord = {
    fileId,
    originalFilename,
    processedAt,
    piiMatches: matches,
    summary: {
      total: piiTotal,
      byType: piiTypes,
    },
  };

  // Step 5: Persist clean output, metadata, and audit
  saveCleanOutput(fileId, buildCleanMarkdown(cleanText, metadata));
  saveMetadata(fileId, metadata);
  saveAuditRecord(auditRecord);

  return {
    fileId,
    cleanContent: buildCleanMarkdown(cleanText, metadata),
    metadata,
    auditId: fileId,
  };
}

function buildCleanMarkdown(cleanText: string, metadata: TranscriptMetadata): string {
  const header = [
    `---`,
    `fileId: ${metadata.fileId}`,
    `originalFile: ${metadata.originalFilename}`,
    `processedAt: ${metadata.processedAt}`,
    metadata.transcriptDate ? `transcriptDate: ${metadata.transcriptDate}` : null,
    metadata.duration ? `duration: ${metadata.duration}` : null,
    `speakers: ${metadata.speakers.map(s => s.name).join(', ') || 'unknown'}`,
    `themes: ${metadata.themes.join(', ') || 'none detected'}`,
    `tags: ${metadata.tags.join(', ') || 'none'}`,
    `wordCount: ${metadata.wordCount}`,
    `piiRemoved: ${metadata.piiRemovedCount}`,
    `---`,
    '',
  ]
    .filter(line => line !== null)
    .join('\n');

  return header + cleanText;
}
