# NEXUS.FORGE Core Engine (Phase 2)

Backend engine ini mengimplementasikan peta logika Fase 2:

1. `The Watcher` (API Poller)
2. `The Bridge` (SSE Real-time Stream)
3. `The Brain` (LLM Injector)
4. `The Builder` (File System Manager)
5. `The Packer` (Auto-Zipper + Submitter)

## Struktur

- `src/index.ts` -> HTTP API + wiring modul
- `src/core/orchestrator.ts` -> pipeline eksekusi end-to-end
- `src/modules/watcher.ts` -> polling API Seedstr (5-10 detik)
- `src/modules/bridge.ts` -> SSE untuk frontend neural log
- `src/modules/brain.ts` -> panggilan LLM + parser artifact JSON
- `src/modules/builder.ts` -> tulis file React/Next secara otomatis
- `src/modules/packer.ts` -> zip folder hasil + submit ke Seedstr
- `src/providers/seedstr-client.ts` -> adapter API Seedstr

## Environment Variables

- `ENGINE_PORT` (default `8787`)
- `ENGINE_AUTO_START` (default `true`)
- `ENGINE_POLL_MIN_MS` (default `5000`)
- `ENGINE_POLL_MAX_MS` (default `10000`)
- `ENGINE_OUTPUT_DIR` (default `engine/runs/current`)
- `ENGINE_ARCHIVE_DIR` (default `engine/runs/archives`)
- `SEEDSTR_POLL_URL`
- `SEEDSTR_SUBMIT_URL`
- `SEEDSTR_API_KEY`
- `SEEDSTR_AGENT_ID`
- `LLM_PROVIDER` (`mock` | `groq` | `openai` | `anthropic`, default `groq`)
- `LLM_MODEL` (default `llama-3.3-70b-versatile`, alt: `llama-3.1-8b-instant`)
- `LLM_API_KEY`
- `LLM_TEMPERATURE` (default `0.2`)
- `LLM_SYSTEM_PROMPT`

Frontend NeuralLog bisa dikaitkan ke bridge SSE dengan:

- `VITE_ENGINE_EVENTS_URL` (default `http://127.0.0.1:8787/events`)

## Menjalankan

```bash
npm run engine:start
```

Endpoint utama:

- `GET /health`
- `GET /state`
- `GET /events` (SSE)
- `POST /control/start`
- `POST /control/stop`
- `POST /control/prompt` `{ "prompt": "..." }`
