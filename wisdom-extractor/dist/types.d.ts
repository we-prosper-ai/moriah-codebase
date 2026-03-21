export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Module = 'Fundamentals of Freedom' | 'Four Currencies Framework' | 'Revenue Architecture' | 'Business Systems' | 'Marketing & Positioning' | 'Sales Psychology' | 'Team & Delegation' | 'Legacy & Scale';
export interface Teaching {
    id: string;
    title: string;
    core_concept: string;
    insight: string;
    quotes: string[];
    frameworks: string[];
    action_steps: string[];
    case_studies: string[];
    module: Module | string;
    prerequisites: string[];
    difficulty: Difficulty;
    estimated_time_to_internalize: string;
    next_teachings: string[];
    source_file_id: string;
    source_filename: string;
    created_at: string;
    updated_at: string;
}
export interface ExtractionAudit {
    id: string;
    file_id: string;
    filename: string;
    model_used: string;
    prompt_tokens: number;
    completion_tokens: number;
    teachings_extracted: number;
    teaching_ids: string[];
    duration_ms: number;
    created_at: string;
    raw_prompt?: string;
    raw_response?: string;
}
export interface ExtractRequest {
    content: string;
    filename?: string;
    file_id?: string;
    metadata?: TranscriptMetadata;
}
export interface TranscriptMetadata {
    speakers?: string[];
    themes?: string[];
    tags?: string[];
    date?: string;
    duration?: string;
}
export interface ExtractResponse {
    file_id: string;
    audit_id: string;
    teachings: Teaching[];
    count: number;
    duration_ms: number;
}
export interface BatchExtractRequest {
    files: ExtractRequest[];
}
export interface BatchExtractResponse {
    batch_id: string;
    processed_at: string;
    results: ExtractResponse[];
    errors: Array<{
        filename: string;
        error: string;
    }>;
    summary: {
        total: number;
        succeeded: number;
        failed: number;
        total_teachings: number;
    };
}
export interface TeachingListResponse {
    teachings: Teaching[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}
export interface SyncResponse {
    synced: number;
    failed: number;
    teachings: Teaching[];
}
export interface ErrorResponse {
    error: string;
    details?: string;
    timestamp: string;
}
//# sourceMappingURL=types.d.ts.map