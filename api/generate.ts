/**
 * Vercel Serverless Function — /api/generate
 * Supports OpenAI GPT and Groq.
 * API Key disimpan AMAN di Vercel Environment Variables (server-side).
 * Frontend TIDAK pernah menyentuh API Key.
 */

const PROVIDERS: Record<string, { url: string; keyEnv: string; defaultModel: string }> = {
    openai: {
        url: 'https://api.openai.com/v1/chat/completions',
        keyEnv: 'OPENAI_API_KEY',
        defaultModel: 'gpt-4o-mini',
    },
    groq: {
        url: 'https://api.groq.com/openai/v1/chat/completions',
        keyEnv: 'GROQ_API_KEY',
        defaultModel: 'llama-3.3-70b-versatile',
    },
};

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

export default async function handler(req: any, res: any) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Auto-detect provider: check OpenAI first, then Groq
    const providerName = process.env.LLM_PROVIDER || (process.env.OPENAI_API_KEY ? 'openai' : 'groq');
    const provider = PROVIDERS[providerName] ?? PROVIDERS.openai;
    const apiKey = process.env[provider.keyEnv];

    if (!apiKey) {
        return res.status(500).json({
            error: `${provider.keyEnv} not configured. Add it in Vercel Environment Variables.`,
        });
    }

    const { prompt } = req.body ?? {};
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Missing "prompt" in request body' });
    }

    try {
        const model = process.env.LLM_MODEL || provider.defaultModel;

        const apiRes = await fetch(provider.url, {
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

        if (!apiRes.ok) {
            const errData = await apiRes.json();
            return res.status(apiRes.status).json({ error: `${providerName} API error`, details: errData });
        }

        const data = await apiRes.json();
        const rawContent = data.choices?.[0]?.message?.content ?? '';

        const cleaned = sanitize(rawContent);
        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch {
            try {
                parsed = JSON.parse(repairJson(cleaned));
            } catch {
                return res.status(200).json({
                    success: true,
                    provider: providerName,
                    model,
                    raw: rawContent,
                    parsed: null,
                    message: 'AI responded but output could not be parsed as JSON',
                });
            }
        }

        return res.status(200).json({
            success: true,
            provider: providerName,
            model,
            parsed,
            files: parsed.files?.length ?? 0,
            projectName: parsed.projectName ?? 'unknown',
        });
    } catch (err: any) {
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
}
