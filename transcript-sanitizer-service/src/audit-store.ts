import * as fs from 'fs';
import * as path from 'path';
import { AuditRecord } from './types';

const AUDIT_DIR = path.join(__dirname, '..', 'data', 'audit');

export function ensureAuditDir(): void {
  if (!fs.existsSync(AUDIT_DIR)) {
    fs.mkdirSync(AUDIT_DIR, { recursive: true });
  }
}

export function saveAuditRecord(record: AuditRecord): void {
  ensureAuditDir();
  const filePath = path.join(AUDIT_DIR, `${record.fileId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf-8');
}

export function getAuditRecord(fileId: string): AuditRecord | null {
  ensureAuditDir();
  const filePath = path.join(AUDIT_DIR, `${fileId}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as AuditRecord;
  } catch {
    return null;
  }
}

export function listAuditRecords(): string[] {
  ensureAuditDir();
  return fs
    .readdirSync(AUDIT_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

export function saveCleanOutput(fileId: string, content: string): string {
  const outputDir = path.join(__dirname, '..', 'data', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const filePath = path.join(outputDir, `${fileId}.md`);
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

export function saveMetadata(fileId: string, metadata: object): string {
  const outputDir = path.join(__dirname, '..', 'data', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const filePath = path.join(outputDir, `${fileId}.meta.json`);
  fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2), 'utf-8');
  return filePath;
}
