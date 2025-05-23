export type GenerationPhase = 
  | 'initializing' 
  | 'generating-content' 
  | 'generating-thumbnail' 
  | 'finalizing';

export interface GenerationState {
  phase: GenerationPhase | null;
  progress: number; // 0-100
  error?: {
    phase: GenerationPhase;
    message: string;
  };
}

export const GENERATION_PHASES: Record<GenerationPhase, { name: string; progress: number }> = {
  'initializing': { name: 'Initializing', progress: 10 },
  'generating-content': { name: 'Generating Content', progress: 40 },
  'generating-thumbnail': { name: 'Creating Thumbnail', progress: 85 },
  'finalizing': { name: 'Finalizing', progress: 100 }
}; 