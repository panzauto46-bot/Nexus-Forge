/**
 * Vercel Serverless Function — /api/generate
 * AUTO-SWITCH: OpenAI GPT → Groq Llama (fallback otomatis)
 * API Keys disimpan AMAN di Vercel Environment Variables.
 */

interface Provider {
    name: string;
    url: string;
    keyEnv: string;
    defaultModel: string;
}

const PROVIDERS: Provider[] = [
    {
        name: 'openai',
        url: 'https://api.openai.com/v1/chat/completions',
        keyEnv: 'OPENAI_API_KEY',
        defaultModel: 'gpt-4o-mini',
    },
    {
        name: 'groq',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        keyEnv: 'GROQ_API_KEY',
        defaultModel: 'llama-3.3-70b-versatile',
    },
];

const SYSTEM_PROMPT = [
    'You are The Brain module for NEXUS.FORGE, an autonomous AI agent.',
    'Generate high quality React + Tailwind CSS code based on the user prompt.',
    'Return ONLY valid JSON with this exact schema:',
    '{',
    '  "projectName": "string",',
    '  "files": [{ "path": "src/App.tsx", "content": "..." }],',
    '  "notes": ["optional build notes"]',
    '}',
    'Constraints:',
    '- Always include at least: src/App.tsx, src/index.css, src/main.tsx.',
    '- Keep code production-grade, readable, and composable.',
    '- Do NOT wrap JSON in markdown code fences.',
].join('\n');

function repairJson(raw: string): string {
    const result: string[] = [];
    let inString = false;
    let escaped = false;
    for (let i = 0; i < raw.length; i++) {
        const ch = raw[i];
        if (escaped) { result.push(ch); escaped = false; continue; }
        if (ch === '\\' && inString) { escaped = true; result.push(ch); continue; }
        if (ch === '"') { inString = !inString; result.push(ch); continue; }
        if (inString) {
            if (ch === '\n') { result.push('\\n'); continue; }
            if (ch === '\r') { result.push('\\r'); continue; }
            if (ch === '\t') { result.push('\\t'); continue; }
        }
        result.push(ch);
    }
    return result.join('');
}

function sanitize(raw: string): string {
    let cleaned = raw.trim();
    cleaned = cleaned.replace(/^```(?:json|tsx|typescript|jsx|js|ts)?\s*\n?/i, '');
    cleaned = cleaned.replace(/\n?```\s*$/i, '');
    return cleaned.trim();
}

function tryParse(raw: string): any {
    const cleaned = sanitize(raw);
    try { return JSON.parse(cleaned); } catch { }
    try { return JSON.parse(repairJson(cleaned)); } catch { }
    return null;
}

async function callProvider(provider: Provider, apiKey: string, prompt: string) {
    const model = process.env.LLM_MODEL || provider.defaultModel;

    const res = await fetch(provider.url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt },
            ],
            temperature: 0.2,
            max_tokens: 8192,
        }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`${provider.name} ${res.status}: ${JSON.stringify(err)}`);
    }

    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content ?? '';
    return { rawContent, model, provider: provider.name };
}

export default async function handler(req: any, res: any) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt } = req.body ?? {};
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Missing "prompt" in request body' });
    }

    // Filter providers that have API keys configured
    const available = PROVIDERS.filter(p => !!process.env[p.keyEnv]);

    if (available.length === 0) {
        return res.status(500).json({
            error: 'No AI provider configured. Add OPENAI_API_KEY or GROQ_API_KEY in Vercel Environment Variables.',
        });
    }

    const errors: string[] = [];

    // AUTO-SWITCH: Try each provider in order, fallback on failure
    for (const provider of available) {
        const apiKey = process.env[provider.keyEnv]!;

        try {
            const result = await callProvider(provider, apiKey, prompt);
            const parsed = tryParse(result.rawContent);

            return res.status(200).json({
                success: true,
                provider: result.provider,
                model: result.model,
                fallbackUsed: errors.length > 0,
                failedProviders: errors,
                ...(parsed
                    ? {
                        parsed,
                        files: parsed.files?.length ?? 0,
                        projectName: parsed.projectName ?? 'unknown',
                    }
                    : {
                        raw: result.rawContent,
                        parsed: null,
                        message: 'AI responded but output could not be parsed as JSON',
                    }),
            });
        } catch (err: any) {
            errors.push(`${provider.name}: ${err.message}`);
            // Continue to next provider (auto-switch!)
        }
    }

    // All providers failed
    return res.status(502).json({
        error: 'All AI providers failed',
        details: errors,
    });
}
