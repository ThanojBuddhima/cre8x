# SYNQ — Mobility OS for 2100

Say where you need to be. The city moves you.

SYNQ is a Round 01 frontend prototype for **Cre8X 3.0 — IMAGINE 2100**. It is a civic mobility operating system for Greater Colombo in 2100: intent-based journeys, a 3D mobility twin, and climate-aware rerouting. There is no backend.

Live demo path: **Colombo Fort Hub → KDU, arrive by 08:30**, then a rain disruption on Coastal Road 04.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Demo script for judges

1. Open the site. Skip the intro, or scroll it.
2. Destination is already **KDU**, time **08:30**. Press **Plan my journey**.
3. Open the recommended journey, then **Start journey**.
4. At ~40% of the live trip, rain hits. Accept the reroute.
5. Watch arrival at KDU.

Deep links:

- `/?skipIntro=1` — skip cinematic
- `/?scenario=rain` — plan as if it is already raining
- `/?scenario=emergency` — hospital-priority overlay
- `/journey/j2` — accessible itinerary
- `/live/j1` — live tracking

Open **Demo** in the header for Calm mode (larger type, no 3D).

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, React Router, Zustand, Motion, GSAP ScrollTrigger, Three.js, React Three Fiber, Drei. Deployed as a static SPA.

## Accessibility

- Keyboard and visible focus
- Skip link to the planner
- `prefers-reduced-motion` skips the intro and freezes 3D motion
- Calm mode
- Accessible journey with 0 stairs
- Status is never colour-only
- Live ETA is announced to screen readers

## Deploy

The app is a static Vite SPA. `vercel.json` rewrites client routes to `index.html`.

```bash
npx vercel --yes --prod
```

Log in with `npx vercel login` first if the CLI has no credentials.

- [docs/COMPETITION.md](docs/COMPETITION.md) — written brief
- [docs/SYNQ-Round-01.pdf](docs/SYNQ-Round-01.pdf) — printable PDF
- Live HTML copy: `/competition.html` on the deployed site

## Assets

See [ASSETS.md](ASSETS.md) for fonts, icons, and 3D licensing.

No accounts, tickets, payments, live vehicle APIs, or hosted AI. Journey “intelligence” is a deterministic local planner.
