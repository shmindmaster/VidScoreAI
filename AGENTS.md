# VidScoreAI - Agent Development Guide

## Project Overview

**Application**: AI-Powered Video Performance Analysis  
**URL**: https://vidscoreai.shtrial.com  
**Stack**: Next.js 15 (App Router) + React 18 + TypeScript + Azure AI Services  
**Monorepo**: Yes (apps/frontend, packages/*)

## Architecture Overview (VidScoreAI)

VidScoreAI is a **Next.js 15 full-stack application** for AI-powered video scoring and marketing analytics.

## Project Structure

```
VidScoreAI/
├── apps/
│   └── frontend/          # Next.js 15 full-stack application (App Router)
├── packages/
│   ├── shared-ai/         # Shared Azure OpenAI client (@shared/ai)
│   └── shared-data/       # Shared Postgres, Search, Storage clients (@shared/data)
```

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 18, TypeScript
- **Database**: Azure PostgreSQL (`pg-shared-apps-eastus2`, database: `vidscoreai_db`) via Prisma
- **AI**: Azure OpenAI exclusively (via `@shared/ai` package)
  - Chat: `gpt-4o` (default), `gpt-5.1` (heavy tasks)
  - Embeddings: `text-embedding-3-small`
  - Image: `gpt-image-1-mini`
- **Search**: Azure AI Search (`shared-search-standard-eastus2`, index prefix: `vidscoreai`)
- **Storage**: Azure Blob Storage (`stmahumsharedapps`, prefix: `vidscoreai/`)
- **Deployment**: 
  - Frontend: Azure Static Web App `vidscoreai` in `rg-shared-web` (Free SKU)
  - Backend: Next.js API routes within the same SWA (full-stack)
- **Custom Domain**: `vidscoreai.shtrial.com`

## Build & Test Commands

All commands are executable and tested. Copy-paste ready:

```bash
# Install dependencies (run from repo root)
pnpm install

# Development (Next.js dev server)
pnpm dev              # Starts on http://localhost:3000

# Build (production build)
pnpm build            # Build Next.js app
pnpm lint             # ESLint
pnpm typecheck        # TypeScript type checking

# Testing
pnpm test             # Unit tests
pnpm test:e2e         # Playwright E2E tests
```

**Before committing**: Always run `pnpm lint && pnpm typecheck && pnpm test`

## Coding Conventions

### Next.js App Router

**Good Examples** (refer to these files):
- Pages: `apps/frontend/app/**/page.tsx`
- API Routes: `apps/frontend/app/api/**/route.ts`
- Components: `apps/frontend/components/**/*.tsx`

**Patterns**:
- Use Server Components by default (add `'use client'` only when needed)
- API routes in `app/api/` directory
- Use Prisma for database access via `@shared/data` package
- Use Azure OpenAI via `@shared/ai` package

**Bad Examples** (avoid):
- ❌ Client components when server components would work
- ❌ Direct database queries (use Prisma)
- ❌ Hardcoded API endpoints

## Environment Variables

**No Key Vault**: All secrets/config via App Settings and environment variables.

**No OpenAI.com**: Only Azure OpenAI endpoint (`shared-openai-eastus2`).

See `.env.example` for complete schema. Key variables:

```env
# Azure OpenAI (via @shared/ai package)
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/openai/v1/
AZURE_OPENAI_API_KEY=<your-key>
AZURE_OPENAI_DEFAULT_CHAT_MODEL=gpt-4o
AZURE_OPENAI_MODEL_HEAVY=gpt-5.1
AZURE_OPENAI_MODEL_EMBED=text-embedding-3-small

# PostgreSQL (via Prisma)
DATABASE_URL=postgresql://<user>:<pass>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/vidscoreai_db?sslmode=require

# Azure AI Search (via @shared/data package)
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net
AZURE_SEARCH_API_KEY=<your-key>
AZURE_SEARCH_INDEX_PREFIX=vidscoreai

# Azure Storage (via @shared/data package)
AZURE_STORAGE_CONNECTION_STRING=<connection-string>
AZURE_STORAGE_CONTAINER=vidscoreai
```

## Testing Requirements

**Before every commit**:
```bash
pnpm lint && pnpm typecheck && pnpm test
```

**Test Coverage**:
- Add unit tests for new utilities and components
- Add integration tests for API routes
- E2E tests for critical user flows

## PR Guidelines

- Title: `[VidScoreAI] Description`
- All tests passing
- No TypeScript errors
- Video analysis features tested (when implemented)

## Prohibited Patterns

❌ **Never**:

- Use non-Azure AI providers as primary
- Use OpenAI.com API (only Azure OpenAI)
- Hardcode API keys or credentials
- Bypass input validation
- Use client components when server components work

## Deployment

- **Frontend**: Azure Static Web App `vidscoreai` in `rg-shared-web` (Free SKU)
- **Backend**: Next.js API routes within the same SWA (full-stack)
- **CI/CD**: `.github/workflows/ci-cd.yml` - Auto-deploys on push to `main`
- **Custom Domain**: `vidscoreai.shtrial.com`

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Azure OpenAI Docs](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [Prisma Docs](https://www.prisma.io/docs/)
- `docs/ARCHITECTURE.md` - Detailed architecture documentation
- `docs/CONFIG.md` - Environment variables and configuration guide
