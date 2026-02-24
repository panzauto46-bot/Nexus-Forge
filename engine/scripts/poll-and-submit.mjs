#!/usr/bin/env node
/**
 * NEXUS.FORGE — One-Shot Poll & Submit Script
 * Designed for GitHub Actions cron jobs.
 *
 * 1. Poll Seedstr API v2 for available jobs
 * 2. If a mystery prompt is found → generate React code via Groq
 * 3. Package as zip → upload → submit response
 * 4. Exit
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import { zipSync } from 'fflate';

/* ── Config from Environment ────────────────── */

const SEEDSTR_API_KEY = process.env.SEEDSTR_API_KEY;
const SEEDSTR_AGENT_ID = process.env.SEEDSTR_AGENT_ID || 'NEXUS.FORGE';
const GROQ_API_KEY = process.env.LLM_API_KEY || process.env.GROQ_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const LLM_MODEL = process.env.LLM_MODEL || 'llama-3.3-70b-versatile';

const SEEDSTR_V1 = 'https://www.seedstr.io/api/v1';
const SEEDSTR_V2 = 'https://www.seedstr.io/api/v2';

const WORK_DIR = join(process.cwd(), 'engine', 'runs', '_github_action');

/* ── Logging ─────────────────────────────────── */

function log(level, msg) {
    const ts = new Date().toISOString();
    const icons = { info: 'ℹ️', success: '✅', warn: '⚠️', error: '❌' };
    console.log(`${icons[level] || '•'} [${ts}] ${msg}`);
}

/* ── Seedstr API helpers ─────────────────────── */

async function seedstrRequest(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(SEEDSTR_API_KEY && { Authorization: `Bearer ${SEEDSTR_API_KEY}` }),
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        throw new Error(`Seedstr API ${response.status}: ${text.slice(0, 300)}`);
    }

    return data;
}

function deepFindPrompt(obj) {
    if (!obj || typeof obj !== 'object') return undefined;

    if (Array.isArray(obj)) {
        for (const item of obj) {
            const found = deepFindPrompt(item);
            if (found) return found;
        }
        return undefined;
    }

    for (const key of ['prompt', 'mysteryPrompt', 'challengePrompt', 'description', 'text']) {
        if (typeof obj[key] === 'string' && obj[key].trim().length > 10) {
            return obj[key].trim();
        }
    }

    for (const value of Object.values(obj)) {
        const found = deepFindPrompt(value);
        if (found) return found;
    }

    return undefined;
}

/* ── Step 1: Poll for jobs ───────────────────── */

async function pollForJobs() {
    log('info', 'Polling Seedstr API v2 for available jobs...');

    const data = await seedstrRequest(`${SEEDSTR_V2}/jobs?limit=20&offset=0`);
    const jobs = data.jobs || [];

    log('info', `Found ${jobs.length} jobs. Scanning for mystery prompts...`);

    for (const job of jobs) {
        if (job.status === 'completed' || job.status === 'cancelled') continue;

        const prompt = deepFindPrompt(job);
        if (prompt) {
            log('success', `Mystery prompt detected in job ${job.id}!`);
            log('info', `Prompt: "${prompt.slice(0, 100)}..."`);
            return { jobId: job.id, prompt };
        }
    }

    log('info', 'No mystery prompt found. Will check again next run.');
    return null;
}

/* ── Step 2: Generate code via LLM (Groq → OpenAI fallback) ── */

const SYSTEM_PROMPT = `You are The Brain module for NEXUS.FORGE, an autonomous AI agent competing in the Seedstr $10K Blind Hackathon.

Generate a COMPLETE, production-grade, visually stunning React + Tailwind CSS front-end application.

CRITICAL REQUIREMENTS:
- Return ONLY valid JSON (no markdown, no code fences)
- Use this exact schema:
{
  "projectName": "string",
  "files": [{ "path": "string", "content": "string" }],
  "notes": ["optional"]
}
- Always include these files at minimum:
  - index.html (entry point with CDN links for React, ReactDOM, Babel, Tailwind)
  - src/App.jsx (main component, inline in script tag OR separate)
  - src/styles.css (custom styles beyond Tailwind)
- Make the app a SINGLE index.html file if possible (with inline React via CDN) for maximum compatibility
- Design must be VISUALLY STUNNING: use gradients, animations, modern UI patterns
- Must be FULLY FUNCTIONAL — no placeholder text, all features must work
- Use dark mode as default with vibrant accent colors
- Include smooth transitions and micro-animations
- Make it responsive (mobile + desktop)`;

const LLM_PROVIDERS = [
    {
        name: 'Groq',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        key: () => GROQ_API_KEY,
        model: LLM_MODEL,
        maxTokens: 8000,
    },
    {
        name: 'OpenAI',
        url: 'https://api.openai.com/v1/chat/completions',
        key: () => OPENAI_API_KEY,
        model: 'gpt-4o-mini',
        maxTokens: 8000,
    },
];

async function callLLM(provider, prompt) {
    const apiKey = provider.key();
    if (!apiKey) throw new Error(`${provider.name} API key not configured.`);

    const response = await fetch(provider.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: provider.model,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `BUILD THIS:\n\n${prompt}\n\nRespond with valid JSON only.` },
            ],
            temperature: 0.2,
            max_tokens: provider.maxTokens,
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`${provider.name} API error ${response.status}: ${err.slice(0, 300)}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

function parseArtifact(content) {
    // Strip markdown code fences if present
    content = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');

    let artifact;
    try {
        artifact = JSON.parse(content);
    } catch {
        const match = content.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                artifact = JSON.parse(match[0]);
            } catch {
                let repaired = match[0].replace(
                    /"(?:[^"\\]|\\.)*"/g,
                    (s) => s.replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r')
                );
                artifact = JSON.parse(repaired);
            }
        }
    }

    if (!artifact || !artifact.files || !Array.isArray(artifact.files)) {
        throw new Error('LLM output does not contain valid { projectName, files[] } schema.');
    }

    return artifact;
}

async function generateCode(prompt) {
    for (const provider of LLM_PROVIDERS) {
        const apiKey = provider.key();
        if (!apiKey) {
            log('warn', `${provider.name}: No API key, skipping.`);
            continue;
        }

        try {
            log('info', `Trying ${provider.name} (${provider.model})...`);
            const content = await callLLM(provider, prompt);
            log('info', `${provider.name} responded with ${content.length} chars. Parsing...`);

            const artifact = parseArtifact(content);
            log('success', `Brain generated "${artifact.projectName}" with ${artifact.files.length} files via ${provider.name}.`);
            return artifact;
        } catch (err) {
            log('warn', `${provider.name} failed: ${err.message}`);
        }
    }

    throw new Error('All LLM providers failed. Cannot generate code.');
}

/* ── Step 3: Write files & create zip ────────── */

function buildAndZip(artifact) {
    log('info', 'Building project files and creating zip archive...');

    // Clean and create work directory
    if (existsSync(WORK_DIR)) {
        rmSync(WORK_DIR, { recursive: true, force: true });
    }
    mkdirSync(WORK_DIR, { recursive: true });

    // Write files to disk
    for (const file of artifact.files) {
        const filePath = join(WORK_DIR, file.path);
        const fileDir = join(filePath, '..');
        mkdirSync(fileDir, { recursive: true });
        writeFileSync(filePath, file.content, 'utf-8');
    }

    log('info', `Wrote ${artifact.files.length} files to ${WORK_DIR}`);

    // Create zip using fflate
    const zipData = {};
    for (const file of artifact.files) {
        const content = Buffer.from(file.content, 'utf-8');
        zipData[file.path] = new Uint8Array(content);
    }

    const zippedBytes = zipSync(zipData, { level: 9 });
    const zipName = `nexus-forge-${Date.now()}.zip`;
    const zipPath = join(WORK_DIR, zipName);
    writeFileSync(zipPath, zippedBytes);

    log('success', `Archive created: ${zipName} (${zippedBytes.byteLength} bytes)`);
    return { zipPath, bytes: zippedBytes.byteLength };
}

/* ── Step 4: Upload & submit ─────────────────── */

async function uploadAndSubmit(zipPath, jobId) {
    log('info', 'Uploading zip to Seedstr file storage...');

    const fileName = basename(zipPath);
    const fileBuffer = readFileSync(zipPath);
    const base64Content = fileBuffer.toString('base64');

    // Upload file via v1 /upload
    const uploadResult = await seedstrRequest(`${SEEDSTR_V1}/upload`, {
        method: 'POST',
        body: JSON.stringify({
            files: [{ name: fileName, content: base64Content, type: 'application/zip' }],
        }),
    });

    if (!uploadResult.success || !uploadResult.files?.length) {
        throw new Error('File upload failed.');
    }

    const uploadedFile = uploadResult.files[0];
    log('success', `File uploaded: ${uploadedFile.url}`);

    // Submit response via v2 /jobs/:id/respond
    log('info', `Submitting response to job ${jobId}...`);
    const submitResult = await seedstrRequest(`${SEEDSTR_V2}/jobs/${jobId}/respond`, {
        method: 'POST',
        body: JSON.stringify({
            content: `NEXUS.FORGE automated submission — production-grade React application generated by AI. Archive: ${fileName}`,
            responseType: 'FILE',
            files: [{
                url: uploadedFile.url,
                name: uploadedFile.name,
                size: uploadedFile.size,
                type: uploadedFile.type,
            }],
        }),
    });

    log('success', `Response submitted! ID: ${submitResult.responseId || submitResult.submissionId || 'N/A'}`);
    return submitResult;
}

/* ── Main ────────────────────────────────────── */

async function main() {
    console.log('');
    console.log('  ⬡ NEXUS.FORGE — GitHub Actions Runner');
    console.log('  ─────────────────────────────────────');
    console.log('');

    // Validate config
    if (!SEEDSTR_API_KEY) {
        log('error', 'SEEDSTR_API_KEY is not set. Aborting.');
        process.exit(1);
    }
    if (!GROQ_API_KEY && !OPENAI_API_KEY) {
        log('error', 'No LLM API key set (GROQ_API_KEY or OPENAI_API_KEY). Aborting.');
        process.exit(1);
    }
    log('info', `LLM providers: ${GROQ_API_KEY ? '✅ Groq' : '❌ Groq'} | ${OPENAI_API_KEY ? '✅ OpenAI' : '❌ OpenAI'}`);

    try {
        // Step 1: Poll
        const result = await pollForJobs();
        if (!result) {
            log('info', 'No action needed. Exiting gracefully.');
            process.exit(0);
        }

        // Step 2: Generate
        const artifact = await generateCode(result.prompt);

        // Step 3: Build & Zip
        const { zipPath } = buildAndZip(artifact);

        // Step 4: Upload & Submit
        await uploadAndSubmit(zipPath, result.jobId);

        log('success', '🏆 NEXUS.FORGE mission complete! Response submitted to Seedstr.');
    } catch (error) {
        log('error', `Pipeline failed: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
}

main();
