# VidScoreAI - AI-Powered Video Performance Analysis

**Industry**: Marketing  
**Domain**: https://vidscoreai.shtrial.com  
**Type**: Full-stack AI Application (Next.js with API routes)

## Overview

VidScoreAI is a platform for analyzing video performance and generating actionable insights. Currently a frontend UX demo with backend AI implementation planned.

## Planned AI Features

- **Video Analysis**: AI-powered analysis of video content, engagement, and performance
- **Performance Scoring**: Automated scoring of video effectiveness
- **Insights Generation**: AI-generated recommendations for video optimization
- **Visual Analysis**: Computer vision for frame-by-frame analysis

## Tech Stack

- **Frontend**: Next.js 13.5, React, TypeScript, TailwindCSS
- **Planned Backend**: Azure Functions or Container Apps
- **Planned AI**: Azure OpenAI + Azure Computer Vision
  - Chat: `gpt-5.1-mini`
  - Embeddings: `text-embedding-3-small`
  - Vision: `gpt-image-1-mini`
- **Planned Storage**: Azure Blob Storage (`stmahumsharedapps`, container: `vidscoreai-videos`)
- **Deployment**: 
  - Frontend: Azure Static Web App (`rg-shared-web`)
  - Backend: Same SWA (Next.js API routes) or Container App (`rg-shared-apps`) if split later

## Architecture

- **Current**: Frontend-only demo
- **Planned**: Full-stack with AI backend

## Environment Variables

See `.env.example` for the planned schema. Key variables:

```env
# Azure OpenAI (Standardized - shared across all portfolio apps)
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/
AZURE_OPENAI_API_KEY=<your_key>
AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-5.1-mini
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
AZURE_OPENAI_IMAGE_DEPLOYMENT=gpt-image-1-mini

# Azure Computer Vision (Planned)
AZURE_VISION_ENDPOINT=https://shared-openai-eastus2.cognitiveservices.azure.com/
AZURE_VISION_KEY=<your_key>
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

Deployed via GitHub Actions workflow (`.github/workflows/deploy.yml`) to Azure Static Web App.


