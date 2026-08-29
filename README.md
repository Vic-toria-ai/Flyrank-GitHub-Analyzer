# GitHub Analyzer

A Next.js app that turns a GitHub username into a readable picture of
that developer — profile info, language breakdown, a filterable repo
list, and an AI-generated narrative summary with a computed activity
score. Two profiles can be compared side by side.

**Live URL:** https://flyrank-git-hub-analyzer.vercel.app

## Screenshots
![Home Page](image.png)
![Compare Page-empty](image-1.png)
![Profile Page](image-2.png)

## Features

- **Profile lookup** — search a GitHub username, see their avatar, bio, followers, and public repo count
- **Repo list** — sortable (stars, forks, last updated) and filterable by language
- **Language breakdown chart** — proportional bars showing a developer's primary languages
- **AI-generated summary** — a 2-3 sentence narrative plus strengths/gaps, generated from real repo data and a deterministic activity score computed by a server-side tool (not guessed by the model)
- **Comparison mode** — two profiles side by side, reusing the same components as the single-profile view
- **Optional GitHub token** — raises the API rate limit from 60/hour to 5,000/hour, saved locally in the browser
- **3D and shader demos** — a Three.js scene (`/3d-orb-demo`) and a custom GLSL shader hero (`/shader-hero-demo`), built as part of the program's frontend fundamentals track

## Getting Started

```bash
git clone https://github.com/Vic-toria-ai/Flyrank-GitHub-Analyzer.git
cd Flyrank-GitHub-Analyzer
git checkout capstone-skeleton
npm install
```

Create a `.env` file in the project root (see the Environment Variables table below), then:

```bash
npm run dev
```

Visit `http://localhost:3000`.

To run the test suite:

```bash
npm test              # component tests (Vitest)
npx playwright test --project=chromium   # end-to-end test
```
## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | Optional | A GitHub Personal Access Token (classic, `public_repo` scope) used server-side to raise the GitHub API rate limit from 60/hour to 5,000/hour. Without it, the app still works, just with the lower unauthenticated limit. |
| `OPENROUTER_API_KEY` | Required | API key for [OpenRouter](https://openrouter.ai), used to call the AI model that powers the profile summary. Sign up for a free account and generate a key at openrouter.ai/keys. |

Copy `.env.example` to `.env` and fill in your own values. Neither
variable is exposed to the browser — both are only read inside server
routes (`app/api/analyze/route.js`, `lib/github.js`).

## Architecture
app/
page.js → home page (shader hero + username search)
profile/[username]/page.js → single profile view (Server Component,
fetches GitHub data before rendering)
compare/page.js → side-by-side comparison, reuses the same
components as the profile page
api/analyze/route.js → server route: calls the AI model with a
server-side tool (scoreProfile), streams
the response back
health/page.js → required health-check endpoint
buttons-demo/, 3d-orb-demo/, shader-hero-demo/ → standalone demos built
as part of the program's frontend track
components/
ProfileHeader, RepoList, RepoCard, LanguageChart → profile display
AiSummaryCard → the AI chat/tool-call UI, built on useChat
TokenWidget, SiteHeader → the optional PAT input, lives in the nav
GenerateButton, ShaderHero → assignment-specific demo components
lib/
github.js → GitHub API calls (getUser, getRepos)
rateLimit.js → simple in-memory rate limiter for the AI route


**Why the AI call happens server-side:** GitHub's public API needs no
secret key, so `lib/github.js` is called directly from Client
Components. An AI provider's API key is a real secret — calling it
directly from the browser would expose it in the Network tab. Instead,
`AiSummaryCard` (client) calls the app's own `/api/analyze` route
(server), which holds the key and calls OpenRouter on the client's
behalf.

**Why one AI call, not several:** the single `/api/analyze` call
handles both the narrative summary and the `scoreProfile` tool call in
one pass. Comparison mode reuses this same function twice (once per
username) rather than building a separate comparison-specific AI
pipeline — this keeps the AI surface area small and easy to reason
about, at the cost of comparison-specific insights (e.g. "A ships more
often than B") not being a first-class feature.

**Production hygiene:** `/api/analyze` is rate-limited to 5 requests
per minute per IP address (in-memory, resets on server restart — see
`lib/rateLimit.js`) so a stranger with the public URL can't drain the
OpenRouter API credits. The route also sets `maxDuration = 30` so a
stuck streaming request can't run indefinitely.