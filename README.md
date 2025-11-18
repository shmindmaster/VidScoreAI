# VidScoreAI – Video Content Scoring & Optimization for Marketing Teams

## Overview

VidScoreAI is an AI-powered video content analysis and optimization platform designed for marketing teams at startups and small-to-medium enterprises. The platform automatically scores video content, provides actionable improvement recommendations, and helps teams create higher-performing marketing videos.

Built for marketing teams that need to maximize ROI on video content without large production budgets, VidScoreAI combines computer vision, natural language processing, and predictive analytics to deliver insights that directly impact engagement and conversion rates.

**Demo**: https://vidscoreai.shtrial.com

## Key Features

- **Automated Video Scoring**: AI-powered analysis of video content across multiple dimensions (engagement, clarity, branding, etc.)
- **Performance Prediction**: Predictive analytics to forecast video performance before publication
- **Optimization Recommendations**: Actionable, AI-generated suggestions for improving video content
- **Competitive Analysis**: Compare your videos against industry benchmarks and competitor content
- **A/B Testing Support**: Intelligent test design and analysis for video variations
- **Content Library Management**: Organize and search video assets with AI-powered tagging

## Architecture

### Technology Stack

- **Frontend**: React 19, TypeScript, Next.js 15, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: Azure Database for PostgreSQL
- **AI Services**: Azure OpenAI (Responses API), Azure Computer Vision, Azure AI Search
- **Storage**: Azure Blob Storage for video assets
- **Video Processing**: Azure Media Services / FFmpeg
- **Deployment**: Azure Static Web Apps / Azure App Service

### Shared Azure Infrastructure

VidScoreAI leverages shared Azure AI resources from `rg-shared-ai`:

- **Azure OpenAI**: `shared-openai-eastus2` for content analysis and recommendation generation
- **Azure AI Search**: `shared-search-eastus2` for video metadata search
- **Azure Computer Vision**: For frame analysis and visual quality assessment
- **PostgreSQL with pgvector**: Shared database for video embeddings and similarity search
- **Azure Storage**: Shared storage account for video files

## Configuration & Environment

### Required Environment Variables

```env
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/
AZURE_OPENAI_API_KEY=your_api_key
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Azure Computer Vision
AZURE_COMPUTER_VISION_ENDPOINT=https://your-cv-resource.cognitiveservices.azure.com/
AZURE_COMPUTER_VISION_KEY=your_cv_key

# Azure AI Search
AZURE_SEARCH_ENDPOINT=https://shared-search-eastus2.search.windows.net
AZURE_SEARCH_API_KEY=your_search_key
AZURE_SEARCH_INDEX_NAME=vidscoreai-index

# Database Configuration
DB_SERVER_HOST=your-postgres-server.postgres.database.azure.com
DB_NAME=vidscoreai
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_CONNECTION_STRING=postgresql://user:password@host:5432/database

# Azure Storage
AZURE_STORAGE_ACCOUNT=your_storage_account
AZURE_STORAGE_CONTAINER=vidscoreai-videos
AZURE_STORAGE_CONNECTION_STRING=your_connection_string

# Application
NEXT_PUBLIC_APP_URL=https://vidscoreai.shtrial.com
```

**Note**: Secrets should be stored in Azure Key Vault or GitHub Secrets, never committed to git.

## Getting Started (Local Development)

### Prerequisites

- Node.js 20+
- pnpm package manager
- Azure subscription with access to shared resources
- FFmpeg (for local video processing)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/shmindmaster/VidScoreAI.git
cd VidScoreAI
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment**

```bash
cp .env.example .env.local
# Edit .env.local with your Azure service credentials
```

4. **Start development server**

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Testing

VidScoreAI includes a comprehensive E2E test suite with a mobile-first approach using Playwright.

### Quick Start

```bash
# Run all E2E tests
npm test

# Run with interactive UI (recommended for development)
npm run test:ui

# Run mobile tests only
npm run test:mobile

# View test report
npm run test:report
```

### Test Coverage

- ✅ Video Analyzer flow (upload, analysis, reporting)
- ✅ AI Editor flow (multi-file upload, style selection)
- ✅ Navigation and routing
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Mobile usability (touch targets, scrolling)
- ✅ Cross-browser compatibility (Chrome, Safari, Edge)
- ✅ Accessibility basics

**Coverage**: 75% automated, 95%+ of critical user flows

For detailed testing documentation, see:
- [TESTING.md](./TESTING.md) - Complete testing guide
- [TEST_PLAN.md](./TEST_PLAN.md) - Comprehensive test case documentation

## Use Cases & Roadmap

### Current Use Cases

- **Marketing Teams**: Score and optimize social media videos, ads, and promotional content
- **Content Creators**: Analyze video performance and receive improvement recommendations
- **Agencies**: Client video analysis and reporting

### Planned Enhancements

- **Real-Time Scoring**: Live video analysis during production
- **Multi-Platform Optimization**: Platform-specific recommendations (YouTube, TikTok, Instagram, etc.)
- **Voice & Audio Analysis**: Spoken content quality and engagement scoring
- **Thumbnail Generation**: AI-powered thumbnail creation and optimization
- **Trend Analysis**: Industry trend identification and content opportunity detection

## License

Proprietary - All rights reserved
