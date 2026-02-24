<p align="center">
  <img src="https://img.shields.io/badge/NEXUS.FORGE-Autonomous%20Agent-00ff88?style=for-the-badge&labelColor=0a0a0a&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGZmODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWdvbiBwb2ludHM9IjEyIDIgMjIgOC41IDIyIDE1LjUgMTIgMjIgMiAxNS41IDIgOC41IDEyIDIiPjwvcG9seWdvbj48bGluZSB4MT0iMTIiIHkxPSIyIiB4Mj0iMTIiIHkyPSIyMiI+PC9saW5lPjxsaW5lIHgxPSIyMiIgeTE9IjguNSIgeDI9IjIiIHkyPSIxNS41Ij48L2xpbmU+PC9zdmc+" alt="NEXUS.FORGE"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Seedstr_Blind_Hackathon-$10,000_Prize-FF6B35?style=for-the-badge&labelColor=1a1a1a" alt="Hackathon"/>
  <img src="https://img.shields.io/badge/AI_Judged-No_Human_Bias-8B5CF6?style=for-the-badge&labelColor=1a1a1a" alt="AI Judged"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/LLM-Multi--Provider-FF6F00?style=flat-square&logo=openai&logoColor=white" alt="LLM"/>
</p>

<h1 align="center">⬡ NEXUS.FORGE</h1>

<p align="center">
  <strong>Fully Autonomous AI Agent for the <a href="https://seedstr.io/hackathon">Seedstr $10K Blind Hackathon</a></strong><br/>
  <em>Listens for mystery prompts → Generates production-grade React apps → Auto-submits as .zip</em>
</p>

<p align="center">
  <a href="#what-is-nexusforge">Overview</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#features">Features</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#roadmap">Roadmap</a>
</p>

---

## 🧠 What is NEXUS.FORGE?

**NEXUS.FORGE** is a **fully autonomous AI-powered agent** purpose-built for the [Seedstr $10K Blind Hackathon](https://seedstr.io/hackathon) — the first-ever AI agent hackathon where **no human judges** evaluate submissions. Instead, Seedstr's own AI agent reviews all responses.

### The Challenge

A **mystery prompt** drops randomly between **March 6–10, 2026**. Agents must:
1. Detect the prompt via the Seedstr API
2. Generate a complete, production-grade front-end project
3. Package it as a `.zip` file
4. Submit it back to Seedstr — **all autonomously**

### How NEXUS.FORGE Responds

NEXUS.FORGE runs a **5-stage pipeline** that completes the entire cycle in **under 30 seconds**:

```
  Seedstr API           NEXUS.FORGE Engine                    Seedstr API
  ┌─────────┐   ┌─────┐  ┌───────┐  ┌─────────┐  ┌──────┐   ┌────────┐
  │ Mystery  │──▶│Watch│─▶│ Brain │─▶│ Builder │─▶│Packer│──▶│ Submit │
  │ Prompt   │   │ er  │  │ (LLM) │  │  (FS)   │  │(Zip) │   │  ✓     │
  └─────────┘   └─────┘  └───────┘  └─────────┘  └──────┘   └────────┘
       │             │         │           │           │            │
       │        5-10s poll  Generates  Writes      Compresses     │
       │        interval   React+CSS   to disk     & submits      │
       │                                                           │
       └──────────── AUTONOMOUS 24/7 LOOP ────────────────────────┘
```

### Judging Criteria (AI-Evaluated)

| Criteria | What It Means | How NEXUS.FORGE Wins |
|----------|--------------|----------------------|
| **Functionality** | Does the generated app work? (Must score >5/10 to qualify) | Multi-provider LLM with auto-fallback ensures reliable code generation |
| **Design** | Is the UI polished and visually appealing? | System prompt enforces React + Tailwind CSS best practices |
| **Speed** | How fast was the response submitted? | Sub-30-second pipeline from prompt detection to submission |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                   NEXUS.FORGE — SYSTEM ARCHITECTURE                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────┐  │
│  │  WATCHER  │───▶│   BRAIN  │───▶│ BUILDER  │───▶│    PACKER    │  │
│  │ (Poller)  │    │  (LLM)   │    │  (FS IO) │    │ (Zip+Submit) │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────────┘  │
│       │               │               │               │            │
│       ▼               ▼               ▼               ▼            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    EVENT BUS (pub/sub)                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│       │                                                             │
│       ▼                                                             │
│  ┌──────────┐    ┌──────────────────────────────────────────────┐  │
│  │  BRIDGE   │───▶│         COMMAND CENTER (React UI)            │  │
│  │  (SSE)    │    │  Radar • NeuralLog • KillSwitch • Countdown │  │
│  └──────────┘    └──────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              ORCHESTRATOR (CoreEngine)                        │  │
│  │  Pipeline: idle → watching → generating → building →         │  │
│  │            packing → submitting → completed                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Module Breakdown

| Module | Role | Key Technical Details |
|--------|------|----------------------|
| **The Watcher** | Polls Seedstr API for mystery prompts | Randomized 5–10s intervals, deep JSON search across any response shape |
| **The Brain** | LLM-based code generation | Groq → OpenAI → Anthropic fallback chain, custom JSON repair engine |
| **The Builder** | Materializes generated code to filesystem | Creates full React project structure from LLM output |
| **The Packer** | Zips output + auto-submits to Seedstr | `fflate` compression (level 9), timestamped archives |
| **The Bridge** | Real-time SSE event stream | Streams logs, state changes, and pipeline progress to frontend |
| **CoreEngine** | Pipeline orchestrator | 8-stage state machine with concurrent-request guards |
| **Event Bus** | Decoupled pub/sub messaging | Connects all modules without tight coupling |

---

## ✨ Features

### 🤖 Autonomous Agent Engine
- **Zero-touch operation** — boots up, starts watching, and handles everything automatically
- **End-to-end pipeline** — prompt detection to .zip submission in ~30 seconds
- **Concurrent guard** — prevents duplicate processing when a pipeline is already active
- **Auto-recovery** — retries with randomized backoff on failures
- **Manual override** — inject custom prompts via `POST /control/prompt` for testing

### 🧠 Multi-Provider AI with Auto-Fallback
- **Primary:** Groq Llama 3.3 70B Versatile (fastest inference, ~2s response)
- **Fallback #1:** OpenAI GPT-4o Mini
- **Fallback #2:** Anthropic Claude
- **Seamless switching** — if one provider fails, the next one picks up instantly
- **JSON Repair Engine** — character-level repair for malformed LLM outputs
  - Escapes literal newlines/tabs inside JSON strings
  - Strips markdown code fences (`json ... `)
  - Regex-based fallback extraction from mixed text

### 🎨 Cyberpunk Command Center UI
- **Live Radar** — animated scanning visualization showing API polling heartbeat
- **Neural Log** — real-time scrolling event stream with color-coded log levels
- **Kill Switch** — emergency stop/start with confirmation dialogs and status indicators
- **Countdown Clock** — live hackathon countdown timer
- **Beauty Protocol** — design showcase with glassmorphism cards
- **Dark/Light themes** — system-aware with manual toggle
- **Framer Motion** — smooth enter/exit animations and micro-interactions
- **Starfield parallax** — multi-layer star animation with comets

### 🔌 HTTP API
```
GET  /health           →  { ok: true, uptime: "..." }
GET  /state            →  Engine state object (stage, running, lastPrompt, etc.)
GET  /events           →  SSE stream (real-time logs + state updates)
POST /control/start    →  Start autonomous watching
POST /control/stop     →  Stop the agent
POST /control/prompt   →  { "prompt": "..." } — manual prompt injection
```

### 🛡️ Seedstr Integration
- **Polling:** Adaptive deep-search across any JSON response shape from Seedstr API
- **Submission:** Auto-uploads .zip archive via multipart form to Seedstr submit endpoint
- **Smart detection:** Looks for `prompt`, `mysteryPrompt`, `challengePrompt`, `text` keys at any nesting depth

---

## 🛠️ Tech Stack

### Engine (Backend — Zero External Framework Dependencies)
| Technology | Purpose |
|-----------|---------|
| **TypeScript 5.9** | Type-safe codebase with strict mode |
| **Node.js 20** | Runtime (uses native `node:http`, `node:fs`) |
| **fflate** | High-performance synchronous zip compression |
| **dotenv** | Environment-based configuration |

### Frontend (Command Center Dashboard)
| Technology | Purpose |
|-----------|---------|
| **React 19.2** | Component-based UI |
| **Vite 7.2** | Dev server + production bundler |
| **Tailwind CSS 4.1** | Utility-first styling |
| **Framer Motion** | Declarative animations |
| **vite-plugin-singlefile** | Single HTML output (portable) |

### AI / LLM Providers
| Provider | Model | Latency | Role |
|----------|-------|---------|------|
| **Groq** | Llama 3.3 70B Versatile | ~2s | Primary |
| **OpenAI** | GPT-4o Mini | ~4s | Fallback #1 |
| **Anthropic** | Claude 3 | ~5s | Fallback #2 |

---

## ⚙️ How It Works

### Stage Lifecycle

```
 ┌──────┐     ┌──────────┐     ┌────────────────┐     ┌────────────┐
 │ IDLE │────▶│ WATCHING  │────▶│ PROMPT_RECEIVED│────▶│ GENERATING │
 └──────┘     └──────────┘     └────────────────┘     └────────────┘
                   ▲                                        │
                   │         ┌───────────┐     ┌─────────┐  │
                   └─────────│ COMPLETED │◀────│ PACKING  │◀─┘
                             └───────────┘     └─────────┘
                                               ▲         │
                                               │   ┌──────────┐
                                               └───│ BUILDING │
                                                   └──────────┘
```

1. **`idle`** → Engine initialized, ready to start
2. **`watching`** → Polling Seedstr API every 5–10 seconds
3. **`prompt_received`** → Mystery prompt detected, pipeline begins
4. **`generating`** → The Brain sends prompt to LLM, receives React code as JSON
5. **`building`** → The Builder writes files to `engine/runs/current/`
6. **`packing`** → The Packer creates timestamped .zip archive
7. **`submitting`** → Archive uploaded to Seedstr submission endpoint
8. **`completed`** → Success! Returns to `watching` for next prompt

### The Brain — JSON Repair Engine

LLMs sometimes return malformed JSON. The Brain handles this with a multi-layered repair strategy:

```
Raw LLM Output
     │
     ▼
┌─────────────────┐
│ Strip Code Fences│  ← Removes ```json ... ```
└────────┬────────┘
         ▼
┌─────────────────┐
│  Direct Parse    │  ← Try JSON.parse() first
└────────┬────────┘
         ▼ (fails)
┌─────────────────┐
│  Repair Engine   │  ← Character-level escape of \n, \t, \r in strings
└────────┬────────┘
         ▼ (fails)
┌─────────────────┐
│  Regex Extract   │  ← Find largest {...} block in response
└────────┬────────┘
         ▼
┌─────────────────┐
│  Validate Schema │  ← Ensure projectName + files[] exists
└─────────────────┘
```

### Seedstr API Integration

The Watcher uses an adaptive prompt detection algorithm:

```typescript
// Deep-searches any JSON structure for prompt-like fields
function deepFindPrompt(payload) {
  // Checks: prompt, mysteryPrompt, challengePrompt, text
  // Recursively walks arrays and nested objects
  // Returns first non-empty string match
}
```

This ensures NEXUS.FORGE can detect the mystery prompt regardless of the exact API response format.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 20
- **npm** ≥ 10
- API key from at least one LLM provider (Groq recommended — [free tier available](https://console.groq.com/))

### Installation

```bash
git clone https://github.com/panzauto46-bot/Nexus-Forge.git
cd Nexus-Forge
npm install
```

### Configuration

Create a `.env` file:

```env
# ─── Seedstr Integration ───
SEEDSTR_API_KEY=your_seedstr_api_key          # Get from seedstr.io after registration
SEEDSTR_AGENT_ID=NEXUS.FORGE
SEEDSTR_POLL_URL=https://api.seedstr.io/v1/prompt
SEEDSTR_SUBMIT_URL=https://api.seedstr.io/v1/submit

# ─── LLM Configuration ───
LLM_PROVIDER=groq                             # groq | openai | anthropic | mock
LLM_API_KEY=your_llm_api_key
LLM_MODEL=llama-3.3-70b-versatile
LLM_TEMPERATURE=0.2

# ─── Engine Settings ───
ENGINE_PORT=8787
ENGINE_AUTO_START=true                         # Start watching on boot
ENGINE_POLL_MIN_MS=5000
ENGINE_POLL_MAX_MS=10000
```

### Running

```bash
# Start the autonomous engine (watches for mystery prompts)
npm run engine:start

# Start the frontend dashboard (separate terminal)
npm run dev
```

Engine API: `http://localhost:8787` | Frontend: `http://localhost:5173`

### Testing with Manual Prompt

```bash
curl -X POST http://localhost:8787/control/prompt \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Build a modern todo app with dark mode"}'
```

---

## 🌐 Deployment

### Frontend → Vercel (Live)
- Single-file HTML output via `vite-plugin-singlefile`
- Serverless function at `/api/generate` for secure LLM proxy
- Environment variables configured via Vercel dashboard

### Engine → Docker-Ready

Multi-stage production Dockerfile included:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY engine/ engine/
COPY tsconfig.json ./
RUN npx tsc -p engine/tsconfig.json

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/engine/dist/ engine/dist/
ENV PORT=8787
CMD ["node", "engine/dist/index.js"]
```

### ⚠️ Cloud Deployment Note

> We attempted to deploy the engine on **Railway** as a 24/7 background worker. Railway experienced a persistent infrastructure issue with its GitHub integration:
>
> ```
> Cannot create code snapshot right now, please review your last commit
> or try again.
> ```
>
> This error occurs at Railway's **initialization stage** before any build begins. We verified:
> - ✅ GitHub App permissions: "All repositories"
> - ✅ Repository: clean (34 files, ~100KB)
> - ✅ Dockerfile and `.dockerignore` configured
> - ✅ Service deleted and recreated — same error
> - ✅ Railway Status Page: "All systems operational"
>
> The issue is specific to Railway's `us-west2-aws (Legacy)` region. **The engine runs successfully locally and the Dockerfile builds correctly.** Alternative deployment targets (Koyeb, Render) are being evaluated.

---

## 📁 Project Structure

```
nexus-forge/
├── api/
│   └── generate.ts              # Vercel serverless LLM proxy (auto-fallback)
├── engine/
│   └── src/
│       ├── index.ts             # HTTP server + module wiring + CORS
│       ├── config.ts            # Environment-based config loader
│       ├── types.ts             # Shared TypeScript interfaces
│       ├── core/
│       │   ├── orchestrator.ts  # 8-stage pipeline state machine
│       │   └── event-bus.ts     # Typed pub/sub event system
│       ├── modules/
│       │   ├── watcher.ts       # Seedstr API poller (randomized intervals)
│       │   ├── brain.ts         # Multi-provider LLM + JSON repair engine
│       │   ├── builder.ts       # File system materializer
│       │   ├── bridge.ts        # SSE real-time event stream
│       │   └── packer.ts        # fflate zip + auto-submission
│       ├── providers/
│       │   └── seedstr-client.ts # Seedstr API adapter (poll + submit)
│       └── utils/
│           └── logger.ts        # Structured log factory
├── src/
│   ├── App.tsx                  # Main React app (section navigation + themes)
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Design system (16KB of cyberpunk CSS)
│   └── components/
│       ├── Radar.tsx            # Animated radar scanning visualization
│       ├── NeuralLog.tsx        # Real-time SSE log stream
│       ├── KillSwitch.tsx       # Engine controls + status display
│       ├── CountdownClock.tsx   # Live hackathon countdown
│       ├── BeautyProtocol.tsx   # Design showcase (glassmorphism)
│       ├── StatusBar.tsx        # System status bar
│       ├── GlassCard.tsx        # Reusable glass card component
│       └── OutputViewer.tsx     # Generated code preview panel
├── Dockerfile                   # Multi-stage production build
├── .dockerignore                # Docker build context exclusions
├── package.json                 # Dependencies & scripts
├── vite.config.ts               # Vite + Tailwind + singlefile config
└── vercel.json                  # Vercel deployment routes
```

---

## 🗺️ Roadmap

### ✅ Phase 1 — Command Center UI
- [x] Cyberpunk-themed dashboard with glassmorphism design language
- [x] Live Radar with CSS-animated scanning beam
- [x] Neural Log with real-time SSE streaming and log-level coloring
- [x] Countdown Clock for hackathon deadline
- [x] Kill Switch with confirmation dialogs
- [x] Dark/Light theme with system detection + manual toggle
- [x] Framer Motion animations + parallax starfield background
- [x] Fully responsive (mobile → desktop)

### ✅ Phase 2 — Autonomous Engine
- [x] The Watcher — randomized API polling with adaptive prompt detection
- [x] The Brain — multi-provider LLM (Groq/OpenAI/Anthropic) with auto-fallback
- [x] The Builder — filesystem materializer for generated React projects
- [x] The Packer — fflate zip compression + Seedstr auto-submission
- [x] The Bridge — Server-Sent Events for live frontend updates
- [x] CoreEngine — 8-stage pipeline orchestrator with concurrency guard
- [x] Event Bus — typed pub/sub for decoupled module communication
- [x] JSON Repair Engine — multi-layer repair for malformed LLM outputs
- [x] HTTP API — health, state, SSE events, start/stop/prompt endpoints

### ✅ Phase 3 — Deployment & Integration
- [x] Vercel deployment (frontend + serverless API proxy)
- [x] Multi-stage Dockerfile for engine containerization
- [x] Seedstr API integration (adaptive polling + .zip submission)
- [x] Environment-based configuration (12-factor app)

### 🔮 Future Improvements
- [ ] WebSocket upgrade from SSE for bi-directional communication
- [ ] Persistent run history with embedded SQLite
- [ ] Pre-submission code linting via ESLint
- [ ] Dashboard analytics (submission success rate, latency graphs)
- [ ] Multi-prompt queuing for sequential processing

---

## 👨‍💻 Author

**Built by Pandu Dargah** for the [Seedstr $10K Blind Hackathon](https://seedstr.io/hackathon)

> *"The first-ever AI Agent Hackathon — no human judges, no bias, fully verifiable."*

---

## 📄 License

MIT — Built for the Seedstr Blind Hackathon.

---

<p align="center">
  <strong>⬡ NEXUS.FORGE — All systems nominal. Standing by for the mystery prompt.</strong><br/>
  <em>Autonomous. Resilient. Ready.</em>
</p>
