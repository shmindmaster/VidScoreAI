# VidScoreAI Configuration

## Environment Variables

All configuration is done via environment variables. **No Key Vault** is used. **No OpenAI.com API keys** - only Azure OpenAI.

## Backend Environment Variables (Next.js API Routes)

Location: `.env.local` or App Settings in Azure Static Web App

### Azure OpenAI (Shared)

```bash
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/openai/v1/
AZURE_OPENAI_API_KEY=<azure-openai-key>
AZURE_OPENAI_DEFAULT_CHAT_MODEL=gpt-4o
AZURE_OPENAI_MODEL_HEAVY=gpt-5.1
AZURE_OPENAI_MODEL_EMBED=text-embedding-3-small
AZURE_OPENAI_MODEL_IMAGE=gpt-image-1-mini
```

### PostgreSQL (Shared)

```bash
SHARED_PG_CONNECTION_STRING=postgresql://<user>:<pass>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/vidscoreai_db?sslmode=require
```

### Azure AI Search (Shared)

```bash
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net
AZURE_SEARCH_API_KEY=<search-key>
AZURE_SEARCH_INDEX_PREFIX=vidscoreai
```

### Azure Storage (Shared)

```bash
AZURE_STORAGE_CONNECTION_STRING=<storage-connection-string>
APP_STORAGE_PREFIX=vidscoreai
```

## Frontend Environment Variables

Location: `.env.local` or App Settings in Azure Static Web App

```bash
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_APP_NAME=VidScoreAI
```

## App-Specific Configuration

### Database

- **Database name**: `vidscoreai_db`
- **Schema**: App-specific tables within `vidscoreai_db` (managed by Prisma)

### Search Indexes

- **Index prefix**: `vidscoreai`
- **Example indexes**: `vidscoreai-videos`, `vidscoreai-analytics`

### Storage Prefixes

- **Storage prefix**: `vidscoreai/`
- **Example paths**:
  - `raw/vidscoreai/video-uploads/...`
  - `curated/vidscoreai/processed-videos/...`
  - `ai-artifacts/vidscoreai/analysis-reports/...`

## Local Development

1. Copy `.env.example` to `.env.local`
2. Fill in the required values from Azure Portal or Azure CLI
3. Ensure you have access to the shared resources

## Production Deployment

Environment variables are set as App Settings in:
- **Static Web App**: Azure Portal → Static Web App `vidscoreai` → Configuration → Application settings

