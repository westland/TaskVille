# TaskVille: Comprehensive Project Memory & Technical Log

This document serves as the permanent memory and architectural record of all engineering, design, and deployment work completed on **TaskVille**.

---

## 1. Project Overview & Objectives

- **Project Name:** TaskVille (Gamified Virtual Office for Autonomous AI Swarms)
- **Concept:** Replicates and expands upon the autonomous agent virtual office paradigm (inspired by TaskVille.co). Instead of manual prompting or writing workflow code, users deploy a virtual team of specialized AI agents that execute routine operations on autopilot inside an interactive 2.5D isometric office.
- **GitHub Repository:** [https://github.com/westland/TaskVille](https://github.com/westland/TaskVille)
- **Live Server URL:** [http://89.167.22.10/](http://89.167.22.10/) & [http://89.167.22.10:8550/](http://89.167.22.10:8550/)
- **Target Server:** Hetzner Cloud CX23 (`ubuntu-4gb-hel1-2`, 4 GB RAM, 2 vCPU, 40 GB SSD)

---

## 2. Technical Stack & Architecture

- **Frontend Core:** Vanilla JavaScript (ES Modules) + Semantic HTML5 + Vanilla CSS (Design Tokens, Glassmorphism, Micro-animations).
- **Graphics & Rendering Engine:** HTML5 Canvas 2.5D isometric viewport with depth sorting, station auras, energy circuit lines, animated bezier delegation beams, and speech bubbles.
- **Audio Engine:** Procedural Web Audio API synthesizer for task completion chimes, mechanical typing clicks, delegation whooshes, coffee brews, and leveling fanfares (100% zero external audio files).
- **AI Engine:** Google Gemini Generative AI integration (`gemini-1.5-flash`) via `GeminiService` for real-time task decomposition and agent persona dialog.
- **Production Server:** Multi-stage Docker container (`node:20-alpine` -> `nginx:alpine`) reverse-proxied via Host Nginx on Hetzner Ubuntu.
- **Build Tool:** Vite 6 / 8.

---

## 3. Directory & File Manifest

```
TaskVille/
├── public/
│   └── assets/                     # 3D isometric office floor, avatars, logos (unhashed static files)
│       ├── virtual_office_bg.jpg   # 2.5D isometric office background (1.19 MB)
│       ├── taskville_logo.jpg      # TaskVille brand logo
│       ├── agent_nova.jpg          # Nova Valerius avatar
│       ├── agent_atlas.jpg         # Atlas Vance avatar
│       ├── agent_lyra.jpg          # Lyra Mercer avatar
│       ├── agent_pixel.jpg         # Pixel Kaede avatar
│       ├── agent_vance.jpg         # Vance Sterling avatar
│       └── agent_cipher.jpg        # Cipher Reyes avatar
├── src/
│   ├── audio/
│   │   └── soundEngine.js          # Procedural Web Audio synthesizer
│   ├── data/
│   │   ├── agents.js               # Initial 6 Antigravity agents, levels, coordinates
│   │   ├── autopilot.js            # Pre-configured cron routines & execution logs
│   │   ├── integrations.js         # 250+ SaaS integrations catalog
│   │   └── missionTemplates.js     # Swarm mission templates & deliverable packs
│   ├── game/
│   │   ├── agentManager.js         # Agent lifecycle, XP, level ups, movement, breaks, sync
│   │   ├── officeCanvas.js         # 2.5D isometric canvas rendering & particles
│   │   └── orchestrator.js         # Swarm dispatch, specialist sequencing, peer review
│   ├── services/
│   │   └── geminiService.js        # Google Gemini AI API integration
│   ├── styles/
│   │   ├── main.css                # Base tokens, cyberpunk lounge layout, HUD, sidebar
│   │   └── components.css          # Modals, dossier, vault, hiring hall, toast alerts
│   └── main.js                     # Central controller orchestrating UI, state, modals
├── Dockerfile                      # Multi-stage production build (Node 20 -> Nginx alpine)
├── docker-compose.yml              # Production container service on port 8550:80
├── nginx.conf                      # Container Nginx config (gzip, cache-control, SPA routing)
├── deploy-hetzner.sh               # One-click automated Ubuntu deployment script
├── .gitignore                      # Git ignore rules (node_modules, dist, .env)
├── .env.example                    # Environment template
├── README.md                       # GitHub repository landing page
├── USER_MANUAL.md                  # Comprehensive official user & operator manual
└── PROJECT_MEMORY.md               # This technical memory dossier
```

---

## 4. Key Systems Implemented

### 1. 2.5D Isometric Virtual Floor (`officeCanvas.js`)
- Renders depth-sorted agent stations using normalized coordinates (`0.0` to `1.0`).
- Floating room badges: Executive War Room, Research Lab, Creative Studio, Design Bay, Server Vault, Coffee Bar.
- Energy circuit paths pulse on the floor connecting all wings of the office.
- Quadratic bezier particle beams animate between agents during task delegation and peer reviews.
- Speech bubbles float above agents, auto-clamping long text and pointing directly to avatars.

### 2. Autonomous Agent Team (`agents.js`, `agentManager.js`)
- **Nova Valerius (Lv. 14):** Executive Orchestrator & Task Decomposer.
- **Atlas Vance (Lv. 11):** Deep Web Researcher & Market Intelligence.
- **Lyra Mercer (Lv. 12):** Creative Copywriter & Brand Storyteller.
- **Pixel Kaede (Lv. 10):** Visual Media Designer & Art Director.
- **Vance Sterling (Lv. 13):** Growth Hacker & Multi-Channel Social Pilot.
- **Cipher Reyes (Lv. 15):** Systems Architect & 250+ API Broker.
- Dynamic XP progression and leveling system.
- Autonomous office life: agents wander to the coffee lounge or watercooler periodically.

### 3. Live Google Gemini Generative AI (`geminiService.js`)
- Connects to Google Gemini Generative AI using the project API key.
- **Custom Swarm Decomposition:** When a user types a custom mission, Nova calls Gemini to decompose the prompt into 6 specialist subtasks, inter-agent dialogue, and deliverables.
- **Direct Agent Directives:** Users can instruct any agent directly (e.g. *"Write a poem on quantum computing"*, *"Audit competitor pricing"*). Gemini generates the full finished work and delivers it.

### 4. Deliverables Vault & Creation Repository (`main.js`, `components.css`)
- Serves as the central repository for all work produced by the agents.
- When an agent completes a directive or swarm mission, a dedicated tab is prepended to the Vault (e.g. `📜 Lyra: Poem: Silicon Reverie by Lyra`).
- Displays formatted markdown with headers, blockquotes, stanzas, and code snippets.
- Interactive **"Read Full in Deliverables Vault 📦"** button appears in the Live Feed.
- One-click **"Copy Content"** and **"Download Markdown"** actions.

### 5. Autopilot & Autonomous Scheduling (`autopilot.js`)
- Pre-configured recurring cron routines:
  - 8:00 AM Morning Executive Intelligence Briefing
  - 1:00 PM Multi-Channel Social Content Drop
  - Friday 5:00 PM Competitor & Pricing Audit
  - Hourly Inbound Lead Qualification & Enrichment
- Cyber toggle switches arm/disarm jobs.
- "Trigger All Active Routines Now ⚡" executes routines in parallel with visual canvas beams.

### 6. 250+ SaaS Integrations Catalog (`integrations.js`)
- Connectors for Gmail, Slack, HubSpot, Notion, Twitter/X, Stripe, GitHub, and Shopify.
- Category filters (Productivity, CRM, Social, Commerce & Dev).
- "Test Webhook Handshakes ⚡" runs simulated latency tests across all 250+ endpoints.

### 7. Office Controls & Audio
- `☕ Break`: Sends team to the lounge for cold brew recharge with sizzle audio.
- `🎯 Sync`: Gathers team in the War Room for strategic standup with chime audio.
- Theme Switcher: Cyber Neon, Lo-Fi, and Tokyo themes.
- Procedural audio FX for typing, chimes, fanfares, and whooshes.

---

## 5. Server Deployment & Troubleshooting History

### Hetzner CX23 Configuration:
- **Server:** Hetzner Cloud CX23 (`ubuntu-4gb-hel1-2`, 4GB RAM, 2 vCPU, 40GB SSD)
- **Host IP:** `89.167.22.10`
- **Docker Container:** `taskville_office` (running Alpine Nginx on internal port `8550`)
- **Host Reverse Proxy:** Host Nginx proxies port 80 requests directly to `http://127.0.0.1:8550`, preserving existing applications (`pulse-mexico.com` and `anahuac-innovation.com`).
- **Firewall (UFW):** Ports 22, 80, 443, and 8550 open.

### Critical Gotchas Solved:
1. **GitHub Secret Scanning Push Protection:**
   - Raw API keys in deployment shell scripts are blocked by GitHub push protection.
   - Resolved by referencing environment variables (`VITE_GEMINI_API_KEY`) and git-ignoring `.env`.
2. **Missing 3D Floor on Production (Black Screen):**
   - On localhost dev mode, Vite serves root files directly.
   - In production builds (`vite build`), assets referenced dynamically in JS string literals without ES `import` were omitted unless placed in Vite's standard `public/` directory.
   - Resolved by copying all static assets into `public/assets/`, referencing them as `/assets/...`, and rebuilding the Docker container.
3. **Agent Creation Storage (Deliverables Vault):**
   - Direct agent directives were previously only logging short summaries to the feed without storing the full creative work.
   - Resolved by restructuring Gemini output to pure JSON containing the full markdown text and prepending a new tab into `state.activeDeliverable.tabs`, with direct buttons in the Live Feed and Dossier.

---

## 6. Project Status

- **Build Status:** Clean production build (`npm run build` passing in <800ms).
- **Hetzner Status:** Healthy, running on Docker on Hetzner CX23 (`http://89.167.22.10/`).
- **GitHub Status:** Synchronized on `main` at `https://github.com/westland/TaskVille`.
- **Local Dev Server:** Cleanly shut down; no background processes left running.

---
*TaskVille © 2026. Designed for Autonomous Operations.*
