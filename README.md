# 🧬 Skinlytics AgeVision AI

**Clinical-grade AI skin analysis + generative simulation platform.**

Real-time face detection, biological age estimation, wrinkle scoring, and AI-powered treatment simulation — all privacy-first with client-side ML inference.

| Stack | Details |
|-------|---------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, Shadcn/UI |
| **ML (Client)** | TensorFlow.js, face-api.js — runs in-browser |
| **ML (Server)** | SD.Next (Stable Diffusion) — img2img simulation |
| **Database** | PostgreSQL (Neon serverless) via Drizzle ORM |
| **State** | Zustand — local + offline queue |
| **PWA** | Offline-first, auto-sync, anonymous visitor tracking |
| **Language** | Bahasa Indonesia UI |

---

## 🚀 Features

| # | Feature | Route | Description |
|---|---------|-------|-------------|
| 🪞 | Treatment Simulator | `/simulate` | Before/after simulation of skincare treatment results |
| 🏥 | Dermatology Dashboard | `/dashboard` | Clinical heatmap overlay + comprehensive skin metrics |
| ⏳ | Aging Time-Lapse | `/timelapse` | See yourself at ages 25, 35, 45, 55, 65 |
| 💄 | Product Visualizer | `/products` | Simulate effects of Retinol, Vitamin C, Hyaluronic Acid, etc. |
| 🤖 | AI Skin Therapist | `/therapist` | Conversational skincare advisor with analysis context |
| 📊 | Clinical Report | `/report` | Printable/exportable professional skin analysis report |

---

## 📋 Prerequisites

- **Node.js** 18+
- **PostgreSQL** — free via [Neon](https://neon.tech) _(optional — app works fully offline without it)_
- **GPU with VRAM 6GB+** — for SD.Next _(optional — use Google Colab free GPU, or skip for client-only mode)_

---

## ⚡ Quick Start (Frontend Only)

```bash
# 1. Clone
git clone https://github.com/tristiyadi/Web-Skinlytics-AgeVision-Ai.git
cd Web-Skinlytics-AgeVision-Ai

# 2. Install
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local → set SDNEXT_URL to your SD.Next server

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the face scan works without SD.Next (client-side ML). AI simulation features require SD.Next running.

---

## 🗄️ Database Setup (Neon PostgreSQL)

The database is **optional** — the app works fully offline without it. But when configured, it enables:
- 📜 **Scan history** — persist all analysis results across sessions
- 👤 **Anonymous visitor tracking** — unique UUID per browser, no login needed
- ☁️ **Offline sync** — scans queued offline auto-sync when back online

### Option A: Neon (Recommended — Free Serverless Postgres)

```bash
# 1. Create a free database at https://neon.tech
# 2. Copy the connection string and add to .env.local:
```

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

```bash
# 3. Push the schema to your database:
npm run db:push

# 4. (Optional) Open Drizzle Studio to view data:
npm run db:studio
```

### Option B: Local PostgreSQL

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/skinlytics
```

```bash
npm run db:push
```

### Database Schema

```
visitors
├── id (UUID)           — client-generated, stored in localStorage
├── first_seen_at       — first visit timestamp
├── last_seen_at        — last activity
├── user_agent          — browser info
└── total_scans         — scan counter

scans
├── id (UUID)           — auto-generated
├── visitor_id (FK)     — links to visitor
├── estimated_age       — detected biological age
├── wrinkle_score       — 0-100 wrinkle severity
├── wrinkle_level       — "Low" | "Medium" | "High"
├── gender              — detected gender
├── skin_clarity        — computed: 100 - wrinkle_score
├── hydration_estimate  — computed from wrinkle score
├── elasticity_estimate — computed from wrinkle score
├── uv_damage_estimate  — computed from wrinkle score
├── overall_health      — composite score
├── source              — "client" or "api"
├── device_info (JSONB) — browser/device metadata
└── created_at          — scan timestamp
```

---

## 📡 Offline-First PWA Mode

The app is built as a **Progressive Web App** with offline-first architecture:

| Feature | Offline | Online |
|---------|---------|--------|
| Face scan (camera/upload) | ✅ Client-side ML | ✅ Client-side ML |
| Age & wrinkle analysis | ✅ TensorFlow.js | ✅ TensorFlow.js |
| Save scan results | ✅ Queued in localStorage | ✅ Saved to PostgreSQL |
| View scan history | ❌ Not available | ✅ Loaded from database |
| AI simulation (SD.Next) | ❌ Requires server | ✅ img2img generation |
| AI therapist chat | ❌ Requires server | ✅ Context-aware responses |

### How It Works

1. **Network Detection** — The app monitors `navigator.onLine` + actively pings `/api/health`
2. **Offline Queue** — When offline, scan results are queued in `localStorage`
3. **Auto-Sync** — When connection is restored, pending scans automatically sync to the server
4. **Status Badges** — The scan page and dashboard show real-time online/offline indicators with pending sync counts

### Anonymous Visitor Tracking

No login required. Each browser gets a unique `UUID` stored in `localStorage`:
- Generated on first visit via `crypto.randomUUID()`
- Persists across sessions (survives page reloads, not browser data clearing)
- Used to associate scan history without any personal information
- Visitors table tracks `first_seen_at`, `last_seen_at`, and `total_scans`

---

## 🖥️ SD.Next Setup (Local with Docker)

If you have a local **NVIDIA GPU** + [nvidia-container-toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html) installed:

```bash
# 1. Clone SD.Next into the project
git clone https://github.com/vladmandic/sdnext.git ./sdnext

# 2. Start everything
docker compose up -d

# 3. Wait ~3-5 min for SD.Next to download deps and load model
# Check status:
docker compose logs -f sdnext
```

> **Note:** First launch takes a while as SD.Next downloads Python dependencies and default models. Subsequent starts are fast. The frontend waits for SD.Next to be healthy before starting.

---

## ☁️ SD.Next on Google Colab (Free GPU)

> **Use this if you don't have a local GPU.** Colab provides a free T4 GPU (16GB VRAM) which is more than enough for SD 1.5 and GGUF models.

### Step 1: Create New Colab Notebook

Go to [colab.research.google.com](https://colab.research.google.com) → **New notebook**

**Change runtime to GPU:** `Runtime` → `Change runtime type` → Select **T4 GPU** → Save

### Step 2: Mount Google Drive (Persist Models)

```python
# Cell 1: Mount Drive so models survive session restarts
from google.colab import drive
drive.mount('/content/drive')

# Create persistent model directory
!mkdir -p /content/drive/MyDrive/sdnext-models
```

### Step 3: Install SD.Next

```python
# Cell 2: Clone and setup SD.Next
!git clone https://github.com/vladmandic/sdnext.git /content/sdnext
%cd /content/sdnext
```

### Step 4: Download GGUF Model

GGUF models are quantized (smaller file size, less VRAM usage). Perfect for Colab's free T4 GPU.

```python
# Cell 3: Download SD 1.5 GGUF model (smaller, fast on T4)
!apt-get install -y aria2 > /dev/null 2>&1

# Option A: SD 1.5 GGUF (~2.5GB, fastest)
!aria2c --console-log-level=error -c -x 16 -s 16 \
  "https://huggingface.co/second-state/stable-diffusion-v1-5-GGUF/resolve/main/stable-diffusion-v1-5-Q8_0.gguf" \
  -d /content/sdnext/models/Stable-diffusion \
  -o "sd15-Q8.gguf"

# Option B: Realistic Vision GGUF (better for faces, ~2.5GB)
# !aria2c --console-log-level=error -c -x 16 -s 16 \
#   "https://huggingface.co/second-state/Realistic-Vision-V5.1-GGUF/resolve/main/realistic-vision-v51-Q8_0.gguf" \
#   -d /content/sdnext/models/Stable-diffusion \
#   -o "realistic-vision-Q8.gguf"

# Also symlink persistent storage for next time
!ln -sf /content/drive/MyDrive/sdnext-models /content/sdnext/models/Stable-diffusion/persistent
```

> **💡 Tip: Alternative — use standard safetensors instead of GGUF:**
> If you have enough VRAM (T4 has 16GB, plenty for SD 1.5), safetensors is actually faster because GGUF needs de-quantization at load time. SD.Next treats GGUF as storage-only format.
>
> ```python
> # Standard SD 1.5 safetensors (~4GB, faster inference)
> !aria2c --console-log-level=error -c -x 16 -s 16 \
>   "https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.safetensors" \
>   -d /content/sdnext/models/Stable-diffusion \
>   -o "v1-5-pruned-emaonly.safetensors"
> ```

### Step 5: Launch SD.Next with API + Public Tunnel

```python
# Cell 4: Launch SD.Next
#   --api      → Enable REST API at /sdapi/v1/*
#   --share    → Create public Gradio tunnel URL
#   --docs     → Enable API docs at /docs
#   --listen   → Listen on all interfaces
!python launch.py --api --share --docs --listen --skip-torch-cuda-test
```

**Wait ~2-5 minutes** for first-time setup (downloads dependencies + loads model).

When ready, you'll see output like:

```
Running on public URL: https://xxxxx.gradio.live
```

**Copy that URL** — that's your `SDNEXT_URL`.

### Step 6: Connect Your App

Update your `.env.local` on your local machine:

```env
# Point to your Colab SD.Next instance
SDNEXT_URL=https://xxxxx.gradio.live
SDNEXT_AUTH_USER=
SDNEXT_AUTH_PASS=
```

Then restart your Next.js dev server:

```bash
npm run dev
```

### Step 7: Verify Connection

Open [http://localhost:3000](http://localhost:3000) → Scan your face → Go to **Treatment Simulator** → Click **Simulate Treatment**. If SD.Next is online, simulation will generate in ~10-30 seconds.

Or test the API directly:

```bash
# Check health
curl https://xxxxx.gradio.live/sdapi/v1/progress

# Should return: {"progress": 0, ...}
```

---

## 📓 Complete Colab Notebook (Copy-Paste Ready)

For convenience, here's the entire Colab setup in one cell:

```python
# ═══════════════════════════════════════════════════
#  Skinlytics AgeVision AI — SD.Next Colab Setup
# ═══════════════════════════════════════════════════

# 1. Mount Google Drive
from google.colab import drive
drive.mount('/content/drive')
!mkdir -p /content/drive/MyDrive/sdnext-models

# 2. Clone SD.Next
!git clone https://github.com/vladmandic/sdnext.git /content/sdnext
%cd /content/sdnext

# 3. Download model (choose ONE):

# --- Option A: SD 1.5 GGUF (small, quantized) ---
!aria2c --console-log-level=error -c -x 16 -s 16 \
  "https://huggingface.co/second-state/stable-diffusion-v1-5-GGUF/resolve/main/stable-diffusion-v1-5-Q8_0.gguf" \
  -d /content/sdnext/models/Stable-diffusion \
  -o "sd15-Q8.gguf"

# --- Option B: Standard safetensors (faster inference) ---
# !aria2c --console-log-level=error -c -x 16 -s 16 \
#   "https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.safetensors" \
#   -d /content/sdnext/models/Stable-diffusion \
#   -o "v1-5-pruned-emaonly.safetensors"

# 4. Launch with API + Public URL
!python launch.py --api --share --docs --listen --skip-torch-cuda-test
```

After launch, copy the `gradio.live` URL → paste into `.env.local` as `SDNEXT_URL` → done!

---

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string ([Neon](https://neon.tech)) | _(not set — offline mode)_ |
| `SDNEXT_URL` | SD.Next server URL | `http://localhost:7860` |
| `SDNEXT_AUTH_USER` | Basic auth username (optional) | _(empty)_ |
| `SDNEXT_AUTH_PASS` | Basic auth password (optional) | _(empty)_ |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│  Browser (Client)                                │
│  ├── Camera/Upload → face-api.js analysis        │
│  ├── TensorFlow.js → age + wrinkle detection     │
│  ├── Visitor UUID (localStorage)                 │
│  ├── Offline scan queue (localStorage)           │
│  └── React UI (Next.js 16, PWA)                  │
└──────────────────┬───────────────────────────────┘
                   │ POST /api/scans (save)
                   │ GET  /api/scans (history)
                   │ POST /api/simulate
                   ▼
┌──────────────────────────────────────────────────┐
│  Next.js API Routes (Server)                     │
│  ├── /api/scans    → save/load scan history      │
│  ├── /api/simulate → SD.Next img2img pipeline    │
│  ├── /api/chat     → AI skin therapist           │
│  └── /api/health   → DB + SD.Next status check   │
└──────────────┬───────────────┬────────────────────┘
               │               │
               ▼               ▼
┌──────────────────┐  ┌────────────────────────────┐
│  PostgreSQL      │  │  SD.Next (Docker / Colab)  │
│  (Neon)          │  │  ├── Stable Diffusion      │
│  ├── visitors    │  │  ├── GGUF / safetensors    │
│  └── scans       │  │  └── Returns base64 image  │
└──────────────────┘  └────────────────────────────┘
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── scan/page.tsx         # Face scanner (camera/upload)
│   ├── dashboard/page.tsx    # Dermatology dashboard + heatmap + history
│   ├── simulate/page.tsx     # Treatment simulator
│   ├── timelapse/page.tsx    # Aging time-lapse
│   ├── products/page.tsx     # Product visualizer
│   ├── therapist/page.tsx    # AI skin therapist chat
│   ├── report/page.tsx       # Clinical report generator
│   ├── actions/
│   │   └── save-analysis.ts  # Server action: save scan to DB
│   └── api/
│       ├── scans/route.ts    # POST save + GET history
│       ├── simulate/route.ts # SD.Next img2img proxy
│       ├── chat/route.ts     # Skin therapist API
│       └── health/route.ts   # DB + SD.Next health check
├── components/
│   ├── before-after.tsx      # Interactive comparison slider
│   ├── consent-dialog.tsx    # Privacy consent modal
│   ├── feature-header.tsx    # Shared page header
│   └── no-scan-prompt.tsx    # Empty state component
├── db/
│   ├── index.ts              # Drizzle + Neon connection (optional)
│   └── schema.ts             # visitors + scans tables
├── hooks/
│   ├── use-face-analysis.ts  # TF.js face analysis hook
│   ├── use-scan-history.ts   # Save/load scan history (offline-first)
│   ├── use-network-status.ts # PWA online/offline detection
│   ├── use-skin-simulation.ts# SD.Next simulation hook
│   └── use-skin-chat.ts      # Chat hook
├── lib/
│   ├── visitor.ts            # Anonymous visitor UUID (localStorage)
│   ├── sdnext-client.ts      # SD.Next REST API client
│   ├── simulation-prompts.ts # Prompt engineering
│   └── wrinkle-detection.ts  # Sobel edge detection
└── store/
    └── simulation-store.ts   # Zustand global state
```

---

## ⚠️ Important Notes

- **Privacy**: Face analysis runs 100% client-side. AI simulation (SD.Next) is opt-in with explicit consent dialog. No personal data is collected — only anonymous UUIDs.
- **Database is optional**: The entire app works without `DATABASE_URL`. Set it up when you want scan history persistence.
- **Offline-first**: Scans are queued in localStorage when offline and auto-sync when back online. The scan page shows real-time connection status.
- **GGUF in SD.Next**: GGUF is treated as a storage-only format. Models are de-quantized to FP16 at load time. If you have enough VRAM, safetensors is faster.
- **Colab sessions expire**: Free Colab disconnects after ~90 min idle or ~12h max. Your `gradio.live` URL will change each session — update `.env.local` accordingly.
- **SD.Next quantization alternative**: Instead of GGUF files, SD.Next has built-in SDNQ (quantization engine) under `Settings → Quantization` that can quantize any model on-the-fly.

---

## 🛠️ NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Next.js dev server |
| `build` | `npm run build` | Production build |
| `start` | `npm run start` | Start production server |
| `db:push` | `npm run db:push` | Push schema to PostgreSQL |
| `db:generate` | `npm run db:generate` | Generate Drizzle migrations |
| `db:studio` | `npm run db:studio` | Open Drizzle Studio (DB viewer) |

---

## 📄 License

MIT
