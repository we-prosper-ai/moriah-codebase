import Database from 'better-sqlite3';
import type { Teaching, ExtractionAudit } from './types';
export declare function getDb(): Database.Database;
export declare function closeDb(): void;
export declare function insertTeaching(t: Teaching): void;
export declare function insertTeachings(teachings: Teaching[]): void;
export declare function getTeachingById(id: string): Teaching | null;
export declare function listTeachings(page: number, pageSize: number, module?: string): {
    teachings: Teaching[];
    total: number;
};
export declare function insertAudit(audit: ExtractionAudit): void;
export declare function getAuditById(id: string): ExtractionAudit | null;
export declare function getAuditByFileId(fileId: string): ExtractionAudit | null;
//# sourceMappingURL=db.d.ts.map