import { resolve } from 'node:path';

function toInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBool(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

export interface EngineConfig {
  serverPort: number;
  corsOrigin: string;
  autoStart: boolean;
  seedstrPollUrl: string;
  seedstrSubmitUrl: string;
  seedstrApiKey?: string;
  agentId: string;
  pollMinMs: number;
  pollMaxMs: number;
  llmProvider: 'mock' | 'groq' | 'openai' | 'anthropic';
  llmModel: string;
  llmApiKey?: string;
  llmTemperature: number;
  llmSystemPrompt: string;
  outputDir: string;
  archiveDir: string;
}

const DEFAULT_SYSTEM_PROMPT = [
  'You are The Brain module for NEXUS.FORGE.',
  'Generate high quality React/Tailwind Material Design code.',
  'Return only valid JSON with this schema:',
  '{',
  '  "projectName": "string",',
  '  "files": [{ "path": "src/App.tsx", "content": "..." }],',
  '  "notes": ["optional"]',
  '}',
  'Constraints:',
  '- Always include at least: src/App.tsx, src/index.css, src/main.tsx.',
  '- Keep code production-grade, readable, and composable.',
  '- Do not wrap JSON in markdown code fences.',
].join('\n');

export function loadConfig(): EngineConfig {
  const pollMinMs = toInt(process.env.ENGINE_POLL_MIN_MS, 5000);
  const pollMaxMs = toInt(process.env.ENGINE_POLL_MAX_MS, 10000);

  if (pollMinMs > pollMaxMs) {
    throw new Error('ENGINE_POLL_MIN_MS cannot be larger than ENGINE_POLL_MAX_MS.');
  }

  return {
    serverPort: toInt(process.env.PORT, toInt(process.env.ENGINE_PORT, 8787)),
    corsOrigin: process.env.ENGINE_CORS_ORIGIN ?? '*',
    autoStart: toBool(process.env.ENGINE_AUTO_START, true),
    seedstrPollUrl: process.env.SEEDSTR_POLL_URL ?? 'https://api.seedstr.io/v1/prompt',
    seedstrSubmitUrl: process.env.SEEDSTR_SUBMIT_URL ?? 'https://api.seedstr.io/v1/submit',
    seedstrApiKey: process.env.SEEDSTR_API_KEY,
    agentId: process.env.SEEDSTR_AGENT_ID ?? 'NEXUS.FORGE',
    pollMinMs,
    pollMaxMs,
    llmProvider: (process.env.LLM_PROVIDER as EngineConfig['llmProvider']) ?? 'groq',
    llmModel: process.env.LLM_MODEL ?? 'llama-3.3-70b-versatile',
    llmApiKey: process.env.LLM_API_KEY,
    llmTemperature: parseFloat(process.env.LLM_TEMPERATURE ?? '0.2'),
    llmSystemPrompt: process.env.LLM_SYSTEM_PROMPT ?? DEFAULT_SYSTEM_PROMPT,
    outputDir: resolve(process.cwd(), process.env.ENGINE_OUTPUT_DIR ?? 'engine/runs/current'),
    archiveDir: resolve(process.cwd(), process.env.ENGINE_ARCHIVE_DIR ?? 'engine/runs/archives'),
  };
}
