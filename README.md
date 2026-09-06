# CyberGuard — Frontend (Goal 7: Admin Dashboard)

Next.js 14 (App Router) + TypeScript + Tailwind dashboard for the CyberGuard
hackathon build. Covers the full frontend surface from the timeline: design
system, dashboard shell, incident timeline, attack graph, AI Copilot panel,
containment UI, employee risk views, and the CyberRange training mission.

Every screen renders real, story-consistent **demo data** the moment you run
`npm run dev` — before any backend endpoint exists — and automatically
switches to live data the moment `NEXT_PUBLIC_API_URL` points at a real
FastAPI server. A small `live` / `demo data` badge in the top-right of each
page always tells you which one you're looking at.

---

## 1. Project structure

```
src/
  app/
    layout.tsx              Root shell: fonts, sidebar
    page.tsx                Dashboard / overview        (Goal 7)
    incidents/[id]/page.tsx Incident detail: graph, timeline, copilot, containment
    employees/page.tsx      High-risk employee list
    employees/[id]/page.tsx Employee detail + training impact
    cyberrange/[missionId]/page.tsx  Training mission runner
  components/
    IncidentTimeline.tsx    Goal 3 (D)
    AttackGraph.tsx         Goal 3 (D) — React Flow
    CopilotPanel.tsx        Goal 4 (E)
    ContainmentPanel.tsx    Goal 5 (D)
    MissionQuiz.tsx         Goal 6 (E)
    EmployeeRow.tsx, SecurityScoreGauge.tsx, RiskCharts.tsx, Primitives.tsx, SideNav.tsx
  lib/
    types.ts                Shared TS types = the API contract (see §3)
    api.ts                  Fetch wrapper — THE ONLY FILE THAT CALLS THE BACKEND
    mock-data.ts            Demo data matching the flagship attack chain
    format.ts                Formatting/label helpers
```

**Golden rule for integration:** nothing outside `lib/api.ts` knows whether
data is real or mocked. When a teammate's endpoint goes live, you change
`lib/api.ts` and/or set `NEXT_PUBLIC_API_URL` — you never touch a page or
component.

---

## 2. Local setup

```bash
cd cyberguard-frontend
npm install
cp .env.local.example .env.local   # optional — works without this
npm run dev
```

Open http://localhost:3000. With no `.env.local`, every page falls back to
mock data automatically (badge reads "demo data") — this is intentional so
frontend work is never blocked on the backend being up.

Once teammate A/B/D/E's FastAPI server is running:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Restart `npm run dev`. Pages that successfully reach the backend flip their
badge to "live"; any endpoint that isn't ready yet, errors, or times out
silently falls back to demo data for that call only — the rest of the UI
doesn't break.

---

## 3. API contract (what the backend needs to expose)

This is the exact contract `src/lib/api.ts` calls. Share this table with A, B,
D, and E — matching these shapes means zero frontend changes at integration
time.

| Method | Path | Returns (see `src/lib/types.ts`) | Owner |
|---|---|---|---|
| GET | `/api/org/risk` | `OrgRiskSnapshot` | B |
| GET | `/api/incidents` | `Incident[]` | D |
| GET | `/api/incidents/{id}` | `Incident` | D |
| GET | `/api/incidents/{id}/copilot` | `CopilotBriefing` | E |
| POST | `/api/incidents/{id}/contain` `{action: ContainmentAction}` | `{action, contained: boolean}` | D |
| GET | `/api/employees` | `Employee[]` | A/B |
| GET | `/api/employees/{id}` | `Employee` | A/B |
| GET | `/api/cyberrange/missions/{id}` | `CyberRangeMission` | E |
| POST | `/api/cyberrange/missions/{id}/complete` `{score_after: number}` | `CyberRangeMission` | E |

Field-level shapes (severity enums, event types, containment actions, etc.)
are all defined in `src/lib/types.ts` — treat that file as the source of
truth over this README if they ever drift.

### CORS — needed by whoever owns `main.py` (A)

The browser calls the FastAPI server directly from `localhost:3000` (dev) and
from your deployed frontend origin (prod), so the backend must allow it:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://<your-vercel-project>.vercel.app",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

Without this, every request from the frontend will fail with a CORS error in
the browser console even though the backend logs show a 200 — the classic
hackathon time-sink. Set it up in Phase 1, not Phase 2.

---

## 4. Design system

Dark, dense, operator-console aesthetic (think a real SOC tool at 2am, not a
marketing dashboard):

- **Color** — near-black navy base (`#0A0F1C`), panels one step lighter
  (`#111A2C`), hairline borders (`#26314A`) instead of shadows. Signal colors
  are semantic, not decorative: `signal` teal = live/detected, `amber` =
  elevated risk, `critical` red = active exfiltration/critical severity,
  `good` green = contained/completed. Defined in `tailwind.config.ts`.
- **Type** — IBM Plex Sans for UI text, IBM Plex Mono for anything that's
  data (scores, timestamps, IPs, IDs) — mirrors how real security tooling
  visually separates "prose" from "log/metric" content.
- **Layout** — sharp corners (3–4px radius), no drop shadows, hairline
  dividers instead of card shadows, left sidebar + content, dense information
  layout rather than generous SaaS whitespace.

All tokens live in `tailwind.config.ts` and `globals.css` — change them once
to reskin every page.

---

## 5. Key implementation notes

- **AttackGraph.tsx** uses React Flow with a hand-written left-to-right
  layout (`i * 210px` spacing) since the attack chain is always small and
  linear. If a stretch goal introduces branching attack paths, swap that for
  `dagre` or `elkjs` rather than hand-tuning positions.
- **ContainmentPanel.tsx** and **MissionQuiz.tsx** are the two places that
  `POST` to the backend; everything else is read-only `GET`s. Both optimistically
  update local state and call the real endpoint in a `useTransition`, so the
  UI never blocks on network latency during the live demo.
- **Server components by default** — every `page.tsx` is an async server
  component that awaits `lib/api.ts` directly (no client-side loading
  spinners on first paint). Only the three interactive leaves
  (`ContainmentPanel`, `MissionQuiz`, `SideNav`) are `"use client"`.
- `dynamic = "force-dynamic"` is set on every page so Next.js never caches a
  stale incident/risk snapshot during the live demo.

---

## 6. Deployment

### Option A — Vercel (recommended for the hackathon)

This is almost certainly what you want: zero-config for Next.js, free tier is
enough, deploys in ~60 seconds, and gives you a public HTTPS URL for the
recorded backup demo video.

1. Push this frontend to a GitHub repo (can be a subfolder of the team
   monorepo — see step 2).
2. Go to https://vercel.com → **Add New Project** → import the repo.
3. If the frontend lives in a subfolder (e.g. `frontend/`), set **Root
   Directory** to that folder in the import screen.
4. Framework preset: Vercel auto-detects **Next.js** — leave build command as
   `next build` / output as default.
5. Add an environment variable before deploying:
   - `NEXT_PUBLIC_API_URL` = the public URL of your deployed FastAPI backend
     (e.g. `https://cyberguard-api.onrender.com` or a Fly.io/Railway URL).
   - If your backend isn't deployed yet, deploy the frontend anyway without
     this var — it'll run entirely on demo data, which is a legitimate
     fallback for the recorded backup video mentioned in the timeline.
6. Click **Deploy**. You'll get `https://<project>.vercel.app`.
7. Add that exact URL to the backend's `allow_origins` CORS list (§3) and
   redeploy the backend — otherwise live data will be blocked by the browser.
8. Every subsequent `git push` to the connected branch auto-redeploys —
   useful during Phase 5 (Polish & Rehearsal) so the live URL always matches
   `main`.

**Where to deploy the backend to get a URL for step 5:** Render, Railway, or
Fly.io all support "push a Dockerfile, get a URL" for a FastAPI + Postgres
service and have generous free/hobby tiers — pick whichever the backend
owners are fastest with; none of it changes anything on the frontend side
beyond the one env var.

### Option B — Docker Compose (if you want one command that starts everything)

Useful if you'd rather demo from a laptop with no internet dependency, or if
A's `docker-compose.yml` (Goal 1) already runs Postgres + backend and you want
the frontend in the same stack.

A `Dockerfile` is included in this folder (multi-stage, outputs a
`standalone` Next.js server). Add this service to the team's
`docker-compose.yml`:

```yaml
services:
  frontend:
    build:
      context: ./frontend
      args:
        NEXT_PUBLIC_API_URL: http://localhost:8000
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

Note the `NEXT_PUBLIC_*` caveat: Next.js inlines these into the client
JavaScript bundle **at build time**, not at container start time — that's why
it's passed as a build `arg` above, not a runtime `environment:` var. If you
change the backend URL, you must rebuild the frontend image, not just restart
the container.

### Which one to actually use

Use **Vercel** for the live judged demo (reliable, public, fast to iterate)
and optionally keep **Docker Compose** working as your offline fallback in
case venue wifi fails during the live run — the timeline's Hour 46-47 backup
video step covers this exact risk.

---

## 7. Troubleshooting

- **Every page shows "demo data" even though the backend is running** — check
  `NEXT_PUBLIC_API_URL` is set and that you restarted `npm run dev` after
  editing `.env.local` (Next.js only reads env files at process start).
  Then check the browser console: a CORS error means §3's `allow_origins`
  fix hasn't been applied on the backend yet.
- **React Flow graph renders blank/collapsed** — almost always a missing
  `import "reactflow/dist/style.css"` (already included in `AttackGraph.tsx`)
  or a parent container with no explicit height; `AttackGraph`'s wrapper sets
  `h-[280px]` for this reason — don't remove it.
- **Google Fonts fail to fetch during build** — only happens in fully
  network-isolated environments (e.g. some CI sandboxes). Vercel and any
  normal dev machine have internet access and this will not occur; if it
  does, temporarily swap `next/font/google` for a system font stack in
  `app/layout.tsx` to unblock the build.
- **TypeScript errors after changing the API shape** — `lib/types.ts` is the
  single source of truth; update it first and TypeScript will point at every
  component that needs a matching change.
