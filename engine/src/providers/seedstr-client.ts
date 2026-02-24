import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import type { EngineConfig } from '../config.js';
import type { PollResult, SubmissionResult } from '../types.js';

interface RequestOptions {
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: BodyInit;
  timeoutMs?: number;
}

function buildHeaders(apiKey?: string, extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...extra,
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function deepFindPrompt(payload: unknown): string | undefined {
  if (typeof payload === 'string') {
    return undefined;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const found = deepFindPrompt(item);
      if (found) return found;
    }
    return undefined;
  }

  if (!isObject(payload)) {
    return undefined;
  }

  const candidateKeys = ['prompt', 'mysteryPrompt', 'challengePrompt', 'text'];
  for (const key of candidateKeys) {
    const value = payload[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  for (const value of Object.values(payload)) {
    const found = deepFindPrompt(value);
    if (found) return found;
  }

  return undefined;
}

function summarizeReason(payload: unknown): string {
  if (!isObject(payload)) {
    return 'Unknown response payload.';
  }

  const status = typeof payload.status === 'string' ? payload.status : undefined;
  const message = typeof payload.message === 'string' ? payload.message : undefined;

  if (status && message) return `${status}: ${message}`;
  if (status) return status;
  if (message) return message;
  return 'Prompt not available yet.';
}

function hasNotReadyMessage(text: string): boolean {
  const normalized = text.toLowerCase();
  return (
    normalized.includes('belum')
    || normalized.includes('not yet')
    || normalized.includes('pending')
    || normalized.includes('wait')
    || normalized.includes('later')
  );
}

export class SeedstrClient {
  constructor(private readonly config: EngineConfig) {}

  async pollMysteryPrompt(): Promise<PollResult> {
    const payload = await this.requestJson(this.config.seedstrPollUrl, {
      method: 'GET',
      headers: buildHeaders(this.config.seedstrApiKey),
      timeoutMs: 12000,
    });

    const prompt = deepFindPrompt(payload);
    if (prompt) {
      return {
        ready: true,
        prompt,
        reason: 'Mystery prompt detected.',
        raw: payload,
      };
    }

    const reason = summarizeReason(payload);
    return {
      ready: false,
      reason: hasNotReadyMessage(reason) ? reason : `No prompt found. ${reason}`,
      raw: payload,
    };
  }

  async submitArchive(zipPath: string): Promise<SubmissionResult> {
    const bytes = await readFile(zipPath);
    const form = new FormData();
    form.append('agentId', this.config.agentId);
    form.append('file', new Blob([bytes], { type: 'application/zip' }), basename(zipPath));

    const payload = await this.requestJson(this.config.seedstrSubmitUrl, {
      method: 'POST',
      headers: buildHeaders(this.config.seedstrApiKey),
      body: form,
      timeoutMs: 30000,
    });

    let submissionId: string | undefined;
    if (isObject(payload) && typeof payload.submissionId === 'string') {
      submissionId = payload.submissionId;
    }

    return {
      submissionId,
      raw: payload,
    };
  }

  private async requestJson(url: string, options: RequestOptions): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 15000);

    try {
      const response = await fetch(url, {
        method: options.method ?? 'GET',
        headers: options.headers,
        body: options.body,
        signal: controller.signal,
      });

      const text = await response.text();
      const parsed = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(`Seedstr request failed (${response.status}): ${text.slice(0, 500)}`);
      }

      return parsed;
    } finally {
      clearTimeout(timeout);
    }
  }
}
