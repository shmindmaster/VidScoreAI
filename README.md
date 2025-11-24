# VidScoreAI - AI-Powered Video Performance Analysis

**Industry**: Marketing
**Domain**: https://vidscoreai.shtrial.com
**Type**: Full-stack AI Application (Next.js with API routes)

## Deployment Architecture

**Backend Platform**: ✅ **Azure Container Apps (Consumption)**

- **Frontend**: Azure Static Web App `vidscoreai` in `rg-shared-web` (Free SKU)
  - Next.js 15 App Router (React components, pages)
- **Backend**: Azure Container App `vidscoreai-api` in `cae-shared-apps` (Consumption plan)
  - Container Apps Environment: `cae-shared-apps` in `rg-shared-apps`
  - Scales to zero, pay-per-use pricing
  - Image: `shacrapps.azurecr.io/vidscoreai-api:latest`
- **Custom Domain**: `vidscoreai.shtrial.com`

**Shared Resources** (all in shared resource groups):

- **Database**: `pg-shared-apps-eastus2` (database: `VidScoreAI`) via Prisma
- **Azure OpenAI**: `shared-openai-eastus2` (in `rg-shared-ai`)
- **Azure AI Search**: `shared-search-standard-eastus2` (in `rg-shared-ai`) - only if using search/RAG
- **Storage**: `stmahumsharedapps` (container: `vidscoreai`) in `rg-shared-data`
- **ACR**: `shacrapps` (shared container registry)

**Cost**: ~$0-10/month (SWA Free tier + Container Apps Consumption with free grant)

## Overview

VidScoreAI is a platform for analyzing video performance and generating actionable insights. Currently a frontend UX demo with backend AI implementation planned.

## Planned AI Features

- **Video Analysis**: AI-powered analysis of video content, engagement, and performance
- **Performance Scoring**: Automated scoring of video effectiveness
- **Insights Generation**: AI-generated recommendations for video optimization
- **Visual Analysis**: Computer vision for frame-by-frame analysis

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 18, TypeScript
- **Database**: Azure PostgreSQL (`pg-shared-apps-eastus2`, database: `vidscoreai_dev`) via Prisma
- **AI**: Azure OpenAI exclusively (via `@shared/ai` package)
  - Chat: `gpt-5.1` (default & heavy tasks)
  - Embeddings: `text-embedding-3-small`
  - Image: `gpt-image-1-mini`
- **Search**: Azure AI Search (`shared-search-standard-eastus2`, index: `vidscoreai-dev-index`) - only if using search/RAG
- **Storage**: Azure Blob Storage (`stmahumsharedapps`, container: `VidScoreAI`) in `rg-shared-data`
- **Deployment**:
  - Frontend: Azure Static Web App `vidscoreai` in `rg-shared-web` (Free SKU)
  - Backend: Container App `vidscoreai-api` in `cae-shared-apps` (Consumption plan)
- **Custom Domain**: `vidscoreai.shtrial.com`

## Architecture

- **Monorepo**: pnpm workspaces with Turborepo
- **Apps**:
  - `apps/frontend`: Next.js 15 full-stack application (App Router)
- **Packages**:
  - `packages/shared-ai`: Shared Azure OpenAI client (`@shared/ai`)
  - `packages/shared-data`: Shared Postgres, Search, Storage clients (`@shared/data`)
- **API Routes**: Next.js App Router API routes within the frontend app

## Environment Variables

**No Key Vault**: All secrets/config via App Settings and environment variables.

**No OpenAI.com**: Only Azure OpenAI endpoint (`shared-openai-eastus2`).

See `docs/CONFIG.md` and `.env.example` for the complete schema. Key variables:

```env
# Azure OpenAI (Shared - via @shared/ai package)
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/openai/v1/
AZURE_OPENAI_API_KEY=<your-key>
AZURE_OPENAI_DEFAULT_CHAT_MODEL=gpt-5.1
AZURE_OPENAI_MODEL_HEAVY=gpt-5.1
AZURE_OPENAI_MODEL_EMBED=text-embedding-3-small
AZURE_OPENAI_MODEL_IMAGE=gpt-image-1-mini

# PostgreSQL (Shared - via @shared/data package)
SHARED_PG_CONNECTION_STRING=postgresql://<user>:<pass>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/VidScoreAI?sslmode=require

# Azure AI Search (Shared - via @shared/data package)
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net
AZURE_SEARCH_API_KEY=<your-key>
AZURE_SEARCH_INDEX_PREFIX=vidscoreai

# Azure Storage (Shared - via @shared/data package)
AZURE_STORAGE_CONNECTION_STRING=<connection-string>
AZURE_STORAGE_CONTAINER=VidScoreAI
```

## Setup

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Azure credentials

# Development
pnpm dev              # Start Next.js dev server
pnpm build            # Build for production
pnpm test             # Run Playwright tests
```

## AI Roadmap

- 📋 **Planned**: Video analysis backend, performance scoring, insights generation
- 🔄 **Future**: Real-time video processing, automated optimization recommendations

## Deployment

- **Frontend**: Deployed to Azure Static Web App `vidscoreai` in `rg-shared-web` via GitHub Actions
- **Backend**: Deployed to Container App `vidscoreai-api` in `cae-shared-apps` via GitHub Actions
  - Builds Docker image and pushes to `shacrapps.azurecr.io`
  - Updates Container App with new image
- **CI/CD**: `.github/workflows/ci-cd.yml` - Automatically deploys on push to `main` branch

## Documentation

- `docs/ARCHITECTURE.md` - Detailed architecture documentation
- `docs/CONFIG.md` - Environment variables and configuration guide
