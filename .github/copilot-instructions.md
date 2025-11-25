# GitHub Copilot Instructions - VidScoreAI

This file provides custom instructions for GitHub Copilot to help maintain code quality and consistency across the VidScoreAI project.

## Project Overview

VidScoreAI is a marketing-facing video scoring and optimization demo in the shtrial portfolio. Currently, it's a **frontend-only UX prototype** that simulates video analysis and scoring. The platform will eventually provide:

- AI-powered video content analysis
- Performance scoring and metrics
- AI-generated optimization recommendations
- Visual frame-by-frame analysis

**Current Status**: Frontend-only UX demo (no backend, no database, no AI SDKs)  
**Target Stack**: Next.js 15 (App Router) + React 18 + Azure AI Services + Prisma

## Coding Standards

### TypeScript

- **Strict Mode**: Always enabled
- **Type Safety**: Never use `any` - use proper types or `unknown` with type guards
- **Naming Conventions**:
  - Functions: `camelCase` (`analyzeVideo`, `generateReport`)
  - Components: `PascalCase` (`VideoUploader`, `PerformanceReport`)
  - Constants: `UPPER_SNAKE_CASE` (`API_BASE_URL`, `MAX_FILE_SIZE`)

### Next.js App Router Patterns

**Current State** (Frontend-only):
- No `app/api` routes exist yet
- No database client
- No Azure/OpenAI SDKs
- All video "analysis" is simulated in UI (static scores + canned suggestions)

**When Adding Backend**:
- Use Server Components by default (add `'use client'` only when needed)
- API routes in `app/api/` directory
- Prisma for database access via `@shared/data` package
- Azure OpenAI via `@shared/ai` package (server-side only)

**Example - Good (Current)**:
```typescript
// components/performance-report.tsx
export function PerformanceReport() {
  // Static scores for demo
  const overallScore = 82;
  const sections = [
    { name: 'Hook Strength', score: 85 },
    { name: 'Pacing & Flow', score: 80 },
  ];
  
  return <div>{/* Render report */}</div>;
}
```

**Example - Good (Future Backend)**:
```typescript
// app/api/analyze-video/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { analyzeVideo } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const video = formData.get('video') as File;
  
  const analysis = await analyzeVideo(video);
  return NextResponse.json(analysis);
}
```

### React Components

**Always use**:
- Functional components with TypeScript
- Tailwind CSS + shadcn/ui for styling
- Mobile-first responsive design
- Client Components for interactivity (`'use client'`)

**Example - Good**:
```typescript
'use client';
import { useState } from 'react';

export function VideoUploader() {
  const [file, setFile] = useState<File | null>(null);
  
  const handleDrop = (e: React.DragEvent) => {
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setFile(file);
    }
  };
  
  return <div onDrop={handleDrop}>...</div>;
}
```

## Testing Guidelines

### E2E Tests (Playwright)

- **Mobile-First**: All tests use mobile viewports (Pixel 5: 375x667, iPhone 12: 390x844)
- **Location**: `e2e/**/*.spec.ts`
- **Selectors**: Use role-based selectors (`getByRole`) when possible
- **Mocking**: Mock any future API endpoints in tests

### Test Commands

```bash
# Run all tests
pnpm test

# Run with UI
pnpm test:ui

# Run mobile tests only
pnpm test:mobile

# Run desktop tests only
pnpm test:desktop
```

**Before committing**: All tests must pass (`pnpm lint && pnpm typecheck && pnpm test`)

## Build & Deployment

### Development

- **Use dev server**: `pnpm dev` (Next.js dev server with hot-reload)
- **Never run production build** during interactive development
- **Port**: Default Next.js port (3000)

### Production Build

```bash
# Build Next.js app
pnpm build

# Start production server
pnpm start
```

### Deployment

- **Frontend**: Azure Static Web App (auto-deploys via GitHub Actions)
- **Backend**: Planned - Azure Container App (when implemented)
- **CI/CD**: `.github/workflows/ci-cd.yml` - auto-deploys on push to `main`

## Common Pitfalls

1. **Current State**: Remember this is frontend-only - don't assume backend features exist
2. **Static vs Dynamic**: Keep static and dynamic paths clearly separated
3. **No Backend Yet**: Don't add Express/FastAPI backend - use Next.js API routes when ready
4. **No AI SDKs**: Don't add OpenAI SDKs until backend is implemented
5. **Mobile-First**: Always design for mobile viewport first (390x844px)

## Future AI Integration Patterns

### When Adding Backend

**Azure OpenAI Usage**:
- **Always use** `@shared/ai` package - never create app-specific Azure OpenAI clients
- **Models**:
  - Chat: `gpt-5.1-mini` (for video analysis)
  - Embeddings: `text-embedding-3-small` (for transcript indexing)
  - Image: `gpt-image-1-mini` (for frame analysis)
- **Never use** OpenAI.com API directly - only Azure OpenAI endpoint
- **Server-Side Only**: All AI calls must be server-side (API routes), never in React components

**Video Processing**:
- Use Azure Blob Storage for video uploads (SAS URLs)
- Design background workflow for heavy processing (Container Apps jobs or Functions)
- Return structured JSON that existing UI can render

## File Structure Conventions

```
apps/
└── frontend/              # Next.js 15 app
    ├── app/
    │   ├── page.tsx       # Main marketing + upload + scoring flow
    │   ├── editor/        # Multi-file editor flow
    │   └── api/           # API routes (when added)
    └── components/
        ├── video-uploader.tsx
        ├── loading-analysis.tsx  # Fake loading sequence
        └── performance-report.tsx # Static scores + PDF export
packages/
├── shared-ai/            # Shared Azure OpenAI client (when added)
└── shared-data/          # Shared Prisma, Search, Storage clients (when added)
```

## Resources

- **Architecture**: See `docs/ARCHITECTURE.md`
- **Configuration**: See `docs/CONFIG.md`
- **Next.js Docs**: https://nextjs.org/docs
- **Playwright Docs**: https://playwright.dev/
- **Azure OpenAI Docs**: https://learn.microsoft.com/en-us/azure/ai-services/openai/

## Agent Behavior Rules

- **Ground everything in code reality**: There is no backend, database, or AI SDKs right now
- **Don't assume features**: Don't assume features from README are implemented unless code exists
- **When adding features**: Start with API contract, then implement server routes, then call from components
- **Mobile-First**: Always test on mobile viewport (390x844px) first
- **Static vs Dynamic**: Keep static demo paths separate from future dynamic paths
- **When implementing AI**: Use Azure OpenAI server-side only, never in browser code

## What Copilot Must Not Do

- ❌ **Do not** add direct calls to OpenAI API from browser
- ❌ **Do not** pretend real scoring is happening when it's still static
- ❌ **Do not** introduce separate Express/FastAPI backend
- ❌ **Do not** store secrets in code - use env vars
- ❌ **Do not** claim features are live unless code actually exists
