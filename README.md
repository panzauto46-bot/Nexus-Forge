<p align="center">
  <img src="https://img.shields.io/badge/NEXUS.FORGE-Autonomous%20Agent-00ff88?style=for-the-badge&labelColor=0a0a0a&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGZmODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWdvbiBwb2ludHM9IjEyIDIgMjIgOC41IDIyIDE1LjUgMTIgMjIgMiAxNS41IDIgOC41IDEyIDIiPjwvcG9seWdvbj48bGluZSB4MT0iMTIiIHkxPSIyIiB4Mj0iMTIiIHkyPSIyMiI+PC9saW5lPjxsaW5lIHgxPSIyMiIgeTE9IjguNSIgeDI9IjIiIHkyPSIxNS41Ij48L2xpbmU+PC9zdmc+" alt="NEXUS.FORGE"/>
  <br/>
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/LLM-Multi--Provider-FF6F00?style=flat-square&logo=openai&logoColor=white" alt="LLM"/>
</p>

<h1 align="center">⬡ NEXUS.FORGE</h1>

<p align="center">
  <strong>Fully Autonomous AI Agent for the Seedstr Hackathon</strong><br/>
  <em>Receives mystery prompts → Generates production-grade React apps → Submits automatically</em>
</p>

<p align="center">
  <a href="#architecture">Architecture</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#roadmap">Roadmap</a>
</p>

---

## 🧠 What is NEXUS.FORGE?

**NEXUS.FORGE** is a **fully autonomous AI-powered agent** built for the [Seedstr Hackathon](https://seedstr.io). It operates as a **24/7 background worker** that:

1. **Watches** the Seedstr API for mystery prompt drops
2. **Thinks** using multi-provider LLM intelligence (Groq, OpenAI, Anthropic)
3. **Builds** complete React/Tailwind applications from scratch
4. **Packs** the generated code into deployment-ready archives
5. **Submits** the finished product back to Seedstr — all without human intervention

The entire pipeline runs end-to-end in **under 30 seconds**, from prompt detection to submission.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      NEXUS.FORGE SYSTEM ARCHITECTURE                │
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
│  │  Manages pipeline stages: idle → watching → generating →     │  │
│  │  building → packing → submitting → completed                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Module Breakdown

| Module | Responsibility | Key Features |
|--------|---------------|--------------|
| **The Watcher** | Polls Seedstr API every 5–10s | Randomized intervals, smart prompt detection with deep JSON search |
| **The Brain** | LLM-based code generation | Multi-provider fallback (Groq → OpenAI → Anthropic), JSON repair engine |
| **The Builder** | Writes files to disk | Creates production-grade React project structure |
| **The Packer** | Zips & submits to Seedstr | Uses `fflate` for compression, timestamped archives |
| **The Bridge** | Real-time SSE streaming | Server-Sent Events for live UI updates |
| **CoreEngine** | Pipeline orchestrator | State machine with 8 lifecycle stages |
| **Event Bus** | Internal pub/sub messaging | Decoupled module communication |

---

## ✨ Features

### 🤖 Autonomous Agent Engine
- **Zero-touch operation** — starts watching for prompts immediately on boot
- **End-to-end pipeline** — from API polling to code submission in ~30 seconds
- **Graceful error handling** — auto-recovery with retry logic on failures
- **Stage-aware processing** — prevents duplicate prompt processing during active pipelines

### 🧠 Multi-Provider AI Intelligence
- **Primary:** Groq Llama 3.3 70B Versatile (fastest inference)
- **Fallback #1:** OpenAI GPT-4o Mini
- **Fallback #2:** Anthropic Claude
- **Auto-switch:** If primary provider fails, seamlessly falls back to alternatives
- **JSON Repair Engine:** Handles malformed LLM outputs with character-level JSON repair
- **Code Fence Sanitization:** Strips markdown fences that LLMs sometimes add to responses

### 🎨 Cyberpunk Command Center UI
- **Live Radar** — animated scanning visualization for API polling status
- **Neural Log** — real-time event stream with color-coded severity levels
- **Kill Switch** — emergency stop/start controls with confirmation dialogs
- **Countdown Clock** — hackathon timer with live countdown
- **Beauty Protocol** — design showcase section with glassmorphism effects
- **Dark/Light themes** — system-aware with manual toggle
- **Framer Motion animations** — smooth transitions and micro-interactions
- **Starfield background** — parallax star layers with comet animations

### 🔌 API Endpoints
```
GET  /health          → Health check { ok: true }
GET  /state           → Current engine state
GET  /events          → SSE stream for real-time updates
POST /control/start   → Start the autonomous agent
POST /control/stop    → Stop the agent
POST /control/prompt  → Manual prompt injection { "prompt": "..." }
```

### 🛡️ Security
- API keys stored in environment variables (never exposed to frontend)
- Vercel serverless function for secure LLM proxy (`/api/generate`)
- CORS-aware request handling with configurable origins

---

## 🛠️ Tech Stack

### Engine (Backend)
| Technology | Purpose |
|-----------|---------|
| **TypeScript 5.9** | Type-safe codebase |
| **Node.js 20** | Runtime environment |
| **dotenv** | Environment configuration |
| **fflate** | High-performance zip compression |
| **node:http** | Lightweight HTTP server (zero dependencies) |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19.2** | UI framework |
| **Vite 7.2** | Build tooling & HMR |
| **Tailwind CSS 4.1** | Utility-first styling |
| **Framer Motion** | Fluid animations |
| **vite-plugin-singlefile** | Single HTML output for portability |

### AI / LLM Providers
| Provider | Model | Use Case |
|----------|-------|----------|
| **Groq** | Llama 3.3 70B Versatile | Primary (fastest) |
| **OpenAI** | GPT-4o Mini | Fallback #1 |
| **Anthropic** | Claude 3 | Fallback #2 |

---

## ⚙️ How It Works

### The Autonomous Pipeline

```
  Seedstr API                    NEXUS.FORGE Engine                     Seedstr API
  ┌────────┐     ┌─────┐    ┌───────┐    ┌─────────┐    ┌──────┐     ┌────────┐
  │ Mystery │────▶│Watch│───▶│ Brain │───▶│ Builder │───▶│Packer│────▶│ Submit │
  │ Prompt  │     │ er  │    │ (LLM) │    │  (FS)   │    │(Zip) │     │  ✓     │
  └────────┘     └─────┘    └───────┘    └─────────┘    └──────┘     └────────┘
       │              │           │            │             │              │
       │         5-10s poll  AI generates  Writes files  Compresses &     │
       │         interval    React code    to disk       submits archive   │
       │                                                                   │
       └───────────────── AUTONOMOUS LOOP (24/7) ─────────────────────────┘
```

**Stage Lifecycle:**
1. `idle` → Engine initialized, waiting for start command
2. `watching` → Actively polling Seedstr API for mystery prompts
3. `prompt_received` → New prompt detected, preparing pipeline
4. `generating` → The Brain processes prompt through LLM
5. `building` → The Builder writes generated files to filesystem
6. `packing` → The Packer creates zip archive
7. `submitting` → Archive submitted to Seedstr endpoint
8. `completed` → Cycle complete, returns to watching

### JSON Repair Engine

One of the unique challenges was handling LLM outputs that contain malformed JSON. The Brain module includes a custom character-level JSON repair engine that:

- Escapes literal newlines/tabs inside JSON string values
- Strips markdown code fences (`\`\`\`json ... \`\`\``)
- Falls back to regex-based JSON block extraction
- Normalizes and validates the `BuildArtifact` schema

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20 or higher
- **npm** 10 or higher
- An API key from at least one LLM provider (Groq recommended for speed)

### Installation

```bash
# Clone the repository
git clone https://github.com/panzauto46-bot/Nexus-Forge.git
cd Nexus-Forge

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the root directory:

```env
# ─── LLM Configuration ───
LLM_PROVIDER=groq                           # groq | openai | anthropic | mock
LLM_API_KEY=your-api-key-here               # API key for your chosen provider
LLM_MODEL=llama-3.3-70b-versatile           # Model identifier
LLM_TEMPERATURE=0.2                         # Generation temperature (0.0–1.0)

# ─── Seedstr Integration ───
SEEDSTR_API_KEY=your-seedstr-api-key
SEEDSTR_AGENT_ID=NEXUS.FORGE
SEEDSTR_POLL_URL=https://api.seedstr.io/v1/prompt
SEEDSTR_SUBMIT_URL=https://api.seedstr.io/v1/submit

# ─── Engine Settings ───
ENGINE_PORT=8787                             # HTTP server port
ENGINE_AUTO_START=true                       # Start watching immediately
ENGINE_POLL_MIN_MS=5000                      # Min polling interval
ENGINE_POLL_MAX_MS=10000                     # Max polling interval
ENGINE_CORS_ORIGIN=*                         # CORS origin
```

### Running Locally

```bash
# Start the autonomous engine
npm run engine:start

# Start the frontend (separate terminal)
npm run dev
```

The engine API will be available at `http://localhost:8787` and the frontend at `http://localhost:5173`.

### Frontend Build

```bash
# Build optimized frontend (single HTML file)
npm run build
```

---

## 🌐 Deployment

### Frontend → Vercel

The frontend is deployed on **Vercel** with:
- Single-file HTML output via `vite-plugin-singlefile`
- Serverless API function at `/api/generate` for secure LLM proxy calls
- Environment variables configured through Vercel dashboard

### Engine → Docker-Ready

The engine includes a production-ready **multi-stage Dockerfile**:

```dockerfile
# Build stage: compiles TypeScript
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY engine/ engine/
COPY tsconfig.json ./
RUN npx tsc -p engine/tsconfig.json

# Production stage: runs compiled JavaScript
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/engine/dist/ engine/dist/
ENV PORT=8787
CMD ["node", "engine/dist/index.js"]
```

### ⚠️ Railway Deployment Note

> **Transparency for Judges:** We attempted to deploy the engine as a 24/7 background worker on **Railway** (cloud hosting platform). However, Railway experienced a persistent infrastructure issue with its GitHub integration — specifically, the error:
>
> ```
> Cannot create code snapshot right now, please review your last commit or try again.
> If this error persists, please reach out to the Railway team.
> ```
>
> This error occurs at Railway's **initialization stage** (before any build process begins) when Railway attempts to clone/snapshot the GitHub repository. We confirmed:
> - ✅ GitHub App permissions are set to "All repositories"
> - ✅ Repository is clean (34 tracked files, ~100KB total)
> - ✅ Dockerfile and `.dockerignore` are properly configured
> - ✅ Builder set to Dockerfile mode
> - ✅ We deleted and recreated the service — same error persists
> - ✅ Railway Status Page shows "All systems operational"
>
> The issue appears to be specific to Railway's `us-west2-aws (Legacy)` region's ability to snapshot this repository. **The engine code is fully functional and runs successfully locally.** The Dockerfile has been tested and works correctly.

---

## 📁 Project Structure

```
nexus-forge/
├── api/
│   └── generate.ts              # Vercel serverless LLM proxy
├── engine/
│   └── src/
│       ├── index.ts             # HTTP server + module wiring
│       ├── config.ts            # Environment config loader
│       ├── types.ts             # TypeScript type definitions
│       ├── core/
│       │   ├── orchestrator.ts  # Pipeline state machine
│       │   └── event-bus.ts     # Pub/sub event system
│       ├── modules/
│       │   ├── watcher.ts       # Seedstr API poller
│       │   ├── brain.ts         # Multi-provider LLM client
│       │   ├── builder.ts       # Filesystem writer
│       │   ├── bridge.ts        # SSE real-time stream
│       │   └── packer.ts        # Zip + submit
│       ├── providers/
│       │   └── seedstr-client.ts # Seedstr API adapter
│       └── utils/
│           └── logger.ts        # Structured log factory
├── src/
│   ├── App.tsx                  # Main React application
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Global styles + design system
│   ├── components/
│   │   ├── Radar.tsx            # Animated scanning radar
│   │   ├── NeuralLog.tsx        # Real-time event log stream
│   │   ├── KillSwitch.tsx       # Engine start/stop controls
│   │   ├── CountdownClock.tsx   # Hackathon countdown timer
│   │   ├── BeautyProtocol.tsx   # Design showcase section
│   │   ├── StatusBar.tsx        # System status indicators
│   │   ├── GlassCard.tsx        # Glassmorphism card component
│   │   └── OutputViewer.tsx     # Generated code viewer
│   └── utils/
│       └── cn.ts                # Class name utility (clsx + twMerge)
├── Dockerfile                   # Multi-stage production build
├── .dockerignore                # Docker build exclusions
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite build configuration
└── vercel.json                  # Vercel deployment config
```

---

## 🗺️ Roadmap

### ✅ Phase 1 — Command Center UI
- [x] Cyberpunk-themed dashboard with glassmorphism design
- [x] Live Radar component with scanning animation
- [x] Neural Log with real-time event streaming
- [x] Countdown Clock for hackathon timer
- [x] Dark/Light theme support
- [x] Responsive design (mobile, tablet, desktop)
- [x] Framer Motion animations + starfield background

### ✅ Phase 2 — Autonomous Engine
- [x] The Watcher — API polling with randomized intervals
- [x] The Brain — Multi-provider LLM integration (Groq, OpenAI, Anthropic)
- [x] The Builder — Filesystem writer for generated projects
- [x] The Packer — Auto-zip + auto-submit to Seedstr
- [x] The Bridge — SSE real-time streaming to frontend
- [x] CoreEngine Orchestrator — 8-stage pipeline state machine
- [x] Event Bus — Decoupled pub/sub architecture
- [x] JSON Repair Engine — Handles malformed LLM outputs
- [x] Auto-switch fallback — Seamless provider rotation on failures
- [x] HTTP API with health checks, state queries, and manual prompt injection

### ✅ Phase 3 — Deployment & Integration
- [x] Vercel deployment for frontend + serverless API
- [x] Multi-stage Dockerfile for engine containerization
- [x] `.dockerignore` for optimized builds
- [x] Environment-based configuration system
- [x] Seedstr API integration (polling + submission)

### 🔮 Future Enhancements
- [ ] WebSocket upgrade from SSE for bi-directional communication
- [ ] Persistent run history with database storage
- [ ] Multi-agent coordination for parallel prompt handling
- [ ] Built-in code linting/testing before submission
- [ ] Dashboard analytics with submission success rate tracking

---

## 👨‍💻 Team

**Built by Pandu Dargah** for the Seedstr Re{define} Hackathon

---

## 📄 License

This project is built for hackathon evaluation purposes.

---

<p align="center">
  <strong>⬡ NEXUS.FORGE — Where AI meets autonomy</strong><br/>
  <em>All systems nominal. Standing by for mystery prompts.</em>
</p>
