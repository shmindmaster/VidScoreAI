# Copilot Instructions – VidScoreAI

## Repo Role

VidScoreAI is a **marketing-facing video scoring and optimization demo** in the shtrial portfolio.

From the actual code:

- It is a **Next.js 13.5 App Router** app (`app/page.tsx`, `app/editor/page.tsx`).
- There are **no `app/api` routes**, **no database client**, and **no Azure/OpenAI SDKs**.
- All video "analysis" and scoring is currently **simulated in the UI only** (static scores + canned suggestions).

Treat this as a **frontend-only UX prototype** for the VidScoreAI concept, not as a fully wired AI backend.

## Tech Stack (from code, not README)

- **Framework**: Next.js 13.5 (`app` directory), React 18, TypeScript.
- **Styling**: Tailwind CSS 3.3, shadcn/ui + Radix UI.
- **Components**:
  - `app/page.tsx` – main marketing + upload + scoring flow.
  - `app/editor/page.tsx` – multi-file editor-style flow.
  - `components/video-uploader.tsx` – drag-and-drop file picker, no network calls.
  - `components/loading-analysis.tsx` – fake loading/analysis sequence (timers only).
  - `components/performance-report.tsx` – static overall + per-section scores and suggestions, PDF export via `html2pdf.js`.
- **Testing**: Playwright E2E (`playwright.config.ts`, `e2e/` directory) with **mobile-first** projects.

There is **no** `fetch`, `axios`, or `NextRequest`/`NextResponse` usage anywhere in this repo today.

## Target AI Architecture on MahumTech Azure

When you extend VidScoreAI beyond the current frontend-only implementation, assume this target stack:

- **LLM core**: `gpt-5.1-mini` on the shared `shared-openai-eastus2` Azure OpenAI resource (Azure OpenAI exclusively, no fallback).
- **Embeddings**: `text-embedding-3-small` for indexing transcripts, briefs, and historical performance.
- **Vision**: `gpt-image-1-mini` for frame-level analysis and visual cues.
- **Vector/search**:
  - Shared Postgres (`pg-shared-apps-eastus2`) with `pgvector` for similarity search.
  - Azure AI Search (`shared-search-standard-eastus2`) for hybrid semantic/keyword search over metadata.
- **Storage**: Azure Blob Storage (`stmahumsharedapps`, container: `vidscoreai-videos`) for raw uploads, thumbnails, subtitles, and JSON analysis artifacts.

Server-side, implement an API layer (Next.js API routes or Azure Functions proxied from this app) that:

- Accepts video uploads (typically via SAS URLs to Blob).
- Runs multi-step analysis (transcript → embeddings → LLM reasoning) and returns **structured JSON** that the existing UI can render.
- Persists analysis runs so you can compare performance across time and variants.

## Local Development

From `VidScoreAI/`:

```bash
pnpm install
pnpm dev        # next dev on http://localhost:3000

pnpm build      # next build
pnpm start      # next start

pnpm test       # playwright test
pnpm test:ui    # playwright test --ui
pnpm test:mobile
pnpm test:desktop
```

The README shows `npm test` etc.; prefer the **pnpm** scripts above, which match `package.json`.

## Current Behavior – No Real AI Yet

### Upload & Analysis Flow (Home page)

- `app/page.tsx`:
  - `VideoUploader` collects a local `File` and passes it up.
  - `LoadingAnalysis` shows a timed set of steps ("Analyzing video…" etc.) using `setInterval` + `setTimeout`.
  - After ~5 seconds, `onComplete` flips UI state to show `PerformanceReport`.
- **No network calls** are made; the video never leaves the browser.

### Scoring & Recommendations

- `components/performance-report.tsx`:
  - Uses **hard-coded** `overallScore` (e.g. `82`) and a static list of sections (`Hook Strength`, `Pacing & Flow`, etc.).
  - Suggestion text is static, not generated.
  - Uses `react-circular-progressbar` to render the score visually.
  - Generates a PDF via `html2pdf.js` from the rendered DOM.

### Editor Flow

- `app/editor/page.tsx`:
  - `MultiFileUploader`, `StyleSelector`, and `VideoGeneration` are pure client components.
  - File upload and style selection are local-only; there is **no backend job or Azure Media Services integration**.

## If You Add Real AI / Backend Later

When you extend this repo, keep these rules so it stays consistent with the shtrial/Azure narrative:

- **Backend pattern**:
  - Add `app/api/*/route.ts` handlers, not a separate Express server.
  - Use `NextRequest` / `NextResponse` and **parameterized** queries if you later add a database.
- **Azure OpenAI**:
  - Use the shared `rg-shared-ai` Azure OpenAI resource (`shared-openai-eastus2`) via the official `OpenAI`/`AzureOpenAI` SDK.
  - Configure with env vars:
    ```env
    AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/
    AZURE_OPENAI_API_KEY=...
    AZURE_OPENAI_API_VERSION=2024-02-15-preview
    AZURE_OPENAI_DEPLOYMENT=gpt-4o
    ```
  - All OpenAI calls must be **server-side** (API routes only), never in React components.
- **Video storage / processing**:
  - If you persist videos, use **Azure Blob Storage** and server-side upload endpoints.
  - For heavy processing (frame extraction, FFmpeg, etc.), design a background workflow (Azure Container Apps job, Functions, or Media Services), but do **not** stub those in this repo unless implemented.

## How Copilot Should Behave Here

- **Ground everything in code reality**:
  - There is **no backend**, **no database**, and **no AI SDKs** right now.
  - Do **not** assume features from the README are already implemented.
- For UI work:
  - Follow existing Tailwind/shadcn patterns.
  - Keep everything mobile-first and aligned with Playwright configs (Pixel 5, iPhone 12, etc.).
- For potential new features:
  - Start by sketching the API contract (e.g. `/api/analyze-video`) and the request/response JSON.
  - Then implement server routes and call them from the existing components.

## What Copilot Must Not Do

- Do **not** add direct calls to the public OpenAI API from the browser.
- Do **not** pretend real scoring is happening when it is still static; keep static and dynamic paths clearly separated.
- Do **not** introduce a separate Express/FastAPI backend inside this repo.
- Do **not** store secrets or connection strings in code; use env vars and assume Azure Key Vault in production.

## Testing Expectations

- All new flows must be covered by Playwright tests under `e2e/`.
- Use **role-based selectors** (`getByRole`) and test **mobile first** (Pixel 5 / iPhone 12) per `playwright.config.ts`.
- For any future networked scoring endpoint, mock it in tests instead of calling live services.

## Summary

Right now VidScoreAI is a **frontend-only UX demo** that:

- Simulates uploading and analyzing a video.
- Shows a static but realistic-looking performance report.
- Demonstrates the kind of insights a real Azure/OpenAI + Media pipeline would produce.

When you evolve it, keep the implementation Azure-aligned and server-side, but never claim features are live unless the code actually exists in this repo.
