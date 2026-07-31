# 🧠 Learn Anything

Type a topic, get a one-page learning hub: an AI-built mind map, timeline, flashcards, and quiz,
plus a Wikipedia summary, YouTube videos, and GitHub projects — all on one page.

Built with Next.js 14 (App Router) + Tailwind CSS, designed to deploy on Vercel.

## How it works

1. You type a topic and submit.
2. A single API route (`app/api/learn/route.ts`) runs on the server and, in parallel:
   - Calls the **Gemini API** to generate the mind map, timeline, flashcards, and quiz as JSON.
   - Calls the **Wikipedia REST API** for a summary (no key needed).
   - Calls the **GitHub Search API** for related repos (no key needed, but a token raises the rate limit).
   - Calls the **YouTube Data API v3** for related videos (key required).
3. The page renders all sections once the data comes back.

## 1. Get your API keys

| Key | Required? | Where to get it |
|---|---|---|
| `GEMINI_API_KEY` | Yes — powers the mind map/timeline/flashcards/quiz | https://aistudio.google.com/app/apikey — free, no card required |
| `YOUTUBE_API_KEY` | Optional, for the videos section | https://console.cloud.google.com/apis/credentials — enable "YouTube Data API v3", then create an API key (requires a Google Cloud billing profile, though usage stays within the free daily quota) |
| `GITHUB_TOKEN` | Optional — raises GitHub search from 10 to 30 requests/min | https://github.com/settings/tokens — classic token, no scopes needed |

Without `YOUTUBE_API_KEY`, the app still works — the YouTube section is simply skipped and a small
notice explains why.

## 2. Run it locally

```bash
npm install
cp .env.example .env.local
# then fill in .env.local with your keys
npm run dev
```

Open http://localhost:3000.

## 3. Deploy on Vercel

1. Push this project to a GitHub repository.
2. Go to https://vercel.com/new and import that repository.
3. Make sure the **Framework Preset** is set to **Next.js** (not "Other").
4. Before deploying, add your environment variables under **Settings → Environment Variables**:
   - `GEMINI_API_KEY`
   - `YOUTUBE_API_KEY` (optional)
   - `GITHUB_TOKEN` (optional)
5. Deploy. Every push to your main branch redeploys automatically — remember that changing an
   environment variable requires a manual **Redeploy**, it won't apply retroactively.

## Project structure

```
app/
  api/learn/route.ts   → server route that calls Claude, Wikipedia, GitHub, YouTube
  layout.tsx            → fonts + metadata
  page.tsx               → the whole UI
  globals.css             → Tailwind + starfield/flip-card styles
components/                → one component per section (mind map, timeline, flashcards, quiz, etc.)
lib/types.ts                → shared TypeScript types
```

## Notes

- The mind map is generated as structured JSON (nodes + edges) by Gemini, then laid out client-side as
  an SVG "constellation" — no charting library dependency. Gemini's JSON response-format mode is used,
  so no markdown-fence stripping is needed.
- If Gemini's JSON response ever fails to parse, the API route returns a 502 with a clear error message
  rather than a broken page.
- All three external calls (Wikipedia, GitHub, YouTube) fail gracefully — if one is down or unconfigured,
  the rest of the page still renders.
