# Flyrank Capstone

Frontend capstone project for the FlyRank AI Fluency internship. Built using an AI-assisted development workflow with Claude Code.

## Status
🚧 Early setup phase — tech stack and project scope are still being finalized.

## Stack (planned)
- React + Vite
- More TBD as the project scope is confirmed

## Getting Started
```bash
git clone https://github.com/Vic-toria-ai/Flyrank-Capstone.git
cd Flyrank-Capstone
npm install
```
## AI Tools

### `scoreProfile`

A server-side tool called by the AI during profile analysis. It calculates a
deterministic activity/consistency score from a user's repository data,
rather than letting the model guess at a number — the AI's job is only to
call it and narrate around the result.

**Input schema:**
```json
{
  "repos": [
    {
      "name": "string",
      "language": "string | null",
      "stars": "number",
      "forks": "number",
      "updated_at": "string",
      "description": "string | null"
    }
  ]
}
```

**Output schema:**
```json
{
  "score": "number (0-100)",
  "reasoning": "string"
}
```

**Where it's defined:** `app/api/analyze/route.js`

**How it's rendered:** `components/AiSummaryCard.jsx` renders each of the
tool's four lifecycle states distinctly:
- `input-streaming` — a pulsing indicator while the AI decides what to send
- `input-available` — a spinner showing the repo count being scored
- `output-available` — a score card with the numeric result and reasoning
- `output-error` — a red error state if the tool call fails

## Buttons with a Brain — Motion Notes

The Generate button at `/buttons-demo` (and reused conceptually in
`AiSummaryCard`) animates only `transform` and `opacity` to stay
compositor-friendly and avoid layout thrash. State color/scale
transitions use 200ms with `ease-out`, fast enough to feel responsive
but slow enough to register as motion rather than a snap. The success
checkmark fades in while scaling up from 50%, reading as a deliberate
"arrival" rather than a flat swap. The error shake runs once over 320ms
and is skipped entirely under `prefers-reduced-motion`, while the color
change and "Retry" label still provide full feedback without motion.
The button auto-returns to idle after 1.8s, long enough to read the
result but not so long it feels stuck.

## 3D Activity Orb

A small interactive Three.js/React Three Fiber scene at `/3d-orb-demo`,
built from primitive geometry (no external 3D model files, so nothing
to compress or lazy-load beyond the library code itself). Click the
orb to cycle through four colors, hover to see it scale up and switch
to wireframe, or drag anywhere on the canvas to orbit the camera.

**Loading:** the entire Three.js/R3F bundle is dynamically imported via
`next/dynamic` with `ssr: false`, so it's only fetched when this page
is actually visited, not bundled into the app's main load. Measured
Largest Contentful Paint on this page was 0.51s (Chrome DevTools,
flagged "good"), and the rotation renders smoothly with no visible
frame drops.

**Fallback:** if the browser reports `prefers-reduced-motion`, the
canvas is skipped entirely in favor of a static colored circle, so
motion-sensitive users still see something meaningful without any
animation.

**With more time:** I'd add a real GLB model (DRACO-compressed) as a
second, more visually rich demo, and wire the orb's color/pulse speed
to a real signal from the capstone (e.g. a developer's actual activity
score) rather than a manual click.

## Shader Hero

A custom GLSL fragment shader at `/shader-hero-demo` — a layered sine
wave gradient (violet-500 to zinc-950) that flows over time and bends
gently toward the cursor's horizontal position, with the headline
rendered on top.

**Uniforms used:** `u_time` (drives the wave's continuous motion),
`u_resolution` (corrects aspect ratio so the wave isn't stretched on
wide screens), and `u_mouse` (bends the wave toward the cursor).

**Perf/fallback:** `devicePixelRatio` is capped at 1.5 to avoid
over-rendering on high-DPI screens, the animation pauses via the
Page Visibility API when the browser tab isn't active, and
`prefers-reduced-motion` swaps the shader entirely for a static
gradient using the same two colors — no GPU work at all for users who
've opted out of motion.

## About This Repo
This repo documents an AI-assisted development process as part of a frontend engineering internship track. See `CLAUDE.md` for AI assistant conventions used in this project.