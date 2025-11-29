# AGENTS – Global Rules for VidScoreAI

**API Standard:** Azure OpenAI Responses API (Stateful v1)

This repo uses shared Azure infrastructure and the **Azure OpenAI Responses API**.

## 🛑 HARD RULES (DO NOT BREAK)

1. **NO NEW INFRA:** Do not create Resource Groups, Storage Accounts, or Postgres Servers.
2. **NO AZURE SEARCH:** Use `pgvector` on the shared Postgres database.
3. **NO CI/CD:** Do not touch GitHub Actions or Azure Pipelines.
4. **USE RESPONSES API:** Use `gpt-5.1-codex-mini` via the `/openai/v1/responses` endpoint. Do not use legacy Chat Completions.
5. **USE STATEFUL API:** 
   - Use `input` field for queries.
   - Use `previous_response_id` for conversation history.
   - **Do not** send full message history arrays.
6. **NO FRONTEND KEYS:** Never expose `AZURE_OPENAI_API_KEY` to client-side code.

## 🏗️ Shared Architecture

* **Database:** Shared Postgres (`vidscoreai` database on `pg-shared-apps-eastus2`)
* **Storage:** Shared Storage (`vidscoreai` container in `stmahumsharedapps`)
* **Model:** `gpt-5.1-codex-mini` (Logic/Chat/Code)
* **Image:** `gpt-image-1-mini`
* **Embeddings:** `text-embedding-3-small`
* **Audio:** `gpt-audio-mini`

## 🛠️ Implementation Guide

1. **Embeddings:** Use `text-embedding-3-small` endpoint to generate vector.
2. **Storage:** Store vector in `vidscoreai` database using `pgvector`.
3. **Retrieval:** Query database using cosine distance (`<=>`).
4. **Generation:** Pass retrieved context to `gpt-5.1-codex-mini` via Responses API.

## 📡 API Usage Specs

* **Endpoint:** `/openai/v1/responses` (v1 GA, no api-version query param)
* **Request Format:** Use `input` field (string or array), NOT `messages` array
* **State Management:** Use `previous_response_id` for conversation continuity
* **Auth Header:** `api-key: {AZURE_OPENAI_API_KEY}` (not Bearer token)
* **Token Parameter:** `max_output_tokens` (not `max_completion_tokens` or `max_tokens`)
* **Structured Outputs:** Support `response_format` for JSON mode

### Example Request

```json
{
  "model": "gpt-5.1-codex-mini",
  "input": "User's new question",
  "previous_response_id": "resp_123456"
}
```

### Example Response Handling

* Look for `output` array in the JSON response.
* Store `id` (e.g., `resp_xyz`) to pass in the next request.

## 🏗️ Shared Infrastructure (Read-Only)

* **PostgreSQL:** `pg-shared-apps-eastus2` (database: `vidscoreai`)
* **Storage:** `stmahumsharedapps` (container: `vidscoreai`)
* **OpenAI:** `shared-openai-eastus2`
* **DNS:** `vidscoreai.shtrial.com` (frontend), `api.vidscoreai.shtrial.com` (backend)
* **Registry:** `acrsharedapps`
* **Static Web App:** `blue-field-05d4e8a0f`

**Note:** VidScoreAI is frontend-only (no Container App backend).

## 💰 Cost Control Rules (MANDATORY)

If a Container App is added in the future, it MUST use these cost-optimized settings:

| Setting | Required Value | Reason |
|---------|----------------|--------|
| minReplicas | **0** | Scale-to-zero when idle |
| maxReplicas | **3** | Prevent runaway scaling |
| CPU | **0.25** | Sufficient for API workloads |
| Memory | **0.5Gi** | Sufficient for API workloads |

**Environment Variable Naming:**
- Use `AI_MODEL_CORE` (not `AI_MODEL_GENERAL`)
- Use `DATABASE_URL` for connection strings

**Cost Violations to Avoid:**
- ❌ minReplicas > 0 (wastes money when idle)
- ❌ maxReplicas > 3 (risk of runaway costs)
- ❌ CPU > 0.25 or Memory > 0.5Gi without approval
- ❌ Creating new Azure resources without approval

## 🚀 Deployment Procedures

### Static Web App Deployment
```bash
# Build frontend
cd apps/frontend && pnpm build

# Deploy using SWA CLI
swa deploy ./dist --deployment-token $SWA_DEPLOYMENT_TOKEN
```

## 📁 Repository Organization

### Approved Folder Structure
- **Frontend:** `apps/frontend/src/` (React application)
- **Backend:** `apps/backend/src/` (Backend application)
- **Infrastructure:** `infra/` (if applicable)
- **Documentation:** `docs/` (single source of truth)
- **Scripts:** `scripts/` (deployment, validation, utilities)
- **Tests:** `tests/` (E2E tests)

### File Placement Rules
- **New components:** Place in appropriate frontend structure
- **API routes:** Add to appropriate module under `apps/backend/src/`
- **Documentation:** Update existing files in `docs/`, never create parallel docs

### Documentation Standards
- **Single Source of Truth:** Each topic has one definitive document
- **No Temporary Files:** Delete process docs, summaries, and outdated files (don't archive)
- **Reference, Don't Duplicate:** Link to information instead of copying
- **No Turborepo:** Use simple pnpm workspace scripts instead of Turborepo
