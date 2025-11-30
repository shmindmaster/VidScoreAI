# VidScoreAI - AI-Powered Video Performance Analysis

[![Live Site](https://img.shields.io/badge/Live%20Site-vidscoreai.shtrial.com-blue)](https://vidscoreai.shtrial.com)

**Industry**: Marketing  
**Domain**: https://vidscoreai.shtrial.com  
**Type**: Full-stack AI Application

## Overview

VidScoreAI is a platform for analyzing video performance and generating actionable insights. It uses AI to:
- **Analyze video content** automatically.
- **Score performance** with automated metrics and benchmarks.
- **Generate insights** with AI-powered recommendations for optimization.

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 18, TypeScript
- **Backend**: NestJS (Node.js)
- **Database**: Azure PostgreSQL (`pg-shared-apps-eastus2`, database: `vidscoreai`) via Prisma
- **AI**: Azure OpenAI (via `openai` package)
  - Chat/Code: `gpt-5.1`
- **Storage**: Azure Blob Storage (`stmahumsharedapps`, container: `vidscoreai`)
- **Deployment**:
  - Frontend: Azure Static Web App `vidscoreai`
  - Backend: Container App `vidscoreai-api`
- **Custom Domain**: `vidscoreai.shtrial.com`

## Demo URLs

- **Frontend**: https://vidscoreai.shtrial.com
- **API Base URL**: https://api.vidscoreai.shtrial.com

## Architecture

- **Apps**:
  - `apps/frontend`: Next.js 15 full-stack application (App Router)
  - `apps/backend`: NestJS API Service
- **Flow**:
  1. Frontend initiates upload -> Backend creates record & returns SAS Token.
  2. Frontend uploads directly to Azure Blob Storage.
  3. Frontend confirms upload -> Backend triggers AI analysis.
  4. Backend processes video (mocked/AI) and stores results in Postgres.
  5. Frontend polls for completion and displays results.

## Environment Variables

See `.env.example` for the complete schema. Key variables:

```env
# Backend
DATABASE_URL=postgresql://pgadmin:WalidSahab1125@pg-shared-apps-eastus2.postgres.database.azure.com:5432/vidscoreai
AZURE_STORAGE_CONNECTION_STRING=...
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_DEPLOYMENT_ID=gpt-5.1
```

## Prerequisites

- **Node.js**: >=20.0.0
- **pnpm**: >=8.0.0 (`npm install -g pnpm`)

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

## Development

### Running the Application

```bash
# Start Backend
cd apps/backend
pnpm dev

# Start Frontend
cd apps/frontend
pnpm dev
```

### Database Setup

```bash
cd apps/backend
npx prisma generate
# npx prisma db push # (Requires valid DATABASE_URL)
```

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
| `rg-shared-ai` | Azure OpenAI `shared-openai-eastus2` |
| `rg-shared-data` | PostgreSQL `pg-shared-apps-eastus2`, Storage `stmahumsharedapps` |
| `rg-shared-container-apps` | Container Apps environments, ACR `acrsharedapps` |
| `rg-shared-web` | Static Web Apps |
| `rg-shared-logs` | Log Analytics `law-shared-apps-eastus2`, App Insights `appi-shared-apps-eastus2` |
| `rg-shared-dns` | DNS zones, certificates |

App-specific resources (all on shared services):

| Resource | Name | Service |
| :--- | :--- | :--- |
| Database | `vidscoreai` | `pg-shared-apps-eastus2` |
| Blob Container | `vidscoreai` | `stmahumsharedapps` |
| Static Web App | `vidscoreai` | `rg-shared-web` |
| Container App | `ca-vidscoreai-api` | `rg-shared-container-apps` |

> **⚠️ Important:** Contributors and AI agents must **not** create new resource groups, PostgreSQL servers, storage accounts, or OpenAI/Search accounts. Extend the shared platform instead.

See [`AGENTS.md`](./AGENTS.md) for detailed agent contract and [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) for Copilot rules.
