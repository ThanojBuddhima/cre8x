# SYNQ — Mobility OS for 2100

**Say where you need to be. The city moves you.**

SYNQ is a Round 01 frontend prototype for **Cre8X 3.0 — IMAGINE 2100**. It is a civic mobility operating system for Greater Colombo in 2100, featuring intent-based journeys, a seamless 3D mobility twin, and climate-aware rerouting.

> 🏆 **Cre8X 3.0 Submission**  
> *Note: This is a frontend-only prototype. Journey "intelligence" is handled by a deterministic local planner to guarantee a consistent demo experience for judges.*

---

## ⚡ Features

- **Intent-Based Planner**: Tell the system your destination and arrival time. The system calculates the optimum multi-modal route (Walk, Pod, Rail, Air).
- **Live 3D Mobility Twin**: A gorgeous WebGL 3D representation of Colombo that tracks your live progress across the city map.
- **Dynamic Climate Rerouting**: Simulates real-time disruptions (e.g., Heavy Rain, Emergencies). Watch the system instantly reroute you when Coastal Road 04 floods.
- **Seamless 2D/3D Mode Transitions**: Need to save battery or prefer less motion? "Calm Mode" seamlessly cross-fades the 3D WebGL canvas into a clean, 2D interactive schematic map without losing your journey context.
- **Micro-animations & Waiting States**: Real-time pulsing indicators and countdowns (e.g. "Pod is almost here... arriving in 10 min") keep you informed at every transfer hub.

## 🚀 Run Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

**Production build:**

```bash
npm run build
npm run preview
```

## 🎥 Demo Script for Judges

The live demo path is a journey from **Colombo Fort Hub** to **KDU**, arriving by **08:30**, interrupted by a sudden rain disruption.

1. Open the site. Watch or scroll through the cinematic intro.
2. The destination is pre-filled to **KDU** for time **08:30**. Press **Plan my journey**.
3. A Quick Journey Card will appear. Open the recommended journey, then press **Start journey**.
4. At ~40% of the live trip, a heavy rain storm hits. An Alert Banner will appear—accept the reroute.
5. Watch the remaining live arrival at KDU on the 3D map.

### Demo Controls & Deep Links
Open the **Demo** toggle in the map header to open the Demo Controls sheet. Here you can manually trigger **Clear morning**, **Heavy rain**, or **Emergency** scenarios to bypass waiting for live data. You can also toggle **Calm mode** (larger type, simple 2D map).

- `/?skipIntro=1` — skip cinematic
- `/?scenario=rain` — plan as if it is already raining
- `/?scenario=emergency` — hospital-priority overlay
- `/journey/j2` — accessible itinerary
- `/live/j1` — live tracking

## 🛠 Tech Stack

Built for maximum performance, fluid animations, and robust state management:
- **Core**: Vite, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Vanilla CSS (for complex dynamic variables)
- **State & Routing**: Zustand, React Router
- **3D & Animation**: Three.js, React Three Fiber, Drei, GSAP ScrollTrigger, Motion
- **UI**: Radix UI

## ♿ Accessibility

- Keyboard and visible focus support across all elements.
- Skip link to bypass the cinematic and jump straight to the planner.
- Respects `prefers-reduced-motion` by skipping the intro and freezing 3D motion.
- **Calm mode** provides an accessible, high-contrast, text-heavy 2D alternative to the 3D twin.
- Includes an alternative accessible journey route with 0 stairs.
- Status and alerts are never color-only (icons and text are always present).
- Live ETA and reroutes are announced to screen readers.

## ☁️ Deploy

The app is a static Vite SPA. `vercel.json` rewrites client routes to `index.html`.

```bash
# Log in first if you have no credentials
npx vercel login

# Deploy to Vercel
npx vercel --yes --prod
```

## 📄 Documentation & Assets

- [docs/COMPETITION.md](docs/COMPETITION.md) — written brief
- [docs/SYNQ-Round-01.pdf](docs/SYNQ-Round-01.pdf) — printable PDF
- Live HTML copy: `/competition.html` on the deployed site
- See [ASSETS.md](ASSETS.md) for fonts, icons, and 3D licensing details.
