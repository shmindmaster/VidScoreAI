# VidScoreAI - AI-Powered Video Performance Analysis

[![Live Site](https://img.shields.io/badge/Live%20Site-vidscoreai.shtrial.com-blue)](https://vidscoreai.shtrial.com)

**Industry**: Marketing  
**Domain**: https://vidscoreai.shtrial.com  
**Type**: Frontend UX Demo (Backend AI Implementation Planned)

## Overview

VidScoreAI is a platform for analyzing video performance and generating actionable insights. **Currently, it's a frontend-only UX prototype** that simulates video analysis and scoring. The backend AI implementation is planned for future development.

### Current Status

⚠️ **Frontend-Only Demo**: This is currently a UX prototype with:
- Simulated video upload and analysis flow
- Static performance scores and recommendations
- No backend, database, or AI SDKs yet
- All analysis is simulated in the browser

### Why VidScoreAI?

Traditional video analytics require manual review and lack AI-powered insights. VidScoreAI will use AI to:
- **Analyze video content** automatically using computer vision and NLP
- **Score performance** with automated metrics and benchmarks
- **Generate insights** with AI-powered recommendations for optimization
- **Compare videos** across time and variants for performance tracking

## Planned AI Features

- **Video Analysis**: AI-powered analysis of video content, engagement, and performance
- **Performance Scoring**: Automated scoring of video effectiveness
- **Insights Generation**: AI-generated recommendations for video optimization
- **Visual Analysis**: Computer vision for frame-by-frame analysis

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 18, TypeScript
- **Database**: Azure PostgreSQL (`pg-shared-apps-eastus2`, database: `vidscoreai_db`) via Prisma
- **AI**: Azure OpenAI exclusively (via `@shared/ai` package)
  - Chat: `gpt-5.1` (default & heavy tasks)
  - Embeddings: `text-embedding-3-small`
  - Image: `gpt-image-1-mini`
- **Search**: Azure AI Search (`shared-search-standard-eastus2`, index: `vidscoreai-dev-index`) - only if using search/RAG
- **Storage**: Azure Blob Storage (`stmahumsharedapps`, container: `vidscoreai`) in `rg-shared-data`
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
SHARED_PG_CONNECTION_STRING=postgresql://<user>:<pass>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/vidscoreai_db?sslmode=require

# Azure AI Search (Shared - via @shared/data package)
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net
AZURE_SEARCH_API_KEY=<your-key>
AZURE_SEARCH_INDEX_PREFIX=vidscoreai

# Azure Storage (Shared - via @shared/data package)
AZURE_STORAGE_CONNECTION_STRING=<connection-string>
AZURE_STORAGE_CONTAINER=vidscoreai
```

## Prerequisites

Before you begin, ensure you have:

- **Node.js**: >=20.0.0
- **pnpm**: >=8.0.0 (`npm install -g pnpm`)
- **Azure Account**: Access to shared Azure resources (for future backend implementation)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd VidScoreAI
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment (Optional - for future backend)

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your Azure credentials (when backend is implemented)
# See docs/CONFIG.md for detailed instructions
```

## Development

### Project Structure

```
VidScoreAI/
├── apps/
│   └── frontend/          # Next.js 15 app (App Router)
│       ├── app/
│       │   ├── page.tsx   # Main marketing + upload + scoring flow
│       │   ├── editor/    # Multi-file editor flow
│       │   └── api/       # API routes (planned, not yet implemented)
│       └── components/
│           ├── video-uploader.tsx      # Drag-and-drop file picker
│           ├── loading-analysis.tsx    # Simulated loading sequence
│           └── performance-report.tsx   # Static scores + PDF export
├── packages/
│   ├── shared-ai/        # Shared Azure OpenAI client (planned)
│   └── shared-data/      # Shared Prisma, Search, Storage clients (planned)
└── e2e/                  # Playwright E2E tests
```

### Running the Application

```bash
# Start Next.js dev server (recommended)
pnpm dev

# The app will be available at http://localhost:3000
```

**Important**: Use `pnpm dev` for development - it enables hot-reload. Don't run `pnpm build` during interactive development.

### Available Commands

```bash
# Development
pnpm dev                  # Start Next.js dev server

# Building
pnpm build                # Build Next.js app
pnpm start                # Start production server

# Testing
pnpm test                 # Run Playwright E2E tests
pnpm test:ui              # Run tests with UI
pnpm test:mobile         # Run mobile tests only
pnpm test:desktop        # Run desktop tests only
pnpm lint                 # Lint all code
pnpm typecheck           # TypeScript type checking
```

### Current Behavior

**Upload & Analysis Flow**:
- `VideoUploader` collects a local `File` (no network calls)
- `LoadingAnalysis` shows timed steps using `setInterval`/`setTimeout`
- After ~5 seconds, shows `PerformanceReport` with static scores

**Scoring & Recommendations**:
- Uses hard-coded `overallScore` (e.g., 82)
- Static list of sections with fixed scores
- Suggestion text is static, not AI-generated
- Generates PDF via `html2pdf.js` from rendered DOM

**Editor Flow**:
- `MultiFileUploader`, `StyleSelector`, `VideoGeneration` are pure client components
- File upload and style selection are local-only
- No backend job or Azure Media Services integration yet

## Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Create a branch**: `git checkout -b feature/your-feature-name`
2. **Make changes**: Follow coding standards (see [`.github/copilot-instructions.md`](./.github/copilot-instructions.md))
3. **Test your changes**: `pnpm lint && pnpm typecheck && pnpm test`
4. **Commit**: Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
5. **Push and create PR**: Target `main` branch

### Code Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **Next.js**: Use Server Components by default, Client Components only when needed
- **Testing**: Add Playwright tests for new flows, maintain mobile-first approach
- **Current State**: Remember this is frontend-only - don't assume backend features exist

See [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) for detailed coding standards.

### PR Guidelines

- **Title**: `[VidScoreAI] Description` format
- **Description**: Include what changed and why
- **Tests**: All tests must pass (especially E2E tests)
- **Type Safety**: No TypeScript errors
- **Mobile Testing**: Test on mobile viewport (390x844px)

## Future Backend Implementation

When implementing the backend, follow these patterns:

### API Routes

- Add `app/api/*/route.ts` handlers (Next.js API routes)
- Use `NextRequest`/`NextResponse` for request handling
- Return structured JSON that existing UI can render

### Azure OpenAI Integration

- Use shared `shared-openai-eastus2` Azure OpenAI resource
- Models: `gpt-5.1-mini` (analysis), `text-embedding-3-small` (embeddings), `gpt-image-1-mini` (vision)
- All AI calls must be server-side (API routes only), never in React components

### Video Storage

- Use Azure Blob Storage for video uploads (SAS URLs)
- Design background workflow for heavy processing (Container Apps jobs or Functions)
- Store analysis results in database for comparison across time

## Troubleshooting

### Common Issues

**Build Errors**:
- Clear `.next` directory: `rm -rf .next`
- Rebuild: `pnpm build`
- Check for TypeScript errors: `pnpm typecheck`

**Test Failures**:
- Ensure mobile viewport tests are passing (390x844px)
- Use role-based selectors (`getByRole`) when possible
- Mock any future API endpoints in tests

**For more help**: See `docs/CONFIG.md` or check `.github/copilot-instructions.md` for current implementation status

## Deployment

- **Frontend**: Azure Static Web App `vidscoreai` in `rg-shared-web` (Free SKU)
- **Backend**: Planned - Azure Container App `vidscoreai-api` in `cae-shared-apps` (when implemented)
- **CI/CD**: `.github/workflows/ci-cd.yml` - auto-deploys on push to `main`
- **Custom Domain**: `vidscoreai.shtrial.com`

## Documentation

- **AGENTS.md**: AI coding agent guide
- **.github/copilot-instructions.md**: GitHub Copilot instructions (includes current implementation status)
- **docs/ARCHITECTURE.md**: Detailed architecture documentation
- **docs/CONFIG.md**: Environment variables and configuration guide

## License

[Add your license here]

## Contact & Support

- **Live Site**: https://vidscoreai.shtrial.com
- **Issues**: [GitHub Issues](https://github.com/your-org/vidscoreai/issues)

## ☁️ Infrastructure (MahumTech Shared Platform)

VidScoreAI runs on the **MahumTech Shared Azure Platform**.

- **Subscription:** `44e77ffe-2c39-4726-b6f0-2c733c7ffe78`
- **Region:** East US 2
- **App Slug:** `vidscoreai`

### Shared Resource Groups (no new RGs allowed)

| Resource Group | Purpose |
| :--- | :--- |
| `rg-shared-ai` | Azure OpenAI `shared-openai-eastus2`, AI Search `shared-search-standard-eastus2` |
| `rg-shared-data` | PostgreSQL `pg-shared-apps-eastus2`, Storage `stmahumsharedapps` |
| `rg-shared-container-apps` | Container Apps environments, ACR `acrsharedapps` |
| `rg-shared-web` | Static Web Apps |
| `rg-shared-logs` | Log Analytics `law-shared-apps-eastus2`, App Insights `appi-shared-apps-eastus2` |
| `rg-shared-dns` | DNS zones, certificates |

App-specific resources (all on shared services):

| Resource | Name | Service |
| :--- | :--- | :--- |
| Database | `vidscoreai_db` | `pg-shared-apps-eastus2` |
| Blob Container | `vidscoreai` | `stmahumsharedapps` |
| Search Index | `idx-vidscoreai-primary` | `shared-search-standard-eastus2` |
| Static Web App | `vidscoreai` | `rg-shared-web` |
| Container App | `ca-vidscoreai-api` | `rg-shared-container-apps` |

> **⚠️ Important:** Contributors and AI agents must **not** create new resource groups, PostgreSQL servers, storage accounts, or OpenAI/Search accounts. Extend the shared platform instead.

See [`AGENTS.md`](./AGENTS.md) for detailed agent contract and [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) for Copilot rules.