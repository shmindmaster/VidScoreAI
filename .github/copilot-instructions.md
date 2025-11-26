# Copilot Instructions - VidScoreAI

## Project Overview
- **Application**: AI Video Analysis Platform
- **URL**: https://vidscoreai.shtrial.com
- **API Base URL**: https://api.vidscoreai.shtrial.com
- **API Docs**: https://api.vidscoreai.shtrial.com/docs

## Development Guidelines

### Testing
- Use `pnpm test:e2e` to run Playwright E2E tests
- `pretest:e2e` automatically installs browsers
- Always use pnpm, never npm or yarn

### Infrastructure Rules
- Do NOT create new Azure resource groups
- Reuse shared resource groups (rg-shared-ai, rg-shared-data, rg-shared-apps, rg-shared-web, rg-shared-logs)
- Use shared Postgres server (pg-shared-apps-eastus2) with database named "vidscoreai"
- Use shared storage account with container named "vidscoreai"
- Use shared Azure OpenAI and Azure Search endpoints