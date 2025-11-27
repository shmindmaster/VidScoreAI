# VidScoreAI Architecture

## Overview

VidScoreAI is a full-stack AI application built as a monorepo using pnpm workspaces and Turborepo. It leverages shared Azure resources and standardized packages for AI, data access, and infrastructure.

## Monorepo Structure

```
VidScoreAI/
├── apps/
│   └── frontend/          # Next.js 15 full-stack application (App Router)
├── packages/
│   ├── shared-ai/         # Shared Azure OpenAI client (@shared/ai)
│   └── shared-data/       # Shared Postgres, Search, Storage clients (@shared/data)
├── .github/
│   └── workflows/         # CI/CD workflows
├── package.json           # Root workspace config
├── pnpm-workspace.yaml    # pnpm workspace configuration
└── turbo.json             # Turborepo pipeline
```

## Shared Azure Resources

All resources are deployed to shared resource groups in the MahumTech subscription (East US 2):

### Resource Groups

- **`rg-shared-web`**: Frontend deployment
  - Static Web App: `vidscoreai` (Free SKU)
  - Custom domain: `vidscoreai.shtrial.com`

- **`rg-shared-ai`**: AI services
  - Azure OpenAI: `shared-openai-eastus2`
    - Endpoint: `https://shared-openai-eastus2.openai.azure.com/openai/v1/`
    - Deployments: `gpt-4o`, `gpt-5.1`, `text-embedding-3-small`, `gpt-image-1-mini`
  - Azure AI Search: `shared-search-standard-eastus2`
    - Endpoint: `https://shared-search-standard-eastus2.search.windows.net`
    - Note: VidScoreAI currently does not use Azure AI Search. Any future
      search/RAG implementation should use Postgres + pgvector on the shared
      Postgres host instead of Azure Search indexes.

- **`rg-shared-data`**: Data services
  - PostgreSQL: `pg-shared-apps-eastus2`
    - Database: `vidscoreai_db`
    - Connection: `pg-shared-apps-eastus2.postgres.database.azure.com:5432`
  - Storage: `stmahumsharedapps`
    - Containers: `raw`, `curated`, `ai-artifacts`
    - Prefix: `vidscoreai/` (e.g., `raw/vidscoreai/...`)

- **`rg-shared-dns`**: DNS zones
  - Zone: `shtrial.com`
  - Record: `vidscoreai.shtrial.com` → Static Web App

## Shared Packages

### `@shared/ai`

Provides standardized Azure OpenAI client functions for chat, embeddings, and image generation.

### `@shared/data`

Provides clients for shared data services: Postgres, Azure Search, and Azure Storage.

## Deployment

### Frontend & Backend (Full-Stack)

- **Service**: Azure Static Web App `vidscoreai` in `rg-shared-web`
- **Domain**: `vidscoreai.shtrial.com`
- **Build**: Next.js build output in `apps/frontend/.next`
- **API Routes**: Next.js App Router API routes within the same Static Web App
- **CI/CD**: GitHub Actions workflow deploys on push to `main`

## Configuration

**No Key Vault**: All secrets/config via App Settings and environment variables.

**No OpenAI.com**: Only Azure OpenAI endpoint (`shared-openai-eastus2`).

See `docs/CONFIG.md` for detailed environment variable documentation.

