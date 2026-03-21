import { PipelineResult, OrchestrationConfig } from "./types";
export declare class TranscriptPipelineOrchestrator {
    private sanitizer;
    private extractor;
    private config;
    private pipelineId;
    constructor(config: OrchestrationConfig);
    run(): Promise<PipelineResult>;
    private loadTranscripts;
    private sanitizeTranscripts;
    private extractTeachings;
    private generateOutput;
    private printSummary;
    private delay;
}
//# sourceMappingURL=orchestrator.d.ts.map