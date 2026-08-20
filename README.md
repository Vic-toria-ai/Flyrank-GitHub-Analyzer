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

## About This Repo
This repo documents an AI-assisted development process as part of a frontend engineering internship track. See `CLAUDE.md` for AI assistant conventions used in this project.