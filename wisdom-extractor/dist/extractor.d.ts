import type { ExtractRequest, ExtractResponse } from './types';
export declare function extractTeachings(req: ExtractRequest): Promise<ExtractResponse>;
export declare function extractBatch(files: ExtractRequest[]): Promise<{
    results: ExtractResponse[];
    errors: Array<{
        filename: string;
        error: string;
    }>;
}>;
//# sourceMappingURL=extractor.d.ts.map