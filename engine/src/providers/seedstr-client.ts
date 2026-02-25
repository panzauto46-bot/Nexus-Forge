import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import type { EngineConfig } from '../config.js';
import type { PollResult, SubmissionResult } from '../types.js';

/* ── Types ─────────────────────────────────────── */

interface Job {
  id: string;
  prompt?: string;
  description?: string;
  text?: string;
  budget: number;
  status: string;
  createdAt: string;
  type?: string;
  [key: string]: unknown;
}

interface JobsListResponse {
  jobs: Job[];
  total?: number;
}

interface FileAttachment {
  url: string;
  name: string;
  size: number;
  type: string;
}

interface FileUploadResult {
  url: string;
  name: string;
  size: number;
  type: string;
}

/* ── Helpers ───────────────────────────────────── */

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Deep-search for prompt text in any JSON structure.
 * The Seedstr API may return prompts under different field names.
 */
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

  const candidateKeys = ['prompt', 'mysteryPrompt', 'challengePrompt', 'text', 'description'];
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

const MIME_TYPES: Record<string, string> = {
  zip: 'application/zip',
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  ts: 'text/typescript',
  json: 'application/json',
  md: 'text/markdown',
  txt: 'text/plain',
};

/* ── Seedstr API v2 Client ─────────────────────── */

export class SeedstrClient {
  private readonly baseUrl: string;

  constructor(private readonly config: EngineConfig) {
    this.baseUrl = 'https://www.seedstr.io/api/v2';
  }

  /**
   * Poll for available jobs that contain a mystery prompt.
   * Uses v2 /jobs endpoint to list open jobs.
   */
  async pollMysteryPrompt(): Promise<PollResult> {
    const payload = await this.request<JobsListResponse>(`${this.baseUrl}/jobs?limit=20&offset=0`, {
      method: 'GET',
    });

    // Search through all jobs for one with a prompt-like field
    if (payload.jobs && Array.isArray(payload.jobs)) {
      for (const job of payload.jobs) {
        // Skip jobs that are already completed or cancelled
        if (job.status === 'completed' || job.status === 'cancelled') {
          continue;
        }

        const prompt = deepFindPrompt(job);
        if (prompt) {
          return {
            ready: true,
            prompt,
            reason: `Job ${job.id} contains a mystery prompt.`,
            raw: { jobId: job.id, job },
          };
        }
      }
    }

    return {
      ready: false,
      reason: `No mystery prompt found. ${payload.jobs?.length ?? 0} jobs checked.`,
      raw: payload,
    };
  }

  /**
   * Upload a zip file to Seedstr file storage.
   * Uses v2 /upload endpoint with base64-encoded file content.
   */
  async uploadFile(filePath: string): Promise<FileAttachment> {
    const fileName = basename(filePath);
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    const fileBuffer = readFileSync(filePath);
    const base64Content = fileBuffer.toString('base64');

    const result = await this.request<{
      success: boolean;
      files: FileUploadResult[];
    }>(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: JSON.stringify({
        files: [
          {
            name: fileName,
            content: base64Content,
            type: mimeType,
          },
        ],
      }),
    });

    if (!result.success || !result.files || result.files.length === 0) {
      throw new Error('File upload failed: No files returned from Seedstr.');
    }

    const fileResult = result.files[0];
    return {
      url: fileResult.url,
      name: fileResult.name,
      size: fileResult.size,
      type: fileResult.type,
    };
  }

  /**
   * Submit a response to a specific job.
   * Uses v2 /jobs/:id/respond endpoint with file attachments.
   */
  async submitResponse(
    jobId: string,
    content: string,
    files?: FileAttachment[],
  ): Promise<SubmissionResult> {
    const body: Record<string, unknown> = {
      content,
      responseType: files && files.length > 0 ? 'FILE' : 'TEXT',
    };

    if (files && files.length > 0) {
      body.files = files;
    }

    const result = await this.request<{
      success?: boolean;
      responseId?: string;
      submissionId?: string;
      [key: string]: unknown;
    }>(`${this.baseUrl}/jobs/${jobId}/respond`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return {
      submissionId: result.responseId ?? result.submissionId,
      raw: result,
    };
  }

  /**
   * Full submission flow: upload zip → submit response.
   */
  async submitArchive(zipPath: string, jobId?: string): Promise<SubmissionResult> {
    // Step 1: Upload the zip file
    const fileAttachment = await this.uploadFile(zipPath);

    // Step 2: If we have a job ID, submit as response to that job
    if (jobId) {
      return this.submitResponse(
        jobId,
        `NEXUS.FORGE automated submission. Project archive: ${fileAttachment.name}`,
        [fileAttachment],
      );
    }

    // Fallback: return the upload result
    return {
      submissionId: undefined,
      raw: { uploaded: true, file: fileAttachment },
    };
  }

  /* ── HTTP helpers ────────────────────────────── */

  private async request<T>(url: string, options: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      if (this.config.seedstrApiKey) {
        headers.Authorization = `Bearer ${this.config.seedstrApiKey}`;
      }

      const response = await fetch(url, {
        ...options,
        headers: { ...headers, ...(options.headers as Record<string, string>) },
        signal: controller.signal,
      });

      const text = await response.text();
      const parsed = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(`Seedstr API error (${response.status}): ${text.slice(0, 500)}`);
      }

      return parsed as T;
    } finally {
      clearTimeout(timeout);
    }
  }
}
