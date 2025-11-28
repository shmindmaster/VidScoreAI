# VidScoreAI API - Container App image
FROM node:20-bullseye

WORKDIR /app

# Enable corepack and pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/backend/package.json apps/backend/package.json

# Install dependencies for the monorepo
RUN pnpm install --frozen-lockfile

# Copy full workspace
COPY . .

# Build backend
RUN pnpm --filter backend build

EXPOSE 3001

CMD ["pnpm", "--filter", "backend", "start"]
