export type EngineStage =
  | 'idle'
  | 'watching'
  | 'prompt_received'
  | 'generating'
  | 'building'
  | 'packing'
  | 'submitting'
  | 'completed'
  | 'error';

export type LogLevel = 'info' | 'warn' | 'error' | 'success';

export interface BridgeLogEvent {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  meta?: unknown;
}

export interface EngineState {
  running: boolean;
  stage: EngineStage;
  processing: boolean;
  lastTickAt?: string;
  lastPromptAt?: string;
  lastSubmissionId?: string;
  lastError?: string;
}

export interface PollResult {
  ready: boolean;
  prompt?: string;
  reason: string;
  raw: unknown;
}

export interface BuildArtifactFile {
  path: string;
  content: string;
}

export interface BuildArtifact {
  projectName: string;
  files: BuildArtifactFile[];
  notes?: string[];
}

export interface BuildResult {
  outputDir: string;
  filesWritten: number;
}

export interface ZipResult {
  zipPath: string;
  bytes: number;
}

export interface SubmissionResult {
  submissionId?: string;
  raw: unknown;
}

export interface PromptReadyEvent {
  prompt: string;
  raw: unknown;
}

export interface TickEvent {
  checkedAt: string;
  nextDelayMs: number;
}

export interface EngineEventMap {
  log: BridgeLogEvent;
  state: EngineState;
  tick: TickEvent;
  prompt_waiting: PollResult;
  prompt_ready: PromptReadyEvent;
  output_ready: BuildResult;
  zipped: ZipResult;
  submitted: SubmissionResult;
  error: { stage: EngineStage; error: Error };
}
